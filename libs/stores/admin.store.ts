// src/libs/stores/admin.store.ts - Make sure these methods exist
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
  error: string | null;
  
  // Fetch methods
  fetchStats: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchInvestments: () => Promise<void>;
  fetchTasks: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  
  // Action methods
  approveInvestment: (id: number) => Promise<void>;
  approveTransaction: (id: number, notes?: string) => Promise<void>;
  toggleUserSubscription: (id: number) => Promise<void>;
  updateUserRole: (id: number, role: string) => Promise<void>;
  createTask: (data: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  stats: null,
  users: [],
  investments: [],
  tasks: [],
  transactions: [],
  isLoading: false,
  error: null,

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const stats = await adminService.getDashboardStats();
      set({ stats, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const users = await adminService.getAllUsers();
      set({ users, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchInvestments: async () => {
    set({ isLoading: true, error: null });
    try {
      const investments = await adminService.getAllInvestments();
      set({ investments, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await adminService.getAllTasks();
      set({ tasks, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const transactions = await adminService.getAllTransactions();
      set({ transactions, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  approveInvestment: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await adminService.approveInvestment(id);
      await get().fetchInvestments();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  approveTransaction: async (id: number, notes?: string) => {
    set({ isLoading: true, error: null });
    try {
      await adminService.approveTransaction(id, notes);
      await get().fetchTransactions();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  toggleUserSubscription: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await adminService.toggleUserSubscription(id);
      await get().fetchUsers();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateUserRole: async (id: number, role: string) => {
    set({ isLoading: true, error: null });
    try {
      await adminService.updateUserRole(id, role);
      await get().fetchUsers();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  createTask: async (data: Partial<Task>) => {
    set({ isLoading: true, error: null });
    try {
      await adminService.createTask(data);
      await get().fetchTasks();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTask: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await adminService.deleteTask(id);
      await get().fetchTasks();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));