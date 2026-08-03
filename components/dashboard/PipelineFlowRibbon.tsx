'use client';

import { Target, Search, Database, Sparkles, Send, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface PipelineStep {
  step: string;
  title: string;
  subtitle: string;
  icon: any;
  status: 'active' | 'ready' | 'completed';
  href: string;
  count?: string;
}

export function PipelineFlowRibbon() {
  const steps: PipelineStep[] = [
    {
      step: '01',
      title: 'Target ICP',
      subtitle: 'Define criteria',
      icon: Target,
      status: 'completed',
      href: '/campaigns',
    },
    {
      step: '02',
      title: 'Discovery',
      subtitle: 'Account radar',
      icon: Search,
      status: 'active',
      href: '/companies',
    },
    {
      step: '03',
      title: 'Enrichment',
      subtitle: 'Clay waterfall',
      icon: Database,
      status: 'ready',
      href: '/contacts',
    },
    {
      step: '04',
      title: '10-K Signal',
      subtitle: 'AI synthesis',
      icon: Sparkles,
      status: 'ready',
      href: '/campaigns',
    },
    {
      step: '05',
      title: 'Outreach',
      subtitle: 'Sequencing',
      icon: Send,
      status: 'ready',
      href: '/campaigns',
    },
  ];

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-xl specular-border shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-white/[0.05]">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Autonomous GTM Engine Pipeline
            </h2>
          </div>
        </div>
        <span className="text-[11px] font-mono text-zinc-400">5-Stage Continuous Flow</span>
      </div>

      {/* Horizontal Flow Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.step}
              href={s.href}
              className="group relative flex flex-col p-3 rounded-xl border border-white/[0.06] bg-white/[0.015] hover:bg-white/[0.05] hover:border-white/[0.14] transition-all duration-150 cursor-pointer overflow-hidden"
            >
              {/* Subtle top indicator */}
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] font-semibold text-zinc-400 group-hover:text-indigo-400 transition-colors">
                  {s.step}
                </span>
                {s.status === 'completed' && (
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                )}
                {s.status === 'active' && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:border-white/[0.12] transition-colors shrink-0">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors truncate">
                    {s.title}
                  </div>
                  <div className="text-[10px] text-zinc-400 truncate">
                    {s.subtitle}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
