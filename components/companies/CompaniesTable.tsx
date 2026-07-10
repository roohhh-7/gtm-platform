import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { Company, CampaignCompany } from '@/types';

type TableRowData = {
  id: string;
  campaignId?: string;
  campaignName?: string;
  name: string;
  industry?: string;
  employees?: string;
  status: string;
  tags: string[];
  ai_fit_score?: number;
  why_recommended?: string[];
};

type Props = {
  data: TableRowData[];
};

export function CompaniesTable({ data }: Props) {
  // Group companies by Campaign
  const groupedData = data.reduce((acc, company) => {
    const key = company.campaignName || 'Unassigned';
    if (!acc[key]) acc[key] = [];
    acc[key].push(company);
    return acc;
  }, {} as Record<string, TableRowData[]>);

  return (
    <Card className="p-0 mt-6 overflow-hidden flex flex-col">
      <Table>
        <TableHeader>
          <tr>
            <TableHead>Company</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>AI Match</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-neutral-500">
                No companies found.
              </TableCell>
            </TableRow>
          ) : Object.entries(groupedData).map(([campaignName, companies]) => (
            <React.Fragment key={campaignName}>
              {/* Campaign Header Row */}
              <TableRow className="bg-neutral-900/50 hover:bg-neutral-900/50 border-b-neutral-800">
                <TableCell colSpan={7} className="py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Campaign:</span>
                    <span className="text-sm font-medium text-white">{campaignName}</span>
                    <Badge variant="neutral" className="ml-2 text-[10px] py-0">{companies.length}</Badge>
                  </div>
                </TableCell>
              </TableRow>
              
              {/* Company Rows */}
              {companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>
                    {company.campaignId ? (
                      <Link href={`/campaigns/${company.campaignId}/companies/${company.id}`} className="font-medium text-neutral-200 hover:text-white hover:underline transition-colors block">
                        {company.name}
                      </Link>
                    ) : (
                      <div className="font-medium text-neutral-200">{company.name}</div>
                    )}
                  </TableCell>
                  <TableCell>{company.industry}</TableCell>
                  <TableCell>{company.employees}</TableCell>
                  <TableCell>
                    <Badge variant={company.status === 'active' ? 'success' : company.status === 'disqualified' ? 'neutral' : 'warning'}>
                      {company.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {company.ai_fit_score !== undefined ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-emerald-400 font-medium text-xs">{company.ai_fit_score}</span>
                        {company.why_recommended?.[0] && (
                          <span className="text-[10px] text-neutral-500 max-w-[150px] truncate" title={company.why_recommended[0]}>
                            {company.why_recommended[0]}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-neutral-600 text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 flex-wrap">
                      {company.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-neutral-800 text-neutral-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
