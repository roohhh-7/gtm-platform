import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { CampaignStatus } from '@/types';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'neutral';
  status?: CampaignStatus; // Helper for auto-mapping statuses
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', status, children, ...props }, ref) => {
    let activeVariant = variant;

    if (status) {
      switch (status) {
        case 'active':
          activeVariant = 'success';
          break;
        case 'paused':
          activeVariant = 'warning';
          break;
        case 'draft':
        case 'completed':
          activeVariant = 'neutral';
          break;
      }
    }

    const variants = {
      default: 'bg-neutral-800 text-neutral-300',
      success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      neutral: 'bg-neutral-800/50 text-neutral-400 border border-neutral-700/50',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
          variants[activeVariant],
          className
        )}
        {...props}
      >
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : children}
      </span>
    );
  }
);
Badge.displayName = 'Badge';
