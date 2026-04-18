// src/libs/services/task.service.ts
import { apiService } from './api';
import { Task, UserTask } from '@/libs/types';

class TaskService {
  async getAvailableTasks(): Promise<Task[]> {
    try {
      const response = await apiService.get<Task[]>('/tasks/tasks/available/');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching available tasks:', error);
      return [];
    }
  }

  async getMyTasks(): Promise<UserTask[]> {
    try {
      const response = await apiService.get<UserTask[]>('/tasks/user-tasks/my_tasks/');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching my tasks:', error);
      return [];
    }
  }

  async startTask(taskId: number, tier: 'bronze' | 'silver' | 'gold'): Promise<UserTask> {
    const response = await apiService.post<UserTask>(`/tasks/tasks/${taskId}/start_task/`, { tier });
    return response.data;
  }

  async uploadPaymentProof(userTaskId: number, file: File): Promise<{ status: string; message: string }> {
    const formData = new FormData();
    formData.append('payment_proof', file);
    
    const response = await apiService.post(`/tasks/user-tasks/${userTaskId}/upload_payment/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async uploadCompletionProof(userTaskId: number, file: File): Promise<{ status: string; message: string }> {
    const formData = new FormData();
    formData.append('completion_proof', file);
    
    const response = await apiService.post(`/tasks/user-tasks/${userTaskId}/upload_completion/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export const taskService = new TaskService();