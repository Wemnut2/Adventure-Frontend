import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTaskStore } from '@/libs/stores/task.store';

export const useAvailableTasks = () => {
  const fetchAvailableTasks = useTaskStore((state) => state.fetchAvailableTasks);
  const availableTasks = useTaskStore((state) => state.availableTasks);
  const isLoading = useTaskStore((state) => state.isLoading);
  useQuery({
    queryKey: ['available-tasks'],
    queryFn: fetchAvailableTasks,
    retry: false,
  });
  return { availableTasks, isLoading };
};

export const useMyTasks = () => {
  const fetchMyTasks = useTaskStore((state) => state.fetchMyTasks);
  const myTasks = useTaskStore((state) => state.myTasks);
  const isLoading = useTaskStore((state) => state.isLoading);
  useQuery({
    queryKey: ['my-tasks'],
    queryFn: fetchMyTasks,
    retry: false,
  });
  return { myTasks, isLoading };
};

export const useStartTask = () => {
  const queryClient = useQueryClient();
  const startTask = useTaskStore((state) => state.startTask);
  return useMutation({
    mutationFn: ({ taskId, tier }: { taskId: number; tier: 'bronze' | 'silver' | 'gold' }) =>
      startTask(taskId, tier),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['available-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
    },
  });
};

export const useUploadPayment = () => {
  const queryClient = useQueryClient();
  const uploadPayment = useTaskStore((state) => state.uploadPayment);
  return useMutation({
    mutationFn: ({ taskId, file }: { taskId: number; file: File }) =>
      uploadPayment(taskId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
    },
  });
};

export const useCompleteTask = () => {
  const queryClient = useQueryClient();
  const completeTask = useTaskStore((state) => state.completeTask);
  return useMutation({
    mutationFn: ({ taskId, proof }: { taskId: number; proof: File }) =>
      completeTask(taskId, proof),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['available-tasks'] });
    },
  });
};