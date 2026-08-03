'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
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
      <main className="flex flex-col min-h-screen w-full items-center justify-center p-6 bg-neutral-950">
        {children}
      </main>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="flex flex-col flex-1 pl-0 md:pl-64">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
