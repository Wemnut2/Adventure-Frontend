// src/stores/task.store.ts
import { create } from 'zustand';
import { Task, UserTask } from '@/libs/types';
import { taskService } from '@/libs/services/task.service';

interface TaskState {
  availableTasks: Task[];
  myTasks: UserTask[];
  isLoading: boolean;
  fetchAvailableTasks: () => Promise<void>;
  fetchMyTasks: () => Promise<void>;
  startTask: (taskId: number) => Promise<void>;
  completeTask: (taskId: number, proof?: File) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  availableTasks: [],
  myTasks: [],
  isLoading: false,

  fetchAvailableTasks: async () => {
    set({ isLoading: true });
    try {
      const tasks = await taskService.getAvailableTasks();
      set({ availableTasks: tasks, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchMyTasks: async () => {
    set({ isLoading: true });
    try {
      const tasks = await taskService.getMyTasks();
      set({ myTasks: tasks, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  startTask: async (taskId: number) => {
    set({ isLoading: true });
    try {
      const userTask = await taskService.startTask(taskId);
      set((state) => ({
        myTasks: [userTask, ...state.myTasks],
        availableTasks: state.availableTasks.filter(t => t.id !== taskId),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  completeTask: async (taskId: number, proof?: File) => {
    set({ isLoading: true });
    try {
      await taskService.completeTask(taskId, proof);
      await get().fetchMyTasks();
      await get().fetchAvailableTasks();
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));