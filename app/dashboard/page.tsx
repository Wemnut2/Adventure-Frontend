'use client';

import { useDashboard } from '@/libs/providers/DashboardProvider';
import { useAuthStore } from '@/libs/stores/auth.store';
import DashboardContent from './DashboardContent';

export default function DashboardPage() {
  const { state } = useDashboard();
  const { user } = useAuthStore();

  if (state !== 'ready') return null;

  return <DashboardContent user={user} />;
}