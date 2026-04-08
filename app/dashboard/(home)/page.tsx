// src/app/(dashboard)/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import { MainLayout } from '@/layout/sections/dashboard/MainLayout';
import { Loader2 } from 'lucide-react';
import { Card } from '@/layout/components/Card';
import { Button } from '@/layout/components/Button';
import { 
  DollarSign, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useAuthStore } from '@/libs/stores/auth.store';
import { useInvestmentStore } from '@/libs/stores/investment.store';
import { useTaskStore } from '@/libs/stores/task.store';
import { formatCurrency, formatDate } from '@/libs/utils/format';
import Link from 'next/link';

export default function DashboardPage() {
    const { user } = useAuthStore();
    const { investments, fetchInvestments, isLoading: investmentsLoading } = useInvestmentStore();
    const { myTasks, fetchMyTasks, isLoading: tasksLoading } = useTaskStore();
  
    useEffect(() => {
      fetchInvestments();
      fetchMyTasks();
    }, [fetchInvestments, fetchMyTasks]);
  
    // Show loading state
    if (investmentsLoading || tasksLoading) {
      return (
        <MainLayout>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </MainLayout>
      );
    }

  // Safe array handling with fallbacks
  const investmentsArray = Array.isArray(investments) ? investments : [];
  const myTasksArray = Array.isArray(myTasks) ? myTasks : [];
//   const transactionsArray = Array.isArray(transactions) ? transactions : [];

  const totalInvested = investmentsArray.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const totalProfit = investmentsArray.reduce((sum, inv) => sum + (inv.total_profit || 0), 0);
  const completedTasks = myTasksArray.filter(task => task?.status === 'completed').length;
  const pendingTasks = myTasksArray.filter(task => task?.status === 'pending' || task?.status === 'in_progress').length;

  const stats = [
    {
      title: 'Total Invested',
      value: formatCurrency(totalInvested),
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Profit',
      value: formatCurrency(totalProfit),
      change: '+8.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      title: 'Completed Tasks',
      value: completedTasks.toString(),
      change: '+3',
      trend: 'up',
      icon: CheckCircle,
      color: 'bg-purple-500',
    },
    {
      title: 'Pending Tasks',
      value: pendingTasks.toString(),
      change: 'Awaiting',
      trend: 'neutral',
      icon: Clock,
      color: 'bg-yellow-500',
    },
  ];

  const recentInvestments = investmentsArray.slice(0, 5);
  const recentTasks = myTasksArray.slice(0, 5);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Welcome back, {user?.username || 'User'}!</h1>
          <p className="mt-1 text-blue-100">
            Track your investments and complete tasks to earn more
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    {stat.change && (
                      <div className="mt-2 flex items-center gap-1">
                        {stat.trend === 'up' ? (
                          <ArrowUpRight className="h-4 w-4 text-green-500" />
                        ) : stat.trend === 'down' ? (
                          <ArrowDownRight className="h-4 w-4 text-red-500" />
                        ) : null}
                        <span className={`text-sm ${
                          stat.trend === 'up' ? 'text-green-600' : 
                          stat.trend === 'down' ? 'text-red-600' : 
                          'text-yellow-600'
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className={`rounded-full p-3 ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Recent Investments & Tasks */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Investments */}
          <Card>
            <div className="mb-4 flex items-center justify-between border-b pb-4">
              <h2 className="text-lg font-semibold">Recent Investments</h2>
              <Link href="/investments">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
            <div className="space-y-3">
              {recentInvestments.length > 0 ? (
                recentInvestments.map((investment) => (
                  <div key={investment.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{investment.plan_name || 'Investment'}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(investment.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(investment.amount || 0)}</p>
                      <span className={`text-sm ${
                        investment.status === 'active' ? 'text-green-600' :
                        investment.status === 'completed' ? 'text-blue-600' :
                        'text-yellow-600'
                      }`}>
                        {investment.status || 'pending'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No investments yet</p>
              )}
            </div>
          </Card>

          {/* Recent Tasks */}
          <Card>
            <div className="mb-4 flex items-center justify-between border-b pb-4">
              <h2 className="text-lg font-semibold">Recent Tasks</h2>
              <Link href="/tasks">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
            <div className="space-y-3">
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{task.task_title || 'Task'}</p>
                      <p className="text-sm text-gray-500">
                        Started: {formatDate(task.started_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        +{formatCurrency(task.task_reward || 0)}
                      </p>
                      <span className={`text-sm ${
                        task.status === 'completed' ? 'text-green-600' :
                        task.status === 'in_progress' ? 'text-blue-600' :
                        'text-yellow-600'
                      }`}>
                        {task.status || 'pending'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No tasks started yet</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}