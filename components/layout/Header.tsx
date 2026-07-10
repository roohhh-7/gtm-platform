'use client';

import { usePathname } from 'next/navigation';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Header() {
  const pathname = usePathname();
  
  // Basic breadcrumb generation based on path
  const pathSegments = pathname.split('/').filter(Boolean);
  const currentPage = pathSegments.length > 0 
    ? pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1)
    : 'Dashboard';

  return (
    <header className="h-14 border-b border-neutral-800/60 bg-neutral-950/80 backdrop-blur flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-medium text-neutral-200">
          {currentPage}
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="w-full bg-neutral-900 border border-neutral-800 rounded-md py-1.5 pl-9 pr-3 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-700 transition-colors"
          />
        </div>
        
        <Button variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-full">
          <Bell className="h-4 w-4 text-neutral-400" />
        </Button>
      </div>
    </header>
  );
}
