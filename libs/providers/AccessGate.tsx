'use client';

import { useRouter } from 'next/navigation';
import { useDashboard } from './DashboardProvider';
import { useAuthStore } from '@/libs/stores/auth.store';
import ApplicationSection from '@/layout/sections/home/ApplicationSection';
import SubscriptionRequiredScreen from './SubscriptionRequiredScreen';
import { Loader2 } from 'lucide-react';
import { useCallback } from 'react';

export function AccessGate({ children }: { children: React.ReactNode }) {
  const { state, isLoading, refreshUserStatus } = useDashboard(); // Use refreshUserStatus instead
  const { user, loadUser } = useAuthStore();
  const router = useRouter();

  const handleApplicationSuccess = useCallback(async () => {
    // Refresh user data first
    await loadUser();
    // Then refresh the dashboard state
    if (refreshUserStatus) {
      await refreshUserStatus();
    }
    // No need to manually update state - the refreshUserStatus should update the dashboard state
  }, [loadUser, refreshUserStatus]);

  if (isLoading || state === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-orange-500 h-8 w-8" />
      </div>
    );
  }

  if (state === 'no_form') {
    return <ApplicationSection skipProfileCheck onSuccess={handleApplicationSuccess} />;
  }

  if (state === 'not_subscribed') {
    return <SubscriptionRequiredScreen userEmail={user?.email || ''} />;
  }

  return <>{children}</>;
}