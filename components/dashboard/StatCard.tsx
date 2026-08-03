import { Card } from '@/components/ui/Card';
import { StatCardData } from '@/types';
import { ArrowUpRight, ArrowDownRight, Activity, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props extends Omit<StatCardData, 'icon'> {
  icon?: any;
  subtitle?: string;
}

export function StatCard({ title, value, trend, trendUp, icon: Icon, subtitle }: Props) {
  return (
    <div className="relative group overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 backdrop-blur-md transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.035] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] specular-border">
      {/* Subtle top glow highlight on hover */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{title}</span>
        {Icon && (
          <div className="h-7 w-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-400 group-hover:text-zinc-200 transition-colors">
            <Icon className="h-3.5 w-3.5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-2">
        <span className="text-3xl font-bold tracking-tight text-white tabular-nums">
          {value}
        </span>

        {trend && (
          <div className={cn(
            'flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium tracking-wide border',
            trendUp 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_8px_rgba(52,211,153,0.15)]' 
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          )}>
            {trendUp ? (
              <ArrowUpRight className="h-3 w-3 mr-0.5 shrink-0" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-0.5 shrink-0" />
            )}
            <span>{trend}</span>
          </div>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-zinc-400">{subtitle}</p>
      )}
    </div>
  );
}
