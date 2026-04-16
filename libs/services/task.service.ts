// src/libs/services/task.service.ts
import { apiService } from './api';
import { Task, UserTask } from '@/libs/types';

class TaskService {
  async getAvailableTasks(): Promise<Task[]> {
    const res = await apiService.get('/tasks/available-tasks/');
    return res.data?.results ?? res.data ?? [];
  }

  async getMyTasks(): Promise<UserTask[]> {
    const res = await apiService.get('/tasks/my-tasks/');
    return res.data?.results ?? res.data ?? [];
  }

  async startTask(taskId: number, tier: 'bronze' | 'silver' | 'gold') {
  return (await apiService.post(`/tasks/${taskId}/start_task/`, { tier })).data;
}

async uploadPayment(userTaskId: number, file: File) {
  const form = new FormData();
  form.append('payment_proof', file);

  return (
    await apiService.post(
      `/tasks/upload-payment/${userTaskId}/`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
  ).data;
}

async completeTask(userTaskId: number, file: File) {
  const form = new FormData();
  form.append('completion_proof', file);

  return (
    await apiService.post(
      `/tasks/complete-task/${userTaskId}/`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
  ).data;
}
}

export const taskService = new TaskService();