

'use client';

import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { MainLayout } from '@/layout/sections/dashboard/MainLayout';
import DashboardContent from './DashboardContent';
import { useAuthStore } from '@/libs/stores/auth.store';
import { useInvestmentStore } from '@/libs/stores/investment.store';
import { useTaskStore } from '@/libs/stores/task.store';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { investments, fetchInvestments, isLoading: invLoading } = useInvestmentStore();
  const { myTasks, fetchMyTasks, isLoading: taskLoading } = useTaskStore();

  useEffect(() => {
    fetchInvestments();
    fetchMyTasks();
  }, []);

  if (invLoading || taskLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-orange-500 h-8 w-8" />
            <p className="text-sm text-gray-500">Loading your dashboard...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <DashboardContent
        user={user}
        investments={Array.isArray(investments) ? investments : []}
        myTasks={Array.isArray(myTasks) ? myTasks : []}
      />
    </MainLayout>
  );
}
