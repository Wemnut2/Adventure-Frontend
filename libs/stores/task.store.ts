import { create } from 'zustand';
import { Task, UserTask } from '@/libs/types';
import { taskService } from '@/libs/services/task.service';

interface TaskState {
  availableTasks: Task[];
  myTasks: UserTask[];
  isLoading: boolean;
  isStartingTask: boolean;
  fetchAvailableTasks: () => Promise<Task[]>;
  fetchMyTasks: () => Promise<UserTask[]>;
  startTask: (taskId: number, tier: 'bronze' | 'silver' | 'gold') => Promise<any>;
  uploadPayment: (userTaskId: number, file: File) => Promise<void>;
  completeTask: (userTaskId: number, file: File) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  availableTasks: [],
  myTasks: [],
  isLoading: false,
  isStartingTask: false,

  fetchAvailableTasks: async () => {
    try {
      const tasks = await taskService.getAvailableTasks();
      set({ availableTasks: Array.isArray(tasks) ? tasks : [] });
      return tasks;
    } catch (error) {
      throw error;
    }
  },

  fetchMyTasks: async () => {
    try {
      const tasks = await taskService.getMyTasks();
      set({ myTasks: Array.isArray(tasks) ? tasks : [] });
      return tasks;
    } catch (error) {
      throw error;
    }
  },

  startTask: async (taskId, tier) => {
    set({ isStartingTask: true });
    try {
      const res = await taskService.startTask(taskId, tier);
      // Refresh lists in background — don't block return
      get().fetchMyTasks();
      get().fetchAvailableTasks();
      return res;
    } catch (error) {
      throw error;
    } finally {
      set({ isStartingTask: false });
    }
  },

  uploadPayment: async (userTaskId, file) => {
    set({ isLoading: true });
    try {
      await taskService.uploadPayment(userTaskId, file);
      await get().fetchMyTasks();
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  completeTask: async (userTaskId, file) => {
    set({ isLoading: true });
    try {
      const task = get().myTasks.find((t) => t.id === userTaskId);
      if (task && task.status !== 'in_progress') {
        throw new Error('Task must be in progress to submit completion');
      }
      await taskService.completeTask(userTaskId, file);
      await get().fetchMyTasks();
      await get().fetchAvailableTasks();
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));