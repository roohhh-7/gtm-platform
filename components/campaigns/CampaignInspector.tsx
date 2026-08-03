'use client';

import { Campaign } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  Building2, 
  Users, 
  Target, 
  Search, 
  Sparkles, 
  Send, 
  ArrowUpRight, 
  Archive, 
  Trash2, 
  X,
  ExternalLink,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

interface Props {
  campaign: Campaign | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

export function CampaignInspector({ campaign, onClose, onUpdateStatus, onDelete }: Props) {
  if (!campaign) {
    return (
      <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] p-12 text-center flex flex-col items-center justify-center min-h-[380px]">
        <Target className="h-8 w-8 text-zinc-400 mb-2 stroke-1" />
        <div className="text-xs font-semibold text-zinc-300">Select a Campaign</div>
        <div className="text-[11px] text-zinc-400 mt-1 max-w-xs">
          Click any campaign on the left to preview its metrics, ICP criteria, and jump to live workflow tabs.
        </div>
      </div>
    );
  }

  const tabShortcuts = [
    { label: 'Target ICP', tab: 'icp', icon: Target },
    { label: 'Company Accounts', tab: 'companies', icon: Building2 },
    { label: 'Prospect Discovery', tab: 'discovery', icon: Search },
    { label: 'Decision Makers', tab: 'contacts', icon: Users },
    { label: '10-K AI Research', tab: 'research', icon: Sparkles },
    { label: 'Outreach Sequence', tab: 'outreach', icon: Send },
  ];

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-xl specular-border shadow-2xl space-y-5 sticky top-24">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-4 border-b border-white/[0.06]">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge status={campaign.status as any} />
            <span className="font-mono text-[10px] text-zinc-400">
              {new Date(campaign.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <h2 className="text-base font-bold text-white tracking-tight break-words">
            {campaign.name}
          </h2>
          {campaign.industry && (
            <p className="text-xs text-indigo-300 mt-0.5">
              Industry: {campaign.industry}
            </p>
          )}
        </div>

        <button 
          onClick={onClose}
          className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.05] transition-colors shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
        <div className="text-center">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Sent</span>
          <div className="text-sm font-bold text-white font-mono mt-0.5">{campaign.sent || 0}</div>
        </div>
        <div className="text-center border-x border-white/[0.06]">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Replies</span>
          <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">{campaign.replies || 0}</div>
        </div>
        <div className="text-center">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Meetings</span>
          <div className="text-sm font-bold text-indigo-300 font-mono mt-0.5">{campaign.meetings || 0}</div>
        </div>
      </div>

      {/* Direct Tab Jumps */}
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-2">
          Jump to Workspace Tab
        </span>
        <div className="grid grid-cols-2 gap-2">
          {tabShortcuts.map((s) => (
            <Link
              key={s.tab}
              href={`/campaigns/${campaign.id}?tab=${s.tab}`}
              className="flex items-center gap-2 p-2.5 rounded-lg border border-white/[0.06] bg-white/[0.015] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all text-xs font-medium text-zinc-300 hover:text-white"
            >
              <s.icon className="h-3.5 w-3.5 text-zinc-400" />
              <span className="truncate">{s.label}</span>
              <ArrowUpRight className="h-3 w-3 text-zinc-400 ml-auto shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Full Details CTA & Actions */}
      <div className="pt-3 border-t border-white/[0.06] space-y-2">
        <Link href={`/campaigns/${campaign.id}`} className="block w-full">
          <Button variant="accent" size="sm" className="w-full gap-1.5 text-xs font-semibold">
            <span>Open Campaign Studio</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </Link>

        <div className="flex items-center justify-between gap-2 pt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUpdateStatus(campaign.id, campaign.status === 'paused' ? 'active' : 'paused')}
            className="text-xs text-zinc-400 hover:text-white flex-1"
          >
            {campaign.status === 'paused' ? 'Resume' : 'Pause'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(campaign.id)}
            className="text-xs text-rose-400 hover:bg-rose-500/10 flex-1 gap-1"
          >
            <Trash2 className="h-3 w-3" />
            <span>Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
