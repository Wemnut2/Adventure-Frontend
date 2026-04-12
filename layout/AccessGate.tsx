'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/libs/stores/auth.store';
import ApplicationSection from '@/layout/sections/home/ApplicationSection';

export default function AccessGate({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (!user) return;
    if (user.status === 'payment_pending' && pathname !== '/apply') {
      router.replace('/apply');
    }
  }, [isAuthenticated, user, pathname, router]);

  if (!isAuthenticated) return null;
  if (!user) return <div>Loading...</div>;

  if (user.status === 'pending' || user.status === 'form_pending') {
    return <ApplicationSection />;
  }

  if (user.status === 'payment_pending' && pathname !== '/apply') return null;

  if (user.status === 'under_review') {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold">Verification Under Review</h2>
        <p className="text-gray-500 mt-2">
          Your payment is being reviewed. You'll get access once approved.
        </p>
      </div>
    );
  }

  if (user.status === 'active') return <>{children}</>;

  return null;
}