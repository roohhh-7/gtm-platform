'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Play, Pause, Pencil } from 'lucide-react';
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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-50">
            {campaign?.name || (error ? `Error: ${error.message}` : 'Loading Campaign...')}
          </h1>
          <Badge status={campaign?.status || 'active'} />
        </div>
        <p className="text-sm text-neutral-400 mt-1">{campaign?.description || `Targeting companies in the ${campaign?.industry || ''} industry.`}</p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="secondary" className="w-full sm:w-auto gap-2">
          <Pause className="h-4 w-4" />
          Pause
        </Button>
        <Button variant="secondary" className="w-full sm:w-auto gap-2">
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </div>
    </div>
  );
}
