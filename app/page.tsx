'use client';

import { useEffect, useState } from 'react';
import { createClient } from "@/lib/supabase/client";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentCampaigns } from "@/components/dashboard/RecentCampaigns";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";

export default function Dashboard() {
  const [stats, setStats] = useState({ campaigns: 0, companies: 0, contacts: 0 });
  const [recentCampaigns, setRecentCampaigns] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      // 1. Total Campaigns
      const { count: campaignsCount } = await supabase
        .from('campaigns')
        .select('*', { count: 'exact', head: true })
        .neq('status', 'archived');

      // 2. Total Companies
      const { count: companiesCount } = await supabase
        .from('campaign_companies')
        .select('*', { count: 'exact', head: true });

      setStats({
        campaigns: campaignsCount || 0,
        companies: companiesCount || 0,
        contacts: 0 // Mock until built
      });

      // 3. Recent Campaigns
      const { data: campaignsData } = await supabase
        .from('campaigns')
        .select('id, name, status, created_at, user_id')
        .neq('status', 'archived')
        .order('created_at', { ascending: false })
        .limit(5);

      if (campaignsData) {
        const withCounts = await Promise.all(campaignsData.map(async (c) => {
          const { count } = await supabase
            .from('campaign_companies')
            .select('*', { count: 'exact', head: true })
            .eq('campaign_id', c.id);
          return {
            ...c,
            companies_count: count || 0,
            contacts_count: 0
          };
        }));
        setRecentCampaigns(withCounts);
        
        // 4. Map to Activity
        setActivities(campaignsData.map(c => ({
          id: c.id,
          user: 'System',
          action: 'created campaign',
          target: c.name,
          time: new Date(c.created_at).toLocaleDateString()
        })));
      }

      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-50">
            Overview
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Here's what's happening in your workspace today.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        <StatCard
          title="Active Campaigns"
          value={loading ? "-" : stats.campaigns.toString()}
          trend=""
          trendUp={true}
        />
        <StatCard
          title="Companies Discovered"
          value={loading ? "-" : stats.companies.toString()}
          trend=""
          trendUp={true}
        />
        <StatCard
          title="Contacts Sourced"
          value={loading ? "-" : stats.contacts.toString()}
          trend=""
          trendUp={false}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:gap-6">
        <div className="col-span-1 space-y-4 md:space-y-6 lg:col-span-2">
          {loading ? (
             <div className="py-12 flex justify-center text-neutral-500">Loading campaigns...</div>
          ) : (
             <RecentCampaigns campaigns={recentCampaigns} />
          )}
        </div>

        <div className="col-span-1 space-y-4 md:space-y-6">
          <QuickActions />
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  );
}