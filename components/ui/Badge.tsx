import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'neutral' | 'error' | 'indigo';
  status?: string;
  showDot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', status, showDot = true, children, ...props }, ref) => {
    let activeVariant = variant;
    let dotColor = 'bg-zinc-400';

    if (status) {
      switch (status.toLowerCase()) {
        case 'active':
        case 'sent':
        case 'replied':
        case 'completed':
          activeVariant = 'success';
          dotColor = 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]';
          break;
        case 'paused':
        case 'warning':
        case 'pending':
          activeVariant = 'warning';
          dotColor = 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]';
          break;
        case 'bounced':
        case 'error':
        case 'disqualified':
        case 'failed':
          activeVariant = 'error';
          dotColor = 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]';
          break;
        case 'draft':
          activeVariant = 'indigo';
          dotColor = 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]';
          break;
        default:
          activeVariant = 'neutral';
          dotColor = 'bg-zinc-400';
          break;
      }
    }

    const variants = {
      default: 'bg-white/[0.05] text-zinc-300 border border-white/[0.08]',
      success: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
      warning: 'bg-amber-500/10 text-amber-300 border border-amber-500/20',
      error: 'bg-rose-500/10 text-rose-300 border border-rose-500/20',
      neutral: 'bg-white/[0.03] text-zinc-400 border border-white/[0.06]',
      indigo: 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide shadow-sm backdrop-blur-sm',
          variants[activeVariant],
          className
        )}
        {...props}
      >
        {showDot && (
          <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotColor)} />
        )}
        <span>{status ? status.charAt(0).toUpperCase() + status.slice(1) : children}</span>
      </span>
    );
  }
);
Badge.displayName = 'Badge';
