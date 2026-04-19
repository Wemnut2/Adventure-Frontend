// src/libs/stores/investment.store.ts
import { create } from 'zustand';
import { InvestmentPlan, UserInvestment, InvestmentTransaction } from '@/libs/types';
import { investmentService } from '@/libs/services/investment.service';

interface InvestmentState {
  plans: InvestmentPlan[];
  userInvestments: UserInvestment[];
  transactions: InvestmentTransaction[];
  isLoading: boolean;
  error: string | null;
  
  // Setter methods
  setPlans: (plans: InvestmentPlan[]) => void;
  setUserInvestments: (investments: UserInvestment[]) => void;
  setTransactions: (transactions: InvestmentTransaction[]) => void;
  
  // Fetch methods
  fetchPlans: () => Promise<void>;
  fetchUserInvestments: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  
  // Action methods
  createInvestment: (planId: number, amount: number) => Promise<UserInvestment>;
  uploadPaymentProof: (investmentId: number, file: File, reference: string) => Promise<void>;
  withdrawInvestment: (investmentId: number) => Promise<void>;
}

export const useInvestmentStore = create<InvestmentState>((set, get) => ({
  plans: [],
  userInvestments: [],
  transactions: [],
  isLoading: false,
  error: null,

  // Setter methods
  setPlans: (plans: InvestmentPlan[]) => set({ plans }),
  setUserInvestments: (userInvestments: UserInvestment[]) => set({ userInvestments }),
  setTransactions: (transactions: InvestmentTransaction[]) => set({ transactions }),

  fetchPlans: async () => {
    set({ isLoading: true, error: null });
    try {
      const plans = await investmentService.getInvestmentPlans();
      const plansArray = Array.isArray(plans) ? plans : [];
      set({ plans: plansArray, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchUserInvestments: async () => {
    set({ isLoading: true, error: null });
    try {
      const investments = await investmentService.getMyInvestments();
      const investmentsArray = Array.isArray(investments) ? investments : [];
      set({ userInvestments: investmentsArray, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const transactions = await investmentService.getMyTransactions();
      const transactionsArray = Array.isArray(transactions) ? transactions : [];
      set({ transactions: transactionsArray, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createInvestment: async (planId: number, amount: number) => {
    set({ isLoading: true, error: null });
    try {
      const investment = await investmentService.createInvestment({ plan: planId, amount });
      set((state) => ({
        userInvestments: [investment, ...state.userInvestments],
        isLoading: false,
      }));
      return investment;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  uploadPaymentProof: async (investmentId: number, file: File, reference: string) => {
    set({ isLoading: true, error: null });
    try {
      await investmentService.uploadPaymentProof(investmentId, file, reference);
      await get().fetchUserInvestments();
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  withdrawInvestment: async (investmentId: number) => {
    set({ isLoading: true, error: null });
    try {
      await investmentService.withdrawInvestment(investmentId);
      await get().fetchUserInvestments();
      await get().fetchTransactions();
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
}));