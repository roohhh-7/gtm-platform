import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none cursor-pointer';
    
    const variants = {
      primary: 'bg-zinc-100 text-zinc-950 hover:bg-white shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,1)] hover:shadow-[0_2px_8px_rgba(255,255,255,0.2)] rounded-lg font-semibold',
      accent: 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.35),inset_0_1px_0_0_rgba(255,255,255,0.2)] rounded-lg font-semibold border border-indigo-400/30',
      secondary: 'bg-white/[0.04] text-zinc-200 hover:bg-white/[0.08] hover:text-white border border-white/[0.08] hover:border-white/[0.16] shadow-[0_1px_2px_rgba(0,0,0,0.3)] rounded-lg',
      ghost: 'bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.05] rounded-lg',
      danger: 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/30 rounded-lg',
    };
    
    const sizes = {
      sm: 'h-7 px-2.5 text-xs gap-1.5',
      md: 'h-9 px-3.5 text-sm gap-2',
      lg: 'h-11 px-5 text-sm gap-2.5',
      icon: 'h-8 w-8 p-0',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
