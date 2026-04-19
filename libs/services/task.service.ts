// src/libs/services/task.service.ts
import { apiService } from './api';
import { Task, UserTask } from '@/libs/types';

// Define specific response types
interface UploadResponse {
  status: string;
  message: string;
}

class TaskService {
  async getAvailableTasks(): Promise<Task[]> {
    try {
      const response = await apiService.get('/tasks/tasks/');
      return response.data?.results || response.data || [];
    } catch (error) {
      console.error('Error fetching available tasks:', error);
      return [];
    }
  }

  async getMyTasks(): Promise<UserTask[]> {
    try {
      const response = await apiService.get('/tasks/investments/');
      return response.data?.results || response.data || [];
    } catch (error) {
      console.error('Error fetching my tasks:', error);
      return [];
    }
  }

  async startTask(taskId: number, tier: string): Promise<UserTask> {
    const response = await apiService.post<UserTask>(`/tasks/investments/${taskId}/invest/`, { tier });
    return response.data;
  }

  async uploadPaymentProof(userTaskId: number, file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('payment_proof', file);
    const response = await apiService.post<UploadResponse>(`/tasks/investments/${userTaskId}/upload-payment/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async uploadCompletionProof(userTaskId: number, file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('completion_proof', file);
    const response = await apiService.post<UploadResponse>(`/tasks/investments/${userTaskId}/upload-completion/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export const taskService = new TaskService();