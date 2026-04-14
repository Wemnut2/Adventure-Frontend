import { create } from 'zustand';
import { Task, UserTask } from '@/libs/types';
import { taskService } from '@/libs/services/task.service';

interface TaskState {
  availableTasks: Task[];
  myTasks: UserTask[];
  isLoading: boolean;
  fetchAvailableTasks: () => Promise<Task[]>;
  fetchMyTasks: () => Promise<UserTask[]>;
  startTask: (taskId: number, tier: 'bronze' | 'silver' | 'gold') => Promise<any>;
  uploadPayment: (taskId: number, file: File) => Promise<void>;
  completeTask: (taskId: number, proof: File) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  availableTasks: [],
  myTasks: [],
  isLoading: false,

  fetchAvailableTasks: async () => {
    

    set({ isLoading: true });
  try {
    const tasks = await taskService.getAvailableTasks();
    console.log('AVAILABLE TASKS:', tasks); 
    set({ availableTasks: Array.isArray(tasks) ? tasks : [], isLoading: false });
    return tasks;
  } catch (error) {
    console.error('Fetch available tasks error:', error);
    set({ isLoading: false });
    throw error;
  }
  },

  fetchMyTasks: async () => {
    set({ isLoading: true });
    try {
      const tasks = await taskService.getMyTasks();
      set({ myTasks: Array.isArray(tasks) ? tasks : [], isLoading: false });
      return tasks;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  startTask: async (taskId, tier) => {
    set({ isLoading: true });
    try {
      const res = await taskService.startTask(taskId, tier);
      await get().fetchMyTasks();
      await get().fetchAvailableTasks();
      set({ isLoading: false });
      return res;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  uploadPayment: async (taskId, file) => {
    set({ isLoading: true });
    try {
      const formData = new FormData();
      formData.append('payment_proof', file);
      await taskService.uploadPayment(taskId, formData);
      await get().fetchMyTasks();
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  completeTask: async (taskId, proof) => {
    set({ isLoading: true });
    try {
      // Safety check — task must be in_progress
      const task = get().myTasks.find((t) => t.task === taskId);
      if (task?.status !== 'in_progress') {
        throw new Error('Task must be in progress first');
      }
      const formData = new FormData();
      formData.append('completion_proof', proof);
      await taskService.completeTask(taskId, formData);
      await get().fetchMyTasks();
      await get().fetchAvailableTasks();
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  
}));