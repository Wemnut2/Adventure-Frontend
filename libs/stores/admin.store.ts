import { create } from 'zustand';
import {
  User,
  Investment,
  Task,
  Transaction,
  DashboardStats
} from '@/libs/types';

import { adminService } from '@/libs/services/admin.service';

interface AdminState {
  stats: DashboardStats | null;
  users: User[];
  investments: Investment[];
  tasks: Task[];
  transactions: Transaction[];

  loading: {
    stats: boolean;
    users: boolean;
    investments: boolean;
    tasks: boolean;
    transactions: boolean;
  };

  // fetchers
  fetchStats: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchInvestments: () => Promise<void>;
  fetchTasks: () => Promise<void>;
  fetchTransactions: () => Promise<void>;

  // actions
  approveInvestment: (id: number) => Promise<void>;
  approveTransaction: (id: number, notes?: string) => Promise<void>;
  toggleUserSubscription: (id: number) => Promise<void>;
  updateUserRole: (id: number, role: string) => Promise<void>;
  createTask: (data: Partial<Task>) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  stats: null,
  users: [],
  investments: [],
  tasks: [],
  transactions: [],

  loading: {
    stats: false,
    users: false,
    investments: false,
    tasks: false,
    transactions: false,
  },

  /* ======================
     STATS
  ====================== */
  fetchStats: async () => {
    set((s) => ({ loading: { ...s.loading, stats: true } }));
    try {
      const stats = await adminService.getDashboardStats();
      set((s) => ({
        stats,
        loading: { ...s.loading, stats: false },
      }));
    } catch (err) {
      set((s) => ({ loading: { ...s.loading, stats: false } }));
      throw err;
    }
  },

  /* ======================
     USERS
  ====================== */
  fetchUsers: async () => {
    set((s) => ({ loading: { ...s.loading, users: true } }));
    try {
      const users = await adminService.getAllUsers();
      set((s) => ({
        users,
        loading: { ...s.loading, users: false },
      }));
    } catch (err) {
      set((s) => ({ loading: { ...s.loading, users: false } }));
      throw err;
    }
  },

  /* ======================
     INVESTMENTS
  ====================== */
  fetchInvestments: async () => {
    set((s) => ({ loading: { ...s.loading, investments: true } }));
    try {
      const investments = await adminService.getAllInvestments();
      set((s) => ({
        investments,
        loading: { ...s.loading, investments: false },
      }));
    } catch (err) {
      set((s) => ({ loading: { ...s.loading, investments: false } }));
      throw err;
    }
  },

  /* ======================
     TASKS
  ====================== */
  fetchTasks: async () => {
    set((s) => ({ loading: { ...s.loading, tasks: true } }));
    try {
      const tasks = await adminService.getAllTasks();
      set((s) => ({
        tasks,
        loading: { ...s.loading, tasks: false },
      }));
    } catch (err) {
      set((s) => ({ loading: { ...s.loading, tasks: false } }));
      throw err;
    }
  },

  /* ======================
     TRANSACTIONS
  ====================== */
  fetchTransactions: async () => {
    set((s) => ({ loading: { ...s.loading, transactions: true } }));
    try {
      const transactions = await adminService.getAllTransactions();
      set((s) => ({
        transactions,
        loading: { ...s.loading, transactions: false },
      }));
    } catch (err) {
      set((s) => ({ loading: { ...s.loading, transactions: false } }));
      throw err;
    }
  },

  /* ======================
     ACTIONS
  ====================== */
  approveInvestment: async (id) => {
    await adminService.approveInvestment(id);
    await get().fetchInvestments();
  },

  approveTransaction: async (id, notes) => {
    await adminService.approveTransaction(id, notes);
    await get().fetchTransactions();
  },

  toggleUserSubscription: async (id) => {
    await adminService.toggleUserSubscription(id);
    await get().fetchUsers();
  },

  updateUserRole: async (id, role) => {
    await adminService.updateUserRole(id, role);
    await get().fetchUsers();
  },

  createTask: async (data) => {
    await adminService.createTask(data);
    await get().fetchTasks();
  },
}));