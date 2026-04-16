// src/providers/AuthProvider.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/libs/stores/auth.store';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  userRole: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, loadUser, isLoading } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      await loadUser();
      setIsChecking(false);
    };
    initAuth();
  }, [loadUser]);

  useEffect(() => {
    if (isChecking) return;

    const isAdminRoute = pathname?.startsWith('/admin');
    const isUserRoute = pathname?.startsWith('/dashboard');
    const isAuthRoute = pathname === '/login' || pathname === '/register';

    // If not authenticated and not on auth page, redirect to login
    if (!isAuthenticated && !isAuthRoute) {
      router.push('/login');
      return;
    }

    // If authenticated
    if (isAuthenticated && user) {
      const userRole = user.role;
      
      // If on admin route but user is not admin
      if (isAdminRoute && userRole !== 'admin' && userRole !== 'super_admin') {
        router.push('/dashboard');
        return;
      }
      
      // If on user route but user is admin
      if (isUserRoute && (userRole === 'admin' || userRole === 'super_admin')) {
        router.push('/admin');
        return;
      }
      
      // If on auth page but authenticated, redirect to appropriate dashboard
      if (isAuthRoute) {
        if (userRole === 'admin' || userRole === 'super_admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
        return;
      }
    }
  }, [isAuthenticated, user, pathname, router, isChecking]);

  if (isChecking || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        userRole: user?.role || null,
        isAuthenticated,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}