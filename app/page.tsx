import { StatCard } from "@/components/dashboard/StatCard";
import { RecentCampaigns } from "@/components/dashboard/RecentCampaigns";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";

export default async function Dashboard() {

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
          value="12"
          trend="+2"
          trendUp={true}
        />
        <StatCard
          title="Emails Sent"
          value="45,231"
          trend="+12%"
          trendUp={true}
        />
        <StatCard
          title="Meetings Booked"
          value="128"
          trend="-3%"
          trendUp={false}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:gap-6">
        <div className="col-span-1 space-y-4 md:space-y-6 lg:col-span-2">
          <RecentCampaigns />
        </div>

        <div className="col-span-1 space-y-4 md:space-y-6">
          <QuickActions />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}