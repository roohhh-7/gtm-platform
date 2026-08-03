import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && (
          <Search className="absolute left-3 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
        )}
        <input
          ref={ref}
          className={cn(
            'flex h-9 w-full rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-sm text-zinc-100 shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-150',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-zinc-400',
            'focus-visible:outline-none focus-visible:border-indigo-500/50 focus-visible:ring-2 focus-visible:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 hover:border-white/[0.14]',
            icon && 'pl-9',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = 'Input';
