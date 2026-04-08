// src/services/auth.service.ts
import { apiService } from './api';
import { AuthResponse, LoginCredentials, RegisterData, User, ActivityLog } from '@/libs/types';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login/', credentials);
    return response.data;
  }

  async register(data: RegisterData): Promise<User> {
    const response = await apiService.post<User>('/auth/register/', data);
    return response.data;
  }

  async logout(refreshToken: string): Promise<void> {
    await apiService.post('/auth/logout/', { refresh: refreshToken });
  }

  async getProfile(): Promise<User> {
    const response = await apiService.get<User>('/auth/profile/');
    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiService.put<User>('/auth/profile/', data);
    return response.data;
  }

  async updateAccountInfo(data: Partial<User>): Promise<User> {
    const response = await apiService.put<User>('/auth/update-account/', data);
    return response.data;
  }

  async getMyActivities(): Promise<ActivityLog[]> {
    const response = await apiService.get<ActivityLog[]>('/auth/my-activities/');
    return response.data;
  }

  async checkSubscription(): Promise<{
    is_subscribed: boolean;
    subscription_end_date: string | null;
    subscription_active: boolean;
  }> {
    const response = await apiService.get('/auth/check-subscription/');
    return response.data;
  }
}

export const authService = new AuthService();