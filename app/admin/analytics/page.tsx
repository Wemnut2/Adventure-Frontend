// src/app/admin/analytics/page.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/layout/components/Card';
import { Button } from '@/layout/components/Button';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Briefcase,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
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

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('month');

  const revenueData = [
    { month: 'Jan', revenue: 12500, expenses: 3200, profit: 9300 },
    { month: 'Feb', revenue: 15800, expenses: 3800, profit: 12000 },
    { month: 'Mar', revenue: 18200, expenses: 4200, profit: 14000 },
    { month: 'Apr', revenue: 21500, expenses: 4800, profit: 16700 },
    { month: 'May', revenue: 24800, expenses: 5200, profit: 19600 },
    { month: 'Jun', revenue: 28900, expenses: 5800, profit: 23100 },
  ];

  const userGrowthData = [
    { month: 'Jan', users: 450, active: 320 },
    { month: 'Feb', users: 580, active: 410 },
    { month: 'Mar', users: 720, active: 510 },
    { month: 'Apr', users: 890, active: 630 },
    { month: 'May', users: 1050, active: 750 },
    { month: 'Jun', users: 1250, active: 890 },
  ];

  const investmentData = [
    { name: 'Starter Plan', value: 35, color: '#f97316' },
    { name: 'Professional', value: 45, color: '#10b981' },
    { name: 'Enterprise', value: 20, color: '#3b82f6' },
  ];

  const topUsers = [
    { name: 'John Doe', investments: 25000, tasks: 45, rank: 1 },
    { name: 'Jane Smith', investments: 18500, tasks: 38, rank: 2 },
    { name: 'Mike Johnson', investments: 15200, tasks: 32, rank: 3 },
    { name: 'Sarah Williams', investments: 12800, tasks: 28, rank: 4 },
    { name: 'David Brown', investments: 9500, tasks: 24, rank: 5 },
  ];

  const stats = [
    { label: 'Total Revenue', value: '$124,500', change: '+23%', trend: 'up', icon: DollarSign },
    { label: 'Active Users', value: '1,250', change: '+18%', trend: 'up', icon: Users },
    { label: 'Total Investments', value: '342', change: '+12%', trend: 'up', icon: Briefcase },
    { label: 'Conversion Rate', value: '24.5%', change: '+5%', trend: 'up', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Analytics Dashboard</h1>
          <p className="mt-1 text-gray-600">Comprehensive platform analytics and insights</p>
        </div>
        <div className="flex gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="mt-2 text-2xl font-bold">{stat.value}</p>
                  <p className={`mt-1 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className="rounded-full bg-orange-100 p-3">
                  <Icon className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Revenue Overview</h2>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="#f97316" fill="url(#colorRevenue)" />
              <Area type="monotone" dataKey="profit" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">User Growth</h2>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="active" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Investment Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={investmentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {investmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Top Investors</h2>
          <div className="space-y-3">
            {topUsers.map((user) => (
              <div key={user.rank} className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    user.rank === 1 ? 'bg-yellow-100 text-yellow-600' :
                    user.rank === 2 ? 'bg-gray-100 text-gray-600' :
                    user.rank === 3 ? 'bg-orange-100 text-orange-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    #{user.rank}
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.tasks} tasks completed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">${user.investments.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}