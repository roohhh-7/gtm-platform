import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'elevated' | 'ghost' | 'flat';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'rounded-xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-md shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)] specular-border',
      interactive: 'rounded-xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-md hover:border-white/[0.14] hover:bg-white/[0.04] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] cursor-pointer specular-border',
      elevated: 'rounded-xl border border-white/[0.1] bg-[#10121a]/80 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.7)] specular-border',
      ghost: 'rounded-xl border border-transparent bg-transparent',
      flat: 'rounded-xl border border-white/[0.05] bg-white/[0.015]',
    };

    return (
      <div
        ref={ref}
        className={cn(variants[variant], 'p-5', className)}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';
