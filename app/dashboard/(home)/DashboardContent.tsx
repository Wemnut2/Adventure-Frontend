'use client';

import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  ArrowRight,
  ListTodo,
  Wallet,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/libs/utils/format';
import { User, Investment, UserTask } from '@/libs/types';

type Props = {
  user: User | null;
  investments: Investment[];
  myTasks: UserTask[];
};

export default function DashboardContent({ user, investments, myTasks }: Props) {
  const totalInvested = investments.reduce((sum, i) => sum + (i.amount || 0), 0);
  const totalProfit = investments.reduce((sum, i) => sum + (i.total_profit || 0), 0);
  const completedTasks = myTasks.filter((t) => t.status === 'completed').length;
  const pendingTasks = myTasks.filter((t) => t.status !== 'completed').length;
  const recentTasks = myTasks.slice(0, 5);
  const recentInvestments = investments.slice(0, 3);

  return (
    <div className="space-y-6 pb-10">

      {/* HERO */}
      <div className="rounded-2xl bg-gradient-to-br from-black via-gray-900 to-orange-900 p-6 text-white">
        <p className="text-sm text-orange-300 font-medium mb-1">Welcome back 👋</p>
        <h1 className="text-2xl font-bold">{user?.username || 'Challenger'}</h1>
        <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
        <div className="flex gap-3 mt-5">
          <Link
            href="/task"
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition-colors"
          >
            Start Challenge
          </Link>
          <Link
            href="/task"
            className="px-4 py-2 border border-white/30 hover:bg-white/10 text-white text-sm font-medium rounded-xl transition-colors"
          >
            View Challenges
          </Link>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Invested"
          value={formatCurrency(totalInvested)}
          icon={DollarSign}
          color="orange"
        />
        <StatCard
          title="Total Profit"
          value={formatCurrency(totalProfit)}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Completed"
          value={completedTasks}
          icon={CheckCircle}
          color="blue"
        />
        <StatCard
          title="Pending"
          value={pendingTasks}
          icon={Clock}
          color="yellow"
        />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* RECENT TASKS */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-orange-100 p-1.5 rounded-lg">
                <ListTodo className="w-4 h-4 text-orange-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Active Challenges</h2>
            </div>
            <Link
              href="/task"
              className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-600 font-medium"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex justify-between items-center p-3 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {task.task_title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDate(task.started_at)}
                    </p>
                  </div>
                  <div className="text-right ml-3 shrink-0">
                    <p className="text-orange-500 font-bold text-sm">
                      +{formatCurrency(task.task_reward || 0)}
                    </p>
                    <StatusBadge status={task.status} />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <ListTodo className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No active challenges yet</p>
                <Link
                  href="/task"
                  className="text-xs text-orange-500 hover:underline mt-1 inline-block"
                >
                  Browse challenges
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* RECENT INVESTMENTS */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-green-100 p-1.5 rounded-lg">
                <Wallet className="w-4 h-4 text-green-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Recent Investments</h2>
            </div>
            <Link
              href="/investments"
              className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-600 font-medium"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentInvestments.length > 0 ? (
              recentInvestments.map((inv) => (
                <div
                  key={inv.id}
                  className="flex justify-between items-center p-3 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {inv.plan_name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {inv.start_date ? formatDate(inv.start_date) : '—'}
                    </p>
                  </div>
                  <div className="text-right ml-3 shrink-0">
                    <p className="font-bold text-sm text-gray-900">
                      {formatCurrency(inv.amount || 0)}
                    </p>
                    <p className="text-xs text-green-500 font-medium">
                      +{formatCurrency(inv.total_profit || 0)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <Wallet className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No investments yet</p>
                <Link
                  href="/investments"
                  className="text-xs text-orange-500 hover:underline mt-1 inline-block"
                >
                  Start investing
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: 'orange' | 'green' | 'blue' | 'yellow';
};

const colorMap = {
  orange: { bg: 'bg-orange-100', icon: 'text-orange-500' },
  green:  { bg: 'bg-green-100',  icon: 'text-green-500'  },
  blue:   { bg: 'bg-blue-100',   icon: 'text-blue-500'   },
  yellow: { bg: 'bg-yellow-100', icon: 'text-yellow-500' },
};

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:border-orange-200 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-gray-500 mb-1">{title}</p>
          <p className="text-lg font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${c.bg} p-2 rounded-xl`}>
          <Icon className={`h-5 w-5 ${c.icon}`} />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    completed:   'bg-green-100 text-green-700',
    in_progress: 'bg-blue-100 text-blue-700',
    pending:     'bg-yellow-100 text-yellow-700',
    failed:      'bg-red-100 text-red-700',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status.replace('_', ' ')}
    </span>
  );
}