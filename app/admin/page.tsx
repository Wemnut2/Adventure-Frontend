// src/app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/layout/components/Card';
import { Button } from '@/layout/components/Button';
import {
  Users,
  Briefcase,
  DollarSign,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MoreHorizontal,
  CheckSquare
} from 'lucide-react';
import { adminService } from '@/libs/services/admin.service';
import { formatCurrency } from '@/libs/utils/format';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

interface DashboardStats {
  total_users: number;
  active_investments: number;
  total_volume: number;
  completed_tasks: number;
  pending_approvals: number;
  challenge_participants: number;
  active_users: number;
  inactive_users: number;
  subscribed_users: number;
}

export default function ModernAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.total_users || 0,
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Active Investments',
      value: stats?.active_investments || 0,
      change: '+8.2%',
      trend: 'up',
      icon: Briefcase,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Total Volume',
      value: formatCurrency(stats?.total_volume || 0),
      change: '+15.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Completed Tasks',
      value: stats?.completed_tasks || 0,
      change: '+23.1%',
      trend: 'up',
      icon: CheckCircle,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    },
    {
      title: 'Pending Approvals',
      value: stats?.pending_approvals || 0,
      change: '-5.4%',
      trend: 'down',
      icon: Clock,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600'
    },
    {
      title: 'Challenge Participants',
      value: stats?.challenge_participants || 0,
      change: '+18.7%',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600'
    }
  ];

  const chartData = [
    { name: 'Mon', users: 400, revenue: 2400, tasks: 24 },
    { name: 'Tue', users: 450, revenue: 2800, tasks: 28 },
    { name: 'Wed', users: 480, revenue: 3200, tasks: 32 },
    { name: 'Thu', users: 520, revenue: 3800, tasks: 38 },
    { name: 'Fri', users: 580, revenue: 4200, tasks: 42 },
    { name: 'Sat', users: 620, revenue: 4800, tasks: 48 },
    { name: 'Sun', users: 650, revenue: 5200, tasks: 52 }
  ];

  const pieData = [
    { name: 'Active Users', value: stats?.active_users || 0, color: '#f97316' },
    { name: 'Inactive Users', value: stats?.inactive_users || 0, color: '#94a3b8' },
    { name: 'Subscribed', value: stats?.subscribed_users || 0, color: '#10b981' }
  ];

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'Completed investment', amount: 5000, time: '5 min ago', status: 'success' },
    { id: 2, user: 'Jane Smith', action: 'Started new task', amount: null, time: '1 hour ago', status: 'info' },
    { id: 3, user: 'Mike Johnson', action: 'Withdrawal request', amount: 2500, time: '2 hours ago', status: 'warning' },
    { id: 4, user: 'Sarah Williams', action: 'Registered new account', amount: null, time: '3 hours ago', status: 'success' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="text-center">
          <div className="relative">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
          <p className="mt-1 text-gray-600">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <Button variant="outline" onClick={fetchDashboardData} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;
          return (
            <Card key={index} className="group relative overflow-hidden transition-all hover:shadow-xl">
              <div className={`absolute right-0 top-0 h-20 w-20 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br ${stat.color} opacity-10 blur-2xl transition-all group-hover:scale-150`} />
              <div className="relative p-4">
                <div className="flex items-center justify-between">
                  <div className={`rounded-xl p-2 ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                  <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
                    stat.trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}>
                    <TrendIcon className="h-3 w-3" />
                    {stat.change}
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Platform Activity</h2>
            <button className="text-sm text-orange-600 hover:text-orange-700">View Details →</button>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Area type="monotone" dataKey="users" stroke="#f97316" fill="url(#colorUsers)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">User Distribution</h2>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activities & Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Activities</h2>
            <button className="text-sm text-orange-600 hover:text-orange-700">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <p className="font-medium">{activity.user}</p>
                    <p className="text-sm text-gray-500">{activity.action}</p>
                  </div>
                </div>
                <div className="text-right">
                  {activity.amount && (
                    <p className="font-semibold text-green-600">+${activity.amount}</p>
                  )}
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button className="h-20 flex-col gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <Users className="h-6 w-6" />
              <span className="text-sm">Add User</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Briefcase className="h-6 w-6" />
              <span className="text-sm">New Investment</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <CheckSquare className="h-6 w-6" />
              <span className="text-sm">Create Task</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <DollarSign className="h-6 w-6" />
              <span className="text-sm">Process Payment</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}