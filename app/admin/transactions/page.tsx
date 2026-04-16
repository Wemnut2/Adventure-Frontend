// src/app/admin/transactions/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card } from '@/layout/components/Card';
import { Button } from '@/layout/components/Button';
import { Input } from '@/layout/components/Input';
import { adminService } from '@/libs/services/admin.service';
import { useToast } from '@/libs/src/contexts/ToastContext';
import { formatCurrency, formatDateTime } from '@/libs/utils/format';
import { Transaction } from '@/libs/types';
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Loader2
} from 'lucide-react';

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { showToast } = useToast();

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllTransactions();
      setTransactions(data);
    } catch {
      showToast('Failed to fetch transactions', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleApproveTransaction = async (transactionId: number) => {
    try {
      await adminService.approveTransaction(transactionId);
      showToast('Transaction approved successfully', 'success');
      fetchTransactions();
    } catch {
      showToast('Failed to approve transaction', 'error');
    }
  };

  const filteredTransactions = transactions.filter((transaction: Transaction) => {
    const matchesSearch = 
      transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user_email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
            <CheckCircle className="h-3 w-3" />
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
            <Clock className="h-3 w-3" />
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
            <XCircle className="h-3 w-3" />
            Failed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
            <XCircle className="h-3 w-3" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
            {status}
          </span>
        );
    }
  };

  const stats = {
    total: transactions.length,
    pending: transactions.filter((t: Transaction) => t.status === 'pending').length,
    completed: transactions.filter((t: Transaction) => t.status === 'completed').length,
    failed: transactions.filter((t: Transaction) => t.status === 'failed').length,
    totalVolume: transactions.reduce((sum: number, t: Transaction) => sum + (t.amount || 0), 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Transaction Management</h1>
        <p className="mt-1 text-gray-600">
          Review and process all platform transactions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Transactions</p>
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-xs text-gray-500 mt-1">All time</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          <p className="text-xs text-gray-500 mt-1">Successfully processed</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Volume</p>
          <p className="text-2xl font-bold">{formatCurrency(stats.totalVolume)}</p>
          <p className="text-xs text-gray-500 mt-1">All transactions</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <div className="w-64">
            <Input
              placeholder="Search by reference or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <Button variant="outline" onClick={() => {
          // Export functionality
          const csv = transactions.map(t => ({
            Date: formatDateTime(t.created_at),
            User: t.user_email,
            Type: t.transaction_type,
            Amount: t.amount,
            Reference: t.reference,
            Status: t.status
          }));
          console.log('Export CSV:', csv);
          showToast('Export started', 'info');
        }}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Transactions Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction: Transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      {formatDateTime(transaction.created_at)}
                    </td>
                    <td className="px-6 py-4 text-sm">{transaction.user_email}</td>
                    <td className="px-6 py-4 text-sm capitalize">{transaction.transaction_type}</td>
                    <td className={`px-6 py-4 text-sm font-semibold whitespace-nowrap ${
                      transaction.transaction_type === 'withdrawal' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {transaction.transaction_type === 'withdrawal' ? '-' : '+'}
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      {transaction.reference}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(transaction.status)}</td>
                    <td className="px-6 py-4">
                      {transaction.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleApproveTransaction(transaction.id)}
                          className="whitespace-nowrap"
                        >
                          Approve
                        </Button>
                      )}
                      {transaction.status === 'completed' && (
                        <span className="text-xs text-green-600">Processed</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    {searchTerm || statusFilter !== 'all' ? 'No matching transactions found' : 'No transactions yet'}
                  </td>
                </tr>
              )}
            </tbody>
           </table>
        </div>
        
        {filteredTransactions.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <div className="flex items-center justify-between text-sm">
              <p className="text-gray-600">
                Showing {filteredTransactions.length} of {transactions.length} transactions
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}