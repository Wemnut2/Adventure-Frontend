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
  plans: [], // Initialize as empty array
  investments: [], // Initialize as empty array
  transactions: [], // Initialize as empty array
  isLoading: false,

  fetchPlans: async () => {
    set({ isLoading: true });
    try {
      const plans = await investmentService.getInvestmentPlans();
      set({ plans: plans || [], isLoading: false }); // Ensure array
    } catch (error) {
      console.error('Error fetching plans:', error);
      set({ plans: [], isLoading: false }); // Set empty array on error
    }
  },

  fetchInvestments: async () => {
    set({ isLoading: true });
    try {
      const investments = await investmentService.getMyInvestments();
      set({ investments: investments || [], isLoading: false }); // Ensure array
    } catch (error) {
      console.error('Error fetching investments:', error);
      set({ investments: [], isLoading: false }); // Set empty array on error
    }
  },

  fetchTransactions: async () => {
    set({ isLoading: true });
    try {
      const transactions = await investmentService.getMyTransactions();
      set({ transactions: transactions || [], isLoading: false }); // Ensure array
    } catch (error) {
      console.error('Error fetching transactions:', error);
      set({ transactions: [], isLoading: false }); // Set empty array on error
    }
  },

  createInvestment: async (planId: number, amount: number) => {
    set({ isLoading: true });
    try {
      const investment = await investmentService.createInvestment({ plan: planId, amount });
      set((state) => ({
        investments: [investment, ...(state.investments || [])], // Ensure array
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error creating investment:', error);
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
      console.error('Error withdrawing investment:', error);
      set({ isLoading: false });
      throw error;
    }
  },
}));