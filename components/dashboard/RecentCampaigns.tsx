import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Campaign } from '@/types';
import { MoreHorizontal } from 'lucide-react';

const mockCampaigns: Campaign[] = [
  { id: '1', user_id: '1', name: 'Q3 Enterprise Software', status: 'active', sent: 1250, replies: 45, meetings: 12, created_at: '2d ago' },
  { id: '2', user_id: '1', name: 'Healthcare VPs Outbound', status: 'active', sent: 850, replies: 82, meetings: 24, created_at: '1w ago' },
  { id: '3', user_id: '1', name: 'Series A Fintech Draft', status: 'draft', sent: 0, replies: 0, meetings: 0, created_at: '2w ago' },
  { id: '4', user_id: '1', name: 'Q2 Marketing Agency', status: 'completed', sent: 3200, replies: 12, meetings: 1, created_at: '1mo ago' },
];

export function RecentCampaigns() {
  return (
    <Card className="col-span-1 md:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-neutral-200">Recent Campaigns</h2>
        <button className="text-xs font-medium text-neutral-500 hover:text-neutral-300 transition-colors">View all</button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-neutral-500 border-b border-neutral-800">
            <tr>
              <th className="pb-3 font-medium">Campaign</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium text-right">Sent</th>
              <th className="pb-3 font-medium text-right">Replies</th>
              <th className="pb-3 font-medium text-right">Meetings</th>
              <th className="pb-3 font-medium text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60">
            {mockCampaigns.map((campaign) => (
              <tr key={campaign.id} className="group hover:bg-neutral-800/30 transition-colors">
                <td className="py-3 pr-4">
                  <div className="font-medium text-neutral-200">{campaign.name}</div>
                  <div className="text-xs text-neutral-500 mt-0.5">Created {campaign.created_at}</div>
                </td>
                <td className="py-3 pr-4">
                  <Badge status={campaign.status} />
                </td>
                <td className="py-3 pr-4 text-right tabular-nums text-neutral-300">{campaign.sent.toLocaleString()}</td>
                <td className="py-3 pr-4 text-right tabular-nums text-neutral-300">{campaign.replies.toLocaleString()}</td>
                <td className="py-3 pr-4 text-right tabular-nums text-neutral-300">{campaign.meetings.toLocaleString()}</td>
                <td className="py-3 text-right">
                  <button className="p-1 rounded text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 transition-colors opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
