// src/hooks/useInvestments.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { investmentService } from '@/libs/services/investment.service';
import { useInvestmentStore } from '@/libs/stores/investment.store';

export const useInvestmentPlans = () => {
  const fetchPlans = useInvestmentStore((state) => state.fetchPlans);
  const plans = useInvestmentStore((state) => state.plans);
  const isLoading = useInvestmentStore((state) => state.isLoading);

  useQuery({
    queryKey: ['investment-plans'],
    queryFn: fetchPlans,
    staleTime: 30 * 60 * 1000,
  });

  return { plans, isLoading };
};

export const useMyInvestments = () => {
  const fetchInvestments = useInvestmentStore((state) => state.fetchInvestments);
  const investments = useInvestmentStore((state) => state.investments);
  const isLoading = useInvestmentStore((state) => state.isLoading);

  useQuery({
    queryKey: ['my-investments'],
    queryFn: fetchInvestments,
  });

  return { investments, isLoading };
};

export const useTransactions = () => {
  const fetchTransactions = useInvestmentStore((state) => state.fetchTransactions);
  const transactions = useInvestmentStore((state) => state.transactions);
  const isLoading = useInvestmentStore((state) => state.isLoading);

  useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
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