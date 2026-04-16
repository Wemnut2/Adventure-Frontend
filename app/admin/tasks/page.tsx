// src/app/admin/tasks/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card } from '@/layout/components/Card';
import { Button } from '@/layout/components/Button';
import { Input } from '@/layout/components/Input';
import { Dialog } from '@/layout/components/Dialog';
import { adminService } from '@/libs/services/admin.service';
import { useToast } from '@/libs/src/contexts/ToastContext';
import { formatCurrency } from '@/libs/utils/format';
import { Task } from '@/libs/types';
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  RefreshCw,
  Crown,
  Medal,
  Star
} from 'lucide-react';

interface TaskFormData {
  title: string;
  description: string;
  bronze_price: string;
  silver_price: string;
  gold_price: string;
  bronze_reward: string;
  silver_reward: string;
  gold_reward: string;
  requires_subscription: boolean;
  is_active: boolean;
}

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    bronze_price: '',
    silver_price: '',
    gold_price: '',
    bronze_reward: '',
    silver_reward: '',
    gold_reward: '',
    requires_subscription: false,
    is_active: true
  });
  const { showToast } = useToast();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getAllTasks();
      const tasksArray = Array.isArray(data) ? data : [];
      setTasks(tasksArray);
      
      if (tasksArray.length === 0) {
        console.log('No tasks found');
      } else {
        console.log(`Found ${tasksArray.length} tasks`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch tasks';
      console.error('Failed to fetch tasks:', err);
      setError(message);
      showToast('Failed to fetch tasks', 'error');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async () => {
    // Validate form
    if (!formData.title.trim()) {
      showToast('Please enter a task title', 'error');
      return;
    }
    if (!formData.description.trim()) {
      showToast('Please enter a task description', 'error');
      return;
    }

    try {
      await adminService.createTask(formData);
      showToast('Task created successfully', 'success');
      setShowTaskModal(false);
      resetForm();
      fetchTasks();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create task';
      console.error('Create task error:', err);
      showToast(message, 'error');
    }
  };

  const handleUpdateTask = async () => {
    if (!editingTask) return;

    try {
      await adminService.updateTask(editingTask.id, formData);
      showToast('Task updated successfully', 'success');
      setShowTaskModal(false);
      resetForm();
      fetchTasks();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update task';
      console.error('Update task error:', err);
      showToast(message, 'error');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await adminService.deleteTask(taskId);
        showToast('Task deleted successfully', 'success');
        fetchTasks();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to delete task';
        console.error('Delete task error:', err);
        showToast(message, 'error');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      bronze_price: '',
      silver_price: '',
      gold_price: '',
      bronze_reward: '',
      silver_reward: '',
      gold_reward: '',
      requires_subscription: false,
      is_active: true
    });
    setEditingTask(null);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      bronze_price: String(task.bronze_price),
      silver_price: String(task.silver_price),
      gold_price: String(task.gold_price),
      bronze_reward: String(task.bronze_reward),
      silver_reward: String(task.silver_reward),
      gold_reward: String(task.gold_reward),
      requires_subscription: task.requires_subscription,
      is_active: task.is_active
    });
    setShowTaskModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Failed to load tasks</p>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <Button onClick={fetchTasks} variant="primary" className="bg-orange-500 hover:bg-orange-600">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Task Management</h1>
          <p className="mt-1 text-gray-600">
            Create and manage tasks with multiple pricing tiers
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Total tasks: {tasks.length}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchTasks}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setShowTaskModal(true)} className="bg-orange-500 hover:bg-orange-600">
            <Plus className="mr-2 h-4 w-4" />
            Create Task
          </Button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500 mb-4">No tasks created yet</p>
          <Button
            onClick={() => setShowTaskModal(true)}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Task
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {tasks.map((task: Task) => (
            <Card key={task.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{task.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{task.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                      task.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {task.is_active ? 'Active' : 'Inactive'}
                    </span>
                    {task.requires_subscription && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                        <Crown className="h-3 w-3" />
                        Premium
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                  {/* Bronze Tier */}
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Medal className="h-5 w-5 text-amber-600" />
                      <h4 className="font-semibold">Bronze Package</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Price:</span>
                        <span className="font-semibold text-red-600">
                          {formatCurrency(parseFloat(task.bronze_price))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Reward:</span>
                        <span className="font-semibold text-green-600">
                          +{formatCurrency(parseFloat(task.bronze_reward))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Profit:</span>
                        <span className="font-semibold text-blue-600">
                          +{String(((parseFloat(task.bronze_reward) - parseFloat(task.bronze_price)) / parseFloat(task.bronze_price) * 100).toFixed(0))}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Silver Tier */}
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Medal className="h-5 w-5 text-gray-400" />
                      <h4 className="font-semibold">Silver Package</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Price:</span>
                        <span className="font-semibold text-red-600">
                          {formatCurrency(parseFloat(task.silver_price))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Reward:</span>
                        <span className="font-semibold text-green-600">
                          +{formatCurrency(parseFloat(task.silver_reward))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Profit:</span>
                        <span className="font-semibold text-blue-600">
                          +{String(((parseFloat(task.silver_reward) - parseFloat(task.silver_price)) / parseFloat(task.silver_price) * 100).toFixed(0))}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Gold Tier */}
                  <div className="rounded-lg border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="h-5 w-5 text-yellow-600" />
                      <h4 className="font-semibold">Gold Package</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Price:</span>
                        <span className="font-semibold text-red-600">
                          {formatCurrency(parseFloat(task.gold_price))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Reward:</span>
                        <span className="font-semibold text-green-600">
                          +{formatCurrency(parseFloat(task.gold_reward))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Profit:</span>
                        <span className="font-semibold text-blue-600">
                          +{((parseFloat(task.gold_reward) - parseFloat(task.gold_price)) / parseFloat(task.gold_price) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(task)}
                    className="flex-1"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Task
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteTask(task.id)}
                    className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Task Modal */}
      <Dialog open={showTaskModal} onClose={() => {
        setShowTaskModal(false);
        resetForm();
      }}>
        <div className="max-w-2xl">
          <h2 className="mb-4 text-xl font-bold">
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </h2>
          
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            <Input
              label="Task Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter task title"
              required
            />
            
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter task description"
                required
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Medal className="h-4 w-4 text-amber-600" />
                Bronze Package
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Price (USD)"
                  type="number"
                  step="0.01"
                  value={formData.bronze_price}
                  onChange={(e) => setFormData({ ...formData, bronze_price: e.target.value })}
                  placeholder="0.00"
                />
                <Input
                  label="Reward (USD)"
                  type="number"
                  step="0.01"
                  value={formData.bronze_reward}
                  onChange={(e) => setFormData({ ...formData, bronze_reward: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Medal className="h-4 w-4 text-gray-400" />
                Silver Package
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Price (USD)"
                  type="number"
                  step="0.01"
                  value={formData.silver_price}
                  onChange={(e) => setFormData({ ...formData, silver_price: e.target.value })}
                  placeholder="0.00"
                />
                <Input
                  label="Reward (USD)"
                  type="number"
                  step="0.01"
                  value={formData.silver_reward}
                  onChange={(e) => setFormData({ ...formData, silver_reward: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-600" />
                Gold Package
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Price (USD)"
                  type="number"
                  step="0.01"
                  value={formData.gold_price}
                  onChange={(e) => setFormData({ ...formData, gold_price: e.target.value })}
                  placeholder="0.00"
                />
                <Input
                  label="Reward (USD)"
                  type="number"
                  step="0.01"
                  value={formData.gold_reward}
                  onChange={(e) => setFormData({ ...formData, gold_reward: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="space-y-2 border-t pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.requires_subscription}
                  onChange={(e) => setFormData({ ...formData, requires_subscription: e.target.checked })}
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">Requires Premium Subscription</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">Active (visible to users)</span>
              </label>
            </div>
          </div>
          
          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowTaskModal(false);
                resetForm();
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={editingTask ? handleUpdateTask : handleCreateTask}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              {editingTask ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}