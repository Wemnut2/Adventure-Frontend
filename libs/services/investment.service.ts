// src/libs/services/investment.service.ts
import { apiService } from './api';
import { InvestmentPlan, UserInvestment, InvestmentTransaction, CreateInvestmentData } from '@/libs/types';

class InvestmentService {
  async getInvestmentPlans(): Promise<InvestmentPlan[]> {
    try {
      const response = await apiService.get('/investments/plans/');
      return response.data?.results || response.data || [];
    } catch (error) {
      console.error('Error fetching plans:', error);
      return [];
    }
  }

  async createInvestment(data: CreateInvestmentData): Promise<UserInvestment> {
    const response = await apiService.post('/investments/investments/', data);
    return response.data;
  }

  async getMyInvestments(): Promise<UserInvestment[]> {
    try {
      const response = await apiService.get('/investments/investments/');
      return response.data?.results || response.data || [];
    } catch (error) {
      console.error('Error fetching investments:', error);
      return [];
    }
  }

  async getMyTransactions(): Promise<InvestmentTransaction[]> {
    try {
      const response = await apiService.get('/investments/transactions/');
      return response.data?.results || response.data || [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

  // Add missing method for withdrawals
  async requestWithdrawal(data: { amount: number; method: string; wallet_details: string }): Promise<{ reference: string }> {
    const response = await apiService.post('/investments/withdrawals/request/', data);
    return response.data;
  }
}

export const investmentService = new InvestmentService();