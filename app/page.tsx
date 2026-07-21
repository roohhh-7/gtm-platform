import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentCampaigns } from "@/components/dashboard/RecentCampaigns";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";

export default async function Dashboard() {
  const supabase = await createClient();

  // 1. Total Campaigns
  const { count: campaignsCount } = await supabase
    .from('campaigns')
    .select('*', { count: 'exact', head: true })
    .neq('status', 'archived');

  // 2. Total Companies Sourced
  const { count: companiesCount } = await supabase
    .from('campaign_companies')
    .select('*', { count: 'exact', head: true });

  // 3. Total Contacts Found
  // (We use a mock count or query campaign_contacts if it exists)
  const { count: contactsCount } = await supabase
    .from('campaign_companies') // for now just an arbitrary metric until contacts table is populated
    .select('*', { count: 'exact', head: true });

  // 4. Recent Campaigns
  const { data: recentCampaigns } = await supabase
    .from('campaigns')
    .select('id, name, status, created_at, user_id')
    .neq('status', 'archived')
    .order('created_at', { ascending: false })
    .limit(5);
    
  // Fetch company counts for each recent campaign
  const campaignsWithCounts = await Promise.all((recentCampaigns || []).map(async (campaign) => {
    const { count } = await supabase
      .from('campaign_companies')
      .select('*', { count: 'exact', head: true })
      .eq('campaign_id', campaign.id);
    return {
      ...campaign,
      companies_count: count || 0,
      contacts_count: 0 // Mock until we build Contacts sync
    };
  }));

  // 5. Recent Activity
  // Let's just fetch the 5 most recently created campaigns to show as activity
  const { data: recentActivityCampaigns } = await supabase
    .from('campaigns')
    .select('id, name, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  const activities = (recentActivityCampaigns || []).map(c => ({
    id: c.id,
    user: 'System',
    action: 'created campaign',
    target: c.name,
    time: new Date(c.created_at).toLocaleDateString()
  }));

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
          value={(campaignsCount || 0).toString()}
          trend=""
          trendUp={true}
        />
        <StatCard
          title="Companies Discovered"
          value={(companiesCount || 0).toString()}
          trend=""
          trendUp={true}
        />
        <StatCard
          title="Contacts Sourced"
          value={(0).toString()}
          trend=""
          trendUp={false}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:gap-6">
        <div className="col-span-1 space-y-4 md:space-y-6 lg:col-span-2">
          <RecentCampaigns campaigns={campaignsWithCounts} />
        </div>

        <div className="col-span-1 space-y-4 md:space-y-6">
          <QuickActions />
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  );
}