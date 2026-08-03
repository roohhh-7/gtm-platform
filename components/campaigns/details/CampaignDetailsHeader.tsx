'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Megaphone, Sparkles, Building2 } from 'lucide-react';
import { campaignService } from '@/services/campaigns';
import { Campaign } from '@/types';

type Props = {
  campaignId: string;
};

export function CampaignDetailsHeader({ campaignId }: Props) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadCampaign() {
      const { campaign: data, error: err } = await campaignService.getCampaign(campaignId);
      if (err) setError(err as Error);
      else setCampaign(data);
    }
    loadCampaign();
  }, [campaignId]);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
      <div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Megaphone className="h-4 w-4" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-100 to-zinc-400">
            {campaign?.name || (error ? `Error: ${error.message}` : 'Loading Campaign...')}
          </h1>
          <Badge status={campaign?.status || 'active'} />
        </div>
        <p className="text-xs text-zinc-400 mt-1.5 flex items-center gap-2">
          <span>Targeting {campaign?.industry ? `companies in ${campaign.industry}` : 'prospect accounts'}</span>
          <span className="text-zinc-400">•</span>
          <span className="font-mono text-[11px] text-zinc-400">ID: {campaignId.slice(0, 8)}...</span>
        </p>
      </div>
    </div>
  );
}
