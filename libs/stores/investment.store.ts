// src/stores/investment.store.ts
import { create } from 'zustand';
import { InvestmentPlan, Investment, Transaction } from '@/libs/types';
import { investmentService } from '@/libs/services/investment.service';

interface InvestmentState {
  plans: InvestmentPlan[];
  investments: Investment[];
  transactions: Transaction[];
  isLoading: boolean;
  fetchPlans: () => Promise<void>;
  fetchInvestments: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  createInvestment: (planId: number, amount: number) => Promise<void>;
  withdrawInvestment: (investmentId: number) => Promise<void>;
}

export const useInvestmentStore = create<InvestmentState>((set, get) => ({
  plans: [],
  investments: [],
  transactions: [],
  isLoading: false,

  fetchPlans: async () => {
    set({ isLoading: true });
    try {
      const plans = await investmentService.getInvestmentPlans();
      set({ plans, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchInvestments: async () => {
    set({ isLoading: true });
    try {
      const investments = await investmentService.getMyInvestments();
      set({ investments, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchTransactions: async () => {
    set({ isLoading: true });
    try {
      const transactions = await investmentService.getMyTransactions();
      set({ transactions, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createInvestment: async (planId: number, amount: number) => {
    set({ isLoading: true });
    try {
      const investment = await investmentService.createInvestment({ plan: planId, amount });
      set((state) => ({
        investments: [investment, ...state.investments],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  withdrawInvestment: async (investmentId: number) => {
    set({ isLoading: true });
    try {
      await investmentService.withdrawInvestment(investmentId);
      await get().fetchInvestments();
      await get().fetchTransactions();
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));