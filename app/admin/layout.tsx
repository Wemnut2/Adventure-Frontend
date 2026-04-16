// src/app/admin/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ModernSidebar } from '@/layout/components/admin/ModernSidebar';
import { ModernHeader } from '@/layout/components/admin/ModernHeader';
import { useAuthStore } from '@/libs/stores/auth.store';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, loadUser } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.role !== 'admin' && user?.role !== 'super_admin') {
      router.push('/dashboard');
    } else if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'super_admin')) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <ModernSidebar />
      <ModernHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <main className="p-6 transition-all duration-300 lg:ml-72 lg:mt-16">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}