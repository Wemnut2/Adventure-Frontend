'use client';

import { useRouter } from 'next/navigation';
import { useDashboard } from './DashboardProvider';
import { useAuthStore } from '@/libs/stores/auth.store';
import ApplicationSection from '@/layout/sections/home/ApplicationSection';
import SubscriptionRequiredScreen from './SubscriptionRequiredScreen';
import { Loader2 } from 'lucide-react';

export function AccessGate({ children }: { children: React.ReactNode }) {
  const { state, isLoading } = useDashboard();
  const { user } = useAuthStore();
  const router = useRouter();

  if (isLoading || state === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-orange-500 h-8 w-8" />
      </div>
    );
  }

  if (state === 'no_form') {
    return <ApplicationSection skipProfileCheck />;
  }

  if (state === 'not_subscribed') {
    return <SubscriptionRequiredScreen userEmail={user?.email || ''} />;
  }

  return <>{children}</>;
}