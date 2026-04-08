// src/services/admin.service.ts
import { apiService } from './api';
import { User, Investment, Task, Transaction, DashboardStats } from '@/libs/types';

class AdminService {
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiService.get<DashboardStats>('/admin/dashboard/');
    return response.data;
  }

  // User Management
  async getAllUsers(): Promise<User[]> {
    const response = await apiService.get<User[]>('/admin/users/');
    return response.data;
  }

  async getUserDetail(id: number): Promise<User> {
    const response = await apiService.get<User>(`/admin/users/${id}/`);
    return response.data;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const response = await apiService.patch<User>(`/admin/users/${id}/`, data);
    return response.data;
  }

  async deleteUser(id: number): Promise<void> {
    await apiService.delete(`/admin/users/${id}/delete_user/`);
  }

  async toggleUserSubscription(id: number): Promise<{ status: string; is_subscribed: boolean }> {
    const response = await apiService.post(`/admin/users/${id}/toggle_subscription/`);
    return response.data;
  }

  async updateUserRole(id: number, role: string): Promise<{ status: string; role: string }> {
    const response = await apiService.post(`/admin/users/${id}/update_role/`, { role });
    return response.data;
  }

  // Investment Management
  async getAllInvestments(): Promise<Investment[]> {
    const response = await apiService.get<Investment[]>('/admin/investments/');
    return response.data;
  }

  async approveInvestment(id: number): Promise<{ status: string }> {
    const response = await apiService.post(`/admin/investments/${id}/approve_investment/`);
    return response.data;
  }

  // Task Management
  async getAllTasks(): Promise<Task[]> {
    const response = await apiService.get<Task[]>('/admin/tasks/');
    return response.data;
  }

  async createTask(data: Partial<Task>): Promise<Task> {
    const response = await apiService.post<Task>('/admin/tasks/create_task/', data);
    return response.data;
  }

  async updateTask(id: number, data: Partial<Task>): Promise<Task> {
    const response = await apiService.patch<Task>(`/admin/tasks/${id}/`, data);
    return response.data;
  }

  async deleteTask(id: number): Promise<void> {
    await apiService.delete(`/admin/tasks/${id}/`);
  }

  async assignTaskToUser(taskId: number, userId: number): Promise<{ status: string; created: boolean }> {
    const response = await apiService.post(`/admin/tasks/${taskId}/assign_task_to_user/`, { user_id: userId });
    return response.data;
  }

  // Transaction Management
  async getAllTransactions(): Promise<Transaction[]> {
    const response = await apiService.get<Transaction[]>('/admin/transactions/');
    return response.data;
  }

  async approveTransaction(id: number, notes?: string): Promise<{ status: string }> {
    const response = await apiService.post(`/admin/transactions/${id}/approve_transaction/`, { notes });
    return response.data;
  }
}

export const adminService = new AdminService();