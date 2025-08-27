"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { DashboardLayout } from './layout/dashboard-layout';
import FullScreenLoader from './full-screen-loader';
import { AppProvider } from '@/contexts/app-context';

const PUBLIC_PATHS = ['/login'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('rb_token');
    const isPublicPath = PUBLIC_PATHS.includes(pathname);

    if (!token && !isPublicPath) {
      router.replace('/login');
    } else if (token && isPublicPath) {
      router.replace('/dashboard');
    } else {
      setIsVerifying(false);
    }
  }, [pathname, router]);

  if (isVerifying) {
    return <FullScreenLoader />;
  }

  if (PUBLIC_PATHS.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <AppProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </AppProvider>
  );
}
