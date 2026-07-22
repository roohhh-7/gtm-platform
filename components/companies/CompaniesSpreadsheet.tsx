'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridReadyEvent, SelectionChangedEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { createRoot } from 'react-dom/client';

type TableRowData = {
  id: string;
  campaignId?: string;
  name: string;
  domain?: string;
  industry?: string;
  employees?: string;
  country?: string;
  status: string;
  tags: string[];
  ai_fit_score?: number;
  why_recommended?: string[];
  // Dynamic fields
  [key: string]: any;
};

type Props = {
  data: TableRowData[];
  onSelectionChange?: (selectedRows: TableRowData[]) => void;
  enrichingIds?: Set<string>;
};

// Custom cell renderers for AG Grid
const NameCellRenderer = (props: any) => {
  const data = props.data;
  return data.campaignId ? (
    <Link href={`/campaigns/${data.campaignId}/companies/${data.id}`} className="text-white hover:underline truncate">
      {data.name}
    </Link>
  ) : (
    <span className="text-white truncate">{data.name}</span>
  );
};

const DomainCellRenderer = (props: any) => {
  return (
    <a href={`https://${props.value}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline truncate">
      {props.value || 'website.com'}
    </a>
  );
};

const StatusCellRenderer = (props: any) => {
  return (
    <div className="flex items-center h-full">
      <Badge variant={props.value === 'active' ? 'success' : props.value === 'disqualified' ? 'neutral' : 'warning'}>
        {props.value}
      </Badge>
    </div>
  );
};

const AiMatchCellRenderer = (props: any) => {
  const data = props.data;
  if (data.ai_fit_score !== undefined) {
    return (
      <div className="flex items-center gap-1.5 h-full">
        <span className="text-emerald-400 font-medium text-xs">{data.ai_fit_score}</span>
        {data.why_recommended?.[0] && (
          <span className="text-[10px] text-neutral-500 max-w-[100px] truncate" title={data.why_recommended[0]}>
            • {data.why_recommended[0]}
          </span>
        )}
      </div>
    );
  }
  return <div className="flex text-neutral-600 text-xs h-full items-center">-</div>;
};

const EnrichStatusCellRenderer = (props: any) => {
  const isEnriching = props.context?.enrichingIds?.has(props.data.id);
  const isEnriched = props.data.clay_enriched === true; 
  
  if (isEnriching) {
    return (
      <div className="flex items-center gap-2 text-indigo-400 text-xs font-medium h-full">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        Enriching...
      </div>
    );
  }
  if (isEnriched) {
    return (
      <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium h-full">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Enriched
      </div>
    );
  }
  
  return <div className="text-neutral-500 text-xs flex items-center h-full">Pending</div>;
};

export function CompaniesSpreadsheet({ data, onSelectionChange, enrichingIds }: Props) {
  const [gridApi, setGridApi] = useState<any>(null);

  const columnDefs = useMemo<ColDef[]>(() => [
    { 
      field: 'name', 
      headerName: 'Company', 
      minWidth: 200,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      cellRenderer: NameCellRenderer,
    },
    { field: 'domain', headerName: 'Domain', minWidth: 150, cellRenderer: DomainCellRenderer },
    { field: 'industry', headerName: 'Industry', minWidth: 180 },
    { field: 'employees', headerName: 'Employees', width: 130 },
    { field: 'country', headerName: 'Country', width: 130 },
    { field: 'status', headerName: 'Status', width: 120, cellRenderer: StatusCellRenderer },
    { 
      field: 'ai_fit_score', 
      headerName: 'AI Match', 
      width: 150, 
      cellRenderer: AiMatchCellRenderer,
      sortable: true
    },
    {
      headerName: 'Enrichment Status',
      width: 150,
      cellRenderer: EnrichStatusCellRenderer
    }
  ], []);

  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    filter: true,
    editable: true,
  }), []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  }, []);

  const handleSelectionChanged = useCallback(() => {
    if (gridApi && onSelectionChange) {
      const selectedNodes = gridApi.getSelectedNodes();
      const selectedData = selectedNodes.map((node: any) => node.data);
      onSelectionChange(selectedData);
    }
  }, [gridApi, onSelectionChange]);

  // Dark theme override styles for AG Grid v31
  const gridStyles = `
    .ag-theme-quartz-dark {
      --ag-background-color: transparent !important;
      --ag-header-background-color: rgba(23, 23, 23, 0.8) !important;
      --ag-odd-row-background-color: transparent !important;
      --ag-border-color: #262626 !important;
      --ag-row-border-color: #262626 !important;
      --ag-header-foreground-color: #a3a3a3 !important;
      --ag-data-color: #d4d4d4 !important;
      --ag-row-hover-color: rgba(38, 38, 38, 0.5) !important;
      --ag-selected-row-background-color: rgba(99, 102, 241, 0.1) !important;
      --ag-checkbox-checked-color: #6366f1 !important;
      --ag-font-family: inherit !important;
      --ag-font-size: 13px !important;
      --ag-cell-horizontal-padding: 16px !important;
    }
    .ag-theme-quartz-dark .ag-header-cell {
      font-weight: 500;
    }
    .ag-theme-quartz-dark .ag-cell {
      display: flex;
      align-items: center;
    }
  `;

  return (
    <div className="w-full h-[600px] flex flex-col relative border border-neutral-800 bg-neutral-900/50 rounded-xl overflow-hidden -mt-2">
      <style dangerouslySetInnerHTML={{ __html: gridStyles }} />
      <div className="ag-theme-quartz-dark w-full h-full flex-1">
        <AgGridReact
          rowData={data}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection="multiple"
          suppressRowClickSelection={true}
          onGridReady={onGridReady}
          onSelectionChanged={handleSelectionChanged}
          context={{ enrichingIds }}
          overlayNoRowsTemplate='<span class="text-neutral-500">No companies found in this campaign.</span>'
          rowHeight={52}
          headerHeight={44}
        />
      </div>
    </div>
  );
}
