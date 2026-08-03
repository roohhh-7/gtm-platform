'use client';

import { useState, useEffect, useCallback } from 'react';
import { CampaignFilters } from '@/components/campaigns/CampaignFilters';
import { CampaignTable } from '@/components/campaigns/CampaignTable';
import { campaignService } from '@/services/campaigns';
import { Campaign } from '@/types';
import { useRouter } from 'next/navigation';

export default function CompaniesPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Filters and Pagination
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 10;

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

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCampaigns();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchCampaigns]);

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
      fetchCampaigns();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Select a Campaign</h1>
        <p className="text-neutral-400 mt-1">Choose a campaign to view and manage its companies spreadsheet.</p>
      </div>
      
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
          onRowClick={(id) => router.push(`/campaigns/${id}?tab=companies`)}
        />
      )}
    </div>
  );
}
