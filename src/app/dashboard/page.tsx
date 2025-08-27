'use client';
import { useEffect } from 'react';
import { KpiCard, KpiCardSkeleton } from '@/components/kpi-card';
import { api } from '@/lib/api';
import { useAppContext } from '@/contexts/app-context';
import type { Stats } from '@/types';
import useSWR from 'swr';
import { AlertCircle, FileText, Users, BadgeCheck, Tag, Banknote } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const fetcher = (url: string) => api(url).then(res => res.data);

export default function DashboardPage() {
  const { setPageTitle } = useAppContext();
  const { data: stats, error, isLoading } = useSWR<Stats>('/stats', fetcher, { revalidateOnFocus: false });

  useEffect(() => {
    setPageTitle('Dashboard');
  }, [setPageTitle]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load dashboard statistics. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {isLoading ? (
          <>
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
          </>
        ) : stats ? (
          <>
            <KpiCard title="Total Users" value={stats.total_users} icon={Users} />
            <KpiCard title="Total Leads" value={stats.total_leads} icon={FileText} />
            <KpiCard title="Verified Leads" value={stats.verified_leads} icon={BadgeCheck} />
            <KpiCard title="Offers" value={stats.total_offers} icon={Tag} />
            <KpiCard title="Withdraw Requests" value={stats.total_withdraw_reqs} icon={Banknote} />
          </>
        ) : null}
      </div>
      <div className="mt-8">
        {/* Additional dashboard components like charts can be added here */}
      </div>
    </div>
  );
}
