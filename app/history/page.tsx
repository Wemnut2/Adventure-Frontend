// src/app/(dashboard)/history/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/layout/sections/dashboard/MainLayout';
import { Card } from '@/layout/components/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/layout/components/Tabs';
import { Input } from '@/layout/components/Input';
import { Button } from '@/layout/components/Button';
import { useInvestmentStore } from '@/libs/stores/investment.store';
import { useTaskStore } from '@/libs/stores/task.store';
import { useAuthStore } from '@/libs/stores/auth.store';
import { formatCurrency, formatDateTime } from '@/libs/utils/format';
import { 
  Search, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  AlertCircle,
  Download,
  Loader2
} from 'lucide-react';

export default function HistoryPage() {
  const { investments, fetchInvestments, transactions, fetchTransactions, isLoading: investmentsLoading } = useInvestmentStore();
  const { myTasks, fetchMyTasks, isLoading: tasksLoading } = useTaskStore();
  const { activities, fetchActivities, isLoading: activitiesLoading } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch all data
    fetchInvestments();
    fetchTransactions();
    fetchMyTasks();
    fetchActivities();
  }, [fetchInvestments, fetchTransactions, fetchMyTasks, fetchActivities]);

  // Safe array handling - ensure we always have arrays
  const investmentsArray = Array.isArray(investments) ? investments : [];
  const transactionsArray = Array.isArray(transactions) ? transactions : [];
  const myTasksArray = Array.isArray(myTasks) ? myTasks : [];
  const activitiesArray = Array.isArray(activities) ? activities : [];

  // Filter data based on search term
  const filteredInvestments = investmentsArray.filter(inv =>
    inv?.plan_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv?.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransactions = transactionsArray.filter(t =>
    t?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t?.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t?.transaction_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTasks = myTasksArray.filter(task =>
    task?.task_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task?.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredActivities = activitiesArray.filter(activity =>
    activity?.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity?.details?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'active':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      default:
        return <TrendingUp className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      case 'active':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }
    
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Loading state
  if (investmentsLoading || tasksLoading || activitiesLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading history...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">History</h1>
            <p className="mt-1 text-gray-600">
              View your complete transaction and activity history
            </p>
          </div>
          <div className="flex gap-3">
            <div className="w-64">
              <Input
                placeholder="Search history..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="h-4 w-4 text-gray-400" />}
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="investments">
          <TabsList>
            <TabsTrigger value="investments">
              Investments ({filteredInvestments.length})
            </TabsTrigger>
            <TabsTrigger value="transactions">
              Transactions ({filteredTransactions.length})
            </TabsTrigger>
            <TabsTrigger value="tasks">
              Tasks ({filteredTasks.length})
            </TabsTrigger>
            <TabsTrigger value="activities">
              Activities ({filteredActivities.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="investments" className="mt-6">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Plan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Profit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredInvestments.length > 0 ? (
                      filteredInvestments.map((investment) => (
                        <tr key={investment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm">{formatDateTime(investment.created_at)}</td>
                          <td className="px-6 py-4 text-sm font-medium">{investment.plan_name || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm font-semibold">{formatCurrency(investment.amount || 0)}</td>
                          <td className="px-6 py-4 text-sm text-green-600">{formatCurrency(investment.total_profit || 0)}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(investment.status)}`}>
                              {getStatusIcon(investment.status)}
                              {investment.status || 'N/A'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                          No investment history found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {filteredInvestments.length > 0 && (
                <div className="border-t border-gray-200 p-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToCSV(filteredInvestments, 'investments')}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export to CSV
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="mt-6">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Reference</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm">{formatDateTime(transaction.created_at)}</td>
                          <td className="px-6 py-4 text-sm capitalize">{transaction.transaction_type || 'N/A'}</td>
                          <td className={`px-6 py-4 text-sm font-semibold ${
                            transaction.transaction_type === 'withdrawal' ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {transaction.transaction_type === 'withdrawal' ? '-' : '+'}
                            {formatCurrency(transaction.amount || 0)}
                          </td>
                          <td className="px-6 py-4 text-sm font-mono">{transaction.reference || 'N/A'}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(transaction.status)}`}>
                              {getStatusIcon(transaction.status)}
                              {transaction.status || 'N/A'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                          No transaction history found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {filteredTransactions.length > 0 && (
                <div className="border-t border-gray-200 p-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToCSV(filteredTransactions, 'transactions')}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export to CSV
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="mt-6">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Started</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Task</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Reward</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Completed</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map((task) => (
                        <tr key={task.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm">{formatDateTime(task.started_at)}</td>
                          <td className="px-6 py-4 text-sm font-medium">{task.task_title || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-green-600">
                            +{formatCurrency(task.task_reward || 0)}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {task.completed_at ? formatDateTime(task.completed_at) : '-'}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(task.status)}`}>
                              {getStatusIcon(task.status)}
                              {task.status || 'N/A'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                          No task history found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {filteredTasks.length > 0 && (
                <div className="border-t border-gray-200 p-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToCSV(filteredTasks, 'tasks')}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export to CSV
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="mt-6">
            <Card className="overflow-hidden">
              <div className="divide-y divide-gray-200">
                {filteredActivities.length > 0 ? (
                  filteredActivities.map((activity) => (
                    <div key={activity.id} className="p-4 hover:bg-gray-50">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{activity.action || 'N/A'}</p>
                          {activity.details && (
                            <p className="mt-1 text-sm text-gray-600">{activity.details}</p>
                          )}
                          {activity.ip_address && (
                            <p className="mt-1 text-xs text-gray-400">IP: {activity.ip_address}</p>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {formatDateTime(activity.created_at)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-gray-500">No activity history found</p>
                  </div>
                )}
              </div>
              {filteredActivities.length > 0 && (
                <div className="border-t border-gray-200 p-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToCSV(filteredActivities, 'activities')}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export to CSV
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}