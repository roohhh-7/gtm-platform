import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { label: string; value: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        <select
          ref={ref}
          className={cn(
            'appearance-none flex h-9 w-full rounded-lg border border-white/[0.08] bg-[#12141c]/90 px-3 py-1 pr-8 text-sm text-zinc-100 shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-150',
            'placeholder:text-zinc-400',
            'focus-visible:outline-none focus-visible:border-indigo-500/50 focus-visible:ring-2 focus-visible:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 hover:border-white/[0.14] cursor-pointer',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-[#12141c] text-zinc-100 py-1">
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
      </div>
    );
  }
);
Select.displayName = 'Select';
