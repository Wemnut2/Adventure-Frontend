// src/stores/admin.store.ts
import { create } from 'zustand';
import { User, Investment, Task, Transaction, DashboardStats } from '@/libs/types';
import { adminService } from '@/libs/services/admin.service';

interface AdminState {
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
  updateUserRole: (id: number, role: string) => Promise<void>;
  createTask: (data: Partial<Task>) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  stats: null,
  users: [],
  investments: [],
  tasks: [],
  transactions: [],
  isLoading: false,

  fetchStats: async () => {
    set({ isLoading: true });
    try {
      const stats = await adminService.getDashboardStats();
      set({ stats, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      const users = await adminService.getAllUsers();
      set({ users, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchInvestments: async () => {
    set({ isLoading: true });
    try {
      const investments = await adminService.getAllInvestments();
      set({ investments, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchTasks: async () => {
    set({ isLoading: true });
    try {
      const tasks = await adminService.getAllTasks();
      set({ tasks, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchTransactions: async () => {
    set({ isLoading: true });
    try {
      const transactions = await adminService.getAllTransactions();
      set({ transactions, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  approveInvestment: async (id: number) => {
    set({ isLoading: true });
    try {
      await adminService.approveInvestment(id);
      await get().fetchInvestments();
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  approveTransaction: async (id: number, notes?: string) => {
    set({ isLoading: true });
    try {
      await adminService.approveTransaction(id, notes);
      await get().fetchTransactions();
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  toggleUserSubscription: async (id: number) => {
    set({ isLoading: true });
    try {
      await adminService.toggleUserSubscription(id);
      await get().fetchUsers();
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateUserRole: async (id: number, role: string) => {
    set({ isLoading: true });
    try {
      await adminService.updateUserRole(id, role);
      await get().fetchUsers();
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createTask: async (data: Partial<Task>) => {
    set({ isLoading: true });
    try {
      await adminService.createTask(data);
      await get().fetchTasks();
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));