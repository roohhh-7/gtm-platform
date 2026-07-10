'use client';

import { useState, useEffect, useCallback } from 'react';
import { CampaignsHeader } from '@/components/campaigns/CampaignsHeader';
import { CampaignFilters } from '@/components/campaigns/CampaignFilters';
import { CampaignTable } from '@/components/campaigns/CampaignTable';
import NewCampaignModal from '@/components/NewCampaignModal';
import { campaignService } from '@/services/campaigns';
import { Campaign } from '@/types';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
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
    
    if (data) setCampaigns(data);
    if (count !== null) setTotalCount(count);
    
    setLoading(false);
  }, [search, status, page]);

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
    fetchCampaigns(); // Refresh data
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      await campaignService.deleteCampaign(id);
      fetchCampaigns(); // Refresh data
    }
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
      
      {loading ? (
        <div className="py-12 flex justify-center text-neutral-500">Loading campaigns...</div>
      ) : (
        <CampaignTable 
          campaigns={campaigns}
          totalCount={totalCount}
          currentPage={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDelete}
        />
      )}

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
