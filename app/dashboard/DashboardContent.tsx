// src/app/(dashboard)/dashboard/DashboardContent.tsx
'use client';

import { useInvestmentStore } from '@/libs/stores/investment.store';
import { useTaskStore } from '@/libs/stores/task.store';
import { formatCurrency } from '@/libs/utils/format';
import Link from 'next/link';
import { DollarSign, TrendingUp, CheckCircle, Clock, ArrowRight, Send } from 'lucide-react';
import { DASH_STYLES } from '@/app/styles/dashboardStyles';
import { User } from '@/libs/types';  // Import the User type

interface DashboardContentProps {
  user: User | null;  // Use User type instead of any
}

export default function DashboardContent({ user }: DashboardContentProps) {
  const { userInvestments } = useInvestmentStore();
  const { myTasks }         = useTaskStore();

  const investments = Array.isArray(userInvestments) ? userInvestments : [];
  const tasks       = Array.isArray(myTasks)         ? myTasks         : [];

  const totalInvested    = investments.reduce((s, i) => s + (i.amount       || 0), 0);
  const totalProfit      = investments.reduce((s, i) => s + (i.total_profit  || 0), 0);
  const activeInvestments = investments.filter(i => i.status === 'active').length;
  const completedTasks   = tasks.filter(t => t.status === 'completed').length;

const stats = [
  { label: 'Total Invested',        value: formatCurrency(totalInvested), icon: DollarSign  },
  { label: 'Total Profit',          value: formatCurrency(totalProfit),   icon: TrendingUp  },
  { label: 'Active Investments',    value: activeInvestments,             icon: CheckCircle }, // Fixed here
  { label: 'Completed Tasks',       value: completedTasks,                icon: Clock       },
];

  return (
    <div className="ds ds-page ds-fade-up">
      <style>{DASH_STYLES}</style>

      {/* Welcome */}
      <div className="ds-welcome">
        <div>
          <p className="ds-welcome-greeting">Dashboard</p>
          <p className="ds-welcome-name">Welcome back, {user?.username || 'User'}</p>
          <p className="ds-welcome-sub">Track your investments and grow your wealth.</p>
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <Link href="/dashboard/investments" className="ds-btn-primary" style={{ textDecoration:'none' }}>
            Invest Now <ArrowRight size={13} />
          </Link>
          <Link href="/dashboard/withdrawals" className="ds-btn-ghost" style={{ textDecoration:'none' }}>
            <Send size={12} /> Withdraw
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="ds-stat-grid" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))' }}>
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div className="ds-stat-card" key={s.label}>
              <div className="ds-stat-icon-pill"><Icon size={14} /></div>
              <p className="ds-stat-value">{s.value}</p>
              <p className="ds-stat-label">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Two-column */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:16 }}>

        {/* Quick Actions */}
        <div className="ds-card">
          <div className="ds-card-header"><p className="ds-card-title">Quick Actions</p></div>
          <div className="ds-card-body" style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <Link href="/dashboard/investments" className="ds-btn-primary" style={{ textDecoration:'none', width:'100%' }}>
              Invest Now <ArrowRight size={13} />
            </Link>
            <Link href="/dashboard/withdrawals" className="ds-btn-ghost" style={{ textDecoration:'none', width:'100%' }}>
              Request Withdrawal
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="ds-card">
          <div className="ds-card-header"><p className="ds-card-title">Recent Activity</p></div>
          {investments.length > 0 ? (
            investments.slice(0, 4).map(inv => (
              <div key={inv.id} className="ds-list-item">
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div className="ds-list-icon"><DollarSign size={14} /></div>
                  <div>
                    <p style={{ fontSize:12.5, fontWeight:500, color:'#1a1a1a' }}>{inv.plan_name}</p>
                    <p style={{ fontSize:11.5, color:'#bbb' }}>{new Date(inv.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <p style={{ fontSize:13, fontWeight:600, color:'#16a34a' }}>{formatCurrency(inv.amount)}</p>
              </div>
            ))
          ) : (
            <div className="ds-empty">
              <div className="ds-empty-icon"><DollarSign size={18} /></div>
              <p className="ds-empty-title">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}