'use client';

import { useState, useEffect, useCallback } from 'react';
import { CampaignsHeader } from '@/components/campaigns/CampaignsHeader';
import { CampaignFilters } from '@/components/campaigns/CampaignFilters';
import { CampaignTable } from '@/components/campaigns/CampaignTable';
import { CampaignInspector } from '@/components/campaigns/CampaignInspector';
import NewCampaignModal from '@/components/NewCampaignModal';
import { campaignService } from '@/services/campaigns';
import { Campaign } from '@/types';
import { Loader2, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  
  // Filters and Pagination
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    const { campaigns: data, count } = await campaignService.getCampaigns({
      search,
      status,
      page,
      limit: pageSize,
    });
    
    if (data) {
      setCampaigns(data);
      // Auto select first campaign if none currently selected
      if (!selectedCampaign && data.length > 0) {
        setSelectedCampaign(data[0]);
      } else if (selectedCampaign) {
        // Keep updated data for selected campaign
        const updated = data.find(c => c.id === selectedCampaign.id);
        if (updated) setSelectedCampaign(updated);
      }
    }
    if (count !== null) setTotalCount(count);
    
    setLoading(false);
  }, [search, status, page, selectedCampaign]);

  // Debounce search slightly to avoid excessive calls
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCampaigns();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchCampaigns]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, status]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    await campaignService.updateStatus(id, newStatus);
    fetchCampaigns();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      await campaignService.deleteCampaign(id);
      if (selectedCampaign?.id === id) {
        setSelectedCampaign(null);
      }
      fetchCampaigns();
    }
  };

  const handleSelectCampaign = (id: string) => {
    const c = campaigns.find(item => item.id === id);
    if (c) setSelectedCampaign(c);
  };

  return (
    <div className="space-y-6">
      <CampaignsHeader onCreateClick={() => setIsModalOpen(true)} />
      
      <CampaignFilters 
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
      />
      
      {/* Master-Detail Split Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Master List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {loading ? (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-16 flex flex-col items-center justify-center gap-3 backdrop-blur-md">
              <Loader2 className="h-6 w-6 text-indigo-400 animate-spin" />
              <span className="text-xs text-zinc-400">Loading campaign directory...</span>
            </div>
          ) : (
            <CampaignTable 
              campaigns={campaigns}
              totalCount={totalCount}
              currentPage={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDelete}
              onRowClick={handleSelectCampaign}
            />
          )}
        </div>

        {/* Detail Inspector (5 cols) */}
        <div className="lg:col-span-5">
          <CampaignInspector 
            campaign={selectedCampaign}
            onClose={() => setSelectedCampaign(null)}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <NewCampaignModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchCampaigns();
        }}
      />
    </div>
  );
}
