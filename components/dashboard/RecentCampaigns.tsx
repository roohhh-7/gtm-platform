import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MoreHorizontal } from 'lucide-react';

interface CampaignWithCounts {
  id: string;
  name: string;
  status: string;
  created_at: string;
  companies_count: number;
  contacts_count: number;
}

export function RecentCampaigns({ campaigns = [] }: { campaigns?: CampaignWithCounts[] }) {
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
              <th className="pb-3 font-medium text-right">Companies</th>
              <th className="pb-3 font-medium text-right">Contacts</th>
              <th className="pb-3 font-medium text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60">
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-neutral-500 text-sm">
                  No campaigns yet. Click "New Campaign" to get started.
                </td>
              </tr>
            ) : (
              campaigns.map((campaign) => (
                <tr key={campaign.id} className="group hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="font-medium text-neutral-200">{campaign.name}</div>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      Created {new Date(campaign.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge status={campaign.status as any} />
                  </td>
                  <td className="py-3 pr-4 text-right tabular-nums text-neutral-300">{campaign.companies_count.toLocaleString()}</td>
                  <td className="py-3 pr-4 text-right tabular-nums text-neutral-300">{campaign.contacts_count.toLocaleString()}</td>
                  <td className="py-3 text-right">
                    <button className="p-1 rounded text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 transition-colors opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
