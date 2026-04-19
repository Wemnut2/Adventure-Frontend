// src/hooks/useAdmin.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminStore } from '@/libs/stores/admin.store';
import { Task, User, Investment, Transaction, DashboardStats } from '@/libs/types';

// Define the store state type
interface AdminStoreState {
  stats: DashboardStats | null;
  users: User[];
  investments: Investment[];
  tasks: Task[];
  transactions: Transaction[];
  isLoading: boolean;
  fetchStats: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchInvestments: () => Promise<void>;
  fetchTasks: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  approveInvestment: (id: number) => Promise<void>;
  approveTransaction: (id: number, notes?: string) => Promise<void>;
  toggleUserSubscription: (id: number) => Promise<void>;
  createTask: (data: Partial<Task>) => Promise<void>;
}

export const useAdminStats = () => {
  const fetchStats = useAdminStore((state: AdminStoreState) => state.fetchStats);
  const stats = useAdminStore((state: AdminStoreState) => state.stats);
  const isLoading = useAdminStore((state: AdminStoreState) => state.isLoading);

  const { isLoading: queryLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: fetchStats,
    refetchInterval: 30000,
    enabled: typeof fetchStats === 'function',
  });

  return { stats, isLoading: isLoading || queryLoading };
};

export const useAdminUsers = () => {
  const fetchUsers = useAdminStore((state: AdminStoreState) => state.fetchUsers);
  const users = useAdminStore((state: AdminStoreState) => state.users);
  const isLoading = useAdminStore((state: AdminStoreState) => state.isLoading);

  const { isLoading: queryLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: fetchUsers,
    enabled: typeof fetchUsers === 'function',
  });

  return { users, isLoading: isLoading || queryLoading };
};

export const useAdminInvestments = () => {
  const fetchInvestments = useAdminStore((state: AdminStoreState) => state.fetchInvestments);
  const investments = useAdminStore((state: AdminStoreState) => state.investments);
  const isLoading = useAdminStore((state: AdminStoreState) => state.isLoading);

  const { isLoading: queryLoading } = useQuery({
    queryKey: ['admin-investments'],
    queryFn: fetchInvestments,
    enabled: typeof fetchInvestments === 'function',
  });

  return { investments, isLoading: isLoading || queryLoading };
};

export const useAdminTasks = () => {
  const fetchTasks = useAdminStore((state: AdminStoreState) => state.fetchTasks);
  const tasks = useAdminStore((state: AdminStoreState) => state.tasks);
  const isLoading = useAdminStore((state: AdminStoreState) => state.isLoading);

  const { isLoading: queryLoading } = useQuery({
    queryKey: ['admin-tasks'],
    queryFn: fetchTasks,
    enabled: typeof fetchTasks === 'function',
  });

  return { tasks, isLoading: isLoading || queryLoading };
};

export const useAdminTransactions = () => {
  const fetchTransactions = useAdminStore((state: AdminStoreState) => state.fetchTransactions);
  const transactions = useAdminStore((state: AdminStoreState) => state.transactions);
  const isLoading = useAdminStore((state: AdminStoreState) => state.isLoading);

  const { isLoading: queryLoading } = useQuery({
    queryKey: ['admin-transactions'],
    queryFn: fetchTransactions,
    enabled: typeof fetchTransactions === 'function',
  });

  return { transactions, isLoading: isLoading || queryLoading };
};

export const useApproveInvestment = () => {
  const queryClient = useQueryClient();
  const approveInvestment = useAdminStore((state: AdminStoreState) => state.approveInvestment);

  return useMutation({
    mutationFn: (id: number) => {
      if (typeof approveInvestment !== 'function') {
        throw new Error('approveInvestment is not available in store');
      }
      return approveInvestment(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-investments'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (error: Error) => {
      console.error('Failed to approve investment:', error);
    },
  });
};

export const useApproveTransaction = () => {
  const queryClient = useQueryClient();
  const approveTransaction = useAdminStore((state: AdminStoreState) => state.approveTransaction);

  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => {
      if (typeof approveTransaction !== 'function') {
        throw new Error('approveTransaction is not available in store');
      }
      return approveTransaction(id, notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (error: Error) => {
      console.error('Failed to approve transaction:', error);
    },
  });
};

export const useToggleSubscription = () => {
  const queryClient = useQueryClient();
  const toggleUserSubscription = useAdminStore((state: AdminStoreState) => state.toggleUserSubscription);

  return useMutation({
    mutationFn: (id: number) => {
      if (typeof toggleUserSubscription !== 'function') {
        throw new Error('toggleUserSubscription is not available in store');
      }
      return toggleUserSubscription(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (error: Error) => {
      console.error('Failed to toggle subscription:', error);
    },
  });
};

export const useCreateAdminTask = () => {
  const queryClient = useQueryClient();
  const createTask = useAdminStore((state: AdminStoreState) => state.createTask);

  return useMutation({
    mutationFn: (data: Partial<Task>) => {
      if (typeof createTask !== 'function') {
        throw new Error('createTask is not available in store');
      }
      return createTask(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (error: Error) => {
      console.error('Failed to create task:', error);
    },
  });
};