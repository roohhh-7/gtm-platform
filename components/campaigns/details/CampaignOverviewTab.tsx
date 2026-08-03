'use client';

import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/dashboard/StatCard';

type Props = {
  campaignId: string;
};

export function CampaignOverviewTab({ campaignId }: Props) {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Contacts Found" value="0" trend="" trendUp={true} />
        <StatCard title="Emails Sent" value="0" trend="" trendUp={true} />
        <StatCard title="Replies" value="0" trend="" trendUp={true} />
        <StatCard title="Meetings" value="0" trend="" trendUp={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analytics Preview Placeholder */}
        <Card className="flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-sm font-medium text-neutral-200">Conversion Funnel</h2>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center min-h-[200px] border border-dashed border-neutral-800 rounded-lg">
            <div className="w-full max-w-[200px] space-y-2 opacity-50">
              <div className="w-full bg-neutral-800 rounded h-8 flex items-center justify-between px-3 text-xs text-neutral-400">
                <span>Sent</span>
                <span>0</span>
              </div>
              <div className="w-5/6 mx-auto bg-neutral-700/50 rounded h-8 flex items-center justify-between px-3 text-xs text-neutral-300">
                <span>Opened</span>
                <span>0</span>
              </div>
              <div className="w-3/4 mx-auto bg-emerald-900/30 border border-emerald-500/20 rounded h-8 flex items-center justify-between px-3 text-xs text-emerald-400 font-medium">
                <span>Replied</span>
                <span>0</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
