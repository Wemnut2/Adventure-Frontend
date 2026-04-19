// src/stores/auth.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, ActivityLog, RegisterData } from '@/libs/types';
import { authService } from '@/libs/services/auth.service';
import { setTokens, removeTokens, getAccessToken } from '@/libs/utils/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  activities: ActivityLog[];
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  updateAccountInfo: (data: Partial<User>) => Promise<void>;
  fetchActivities: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      activities: [],

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await authService.login({ email, password });
          setTokens(response.access, response.refresh);
          set({ user: response.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });
        try {
          await authService.register(data);
          set({ isLoading: false });
        } catch (error) {
          console.error('Registration error:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            await authService.logout(refreshToken);
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          removeTokens();
          set({ user: null, isAuthenticated: false, isLoading: false, activities: [] });
        }
      },

      loadUser: async () => {
        const token = getAccessToken();
        if (!token) {
          set({ isAuthenticated: false, user: null, isLoading: false });
          return;
        }

        set({ isLoading: true });
        try {
          const user = await authService.getProfile();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          console.error('Load user error:', error);
          removeTokens();
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      updateUser: async (data: Partial<User>) => {
        set({ isLoading: true });
        try {
          const updatedUser = await authService.updateProfile(data);
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          console.error('Update user error:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      updateAccountInfo: async (data: Partial<User>) => {
        set({ isLoading: true });
        try {
          const updatedUser = await authService.updateAccountInfo(data);
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          console.error('Update account info error:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      fetchActivities: async () => {
        set({ isLoading: true });
        try {
          const activities = await authService.getMyActivities();
          set({ activities, isLoading: false });
        } catch (error) {
          console.error('Fetch activities error:', error);
          set({ isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);