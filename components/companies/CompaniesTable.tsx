import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { CheckCircle2, MoreHorizontal } from 'lucide-react';
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
};

type Props = {
  data: TableRowData[];
};

export function CompaniesTable({ data }: Props) {
  return (
    <div className="border border-neutral-800 bg-neutral-900/50 rounded-xl overflow-x-auto -mt-2">
      <Table className="min-w-max border-collapse">
        <TableHeader>
          <TableRow className="border-neutral-800 bg-neutral-900/80 hover:bg-neutral-900/80">
            <TableHead className="w-12 border-r border-neutral-800 text-center">#</TableHead>
            <TableHead className="w-48 border-r border-neutral-800">Company</TableHead>
            <TableHead className="w-40 border-r border-neutral-800">Domain</TableHead>
            <TableHead className="w-48 border-r border-neutral-800">Industry</TableHead>
            <TableHead className="w-32 border-r border-neutral-800">Employees</TableHead>
            <TableHead className="w-32 border-r border-neutral-800">Country</TableHead>
            <TableHead className="w-32 border-r border-neutral-800">Status</TableHead>
            <TableHead className="w-40 bg-indigo-500/5 text-indigo-300">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                AI Match
              </div>
            </TableHead>
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
              <TableRow key={company.id} className="border-neutral-800 hover:bg-neutral-800/30">
                <TableCell className="border-r border-neutral-800 text-center text-neutral-500 text-xs">
                  {index + 1}
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
                <TableCell className="bg-indigo-500/5">
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
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
