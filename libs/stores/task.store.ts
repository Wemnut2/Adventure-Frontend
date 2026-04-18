// src/libs/stores/task.store.ts
import { create } from 'zustand';
import { Task, UserTask } from '@/libs/types';
import { taskService } from '@/libs/services/task.service';

interface TaskState {
  availableTasks: Task[];
  myTasks: UserTask[];
  isLoading: boolean;
  fetchAvailableTasks: () => Promise<void>;
  fetchMyTasks: () => Promise<void>;
  startTask: (taskId: number, tier: 'bronze' | 'silver' | 'gold') => Promise<UserTask>;
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
      console.log('Fetched available tasks:', tasks);
      set({ availableTasks: tasks || [], isLoading: false });
    } catch (error) {
      console.error('Error fetching available tasks:', error);
      set({ availableTasks: [], isLoading: false });
    }
  },

  fetchMyTasks: async () => {
    set({ isLoading: true });
    try {
      const tasks = await taskService.getMyTasks();
      console.log('Fetched my tasks:', tasks);
      set({ myTasks: tasks || [], isLoading: false });
    } catch (error) {
      console.error('Error fetching my tasks:', error);
      set({ myTasks: [], isLoading: false });
    }
  },

  startTask: async (taskId: number, tier: 'bronze' | 'silver' | 'gold') => {
    set({ isLoading: true });
    try {
      const userTask = await taskService.startTask(taskId, tier);
      console.log('Started task:', userTask);
      set((state) => ({
        myTasks: [userTask, ...(state.myTasks || [])],
        availableTasks: (state.availableTasks || []).filter(t => t.id !== taskId),
        isLoading: false,
      }));
      return userTask;
    } catch (error) {
      console.error('Error starting task:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  uploadPayment: async (userTaskId: number, file: File) => {
    set({ isLoading: true });
    try {
      await taskService.uploadPaymentProof(userTaskId, file);
      set({ isLoading: false });
    } catch (error) {
      console.error('Error uploading payment:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  completeTask: async (userTaskId: number, file: File) => {
    set({ isLoading: true });
    try {
      await taskService.uploadCompletionProof(userTaskId, file);
      set({ isLoading: false });
    } catch (error) {
      console.error('Error completing task:', error);
      set({ isLoading: false });
      throw error;
    }
  },
}));