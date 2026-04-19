// src/libs/hooks/useInvestments.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { investmentService } from '@/libs/services/investment.service';
import { useInvestmentStore } from '@/libs/stores/investment.store';
import { InvestmentPlan, UserInvestment, InvestmentTransaction } from '@/libs/types';

// Define the response type for paginated responses
interface PaginatedResponse<T> {
  results: T[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}

// Helper function to extract array from response
function extractArray<T>(data: T[] | PaginatedResponse<T> | unknown): T[] {
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === 'object' && 'results' in data && Array.isArray((data as PaginatedResponse<T>).results)) {
    return (data as PaginatedResponse<T>).results;
  }
  return [];
}

export const useInvestmentPlans = () => {
  const setPlans = useInvestmentStore((state) => state.setPlans);
  const plans = useInvestmentStore((state) => state.plans);
  const isLoading = useInvestmentStore((state) => state.isLoading);

  const { isLoading: queryLoading } = useQuery({
    queryKey: ['investment-plans'],
    queryFn: async () => {
      const data = await investmentService.getInvestmentPlans();
      const list = extractArray<InvestmentPlan>(data);
      setPlans(list);
      return list;
    },
    staleTime: 30 * 60 * 1000,
  });

  return { plans, isLoading: isLoading || queryLoading };
};

export const useMyInvestments = () => {
  const setUserInvestments = useInvestmentStore((state) => state.setUserInvestments);
  const userInvestments = useInvestmentStore((state) => state.userInvestments);
  const isLoading = useInvestmentStore((state) => state.isLoading);

  const { isLoading: queryLoading } = useQuery({
    queryKey: ['my-investments'],
    queryFn: async () => {
      const data = await investmentService.getMyInvestments();
      const list = extractArray<UserInvestment>(data);
      setUserInvestments(list);
      return list;
    },
  });

  return { investments: userInvestments, isLoading: isLoading || queryLoading };
};

export const useTransactions = () => {
  const setTransactions = useInvestmentStore((state) => state.setTransactions);
  const transactions = useInvestmentStore((state) => state.transactions);
  const isLoading = useInvestmentStore((state) => state.isLoading);

  const { isLoading: queryLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const data = await investmentService.getMyTransactions();
      const list = extractArray<InvestmentTransaction>(data);
      setTransactions(list);
      return list;
    },
  });

  return { transactions, isLoading: isLoading || queryLoading };
};

export const useCreateInvestment = () => {
  const queryClient = useQueryClient();
  const createInvestment = useInvestmentStore((state) => state.createInvestment);

  return useMutation({
    mutationFn: ({ planId, amount }: { planId: number; amount: number }) =>
      createInvestment(planId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-investments'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error: Error) => {
      console.error('Failed to create investment:', error);
    },
  });
};

export const useWithdrawInvestment = () => {
  const queryClient = useQueryClient();
  const withdrawInvestment = useInvestmentStore((state) => state.withdrawInvestment);

  return useMutation({
    mutationFn: (investmentId: number) => withdrawInvestment(investmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-investments'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error: Error) => {
      console.error('Failed to withdraw investment:', error);
    },
  });
};