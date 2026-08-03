'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Megaphone, 
  Building2, 
  Users, 
  Search, 
  Plus, 
  Bell, 
  Sparkles,
  Command,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { authService } from '@/services/auth';
import { useState } from 'react';
import NewCampaignModal from '@/components/NewCampaignModal';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Campaigns', href: '/campaigns', icon: Megaphone },
  { name: 'Companies', href: '/companies', icon: Building2 },
  { name: 'Contacts', href: '/contacts', icon: Users },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    await authService.signOut();
    router.push('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.07] bg-[#08090c]/85 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
          {/* Brand & Route Switcher */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 shadow-[0_0_20px_rgba(99,102,241,0.45)] border border-white/20 transition-transform group-hover:scale-105">
                <span className="text-white font-bold text-xs tracking-wider">O</span>
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#08090c]" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                  Orbital
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    STUDIO
                  </span>
                </span>
              </div>
            </Link>

            {/* Segmented Route Pills */}
            <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md shadow-inner">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
                      isActive
                        ? 'bg-white/[0.1] text-white shadow-[0_1px_3px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.15)] border border-white/[0.1]'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                    )}
                  >
                    <item.icon className={cn('h-3.5 w-3.5', isActive ? 'text-indigo-400' : 'text-zinc-400')} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Center Search Command */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
              <input 
                type="text" 
                placeholder="Quick jump (⌘K)..." 
                className="w-full bg-white/[0.025] border border-white/[0.07] rounded-lg py-1.5 pl-9 pr-10 text-xs text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-150 shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]"
              />
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-4.5 select-none items-center rounded border border-white/[0.1] bg-white/[0.04] px-1 font-mono text-[9px] font-medium text-zinc-400">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Right Actions & Profile */}
          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span>GTM Active</span>
            </div>

            <Button 
              variant="accent" 
              size="sm" 
              className="gap-1.5 shadow-lg text-xs"
              onClick={() => setIsNewCampaignOpen(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">New Campaign</span>
            </Button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1.5 rounded-lg border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/[0.14] transition-all cursor-pointer"
              >
                <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-indigo-900 to-indigo-600 border border-indigo-400/30 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                  GT
                </div>
                <ChevronDown className="h-3 w-3 text-zinc-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-10 z-50 w-44 rounded-xl bg-[#10121a]/95 border border-white/[0.1] shadow-2xl py-1 backdrop-blur-2xl animate-in fade-in-50 duration-150">
                  <div className="px-3.5 py-2 border-b border-white/[0.06]">
                    <div className="text-xs font-semibold text-white">GTM Engineer</div>
                    <div className="text-[10px] text-zinc-400">workspace@orbital.ai</div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3.5 py-2 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sub-Navigation */}
        <div className="flex md:hidden items-center justify-around border-t border-white/[0.06] px-2 py-1.5 bg-white/[0.01]">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors',
                  isActive ? 'text-indigo-400' : 'text-zinc-400 hover:text-zinc-200'
                )}
              >
                <item.icon className="h-4 w-4 mb-0.5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </header>

      <NewCampaignModal 
        isOpen={isNewCampaignOpen}
        onClose={() => setIsNewCampaignOpen(false)}
        onSuccess={() => {
          setIsNewCampaignOpen(false);
          router.refresh();
        }}
      />
    </>
  );
}
