// src/services/task.service.ts
import { apiService } from './api';
import { Task, UserTask } from '@/libs/types';

class TaskService {
    async getAvailableTasks(): Promise<Task[]> {
        try {
            const response = await apiService.get<Task[]>('/tasks/available-tasks/');
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('Error fetching available tasks:', error);
            return []; // Always return array on error
        }
        }

  async getAllTasks(): Promise<Task[]> {
    const response = await apiService.get<Task[]>('/tasks/tasks/');
    return response.data;
  }

  async getTaskDetail(id: number): Promise<Task> {
    const response = await apiService.get<Task>(`/tasks/tasks/${id}/`);
    return response.data;
  }

  async startTask(id: number): Promise<UserTask> {
    const response = await apiService.post<UserTask>(`/tasks/tasks/${id}/start_task/`);
    return response.data;
  }

  async completeTask(id: number, completionProof?: File): Promise<{ status: string; message: string }> {
    const formData = new FormData();
    if (completionProof) {
      formData.append('completion_proof', completionProof);
    }
    
    const response = await apiService.post(`/tasks/tasks/${id}/complete_task/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getMyTasks(): Promise<UserTask[]> {
    try {
      const response = await apiService.get<UserTask[]>('/tasks/my-tasks/');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching my tasks:', error);
      return []; // Always return array on error
    }
  }
  
}

export const taskService = new TaskService();