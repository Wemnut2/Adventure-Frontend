// src/libs/hooks/useAuth.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/libs/services/auth.service';
import { useAuthStore } from '@/libs/stores/auth.store';

/* ================= AUTH ================= */

export const useLogin = () => {
  const login = useAuthStore((state) => state.login);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: Parameters<typeof authService.register>[0]) =>
      authService.register(data),
  });
};

/* ================= USER ================= */

export const useUserProfile = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['user'],
    queryFn: () => authService.getProfile(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

export const useUpdateProfile = () => {
  const updateUser = useAuthStore((state) => state.updateUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof updateUser>[0]) => updateUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['subscription-status'] });
    },
  });
};

/* ================= PASSWORD ================= */

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: { old_password: string; new_password: string }) =>
      authService.changePassword(data),
  });
};

/* ================= ACTIVITIES ================= */

export const useActivities = () => {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['activities'],
    queryFn: () => authService.getMyActivities(),
    staleTime: 5 * 60 * 1000,
  });

  return {
    activities: query.data || [],
    isLoading: query.isLoading,
    refetch: query.refetch,
    mutate: () => queryClient.invalidateQueries({ queryKey: ['activities'] })
  };
};

/* ================= SUBSCRIPTION ================= */

export const useSubscriptionStatus = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['subscription-status'],
    queryFn: () => authService.checkSubscription(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};