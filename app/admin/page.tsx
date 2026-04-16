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
  AlertCircle,
  Download,
  RefreshCw,
  CheckSquare,
} from 'lucide-react';
import { adminService } from '@/libs/services/admin.service';
import { formatCurrency } from '@/libs/utils/format';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import { DashboardStats } from '@/libs/types';

interface Activity {
  action: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
      
      // Fetch recent activities
      const activities = await adminService.getRecentActivities();
      setRecentActivities(activities);
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
      change: '+12%',
      icon: Users,
      color: 'bg-blue-500',
      trend: 'up'
    },
    {
      title: 'Active Investments',
      value: stats?.active_investments || 0,
      change: '+8%',
      icon: Briefcase,
      color: 'bg-green-500',
      trend: 'up'
    },
    {
      title: 'Total Volume',
      value: formatCurrency(stats?.total_volume || 0),
      change: '+15%',
      icon: DollarSign,
      color: 'bg-purple-500',
      trend: 'up'
    },
    {
      title: 'Completed Tasks',
      value: stats?.completed_tasks || 0,
      change: '+23%',
      icon: CheckCircle,
      color: 'bg-yellow-500',
      trend: 'up'
    },
    {
      title: 'Pending Approvals',
      value: stats?.pending_approvals || 0,
      change: '-5%',
      icon: Clock,
      color: 'bg-orange-500',
      trend: 'down'
    },
    {
      title: 'Challenge Participants',
      value: stats?.challenge_participants || 0,
      change: '+18%',
      icon: TrendingUp,
      color: 'bg-indigo-500',
      trend: 'up'
    }
  ];

  const chartData = [
    { month: 'Jan', users: 400, investments: 240, tasks: 180 },
    { month: 'Feb', users: 500, investments: 280, tasks: 220 },
    { month: 'Mar', users: 550, investments: 320, tasks: 260 },
    { month: 'Apr', users: 600, investments: 380, tasks: 310 },
    { month: 'May', users: 650, investments: 420, tasks: 350 },
    { month: 'Jun', users: 700, investments: 480, tasks: 400 }
  ];

  const pieData = [
    { name: 'Active Users', value: stats?.active_users || 0 },
    { name: 'Subscribed Users', value: stats?.subscribed_users || 0 },
    { name: 'Inactive Users', value: stats?.inactive_users || 0 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-gray-600">
            Welcome back! Here&apos;s what&apos;s happening with your platform today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={fetchDashboardData}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                  <p className={`mt-1 text-xs ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`rounded-full p-3 ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Platform Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#8884d8" />
              <Line type="monotone" dataKey="investments" stroke="#82ca9d" />
              <Line type="monotone" dataKey="tasks" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">User Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent = 0 }) => `${name}: ${((percent * 100).toFixed(0))}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activities & Alerts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Recent Activities</h2>
          <div className="space-y-3">
            {recentActivities.slice(0, 5).map((activity: Activity, index) => (
              <div key={index} className="flex items-start gap-3 border-b pb-3">
                <div className="rounded-full bg-blue-100 p-2">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">{activity.action}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-24 flex-col gap-2">
              <Users className="h-6 w-6" />
              <span>Manage Users</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2">
              <Briefcase className="h-6 w-6" />
              <span>Review Investments</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2">
              <CheckSquare className="h-6 w-6" />
              <span>Approve Tasks</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2">
              <DollarSign className="h-6 w-6" />
              <span>Process Withdrawals</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}