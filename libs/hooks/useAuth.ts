// src/hooks/useAuth.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/libs/stores/auth.store';
import { authService } from '@/libs/services/auth.service';
import { RegisterData } from '@/libs/types';

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

export const useRegister = () => {
  const register = useAuthStore((state) => state.register);

  return useMutation({
    mutationFn: (data: RegisterData) => register(data),
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

export const useUserProfile = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => authService.getProfile(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useActivities = () => {
  return useQuery({
    queryKey: ['activities'],
    queryFn: () => authService.getMyActivities(),
  });
};

export const useSubscriptionStatus = () => {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: () => authService.checkSubscription(),
  });
};