// src/libs/services/investment.service.ts
import { apiService } from './api';
import { InvestmentPlan, UserInvestment, InvestmentTransaction, CreateInvestmentData } from '@/libs/types';

interface WithdrawalResponse {
  reference: string;
  status: string;
  message?: string;
}

interface UploadPaymentResponse {
  status: string;
  message: string;
}

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

  async getInvestmentPlan(id: number): Promise<InvestmentPlan | null> {
    try {
      const response = await apiService.get(`/investments/plans/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching investment plan:', error);
      return null;
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
      console.error('Error fetching my investments:', error);
      return [];
    }
  }

  async getInvestmentDetail(id: number): Promise<UserInvestment | null> {
    try {
      const response = await apiService.get(`/investments/investments/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching investment detail:', error);
      return null;
    }
  }

  async uploadPaymentProof(investmentId: number, file: File, reference: string): Promise<UploadPaymentResponse> {
    try {
      const formData = new FormData();
      formData.append('payment_proof', file);
      formData.append('payment_reference', reference);
      
      const response = await apiService.post<UploadPaymentResponse>(
        `/investments/investments/${investmentId}/upload_payment/`, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error uploading payment proof:', error);
      throw error;
    }
  }

  async withdrawInvestment(investmentId: number): Promise<WithdrawalResponse> {
    try {
      const response = await apiService.post<WithdrawalResponse>(
        `/investments/investments/${investmentId}/withdraw/`
      );
      return response.data;
    } catch (error) {
      console.error('Error withdrawing investment:', error);
      throw error;
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

  async requestWithdrawal(data: { amount: number; method: string; wallet_details: string }): Promise<WithdrawalResponse> {
    try {
      const response = await apiService.post<WithdrawalResponse>('/investments/withdrawals/request/', data);
      return response.data;
    } catch (error) {
      console.error('Error requesting withdrawal:', error);
      throw error;
    }
  }
}

export const investmentService = new InvestmentService();