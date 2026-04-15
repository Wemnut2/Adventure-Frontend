

// src/libs/hooks/useInvestments.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { investmentService } from '@/libs/services/investment.service';
import { useInvestmentStore } from '@/libs/stores/investment.store';

export const useInvestmentPlans = () => {
  const setPlans = useInvestmentStore((state) => state.setPlans);
  const plans = useInvestmentStore((state) => state.plans);

  const { isLoading } = useQuery({
    queryKey: ['investment-plans'],
    queryFn: async () => {
      const data = await investmentService.getInvestmentPlans();
      // Handle both array and paginated { results: [] } responses
      const list = Array.isArray(data) ? data : ((data as any)?.results ?? []);
      setPlans(list);
      return list; // React Query requires a return value
    },
    staleTime: 30 * 60 * 1000,
  });

  return { plans, isLoading };
};

export const useMyInvestments = () => {
  const setInvestments = useInvestmentStore((state) => state.setInvestments);
  const investments = useInvestmentStore((state) => state.investments);

  const { isLoading } = useQuery({
    queryKey: ['my-investments'],
    queryFn: async () => {
      const data = await investmentService.getMyInvestments();
      const list = Array.isArray(data) ? data : ((data as any)?.results ?? []);
      setInvestments(list);
      return list;
    },
  });

  return { investments, isLoading };
};

export const useTransactions = () => {
  const setTransactions = useInvestmentStore((state) => state.setTransactions);
  const transactions = useInvestmentStore((state) => state.transactions);

  const { isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const data = await investmentService.getMyTransactions();
      const list = Array.isArray(data) ? data : ((data as any)?.results ?? []);
      setTransactions(list);
      return list;
    },
  });

  return { transactions, isLoading };
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
  });
};