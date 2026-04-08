// src/hooks/useAdmin.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminStore } from '@/libs/stores/admin.store';
import { adminService } from '@/libs/services/admin.service';
import { Task } from '@/libs/types';

export const useAdminStats = () => {
  const fetchStats = useAdminStore((state) => state.fetchStats);
  const stats = useAdminStore((state) => state.stats);
  const isLoading = useAdminStore((state) => state.isLoading);

  useQuery({
    queryKey: ['admin-stats'],
    queryFn: fetchStats,
    refetchInterval: 30000,
  });

  return { stats, isLoading };
};

export const useAdminUsers = () => {
  const fetchUsers = useAdminStore((state) => state.fetchUsers);
  const users = useAdminStore((state) => state.users);
  const isLoading = useAdminStore((state) => state.isLoading);

  useQuery({
    queryKey: ['admin-users'],
    queryFn: fetchUsers,
  });

  return { users, isLoading };
};

export const useAdminInvestments = () => {
  const fetchInvestments = useAdminStore((state) => state.fetchInvestments);
  const investments = useAdminStore((state) => state.investments);
  const isLoading = useAdminStore((state) => state.isLoading);

  useQuery({
    queryKey: ['admin-investments'],
    queryFn: fetchInvestments,
  });

  return { investments, isLoading };
};

export const useAdminTasks = () => {
  const fetchTasks = useAdminStore((state) => state.fetchTasks);
  const tasks = useAdminStore((state) => state.tasks);
  const isLoading = useAdminStore((state) => state.isLoading);

  useQuery({
    queryKey: ['admin-tasks'],
    queryFn: fetchTasks,
  });

  return { tasks, isLoading };
};

export const useAdminTransactions = () => {
  const fetchTransactions = useAdminStore((state) => state.fetchTransactions);
  const transactions = useAdminStore((state) => state.transactions);
  const isLoading = useAdminStore((state) => state.isLoading);

  useQuery({
    queryKey: ['admin-transactions'],
    queryFn: fetchTransactions,
  });

  return { transactions, isLoading };
};

export const useApproveInvestment = () => {
  const queryClient = useQueryClient();
  const approveInvestment = useAdminStore((state) => state.approveInvestment);

  return useMutation({
    mutationFn: (id: number) => approveInvestment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-investments'] });
    },
  });
};

export const useApproveTransaction = () => {
  const queryClient = useQueryClient();
  const approveTransaction = useAdminStore((state) => state.approveTransaction);

  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) =>
      approveTransaction(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-transactions'] });
    },
  });
};

export const useToggleSubscription = () => {
  const queryClient = useQueryClient();
  const toggleUserSubscription = useAdminStore((state) => state.toggleUserSubscription);

  return useMutation({
    mutationFn: (id: number) => toggleUserSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
};

export const useCreateAdminTask = () => {
  const queryClient = useQueryClient();
  const createTask = useAdminStore((state) => state.createTask);

  return useMutation({
    mutationFn: (data: Partial<Task>) => createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tasks'] });
    },
  });
};