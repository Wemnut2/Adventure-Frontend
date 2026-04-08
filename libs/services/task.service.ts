// src/services/task.service.ts
import { apiService } from './api';
import { Task, UserTask } from '@/libs/types';

class TaskService {
  async getAvailableTasks(): Promise<Task[]> {
    const response = await apiService.get<Task[]>('/tasks/available-tasks/');
    return response.data;
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
    const response = await apiService.get<UserTask[]>('/tasks/my-tasks/');
    return response.data;
  }
}

export const taskService = new TaskService();