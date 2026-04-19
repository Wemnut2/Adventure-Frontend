// src/libs/stores/investment.store.ts
import { create } from 'zustand';
import { InvestmentPlan, UserInvestment, InvestmentTransaction } from '@/libs/types';
import { investmentService } from '@/libs/services/investment.service';

interface InvestmentState {
  plans: InvestmentPlan[];
  userInvestments: UserInvestment[];
  transactions: InvestmentTransaction[];
  isLoading: boolean;
  fetchPlans: () => Promise<void>;
  fetchUserInvestments: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  createInvestment: (planId: number, amount: number) => Promise<UserInvestment | null>;
}

export const useInvestmentStore = create<InvestmentState>((set, get) => ({
  plans: [],
  userInvestments: [],
  transactions: [],
  isLoading: false,

  fetchPlans: async () => {
    set({ isLoading: true });
    try {
      const plans = await investmentService.getInvestmentPlans();
      set({ plans: plans || [], isLoading: false });
    } catch (error) {
      console.error('Error fetching plans:', error);
      set({ plans: [], isLoading: false });
    }
  },

  fetchUserInvestments: async () => {
    set({ isLoading: true });
    try {
      const investments = await investmentService.getMyInvestments();
      set({ userInvestments: investments || [], isLoading: false });
    } catch (error) {
      console.error('Error fetching investments:', error);
      set({ userInvestments: [], isLoading: false });
    }
  },

  fetchTransactions: async () => {
    set({ isLoading: true });
    try {
      const transactions = await investmentService.getMyTransactions();
      set({ transactions: transactions || [], isLoading: false });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      set({ transactions: [], isLoading: false });
    }
  },

  createInvestment: async (planId: number, amount: number) => {
    set({ isLoading: true });
    try {
      const investment = await investmentService.createInvestment({ plan: planId, amount });
      await get().fetchUserInvestments();
      set({ isLoading: false });
      return investment;
    } catch (error) {
      console.error('Error creating investment:', error);
      set({ isLoading: false });
      throw error;
    }
  },
}));