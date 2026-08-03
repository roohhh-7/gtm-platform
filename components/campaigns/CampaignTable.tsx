import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Campaign } from '@/types';
import { MoreHorizontal, ChevronLeft, ChevronRight, Archive, Trash2, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  campaigns: Campaign[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  onRowClick?: (id: string) => void;
};

export function CampaignTable({ 
  campaigns, 
  totalCount, 
  currentPage, 
  pageSize, 
  onPageChange,
  onUpdateStatus,
  onDelete,
  onRowClick
}: Props) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const router = useRouter();
  
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, totalCount);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-md overflow-hidden specular-border shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)]">
      <Table>
        <TableHeader>
          <tr>
            <TableHead className="w-[340px]">Campaign</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Sent</TableHead>
            <TableHead className="text-right">Replies</TableHead>
            <TableHead className="text-right">Meetings</TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {campaigns.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12 text-zinc-400">
                <div className="text-sm font-medium">No campaigns found</div>
                <div className="text-xs text-zinc-400 mt-1">Try adjusting your filters or create a new campaign.</div>
              </TableCell>
            </TableRow>
          ) : (
            campaigns.map((campaign) => (
              <TableRow 
                key={campaign.id}
                className="cursor-pointer hover:bg-white/[0.035] transition-colors duration-150 group"
                onClick={() => onRowClick ? onRowClick(campaign.id) : router.push(`/campaigns/${campaign.id}`)}
              >
                <TableCell>
                  <div className="font-semibold text-zinc-100 group-hover:text-indigo-300 transition-colors text-sm">
                    {campaign.name}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5 font-mono">
                    Created {formatDate(campaign.created_at)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge status={campaign.status as any} />
                </TableCell>
                <TableCell className="text-right tabular-nums font-mono text-zinc-300 text-xs">
                  {campaign.sent.toLocaleString()}
                </TableCell>
                <TableCell className="text-right tabular-nums font-mono text-zinc-300 text-xs">
                  {campaign.replies.toLocaleString()}
                </TableCell>
                <TableCell className="text-right tabular-nums font-mono text-zinc-300 text-xs">
                  {campaign.meetings.toLocaleString()}
                </TableCell>
                <TableCell className="text-right relative" onClick={(e) => e.stopPropagation()}>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-zinc-400 hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === campaign.id ? null : campaign.id);
                    }}
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                  
                  {openMenuId === campaign.id && (
                    <div className="absolute right-6 top-8 z-20 w-44 rounded-xl bg-[#12141c]/95 border border-white/[0.1] shadow-2xl py-1 backdrop-blur-xl animate-in fade-in-50 duration-150">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateStatus(campaign.id, 'archived');
                          setOpenMenuId(null);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs text-zinc-300 hover:bg-white/[0.08] hover:text-white flex items-center gap-2 transition-colors"
                      >
                        <Archive className="h-3.5 w-3.5 text-zinc-400" /> Archive
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(campaign.id);
                          setOpenMenuId(null);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-rose-400" /> Delete
                      </button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {/* Pagination Footer */}
      {totalCount > 0 && (
        <div className="flex items-center justify-between border-t border-white/[0.06] bg-white/[0.01] px-6 py-3.5">
          <div className="text-xs text-zinc-400">
            Showing <span className="font-medium text-zinc-200">{startIdx}</span> to <span className="font-medium text-zinc-200">{endIdx}</span> of <span className="font-medium text-zinc-200">{totalCount}</span> campaigns
          </div>
          
          <div className="flex items-center gap-1.5">
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-7 w-7 text-xs disabled:opacity-30" 
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-7 w-7 text-xs disabled:opacity-30" 
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
