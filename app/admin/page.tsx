// src/app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  Users, Briefcase, DollarSign, CheckCircle,
  Clock, TrendingUp, ArrowUpRight, ArrowDownRight,
  RefreshCw, CheckSquare,
} from 'lucide-react';
import { adminService } from '@/libs/services/admin.service';
import { formatCurrency } from '@/libs/utils/format';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
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

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Users',            value: stats?.total_users ?? 0,                       change: '+12.5%', trend: 'up',   icon: Users },
    { title: 'Active Investments',     value: stats?.active_investments ?? 0,                 change: '+8.2%',  trend: 'up',   icon: Briefcase },
    { title: 'Total Volume',           value: formatCurrency(stats?.total_volume ?? 0),       change: '+15.3%', trend: 'up',   icon: DollarSign },
    { title: 'Completed Tasks',        value: stats?.completed_tasks ?? 0,                    change: '+23.1%', trend: 'up',   icon: CheckCircle },
    { title: 'Pending Approvals',      value: stats?.pending_approvals ?? 0,                  change: '-5.4%',  trend: 'down', icon: Clock },
    { title: 'Challenge Participants', value: stats?.challenge_participants ?? 0,              change: '+18.7%', trend: 'up',   icon: TrendingUp },
  ];

  const chartData = [
    { name: 'Mon', users: 400, revenue: 2400 },
    { name: 'Tue', users: 450, revenue: 2800 },
    { name: 'Wed', users: 480, revenue: 3200 },
    { name: 'Thu', users: 520, revenue: 3800 },
    { name: 'Fri', users: 580, revenue: 4200 },
    { name: 'Sat', users: 620, revenue: 4800 },
    { name: 'Sun', users: 650, revenue: 5200 },
  ];

  const pieData = [
    { name: 'Active',     value: stats?.active_users     ?? 0, color: '#f97316' },
    { name: 'Inactive',   value: stats?.inactive_users   ?? 0, color: '#e5e5e5' },
    { name: 'Subscribed', value: stats?.subscribed_users ?? 0, color: '#1a1a1a' },
  ];

  const recentActivities = [
    { id: 1, user: 'John Doe',       action: 'Completed investment',    amount: 5000, time: '5 min ago',   status: 'success' },
    { id: 2, user: 'Jane Smith',     action: 'Started new task',        amount: null, time: '1 hour ago',  status: 'info' },
    { id: 3, user: 'Mike Johnson',   action: 'Withdrawal request',      amount: 2500, time: '2 hours ago', status: 'warning' },
    { id: 4, user: 'Sarah Williams', action: 'Registered new account',  amount: null, time: '3 hours ago', status: 'success' },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 100px)', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2.5px solid #f0ede9', borderTopColor: '#f97316', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
          <p style={{ marginTop: 14, fontSize: 12.5, color: '#999' }}>Loading dashboard…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');

        .dash-root {
          font-family: 'DM Sans', sans-serif;
          display: flex;
          flex-direction: column;
          gap: 24px;
          animation: fadeUp 0.3s ease;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .dash-card {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 14px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }

        .stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 14px;
        }

        .stat-card {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 14px;
          padding: 18px 16px;
          transition: box-shadow 0.18s, transform 0.18s;
        }

        .stat-card:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.07);
          transform: translateY(-1px);
        }

        .stat-icon-wrap {
          width: 32px; height: 32px;
          border-radius: 8px;
          background: #f5f5f5;
          display: flex; align-items: center; justify-content: center;
          color: #555;
        }

        .stat-value {
          font-size: 22px;
          font-weight: 600;
          color: #1a1a1a;
          margin-top: 14px;
          letter-spacing: -0.02em;
        }

        .stat-title {
          font-size: 11.5px;
          color: #999;
          margin-top: 3px;
        }

        .stat-badge {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          font-size: 10.5px;
          font-weight: 500;
          border-radius: 20px;
          padding: 2px 7px;
        }

        .stat-badge.up   { background: #f0fdf4; color: #16a34a; }
        .stat-badge.down { background: #fff5f5; color: #e05252; }

        .chart-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        @media (max-width: 900px) { .chart-grid { grid-template-columns: 1fr; } }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px 0;
        }

        .card-title {
          font-size: 13px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .card-link {
          font-size: 11.5px;
          color: #f97316;
          text-decoration: none;
          font-weight: 500;
          transition: opacity 0.15s;
        }
        .card-link:hover { opacity: 0.75; }

        .bottom-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 14px;
        }

        @media (max-width: 900px) { .bottom-grid { grid-template-columns: 1fr; } }

        .activity-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 11px 0;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .activity-item:last-child { border-bottom: none; }

        .activity-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .activity-user { font-size: 12.5px; font-weight: 500; color: #1a1a1a; }
        .activity-action { font-size: 11.5px; color: #999; margin-top: 1px; }
        .activity-time { font-size: 10.5px; color: #ccc; }
        .activity-amount { font-size: 12px; font-weight: 600; color: #16a34a; }

        .qa-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          padding: 16px;
        }

        .qa-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 7px;
          height: 80px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 11.5px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.15s;
          border: 1px solid rgba(0,0,0,0.1);
          background: transparent;
          color: #555;
        }

        .qa-btn:hover {
          background: #fafafa;
          border-color: rgba(0,0,0,0.18);
          color: #1a1a1a;
        }

        .qa-btn.primary {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          border-color: transparent;
          color: #fff;
        }

        .qa-btn.primary:hover { opacity: 0.9; }

        .page-header { display: flex; align-items: flex-end; justify-content: space-between; }

        .page-title {
          font-family: 'DM Serif Display', serif;
          font-size: 26px;
          color: #1a1a1a;
          letter-spacing: -0.02em;
        }

        .page-subtitle { font-size: 12px; color: #999; margin-top: 3px; }

        .header-controls { display: flex; gap: 8px; }

        .time-select {
          background: #fafafa;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 8px;
          padding: 7px 12px;
          font-size: 12px;
          color: #555;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          cursor: pointer;
        }

        .refresh-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #fafafa;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 8px;
          padding: 7px 14px;
          font-size: 12px;
          color: #555;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }
        .refresh-btn:hover { background: #f0f0f0; border-color: rgba(0,0,0,0.18); color: #1a1a1a; }

        .legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

        .recharts-tooltip-wrapper .recharts-default-tooltip {
          font-family: 'DM Sans', sans-serif !important;
          font-size: 12px !important;
          border-radius: 8px !important;
          border: 1px solid rgba(0,0,0,0.08) !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.07) !important;
        }
      `}</style>

      <div className="dash-root">

        {/* Page header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Here&apos;s what&apos;s happening today.</p>
          </div>
          <div className="header-controls">
            <select
              className="time-select"
              value={timeRange}
              onChange={e => setTimeRange(e.target.value)}
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <button className="refresh-btn" onClick={fetchDashboardData}>
              <RefreshCw size={13} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="stat-grid">
          {statCards.map((s, i) => {
            const Icon = s.icon;
            const TrendIcon = s.trend === 'up' ? ArrowUpRight : ArrowDownRight;
            return (
              <div className="stat-card" key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="stat-icon-wrap"><Icon size={15} /></div>
                  <span className={`stat-badge ${s.trend}`}>
                    <TrendIcon size={10} />{s.change}
                  </span>
                </div>
                <p className="stat-value">{s.value}</p>
                <p className="stat-title">{s.title}</p>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="chart-grid">
          {/* Area chart */}
          <div className="dash-card">
            <div className="card-header" style={{ marginBottom: 16 }}>
              <span className="card-title">Platform Activity</span>
              <a href="#" className="card-link">View Details →</a>
            </div>
            <div style={{ padding: '0 20px 20px' }}>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#f97316" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="name" stroke="#ccc" tick={{ fontSize: 11, fontFamily: 'DM Sans' }} />
                  <YAxis stroke="#ccc" tick={{ fontSize: 11, fontFamily: 'DM Sans' }} />
                  <Tooltip contentStyle={{ fontFamily: 'DM Sans', fontSize: 12, borderRadius: 8, border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }} />
                  <Area type="monotone" dataKey="users" stroke="#f97316" strokeWidth={2} fill="url(#areaGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie chart */}
          <div className="dash-card">
            <div className="card-header" style={{ marginBottom: 16 }}>
              <span className="card-title">User Distribution</span>
            </div>
            <div style={{ padding: '0 20px 20px' }}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontFamily: 'DM Sans', fontSize: 12, borderRadius: 8, border: '1px solid rgba(0,0,0,0.08)' }} />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 12 }}>
                {pieData.map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="legend-dot" style={{ background: d.color }} />
                    <span style={{ fontSize: 11, color: '#888' }}>{d.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="bottom-grid">
          {/* Recent activities */}
          <div className="dash-card" style={{ padding: '16px 20px' }}>
            <div className="card-header" style={{ padding: 0, marginBottom: 14 }}>
              <span className="card-title">Recent Activities</span>
              <a href="/admin/activities" className="card-link">View All →</a>
            </div>
            <div>
              {recentActivities.map(a => (
                <div key={a.id} className="activity-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span
                      className="activity-dot"
                      style={{ background: a.status === 'success' ? '#16a34a' : a.status === 'warning' ? '#f97316' : '#93c5fd' }}
                    />
                    <div>
                      <p className="activity-user">{a.user}</p>
                      <p className="activity-action">{a.action}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {a.amount != null && <p className="activity-amount">+${a.amount.toLocaleString()}</p>}
                    <p className="activity-time">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dash-card">
            <div className="card-header" style={{ marginBottom: 0 }}>
              <span className="card-title">Quick Actions</span>
            </div>
            <div className="qa-grid">
              <button className="qa-btn primary">
                <Users size={16} />
                <span>Add User</span>
              </button>
              <button className="qa-btn">
                <Briefcase size={16} />
                <span>New Investment</span>
              </button>
              <button className="qa-btn">
                <CheckSquare size={16} />
                <span>Create Task</span>
              </button>
              <button className="qa-btn">
                <DollarSign size={16} />
                <span>Process Payment</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}