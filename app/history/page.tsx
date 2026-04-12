'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/layout/sections/dashboard/MainLayout';
import { useInvestmentStore } from '@/libs/stores/investment.store';
import { useTaskStore } from '@/libs/stores/task.store';
import { useAuthStore } from '@/libs/stores/auth.store';
import { formatCurrency, formatDateTime } from '@/libs/utils/format';
import {
  Search, TrendingUp, CheckCircle, Clock,
  AlertCircle, Download, Loader2, X,
  Award, Medal, Trophy,
} from 'lucide-react';

// ── Status helpers ────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  completed:       'bg-green-100 text-green-700',
  active:          'bg-blue-100 text-blue-700',
  pending:         'bg-yellow-100 text-yellow-700',
  pending_payment: 'bg-blue-100 text-blue-700',
  pending_review:  'bg-yellow-100 text-yellow-700',
  in_progress:     'bg-orange-100 text-orange-700',
  failed:          'bg-red-100 text-red-700',
  cancelled:       'bg-gray-100 text-gray-600',
};

const STATUS_ICONS: Record<string, React.ElementType> = {
  completed:       CheckCircle,
  active:          TrendingUp,
  pending:         Clock,
  pending_payment: Clock,
  pending_review:  AlertCircle,
  in_progress:     TrendingUp,
  failed:          X,
  cancelled:       X,
};

function StatusBadge({ status }: { status: string }) {
  const color = STATUS_COLORS[status] || 'bg-gray-100 text-gray-600';
  const Icon = STATUS_ICONS[status] || Clock;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3" />
      {status.replace(/_/g, ' ')}
    </span>
  );
}

function TierBadge({ tier }: { tier: string }) {
  const map: Record<string, { icon: React.ElementType; color: string }> = {
    bronze: { icon: Award,  color: 'bg-amber-100 text-amber-700' },
    silver: { icon: Medal,  color: 'bg-gray-200 text-gray-700'   },
    gold:   { icon: Trophy, color: 'bg-yellow-100 text-yellow-700'},
  };
  const cfg = map[tier];
  if (!cfg) return null;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      {tier}
    </span>
  );
}

// ── Tab button ────────────────────────────────────────────
function Tab({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
        active ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {children}
    </button>
  );
}

// ── Export helper ─────────────────────────────────────────
function exportToCSV(data: any[], filename: string) {
  if (!data.length) { alert('No data to export'); return; }
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map((row) => headers.map((h) => JSON.stringify(row[h] ?? '')).join(',')),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Empty state ───────────────────────────────────────────
function Empty({ message }: { message: string }) {
  return (
    <div className="py-16 text-center">
      <Clock className="w-10 h-10 text-gray-200 mx-auto mb-3" />
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────
type Tab = 'investments' | 'transactions' | 'tasks' | 'activities';

export default function HistoryPage() {
  const {
    investments, fetchInvestments,
    transactions, fetchTransactions,
    isLoading: invLoading,
  } = useInvestmentStore();

  const { myTasks, fetchMyTasks, isLoading: tasksLoading } = useTaskStore();
  const { activities, fetchActivities, isLoading: activitiesLoading } = useAuthStore();

  const [activeTab, setActiveTab] = useState<Tab>('investments');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchInvestments();
    fetchTransactions();
    fetchMyTasks();
    fetchActivities();
  }, []);

  const investmentsArr  = Array.isArray(investments)  ? investments  : [];
  const transactionsArr = Array.isArray(transactions) ? transactions : [];
  const tasksArr        = Array.isArray(myTasks)      ? myTasks      : [];
  const activitiesArr   = Array.isArray(activities)   ? activities   : [];

  const q = search.toLowerCase();

  const filteredInvestments = investmentsArr.filter((i) =>
    i?.plan_name?.toLowerCase().includes(q) || i?.status?.toLowerCase().includes(q)
  );
  const filteredTransactions = transactionsArr.filter((t) =>
    t?.description?.toLowerCase().includes(q) ||
    t?.reference?.toLowerCase().includes(q) ||
    t?.transaction_type?.toLowerCase().includes(q)
  );
  const filteredTasks = tasksArr.filter((t) =>
    t?.task_title?.toLowerCase().includes(q) || t?.status?.toLowerCase().includes(q)
  );
  const filteredActivities = activitiesArr.filter((a) =>
    a?.action?.toLowerCase().includes(q) || a?.details?.toLowerCase().includes(q)
  );

  const isLoading = invLoading || tasksLoading || activitiesLoading;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            <p className="text-sm text-gray-500">Loading history...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 pb-10">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">History</h1>
            <p className="text-sm text-gray-500 mt-1">Your complete activity and transaction history</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="search"
              placeholder="Search history..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-colors"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto">
          <Tab active={activeTab === 'investments'} onClick={() => setActiveTab('investments')}>
            Investments ({filteredInvestments.length})
          </Tab>
          <Tab active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')}>
            Transactions ({filteredTransactions.length})
          </Tab>
          <Tab active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')}>
            Tasks ({filteredTasks.length})
          </Tab>
          <Tab active={activeTab === 'activities'} onClick={() => setActiveTab('activities')}>
            Activities ({filteredActivities.length})
          </Tab>
        </div>

        {/* ── Investments ── */}
        {activeTab === 'investments' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Plan</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Profit</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredInvestments.length > 0 ? filteredInvestments.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-gray-500">{formatDateTime(inv.created_at)}</td>
                      <td className="px-5 py-4 font-medium text-gray-900">{inv.plan_name || '—'}</td>
                      <td className="px-5 py-4 font-semibold text-gray-900">{formatCurrency(inv.amount || 0)}</td>
                      <td className="px-5 py-4 font-semibold text-green-600">+{formatCurrency(inv.total_profit || 0)}</td>
                      <td className="px-5 py-4"><StatusBadge status={inv.status} /></td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5}><Empty message="No investment history found" /></td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredInvestments.length > 0 && (
              <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => exportToCSV(filteredInvestments, 'investments')}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Download className="w-4 h-4" /> Export CSV
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Transactions ── */}
        {activeTab === 'transactions' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Reference</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredTransactions.length > 0 ? filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-gray-500">{formatDateTime(tx.created_at)}</td>
                      <td className="px-5 py-4 capitalize text-gray-700">{tx.transaction_type || '—'}</td>
                      <td className={`px-5 py-4 font-semibold ${
                        tx.transaction_type === 'withdrawal' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {tx.transaction_type === 'withdrawal' ? '-' : '+'}
                        {formatCurrency(tx.amount || 0)}
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-gray-500">{tx.reference || '—'}</td>
                      <td className="px-5 py-4"><StatusBadge status={tx.status} /></td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5}><Empty message="No transaction history found" /></td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredTransactions.length > 0 && (
              <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => exportToCSV(filteredTransactions, 'transactions')}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Download className="w-4 h-4" /> Export CSV
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Tasks ── */}
        {activeTab === 'tasks' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Started</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Task</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Tier</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Reward</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Completed</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredTasks.length > 0 ? filteredTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-gray-500">{formatDateTime(task.started_at)}</td>
                      <td className="px-5 py-4 font-medium text-gray-900">{task.task_title || '—'}</td>
                      <td className="px-5 py-4">
                        {task.tier ? <TierBadge tier={task.tier} /> : '—'}
                      </td>
                      <td className="px-5 py-4 font-semibold text-green-600">
                        +{formatCurrency(Number(task.reward_amount) || 0)}
                      </td>
                      <td className="px-5 py-4 text-gray-500">
                        {task.completed_at ? formatDateTime(task.completed_at) : '—'}
                      </td>
                      <td className="px-5 py-4"><StatusBadge status={task.status} /></td>
                    </tr>
                  )) : (
                    <tr><td colSpan={6}><Empty message="No task history found" /></td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredTasks.length > 0 && (
              <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => exportToCSV(filteredTasks, 'tasks')}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Download className="w-4 h-4" /> Export CSV
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Activities ── */}
        {activeTab === 'activities' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {filteredActivities.length > 0 ? (
              <>
                <div className="divide-y divide-gray-50">
                  {filteredActivities.map((activity) => (
                    <div key={activity.id} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm">{activity.action || '—'}</p>
                          {activity.details && (
                            <p className="text-xs text-gray-500 mt-0.5">{activity.details}</p>
                          )}
                          {activity.ip_address && (
                            <p className="text-xs text-gray-300 mt-0.5">IP: {activity.ip_address}</p>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 shrink-0 mt-1 sm:mt-0 sm:ml-4">
                          {formatDateTime(activity.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
                  <button
                    onClick={() => exportToCSV(filteredActivities, 'activities')}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Download className="w-4 h-4" /> Export CSV
                  </button>
                </div>
              </>
            ) : (
              <Empty message="No activity history found" />
            )}
          </div>
        )}

      </div>
    </MainLayout>
  );
}