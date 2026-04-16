// src/libs/stores/task.store.ts
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
  uploadPayment: (userTaskId: number, file: File) => Promise<void>;
  completeTask: (userTaskId: number, file: File) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  availableTasks: [],
  myTasks: [],
  isLoading: false,

  fetchAvailableTasks: async () => {
    set({ isLoading: true });
    try {
      const tasks = await taskService.getAvailableTasks();
      set({ availableTasks: Array.isArray(tasks) ? tasks : [], isLoading: false });
      return tasks;
    } catch (error) {
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
      // Refresh both lists after starting
      await get().fetchMyTasks();
      await get().fetchAvailableTasks();
      set({ isLoading: false });
      return res;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // Store receives raw File — service builds FormData internally
  uploadPayment: async (userTaskId, file) => {
    set({ isLoading: true });
    try {
      await taskService.uploadPayment(userTaskId, file);
      await get().fetchMyTasks();
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // Store receives raw File — service builds FormData internally
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
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));