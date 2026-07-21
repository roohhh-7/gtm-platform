import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Campaign } from '@/types';
import { MoreHorizontal, ChevronLeft, ChevronRight, Archive, Trash2 } from 'lucide-react';
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

  // Format date helper
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="p-0 flex flex-col">
      <Table>
        <TableHeader>
          <tr>
            <TableHead className="w-[300px]">Campaign Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Sent</TableHead>
            <TableHead className="text-right">Replies</TableHead>
            <TableHead className="text-right">Meetings</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {campaigns.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                No campaigns found.
              </TableCell>
            </TableRow>
          ) : (
            campaigns.map((campaign) => (
              <TableRow 
                key={campaign.id}
                className="cursor-pointer hover:bg-neutral-800/50 transition-colors"
                onClick={() => onRowClick ? onRowClick(campaign.id) : router.push(`/campaigns/${campaign.id}`)}
              >
                <TableCell>
                  <div className="font-medium text-neutral-200">{campaign.name}</div>
                  <div className="text-xs text-neutral-500 mt-0.5">Created {formatDate(campaign.created_at)}</div>
                </TableCell>
                <TableCell>
                  <Badge status={campaign.status as any} />
                </TableCell>
                <TableCell className="text-right tabular-nums">{campaign.sent.toLocaleString()}</TableCell>
                <TableCell className="text-right tabular-nums">{campaign.replies.toLocaleString()}</TableCell>
                <TableCell className="text-right tabular-nums">{campaign.meetings.toLocaleString()}</TableCell>
                <TableCell className="text-right relative">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === campaign.id ? null : campaign.id);
                    }}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                  
                  {openMenuId === campaign.id && (
                    <div className="absolute right-8 top-8 z-10 w-40 rounded-md bg-neutral-900 border border-neutral-800 shadow-lg py-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateStatus(campaign.id, 'archived');
                          setOpenMenuId(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 flex items-center gap-2"
                      >
                        <Archive className="h-4 w-4" /> Archive
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(campaign.id);
                          setOpenMenuId(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-neutral-800 flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" /> Delete
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
        <div className="flex items-center justify-between border-t border-neutral-800/60 px-6 py-4">
          <div className="text-xs text-neutral-500">
            Showing <span className="font-medium text-neutral-300">{startIdx}</span> to <span className="font-medium text-neutral-300">{endIdx}</span> of <span className="font-medium text-neutral-300">{totalCount}</span> campaigns
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="secondary" 
              size="sm" 
              className="h-8 px-2 disabled:opacity-50" 
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              className="h-8 px-2 disabled:opacity-50"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
