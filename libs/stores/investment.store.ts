// // src/stores/investment.store.ts
// import { create } from 'zustand';
// import { InvestmentPlan, Investment, Transaction } from '@/libs/types';
// import { investmentService } from '@/libs/services/investment.service';

// interface InvestmentState {
//   plans: InvestmentPlan[];
//   investments: Investment[];
//   transactions: Transaction[];
//   isLoading: boolean;
//   fetchPlans: () => Promise<void>;
//   fetchInvestments: () => Promise<void>;
//   fetchTransactions: () => Promise<void>;
//   createInvestment: (planId: number, amount: number) => Promise<void>;
//   withdrawInvestment: (investmentId: number) => Promise<void>;
// }

// export const useInvestmentStore = create<InvestmentState>((set, get) => ({
//   plans: [], // Initialize as empty array
//   investments: [], // Initialize as empty array
//   transactions: [], // Initialize as empty array
//   isLoading: false,

//   fetchPlans: async () => {
//     set({ isLoading: true });
//     try {
//       const plans = await investmentService.getInvestmentPlans();
//       set({ plans: plans || [], isLoading: false }); // Ensure array
//     } catch (error) {
//       console.error('Error fetching plans:', error);
//       set({ plans: [], isLoading: false }); // Set empty array on error
//     }
//   },

//   fetchInvestments: async () => {
//     set({ isLoading: true });
//     try {
//       const investments = await investmentService.getMyInvestments();
//       set({ investments: investments || [], isLoading: false }); // Ensure array
//     } catch (error) {
//       console.error('Error fetching investments:', error);
//       set({ investments: [], isLoading: false }); // Set empty array on error
//     }
//   },

//   fetchTransactions: async () => {
//     set({ isLoading: true });
//     try {
//       const transactions = await investmentService.getMyTransactions();
//       set({ transactions: transactions || [], isLoading: false }); // Ensure array
//     } catch (error) {
//       console.error('Error fetching transactions:', error);
//       set({ transactions: [], isLoading: false }); // Set empty array on error
//     }
//   },

//   createInvestment: async (planId: number, amount: number) => {
//     set({ isLoading: true });
//     try {
//       const investment = await investmentService.createInvestment({ plan: planId, amount });
//       set((state) => ({
//         investments: [investment, ...(state.investments || [])], // Ensure array
//         isLoading: false,
//       }));
//     } catch (error) {
//       console.error('Error creating investment:', error);
//       set({ isLoading: false });
//       throw error;
//     }
//   },

//   withdrawInvestment: async (investmentId: number) => {
//     set({ isLoading: true });
//     try {
//       await investmentService.withdrawInvestment(investmentId);
//       await get().fetchInvestments();
//       await get().fetchTransactions();
//       set({ isLoading: false });
//     } catch (error) {
//       console.error('Error withdrawing investment:', error);
//       set({ isLoading: false });
//       throw error;
//     }
//   },
// }));

// src/libs/stores/investment.store.ts
import { create } from 'zustand';
import { InvestmentPlan, Investment, Transaction } from '@/libs/types';
import { investmentService } from '@/libs/services/investment.service';

interface InvestmentState {
  plans: InvestmentPlan[];
  investments: Investment[];
  transactions: Transaction[];
  isLoading: boolean;

  // Setters (used by hooks to push React Query data into the store)
  setPlans: (plans: InvestmentPlan[]) => void;
  setInvestments: (investments: Investment[]) => void;
  setTransactions: (transactions: Transaction[]) => void;

  // Mutations (still called directly from useMutation)
  createInvestment: (planId: number, amount: number) => Promise<void>;
  withdrawInvestment: (investmentId: number) => Promise<void>;

  // Legacy fetch methods (kept for compatibility but no longer called by hooks)
  fetchPlans: () => Promise<InvestmentPlan[]>;
  fetchInvestments: () => Promise<Investment[]>;
  fetchTransactions: () => Promise<Transaction[]>;
}

export const useInvestmentStore = create<InvestmentState>((set, get) => ({
  plans: [],
  investments: [],
  transactions: [],
  isLoading: false,

  // ── Setters ──────────────────────────────────────────────────────────────
  setPlans: (plans) => set({ plans }),
  setInvestments: (investments) => set({ investments }),
  setTransactions: (transactions) => set({ transactions }),

  // ── Legacy fetch (returns data so React Query is happy if called directly) ─
  fetchPlans: async () => {
    set({ isLoading: true });
    try {
      const raw = await investmentService.getInvestmentPlans();
      const plans = Array.isArray(raw) ? raw : ((raw as any)?.results ?? []);
      set({ plans, isLoading: false });
      return plans;
    } catch (error) {
      console.error('Error fetching plans:', error);
      set({ plans: [], isLoading: false });
      return [];
    }
  },

  fetchInvestments: async () => {
    set({ isLoading: true });
    try {
      const raw = await investmentService.getMyInvestments();
      const investments = Array.isArray(raw) ? raw : ((raw as any)?.results ?? []);
      set({ investments, isLoading: false });
      return investments;
    } catch (error) {
      console.error('Error fetching investments:', error);
      set({ investments: [], isLoading: false });
      return [];
    }
  },

  fetchTransactions: async () => {
    set({ isLoading: true });
    try {
      const raw = await investmentService.getMyTransactions();
      const transactions = Array.isArray(raw) ? raw : ((raw as any)?.results ?? []);
      set({ transactions, isLoading: false });
      return transactions;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      set({ transactions: [], isLoading: false });
      return [];
    }
  },

  // ── Mutations ─────────────────────────────────────────────────────────────
  createInvestment: async (planId, amount) => {
    set({ isLoading: true });
    try {
      const investment = await investmentService.createInvestment({ plan: planId, amount });
      set((state) => ({
        investments: [investment, ...state.investments],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error creating investment:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  withdrawInvestment: async (investmentId) => {
    set({ isLoading: true });
    try {
      await investmentService.withdrawInvestment(investmentId);
      const raw = await investmentService.getMyInvestments();
      const investments = Array.isArray(raw) ? raw : ((raw as any)?.results ?? []);
      const rawTx = await investmentService.getMyTransactions();
      const transactions = Array.isArray(rawTx) ? rawTx : ((rawTx as any)?.results ?? []);
      set({ investments, transactions, isLoading: false });
    } catch (error) {
      console.error('Error withdrawing investment:', error);
      set({ isLoading: false });
      throw error;
    }
  },
}));