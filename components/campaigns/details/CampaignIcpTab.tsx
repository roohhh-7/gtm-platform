'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Target, Pencil } from 'lucide-react';
import { icpService } from '@/services/icps';
import { ICP } from '@/types';
import EditICPModal from '@/components/icp/EditICPModal';

type Props = {
  campaignId: string;
};

export function CampaignIcpTab({ campaignId }: Props) {
  const [icp, setIcp] = useState<ICP | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchIcp = async () => {
      const { icp } = await icpService.getICP(campaignId);
      setIcp(icp);
      setLoading(false);
    };
    fetchIcp();
  }, [campaignId]);

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-neutral-400" />
            <h2 className="text-sm font-medium text-neutral-200">Target ICP Profile</h2>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="p-1 hover:bg-neutral-800 rounded transition-colors text-neutral-400 hover:text-white"
          >
            <Pencil className="h-3 w-3" />
          </button>
        </div>
        
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-neutral-800 rounded w-full"></div>
            <div className="h-4 bg-neutral-800 rounded w-3/4"></div>
          </div>
        ) : !icp ? (
          <div className="text-sm text-neutral-500 py-4 text-center">
            No ICP defined yet. Click edit to configure your target profile.
          </div>
        ) : (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-3 gap-2 py-2 border-b border-neutral-800/60">
              <span className="text-neutral-500">What are you selling?</span>
              <span className="col-span-2 text-neutral-200 whitespace-pre-wrap">
                {icp.product_description || 'Not specified'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-2 border-b border-neutral-800/60">
              <span className="text-neutral-500">What problem are you solving?</span>
              <span className="col-span-2 text-neutral-200 whitespace-pre-wrap">
                {icp.problem_statement || 'Not specified'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-2 border-b border-neutral-800/60">
              <span className="text-neutral-500">Who buys it?</span>
              <span className="col-span-2 text-neutral-200">
                {icp.titles?.length ? icp.titles.join(', ') : 'Any'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-2 border-b border-neutral-800/60">
              <span className="text-neutral-500">Target Industry</span>
              <span className="col-span-2 text-neutral-200">
                {icp.industries?.length ? icp.industries.join(', ') : 'Any'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-2 border-b border-neutral-800/60">
              <span className="text-neutral-500">Company Size</span>
              <span className="col-span-2 text-neutral-200">
                {icp.company_sizes?.length ? icp.company_sizes.join(', ') : 'Any'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-2 border-b border-neutral-800/60">
              <span className="text-neutral-500">Country</span>
              <span className="col-span-2 text-neutral-200">
                {icp.locations?.length ? icp.locations.join(', ') : 'Any'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-2 border-b border-neutral-800/60">
              <span className="text-neutral-500">Market Segment</span>
              <span className="col-span-2 text-neutral-200">
                {icp.market_segments?.length ? icp.market_segments.join(', ') : 'Any'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-2 border-b border-neutral-800/60">
              <span className="text-neutral-500">Ideal Customer Characteristics</span>
              <span className="col-span-2 text-neutral-200 whitespace-pre-wrap">
                {icp.ideal_customer_characteristics || 'Not specified'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-2">
              <span className="text-neutral-500">Target Specific Domains</span>
              <span className="col-span-2 text-neutral-200">
                {icp.target_domains?.length ? icp.target_domains.join(', ') : 'None specified'}
              </span>
            </div>
          </div>
        )}
      </Card>

      <EditICPModal 
        isOpen={isEditModalOpen} 
        campaignId={campaignId}
        initialData={icp}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={(updated) => {
          setIcp(updated);
          setIsEditModalOpen(false);
        }}
      />
    </div>
  );
}
