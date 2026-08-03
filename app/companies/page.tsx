'use client';

import { useState, useEffect, useCallback } from 'react';
import { CampaignFilters } from '@/components/campaigns/CampaignFilters';
import { CampaignTable } from '@/components/campaigns/CampaignTable';
import { campaignService } from '@/services/campaigns';
import { Campaign } from '@/types';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

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
      <div className="pb-2 border-b border-white/[0.06]">
        <h1 className="text-2xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-100 to-zinc-400">
          Target Companies
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Select a campaign sequence to review and enrich account intelligence.
        </p>
      </div>
      
      <CampaignFilters 
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
      />
      
      {loading ? (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-16 flex flex-col items-center justify-center gap-3 backdrop-blur-md">
          <Loader2 className="h-6 w-6 text-indigo-400 animate-spin" />
          <span className="text-xs text-zinc-400">Loading companies database...</span>
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
          onRowClick={(id) => router.push(`/campaigns/${id}?tab=companies`)}
        />
      )}
    </div>
  );
}
