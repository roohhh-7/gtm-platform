'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { authService } from '@/services/auth';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/auth');

  useEffect(() => {
    if (!isAuthPage) {
      authService.getUser().then(({ user }) => {
        if (!user) {
          router.push('/login');
        }
      });
    }
  }, [pathname, isAuthPage, router]);

  if (isAuthPage) {
    return (
      <main className="flex flex-col min-h-screen w-full items-center justify-center p-6 bg-[#08090c]">
        {children}
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#08090c] text-zinc-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 animate-in fade-in-50 duration-200">
        {children}
      </main>
    </div>
  );
}
