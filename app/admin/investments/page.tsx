// src/app/admin/investments/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card } from '@/layout/components/Card';
import { Button } from '@/layout/components/Button';
import { Input } from '@/layout/components/Input';
import { adminService } from '@/libs/services/admin.service';
import { useToast } from '@/libs/src/contexts/ToastContext';
import { formatCurrency, formatDate } from '@/libs/utils/format';
import { Investment } from '@/libs/types';
import {
  Search,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
  TrendingUp
} from 'lucide-react';

export default function AdminInvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { showToast } = useToast();

  const fetchInvestments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getAllInvestments();
      const investmentsArray = Array.isArray(data) ? data : [];
      setInvestments(investmentsArray);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('Failed to fetch investments:', error);
      setError(error?.message || 'Failed to fetch investments');
      showToast('Failed to fetch investments', 'error');
      setInvestments([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  const handleApproveInvestment = async (investmentId: number) => {
    try {
      await adminService.approveInvestment(investmentId);
      showToast('Investment approved successfully', 'success');
      fetchInvestments();
    } catch (error) {
      showToast('Failed to approve investment', 'error');
    }
  };

  const filteredInvestments = Array.isArray(investments) ? investments.filter((inv: Investment) => {
    const matchesSearch = 
      inv.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.plan_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) : [];

  const stats = {
    total: investments.length,
    active: investments.filter(i => i.status === 'active').length,
    pending: investments.filter(i => i.status === 'pending').length,
    completed: investments.filter(i => i.status === 'completed').length,
    totalAmount: investments.reduce((sum, i) => sum + (i.amount || 0), 0)
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
          <TrendingUp className="h-3 w-3" />
          Active
        </span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
          <Clock className="h-3 w-3" />
          Pending
        </span>;
      case 'completed':
        return <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
          <CheckCircle className="h-3 w-3" />
          Completed
        </span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
          <XCircle className="h-3 w-3" />
          Cancelled
        </span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading investments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Failed to load investments</p>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <Button onClick={fetchInvestments} variant="primary" className="bg-orange-500 hover:bg-orange-600">
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
          <h1 className="text-2xl font-bold">Investment Management</h1>
          <p className="mt-1 text-gray-600">
            Review and manage all user investments
          </p>
        </div>
        <Button variant="outline" onClick={fetchInvestments}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Investments</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <div className="w-64">
            <Input
              placeholder="Search by user or plan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Investments Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Profit</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInvestments.length > 0 ? (
                filteredInvestments.map((investment) => (
                  <tr key={investment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{formatDate(investment.created_at)}</td>
                    <td className="px-6 py-4 text-sm">{investment.user_email}</td>
                    <td className="px-6 py-4 text-sm font-medium">{investment.plan_name}</td>
                    <td className="px-6 py-4 text-sm font-semibold">{formatCurrency(investment.amount)}</td>
                    <td className="px-6 py-4 text-sm text-green-600">{formatCurrency(investment.total_profit)}</td>
                    <td className="px-6 py-4">{getStatusBadge(investment.status)}</td>
                    <td className="px-6 py-4">
                      {investment.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleApproveInvestment(investment.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    {searchTerm || statusFilter !== 'all' ? 'No matching investments found' : 'No investments yet'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}