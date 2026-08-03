'use client';

import { useEffect, useState } from 'react';
import { createClient } from "@/lib/supabase/client";
import { RecentCampaigns } from "@/components/dashboard/RecentCampaigns";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { PipelineFlowRibbon } from "@/components/dashboard/PipelineFlowRibbon";
import { Megaphone, Building2, Users, Plus, Sparkles, ArrowUpRight, Activity, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from 'next/link';

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
        contacts: 0
      });

      // 3. Recent Campaigns
      const { data: campaignsData } = await supabase
        .from('campaigns')
        .select('id, name, status, created_at, user_id')
        .neq('status', 'archived')
        .order('created_at', { ascending: false })
        .limit(6);

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
          user: 'GTM Studio',
          action: 'initialized pipeline for',
          target: c.name,
          time: new Date(c.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        })));
      }

      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero Mission Control Strip with Integrated Continuous Metrics */}
      <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 backdrop-blur-2xl specular-border shadow-2xl relative overflow-hidden">
        {/* Subtle ambient light gradient in corner */}
        <div className="absolute top-0 right-0 w-96 h-48 bg-indigo-500/10 blur-3xl pointer-events-none -z-10" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 shadow-sm">
                <Zap className="h-3 w-3 text-indigo-400" />
                GTM Operations Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-100 to-zinc-400">
              Command Mission Control
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
              Autonomous outbound pipelines, real-time signal enrichment, and high-fit account acquisition.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/campaigns">
              <Button variant="accent" size="md" className="gap-2 shadow-xl text-xs font-semibold px-4">
                <Plus className="h-4 w-4" />
                <span>Launch New Campaign</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Integrated Continuous Metrics Strip (No isolated box cards!) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Active Sequences</span>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-white font-mono">
                {loading ? '-' : stats.campaigns}
              </span>
              <span className="text-[11px] text-emerald-400 font-medium">+12%</span>
            </div>
            <span className="text-[11px] text-zinc-400 mt-0.5">Running outreach</span>
          </div>

          <div className="flex flex-col border-l border-white/[0.06] pl-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Discovered Accounts</span>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-white font-mono">
                {loading ? '-' : stats.companies}
              </span>
              <span className="text-[11px] text-emerald-400 font-medium">+28%</span>
            </div>
            <span className="text-[11px] text-zinc-400 mt-0.5">In qualification funnel</span>
          </div>

          <div className="flex flex-col border-l border-white/[0.06] pl-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Enriched Contacts</span>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-white font-mono">
                {loading ? '-' : stats.contacts}
              </span>
              <span className="text-[11px] text-zinc-400 font-mono">Ready</span>
            </div>
            <span className="text-[11px] text-zinc-400 mt-0.5">Verified decision makers</span>
          </div>

          <div className="flex flex-col border-l border-white/[0.06] pl-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Signal Engine</span>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-base font-bold tracking-tight text-indigo-300 font-mono">
                10-K & Clay
              </span>
            </div>
            <span className="text-[11px] text-zinc-400 mt-0.5">Autonomous enrichment</span>
          </div>
        </div>
      </div>

      {/* Full-width 5-Stage Interactive Pipeline Flow Ribbon */}
      <PipelineFlowRibbon />

      {/* Dual-Pane Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane (7 cols) - Campaign Command Center */}
        <div className="lg:col-span-7 space-y-6">
          {loading ? (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-12 text-center text-xs text-zinc-400 backdrop-blur-md">
              Loading campaign pipelines...
            </div>
          ) : (
            <RecentCampaigns campaigns={recentCampaigns} />
          )}
        </div>

        {/* Right Pane (5 cols) - Activity Radar & Launch Shortcuts */}
        <div className="lg:col-span-5 space-y-6">
          <QuickActions />
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  );
}