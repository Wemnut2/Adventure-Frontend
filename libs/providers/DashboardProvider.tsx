'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useAuthStore } from '@/libs/stores/auth.store';
import { useInvestmentStore } from '@/libs/stores/investment.store';
import { useTaskStore } from '@/libs/stores/task.store';
import { apiService } from '@/libs/services/api';

type DashboardState = 'loading' | 'no_form' | 'not_subscribed' | 'ready';

interface DashboardContextType {
  state: DashboardState;
  isLoading: boolean;
  refreshUserStatus: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard must be used within DashboardProvider');
  return context;
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, loadUser } = useAuthStore();
  const { fetchUserInvestments } = useInvestmentStore();
  const { fetchMyTasks } = useTaskStore();
  
  const [state, setState] = useState<DashboardState>('loading');
  const [isLoading, setIsLoading] = useState(true);

  const checkAccess = useCallback(async () => {
    if (!isAuthenticated) {
      setState('loading');
      return false;
    }

    try {
      // First, ensure we have fresh user data
      await loadUser();
      
      // Get fresh user from store after loadUser
      const currentUser = useAuthStore.getState().user;
      
      if (!currentUser) {
        setState('loading');
        return false;
      }

      // Check if user has filled the application form
      const { data: profile } = await apiService.get('/auth/profile/');
      const formFilled = !!profile.full_name;

      if (!formFilled) {
        setState('no_form');
        return false;
      }

      // Check subscription status
      if (!currentUser.is_subscribed) {
        setState('not_subscribed');
        return false;
      }

      // User has form filled AND is subscribed - load dashboard data
      await Promise.all([
        fetchUserInvestments(),
        fetchMyTasks()
      ]);

      setState('ready');
      return true;
    } catch (error) {
      console.error('Dashboard access check failed:', error);
      setState('no_form');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, loadUser, fetchUserInvestments, fetchMyTasks]);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await checkAccess();
    };
    init();
  }, [isAuthenticated, checkAccess]);

  const refreshUserStatus = async () => {
    await checkAccess();
  };

  return (
    <DashboardContext.Provider value={{ state, isLoading, refreshUserStatus }}>
      {children}
    </DashboardContext.Provider>
  );
}