'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Megaphone, 
  Building2, 
  Users, 
  Search, 
  Blocks, 
  Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Campaigns', href: '/campaigns', icon: Megaphone },
  { name: 'Companies', href: '/companies', icon: Building2 },
  { name: 'Contacts', href: '/contacts', icon: Users },
  { name: 'Research', href: '/research', icon: Search },
  { name: 'Integrations', href: '/integrations', icon: Blocks },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-neutral-800/60 bg-neutral-950/50 backdrop-blur-xl">
      <div className="flex h-14 items-center px-6 border-b border-neutral-800/60">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-neutral-100 flex items-center justify-center">
            <span className="text-neutral-950 font-bold text-xs">O</span>
          </div>
          <span className="font-semibold text-sm tracking-tight text-neutral-100">Orbital</span>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <div className="px-3 text-xs font-medium text-neutral-500 mb-2 mt-2 uppercase tracking-wider">Workspace</div>
        {navItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive 
                  ? 'bg-neutral-900 text-neutral-100' 
                  : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
        
        <div className="px-3 text-xs font-medium text-neutral-500 mb-2 mt-6 uppercase tracking-wider">Configure</div>
        {navItems.slice(5).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive 
                  ? 'bg-neutral-900 text-neutral-100' 
                  : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-neutral-800/60">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-medium">
            GTM
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-neutral-200">GTM Engineer</span>
            <span className="text-xs text-neutral-500">Free Plan</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
