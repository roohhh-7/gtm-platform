import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { CheckCircle2, MoreHorizontal, X, Copy, Download, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

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
  clay_enriched?: boolean;
  enriched_data?: Record<string, any>;
};

type Props = {
  data: TableRowData[];
  selectedIds?: Set<string>;
  onSelectionChange?: (ids: Set<string>) => void;
  enrichingIds?: Set<string>;
};

export function CompaniesTable({ data, selectedIds = new Set(), onSelectionChange, enrichingIds = new Set() }: Props) {
  const [selectedCellText, setSelectedCellText] = React.useState<string | null>(null);
  const [hasCopied, setHasCopied] = React.useState(false);

  const handleCopy = () => {
    if (selectedCellText) {
      navigator.clipboard.writeText(selectedCellText);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    }
  };

  const handleExportCSV = () => {
    // Basic CSV generation
    const headers = ['Name', 'Domain', 'Industry', 'Employees', 'Country', 'Status', 'AI Score', ...dynamicColumns];
    const rows = data.map(company => {
      const rowData = [
        `"${company.name || ''}"`,
        `"${company.domain || ''}"`,
        `"${company.industry || ''}"`,
        `"${company.employees || ''}"`,
        `"${company.country || ''}"`,
        `"${company.status || ''}"`,
        `"${company.ai_fit_score || ''}"`
      ];
      
      dynamicColumns.forEach(col => {
        const val = company.enriched_data?.[col] ? String(company.enriched_data[col]).replace(/"/g, '""') : '';
        rowData.push(`"${val}"`);
      });
      
      return rowData.join(',');
    });
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'campaign_companies_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Collect dynamic columns from enriched_data
  const dynamicColumns = React.useMemo(() => {
    const allowedColumns = [
      'TYPE',
      'DOMAIN',
      'COUNTRY',
      'LOCALITY',
      'LOGO_URL',
      'TECH_STACK',
      'DESCRIPTION',
      'LINKEDIN_URL'
    ];
    
    const cols = new Set<string>();
    data.forEach(row => {
      if (row.enriched_data) {
        allowedColumns.forEach(k => {
          if (row.enriched_data![k] !== undefined) {
            cols.add(k);
          }
        });
      }
    });
    // Return them in the exact order specified by allowedColumns
    return allowedColumns.filter(col => cols.has(col));
  }, [data]);

  const allSelected = data.length > 0 && selectedIds.size === data.length;
  
  const toggleAll = () => {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(data.map(d => d.id)));
    }
  };

  const toggleRow = (id: string) => {
    if (!onSelectionChange) return;
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onSelectionChange(next);
  };

  return (
    <div className="border border-neutral-800 bg-neutral-900/50 rounded-xl overflow-x-auto -mt-2">
      <Table className="min-w-max border-collapse">
        <TableHeader>
          <TableRow className="border-neutral-800 bg-neutral-900/80 hover:bg-neutral-900/80">
            <TableHead className="w-12 border-r border-neutral-800 text-center">
              {onSelectionChange && (
                <input 
                  type="checkbox" 
                  checked={allSelected}
                  onChange={toggleAll}
                  className="rounded border-neutral-700 bg-neutral-800/50 checked:bg-indigo-500 checked:border-indigo-500"
                />
              )}
            </TableHead>
            <TableHead className="w-48 border-r border-neutral-800">Company</TableHead>
            <TableHead className="w-40 border-r border-neutral-800">Domain</TableHead>
            <TableHead className="w-48 border-r border-neutral-800">Industry</TableHead>
            <TableHead className="w-32 border-r border-neutral-800">Employees</TableHead>
            <TableHead className="w-32 border-r border-neutral-800">Country</TableHead>
            <TableHead className="w-32 border-r border-neutral-800">Status</TableHead>
            <TableHead className="w-40 bg-indigo-500/5 text-indigo-300 border-r border-neutral-800">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                AI Match
              </div>
            </TableHead>
            {dynamicColumns.map(col => (
              <TableHead key={col} className="w-32 border-r border-neutral-800 capitalize">
                {col.replace(/_/g, ' ')}
              </TableHead>
            ))}
            <TableHead className="w-32 text-center">Enrichment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-12 text-neutral-500">
                No companies found in this campaign.
              </TableCell>
            </TableRow>
          ) : (
            data.map((company, index) => (
              <TableRow key={company.id} className={`border-neutral-800 hover:bg-neutral-800/30 ${selectedIds.has(company.id) ? 'bg-indigo-500/5' : ''}`}>
                <TableCell className="border-r border-neutral-800 text-center text-neutral-500 text-xs">
                  {onSelectionChange ? (
                    <input 
                      type="checkbox" 
                      checked={selectedIds.has(company.id)}
                      onChange={() => toggleRow(company.id)}
                      className="rounded border-neutral-700 bg-neutral-800/50 checked:bg-indigo-500 checked:border-indigo-500"
                    />
                  ) : (
                    index + 1
                  )}
                </TableCell>
                <TableCell className="border-r border-neutral-800 font-medium text-white">
                  {company.campaignId ? (
                    <Link href={`/campaigns/${company.campaignId}/companies/${company.id}`} className="hover:underline transition-colors block truncate max-w-[180px]" title={company.name}>
                      {company.name}
                    </Link>
                  ) : (
                    <div className="truncate max-w-[180px]" title={company.name}>{company.name}</div>
                  )}
                </TableCell>
                <TableCell className="border-r border-neutral-800 text-blue-400">
                  <a href={`https://${company.domain}`} target="_blank" rel="noopener noreferrer" className="hover:underline truncate max-w-[140px] block" title={company.domain}>
                    {company.domain || 'website.com'}
                  </a>
                </TableCell>
                <TableCell className="border-r border-neutral-800 text-neutral-300">
                  <span className="truncate max-w-[180px] block" title={company.industry}>{company.industry || '-'}</span>
                </TableCell>
                <TableCell className="border-r border-neutral-800 text-neutral-300">
                  {company.employees || '-'}
                </TableCell>
                <TableCell className="border-r border-neutral-800 text-neutral-300">
                  {company.country || '-'}
                </TableCell>
                <TableCell className="border-r border-neutral-800">
                  <Badge variant={company.status === 'active' ? 'success' : company.status === 'disqualified' ? 'neutral' : 'warning'}>
                    {company.status}
                  </Badge>
                </TableCell>
                <TableCell className="border-r border-neutral-800 bg-indigo-500/5">
                  {company.ai_fit_score !== undefined ? (
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-emerald-400 font-medium text-xs">{company.ai_fit_score}</span>
                      {company.why_recommended?.[0] && (
                        <span className="text-[10px] text-neutral-500 max-w-[100px] truncate" title={company.why_recommended[0]}>
                          • {company.why_recommended[0]}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex justify-center text-neutral-600 text-xs">-</div>
                  )}
                </TableCell>
                {dynamicColumns.map(col => {
                  const val = company.enriched_data?.[col] ? String(company.enriched_data[col]) : '-';
                  const isUrl = val.startsWith('http');
                  
                  return (
                    <TableCell key={col} className="border-r border-neutral-800 text-neutral-300 max-w-[200px]">
                      {isUrl ? (
                        <a 
                          href={val} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="truncate block text-blue-400 hover:underline cursor-pointer"
                        >
                          {val}
                        </a>
                      ) : (
                        <span 
                          onClick={() => val !== '-' && setSelectedCellText(val)}
                          className={`truncate block ${val !== '-' ? 'cursor-pointer hover:text-white transition-colors' : ''}`}
                          title="Click to view full text"
                        >
                          {val}
                        </span>
                      )}
                    </TableCell>
                  );
                })}
                <TableCell className="text-center">
                  {enrichingIds.has(company.id) ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400">
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Enriching...
                    </span>
                  ) : company.clay_enriched ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Enriched
                    </span>
                  ) : (
                    <span className="text-xs text-neutral-500">Pending</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {/* Export Table Button */}
      <div className="flex justify-end p-4 border-t border-neutral-800 bg-neutral-900/50">
        <Button 
          variant="secondary" 
          size="sm" 
          className="h-8 gap-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20"
          onClick={handleExportCSV}
          disabled={data.length === 0}
        >
          <Download className="w-3.5 h-3.5" />
          Export Table
        </Button>
      </div>

      {/* Cell Content Modal */}
      {selectedCellText && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between p-4 border-b border-neutral-800">
              <h3 className="text-white font-medium">Cell Content</h3>
              <button 
                onClick={() => setSelectedCellText(null)}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <p className="text-neutral-300 whitespace-pre-wrap font-mono text-sm leading-relaxed select-text">
                {selectedCellText}
              </p>
            </div>
            <div className="p-4 border-t border-neutral-800 flex justify-end gap-3">
              <button
                onClick={handleCopy}
                className="px-4 py-2 flex items-center gap-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg text-sm font-medium transition-colors"
              >
                {hasCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {hasCopied ? 'Copied!' : 'Copy text'}
              </button>
              <button 
                onClick={() => setSelectedCellText(null)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
