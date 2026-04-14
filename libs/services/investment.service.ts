// src/services/investment.service.ts
import { apiService } from './api';
import { InvestmentPlan, Investment, CreateInvestmentData, Transaction } from '@/libs/types';

class InvestmentService {

  async getInvestmentPlans(): Promise<InvestmentPlan[]> {
    const response = await apiService.get<InvestmentPlan[]>('/investments/plans/');
    return response.data;
  }

  // ✅ FIXED: now properly inside class
  async requestWithdrawal(data: {
    amount: number;
    method: string;
    wallet_details: string;
  }) {
    const response = await apiService.post("/withdrawals/request/", data);
    return response.data;
  }

  async getInvestmentPlan(id: number): Promise<InvestmentPlan> {
    const response = await apiService.get<InvestmentPlan>(`/investments/plans/${id}/`);
    return response.data;
  }

  async createInvestment(data: CreateInvestmentData): Promise<Investment> {
    const response = await apiService.post<Investment>('/investments/investments/', data);
    return response.data;
  }

  async getMyInvestments(): Promise<Investment[]> {
    const response = await apiService.get<Investment[]>('/investments/investments/');
    return response.data;
  }

  async getInvestmentDetail(id: number): Promise<Investment> {
    const response = await apiService.get<Investment>(`/investments/investments/${id}/`);
    return response.data;
  }

  async withdrawInvestment(id: number): Promise<{ status: string; transaction_id: number }> {
    const response = await apiService.post(`/investments/investments/${id}/withdraw/`);
    return response.data;
  }

  async getMyTransactions(): Promise<Transaction[]> {
    const response = await apiService.get<Transaction[]>('/investments/transactions/');
    return response.data;
  }
}

export const investmentService = new InvestmentService();