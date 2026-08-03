'use client';

import { usePathname } from 'next/navigation';
import { Bell, Search, Command, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Header() {
  const pathname = usePathname();
  
  // Basic breadcrumb generation based on path
  const pathSegments = pathname.split('/').filter(Boolean);
  const currentPage = pathSegments.length > 0 
    ? pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1)
    : 'Overview';

  return (
    <header className="h-16 border-b border-white/[0.06] bg-[#08090c]/70 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="flex items-center text-xs text-zinc-400 gap-1.5 font-medium">
          <span className="hover:text-zinc-200 transition-colors cursor-pointer">Workspace</span>
          <span className="text-zinc-400">/</span>
          <span className="text-zinc-100 font-semibold tracking-tight text-sm">{currentPage}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Command Search Trigger */}
        <div className="relative hidden md:flex items-center w-72">
          <Search className="absolute left-3 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
          <input 
            type="text" 
            placeholder="Search campaigns, companies..." 
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg py-1.5 pl-9 pr-12 text-xs text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-150 shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-white/[0.1] bg-white/[0.05] px-1.5 font-mono text-[10px] font-medium text-zinc-400">
            <span>⌘</span>K
          </kbd>
        </div>

        {/* Live system status chip */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span>System Healthy</span>
        </div>
        
        <Button variant="secondary" size="icon" className="h-8 w-8 rounded-lg">
          <Bell className="h-3.5 w-3.5 text-zinc-400" />
        </Button>
      </div>
    </header>
  );
}
