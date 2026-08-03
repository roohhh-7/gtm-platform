'use client';

import { Badge } from '@/components/ui/Badge';
import { ArrowRight, Megaphone, Plus, Building2, Users, Sparkles, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface CampaignWithCounts {
  id: string;
  name: string;
  status: string;
  created_at: string;
  companies_count: number;
  contacts_count: number;
}

export function RecentCampaigns({ campaigns = [] }: { campaigns?: CampaignWithCounts[] }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-6 w-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Megaphone className="h-3.5 w-3.5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Active Campaign Workflows</h2>
            <p className="text-[11px] text-zinc-400">Live outbound sequencing and pipeline progress</p>
          </div>
        </div>
        <Link href="/campaigns">
          <Button variant="ghost" size="sm" className="text-xs text-zinc-400 hover:text-white gap-1">
            <span>All Campaigns ({campaigns.length})</span>
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>

      {/* Modern Campaign Cards Grid */}
      {campaigns.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.01] p-12 text-center">
          <Megaphone className="h-8 w-8 text-zinc-400 stroke-1 mx-auto mb-2" />
          <p className="font-medium text-sm text-zinc-300">No active campaigns</p>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
            Create an outbound campaign to start discovering qualified companies and enriching decision makers.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {campaigns.map((c) => (
            <Link
              key={c.id}
              href={`/campaigns/${c.id}`}
              className="group relative flex flex-col justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 backdrop-blur-md hover:bg-white/[0.04] hover:border-white/[0.14] hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-all duration-150 specular-border"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="font-semibold text-sm text-zinc-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {c.name}
                  </div>
                  <Badge status={c.status as any} />
                </div>
                <div className="text-[11px] text-zinc-400 font-mono">
                  Created {new Date(c.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>

              {/* Progress & Metrics pill strip */}
              <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Building2 className="h-3.5 w-3.5 text-zinc-400" />
                    <span className="font-semibold text-white">{c.companies_count}</span>
                    <span className="text-[10px] text-zinc-400">cos</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Users className="h-3.5 w-3.5 text-zinc-400" />
                    <span className="font-semibold text-white">{c.contacts_count}</span>
                    <span className="text-[10px] text-zinc-400">leads</span>
                  </div>
                </div>

                <div className="h-6 w-6 rounded-md bg-white/[0.03] group-hover:bg-white/[0.08] border border-white/[0.06] flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
