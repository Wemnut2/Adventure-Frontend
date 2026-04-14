import { apiService } from './api';
import { Task, UserTask } from '@/libs/types';

class TaskService {
 async getAvailableTasks(): Promise<Task[]> {
  const res = await apiService.get('/tasks/available-tasks/');
  // Handle both paginated and plain array responses
  return res.data?.results ?? res.data;
}

async getMyTasks(): Promise<UserTask[]> {
  const res = await apiService.get('/tasks/my-tasks/');
  return res.data?.results ?? res.data;
}

  async startTask(taskId: number, tier: 'bronze' | 'silver' | 'gold') {
    const res = await apiService.post(`/tasks/tasks/${taskId}/start_task/`, { tier });
    return res.data;
  }

  async uploadPayment(taskId: number, formData: FormData) {
    const res = await apiService.post(
      `/tasks/tasks/${taskId}/upload_payment/`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return res.data;
  }

  async completeTask(taskId: number, formData: FormData) {
    const res = await apiService.post(
      `/tasks/tasks/${taskId}/complete_task/`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return res.data;
  }
}

export const taskService = new TaskService();