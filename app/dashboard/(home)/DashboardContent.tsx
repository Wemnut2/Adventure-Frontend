'use client';

import Link from 'next/link';
import { Card } from '@/layout/components/Card';
import { formatCurrency, formatDate } from '@/libs/utils/format';

type User = {
  username?: string;
};

type Investment = {
  amount?: number;
  total_profit?: number;
};

type Task = {
  id: string | number;
  task_title: string;
  started_at: string;
  task_reward?: number;
  status: string;
};

type Props = {
  user: User | null;
  investments: Investment[];
  myTasks: Task[];
};

export default function DashboardContent({
  user,
  investments,
  myTasks,
}: Props) {
  const totalInvested = investments.reduce(
    (sum, i) => sum + (i.amount || 0),
    0
  );

  const totalProfit = investments.reduce(
    (sum, i) => sum + (i.total_profit || 0),
    0
  );

  const completedTasks = myTasks.filter(
    (t) => t.status === 'completed'
  ).length;

  const pendingTasks = myTasks.filter(
    (t) => t.status !== 'completed'
  ).length;

  const recentTasks = myTasks.slice(0, 3);

  return (
    <div className="space-y-6">

      {/* HERO */}
      <div className="rounded-2xl bg-gradient-to-br from-black via-gray-900 to-orange-900 p-6 text-white">
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.username || 'Challenger'}
        </h1>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat title="Invested" value={formatCurrency(totalInvested)} />
        <Stat title="Profit" value={formatCurrency(totalProfit)} />
        <Stat title="Completed" value={completedTasks} />
        <Stat title="Pending" value={pendingTasks} />
      </div>

      {/* TASKS */}
      <Card className="p-5 rounded-2xl">
        {recentTasks.length > 0 ? (
          recentTasks.map((task) => (
            <div
              key={task.id}
              className="flex justify-between p-3 border rounded-xl"
            >
              <div>
                <p className="font-medium">{task.task_title}</p>
                <p className="text-xs text-gray-500">
                  {formatDate(task.started_at)}
                </p>
              </div>

              <div className="text-right">
                <p className="text-orange-500 font-bold">
                  +{formatCurrency(task.task_reward || 0)}
                </p>
                <p className="text-xs text-gray-500">{task.status}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No active challenges
          </p>
        )}
      </Card>
    </div>
  );
}

type StatProps = {
  title: string;
  value: string | number;
};

function Stat({ title, value }: StatProps) {
  return (
    <div className="bg-white border rounded-2xl p-4">
      <p className="text-xs text-gray-500">{title}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}