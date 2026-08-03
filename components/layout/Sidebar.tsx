'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Megaphone, 
  Building2, 
  Users, 
  Sparkles,
  Command,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, badge: null },
  { name: 'Campaigns', href: '/campaigns', icon: Megaphone, badge: null },
  { name: 'Companies', href: '/companies', icon: Building2, badge: null },
  { name: 'Contacts', href: '/contacts', icon: Users, badge: null },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/[0.06] bg-[#090b10]/90 backdrop-blur-2xl">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 shadow-[0_0_16px_rgba(99,102,241,0.4)] border border-white/20">
            <span className="text-white font-bold text-xs tracking-wider">O</span>
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#090b10]" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm tracking-tight text-white flex items-center gap-1.5">
              Orbital
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PRO
              </span>
            </span>
            <span className="text-[11px] text-zinc-400">GTM Workspace</span>
          </div>
        </div>
      </div>
      
      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-1.5">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          Workspace
        </div>

        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group relative flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150',
                isActive 
                  ? 'bg-white/[0.08] text-white shadow-[0_1px_3px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.12)] border border-white/[0.08]' 
                  : 'text-zinc-400 hover:bg-white/[0.035] hover:text-zinc-200'
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn(
                  'h-4 w-4 transition-colors duration-150',
                  isActive ? 'text-indigo-400' : 'text-zinc-400 group-hover:text-zinc-200'
                )} />
                <span className="tracking-tight">{item.name}</span>
              </div>

              {isActive && (
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
              )}
            </Link>
          );
        })}
      </nav>
      
      {/* Footer Profile & Workspace Status */}
      <div className="p-3.5 border-t border-white/[0.06] bg-white/[0.01]">
        <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-indigo-950 to-indigo-700 border border-indigo-400/30 flex items-center justify-center text-[10px] font-bold text-indigo-200 shadow-sm">
              GT
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-zinc-200 leading-tight">GTM Engineer</span>
              <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
                Live Sync
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.06]">
            v2.4
          </span>
        </div>
      </div>
    </aside>
  );
}
