'use client';

import { AccessGate } from '@/libs/providers/AccessGate';
import { DashboardProvider } from '@/libs/providers/DashboardProvider';
import { MainLayout } from '@/layout/sections/dashboard/MainLayout';
import { useAuthStore } from '@/libs/stores/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <DashboardProvider>
      <AccessGate>
        <MainLayout>
          {children}
        </MainLayout>
      </AccessGate>
    </DashboardProvider>
  );
}