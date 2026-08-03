'use client';

import { StatCard } from '@/components/dashboard/StatCard';
import { Users, Mail, MessageSquare, Calendar, Filter, Sparkles } from 'lucide-react';

type Props = {
  campaignId: string;
};

export function CampaignOverviewTab({ campaignId }: Props) {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Contacts Found" value="0" subtitle="Total discovered prospects" icon={Users} trend="+0%" trendUp={true} />
        <StatCard title="Emails Sent" value="0" subtitle="Delivered outbound emails" icon={Mail} trend="+0%" trendUp={true} />
        <StatCard title="Replies" value="0" subtitle="Prospect responses" icon={MessageSquare} trend="+0%" trendUp={true} />
        <StatCard title="Meetings" value="0" subtitle="Scheduled intro calls" icon={Calendar} trend="+0%" trendUp={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-6 backdrop-blur-md specular-border shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Filter className="h-3.5 w-3.5" />
              </div>
              <h2 className="text-sm font-semibold text-white tracking-tight">Conversion Funnel</h2>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">Analytics</span>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-400" />
                <span className="text-xs text-zinc-300 font-medium">Emails Sent</span>
              </div>
              <span className="text-xs font-mono font-semibold text-white">0</span>
            </div>

            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center justify-between ml-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                <span className="text-xs text-zinc-300 font-medium">Opened</span>
              </div>
              <span className="text-xs font-mono font-semibold text-white">0</span>
            </div>

            <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between ml-8">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span className="text-xs text-emerald-300 font-medium">Replied</span>
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-300">0</span>
            </div>
          </div>
        </div>

        {/* AI Performance summary */}
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-6 backdrop-blur-md specular-border shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-6 w-6 rounded-md bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <h2 className="text-sm font-semibold text-white tracking-tight">AI Signal Optimization</h2>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Orbital autonomously discovers high-fit accounts, enriches decision-maker emails, and synthesizes 10-K financial insights to craft ultra-personalized outreach angles.
            </p>
          </div>

          <div className="mt-6 p-3.5 rounded-lg bg-white/[0.015] border border-white/[0.05] flex items-center justify-between">
            <span className="text-xs text-zinc-400">Sequence status</span>
            <span className="text-xs font-semibold text-indigo-300">Ready to Enrich</span>
          </div>
        </div>
      </div>
    </div>
  );
}
