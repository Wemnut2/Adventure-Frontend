// src/app/(dashboard)/tasks/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/layout/sections/dashboard/MainLayout';
import { Card } from '@/layout/components/Card';
import { Button } from '@/layout/components/Button';
import { Dialog } from '@/layout/components/Dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/layout/components/Tabs';
import { useTaskStore } from '@/libs/stores/task.store';
import { useAuthStore } from '@/libs/stores/auth.store';
import { useToast } from '@/libs/src/contexts/ToastContext';
import { formatCurrency } from '@/libs/utils/format';
import { 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Zap,
  Star,
  Shield,
  MessageCircle
} from 'lucide-react';

interface PricingOption {
  id: string;
  name: string;
  price: number;
  features: string[];
  recommended?: boolean;
}

const pricingOptions: PricingOption[] = [
  {
    id: 'basic',
    name: 'Basic Task',
    price: 10,
    features: [
      'Standard task completion',
      '24-48 hour processing',
      'Email support',
      'Basic rewards'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Task',
    price: 50,
    features: [
      'Priority processing',
      '12-24 hour processing',
      'Priority support',
      'Double rewards',
      'Featured tasks'
    ],
    recommended: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise Task',
    price: 100,
    features: [
      'Instant processing',
      '4-8 hour processing',
      '24/7 dedicated support',
      'Triple rewards',
      'Exclusive tasks',
      'VIP status'
    ]
  }
];

export default function TasksPage() {
  const { user } = useAuthStore();
  const { availableTasks, myTasks, fetchAvailableTasks, fetchMyTasks, startTask } = useTaskStore();
  const { showToast } = useToast();
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [selectedPricing, setSelectedPricing] = useState<PricingOption | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);

  useEffect(() => {
    fetchAvailableTasks();
    fetchMyTasks();
  }, []);

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setShowPaymentDialog(true);
  };

  const handleSelectPricing = (pricing: PricingOption) => {
    setSelectedPricing(pricing);
  };

  const handleProceedToWhatsApp = () => {
    if (!selectedTask || !selectedPricing) return;

    const message = `Hello! I want to start the task: ${selectedTask.title}
    
Task Details:
- Task ID: ${selectedTask.id}
- Task Name: ${selectedTask.title}
- Package: ${selectedPricing.name}
- Price: $${selectedPricing.price}
- User Email: ${user?.email}
- Username: ${user?.username}

I have made the payment and attached the proof. Please verify and activate my task.`;

    const whatsappUrl = `https://wa.me/2341234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    showToast('Redirecting to WhatsApp...', 'info');
    setShowPaymentDialog(false);
    setSelectedPricing(null);
  };

  const handleStartTask = async (taskId: number) => {
    try {
      await startTask(taskId);
      showToast('Task started successfully!', 'success');
      fetchAvailableTasks();
      fetchMyTasks();
    } catch (error: any) {
      if (error.response?.data?.error?.includes('subscription')) {
        showToast('This task requires an active subscription', 'error');
      } else {
        showToast('Failed to start task', 'error');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'in_progress':
        return 'text-blue-600 bg-blue-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'pending':
        return 'Pending Verification';
      case 'failed':
        return 'Failed';
      default:
        return status;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="mt-1 text-gray-600">
            Complete tasks to earn rewards and grow your investment
          </p>
        </div>

        <Tabs defaultValue="available">
          <TabsList>
            <TabsTrigger value="available">Available Tasks</TabsTrigger>
            <TabsTrigger value="my-tasks">My Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="mt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {availableTasks.map((task) => (
                <Card key={task.id} className="overflow-hidden transition-all hover:shadow-lg">
                  <div className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{task.title}</h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {task.description}
                        </p>
                      </div>
                      {task.requires_subscription && (
                        <div className="rounded-full bg-yellow-100 px-2 py-1">
                          <span className="text-xs font-medium text-yellow-800">
                            Premium
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mb-4 flex items-center justify-between border-t border-b py-3">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Reward</p>
                        <p className="text-lg font-bold text-green-600">
                          +{formatCurrency(task.reward_amount)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Payment Required</p>
                        <p className="text-lg font-bold text-blue-600">
                          ${task.amount_to_pay}
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleTaskClick(task)}
                      fullWidth
                      className="bg-linear-to-r from-green-500 to-blue-600"
                    >
                      Start Task
                    </Button>
                  </div>
                </Card>
              ))}

              {availableTasks.length === 0 && (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-500">No tasks available at the moment</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="my-tasks" className="mt-6">
            <div className="space-y-4">
              {myTasks.map((task) => (
                <Card key={task.id} className="p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{task.task_title}</h3>
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(task.status)}`}>
                          {getStatusText(task.status)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{task.task_description}</p>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Started:</span>{' '}
                          <span className="font-medium">
                            {new Date(task.started_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Reward:</span>{' '}
                          <span className="font-medium text-green-600">
                            +{formatCurrency(task.task_reward)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {task.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                        <span className="text-sm text-yellow-600">
                          Awaiting admin verification
                        </span>
                      </div>
                    )}

                    {task.status === 'in_progress' && (
                      <Button
                        onClick={() => handleStartTask(task.task)}
                        variant="primary"
                      >
                        Continue Task
                      </Button>
                    )}
                  </div>
                </Card>
              ))}

              {myTasks.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No tasks started yet</p>
                  <Button
                    onClick={() => document.querySelector('[value="available"]')?.dispatchEvent(new Event('click'))}
                    variant="outline"
                    className="mt-4"
                  >
                    Browse Available Tasks
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onClose={() => setShowPaymentDialog(false)}>
        <div className="max-w-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Choose Task Package</h2>
            <p className="mt-1 text-gray-600">
              Select a package for: {selectedTask?.title}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {pricingOptions.map((option) => (
              <div
                key={option.id}
                className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                  selectedPricing?.id === option.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handleSelectPricing(option)}
              >
                {option.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-linear-to-r from-yellow-400 to-yellow-600 px-3 py-1 text-xs font-bold text-white">
                    RECOMMENDED
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-lg font-bold">{option.name}</h3>
                  <div className="my-3">
                    <span className="text-3xl font-bold">${option.price}</span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    {option.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowPaymentDialog(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleProceedToWhatsApp}
              disabled={!selectedPricing}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Proceed to WhatsApp
            </Button>
          </div>

          <div className="mt-4 rounded-lg bg-yellow-50 p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> After payment, send the payment proof on WhatsApp.
              Admin will verify and activate your task within 24 hours.
            </p>
          </div>
        </div>
      </Dialog>
    </MainLayout>
  );
}