// src/app/(dashboard)/DashboardContent.tsx
'use client';

import Link from 'next/link';
import {
  TrendingUp, TrendingDown, DollarSign, Wallet,
  ArrowUpRight, Clock, CheckCircle2, Activity,
  Plus, Send, Download, BarChart3, Target,
  Zap, Crown, ExternalLink, MoreHorizontal,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/libs/utils/format';
import { User, Investment, UserTask } from '@/libs/types';
import { useState } from 'react';
import { DASH_STYLES } from '@/app/styles/dashboardStyles';

type Props = { user: User | null; investments: Investment[]; myTasks: UserTask[]; };

export default function DashboardContent({ user, investments, myTasks }: Props) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  const totalInvested   = investments.reduce((s, i) => s + (i.amount || 0), 0);
  const totalProfit     = investments.reduce((s, i) => s + (i.total_profit || 0), 0);
  const activeInv       = investments.filter(i => i.status === 'active').length;
  const completedTasks  = myTasks.filter(t => t.status === 'completed').length;
  const recentTasks     = myTasks.slice(0, 4);
  const recentInvestments = investments.slice(0, 4);

  const stats = [
    { label: 'Total Balance',        value: formatCurrency(totalInvested + totalProfit), icon: Wallet },
    { label: 'Total Invested',       value: formatCurrency(totalInvested),               icon: DollarSign },
    { label: 'Total Profit',         value: formatCurrency(totalProfit),                  icon: TrendingUp },
    { label: 'Active Investments',   value: activeInv,                                    icon: Activity },
    { label: 'Completed Challenges', value: completedTasks,                               icon: CheckCircle2 },
  ];

  const quickActions = [
    { label: 'Start Challenge', sub: 'Browse tasks',       icon: Target,    href: '/task'        },
    { label: 'Invest Now',      sub: 'View plans',         icon: TrendingUp, href: '/investments' },
    { label: 'Withdraw',        sub: 'Transfer funds',     icon: Send,      href: '/withdrawals' },
    { label: 'View History',    sub: 'Full activity log',  icon: Clock,     href: '/history'     },
  ];

  function taskStatusClass(s: string) {
    return s === 'completed' ? 'completed' : s === 'in_progress' ? 'in_progress' : 'pending';
  }

  return (
    <div className="ds ds-page ds-fade-up">
      <style>{DASH_STYLES}</style>

      {/* Welcome */}
      <div className="ds-welcome">
        <div>
          <p className="ds-welcome-greeting">Dashboard</p>
          <p className="ds-welcome-name">Welcome back, {user?.username || 'Challenger'}</p>
          <p className="ds-welcome-sub">Track your investments, complete challenges, grow your portfolio.</p>
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <Link href="/task" className="ds-btn-primary" style={{ textDecoration:'none' }}>
            <Zap size={14} /> Start Challenge
          </Link>
          <Link href="/investments" className="ds-btn-ghost" style={{ textDecoration:'none' }}>
            View Plans <ExternalLink size={12} />
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="ds-stat-grid" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))' }}>
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div className="ds-stat-card" key={s.label}>
              <div className="ds-stat-icon-pill"><Icon size={15} /></div>
              <p className="ds-stat-value">{s.value}</p>
              <p className="ds-stat-label">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:10 }}>
        {quickActions.map(a => {
          const Icon = a.icon;
          return (
            <Link key={a.href} href={a.href} className="ds-quick-action">
              <div className="ds-quick-action-icon"><Icon size={15} /></div>
              <div>
                <p className="ds-quick-action-label">{a.label}</p>
                <p className="ds-quick-action-sub">{a.sub}</p>
              </div>
              <ArrowUpRight size={13} color="#ccc" style={{ marginLeft:'auto', flexShrink:0 }} />
            </Link>
          );
        })}
      </div>

      {/* Two-column activity cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:16 }}>

        {/* Recent Challenges */}
        <div className="ds-card">
          <div className="ds-card-header">
            <p className="ds-card-title">Active Challenges</p>
            <Link href="/task" className="ds-icon-btn" style={{ textDecoration:'none' }}>
              <ExternalLink size={13} />
            </Link>
          </div>
          {recentTasks.length > 0 ? recentTasks.map(task => (
            <div key={task.id} className="ds-list-item">
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div className="ds-list-icon">
                  {task.status === 'completed'  ? <CheckCircle2 size={15} color="#16a34a" /> :
                   task.status === 'in_progress' ? <Activity size={15} color="#0284c7" /> :
                   <Clock size={15} color="#d97706" />}
                </div>
                <div>
                  <p style={{ fontSize:12.5, fontWeight:500, color:'#1a1a1a', marginBottom:3 }}>{task.task_title}</p>
                  <span className={`ds-badge ${taskStatusClass(task.status)}`}>
                    <span className="ds-badge-dot" />{task.status.replace(/_/g,' ')}
                  </span>
                </div>
              </div>
              <div style={{ textAlign:'right', flexShrink:0 }}>
                <p style={{ fontSize:12.5, fontWeight:600, color:'#1a1a1a' }}>+{formatCurrency(task.task_reward || 0)}</p>
                <p style={{ fontSize:11, color:'#bbb' }}>Reward</p>
              </div>
            </div>
          )) : (
            <div className="ds-empty">
              <div className="ds-empty-icon"><Target size={18} /></div>
              <p className="ds-empty-title">No active challenges</p>
              <p className="ds-empty-sub">Start one to earn rewards</p>
              <Link href="/task" className="ds-btn-primary ds-btn-sm" style={{ textDecoration:'none', display:'inline-flex' }}>
                <Plus size={12} /> Browse
              </Link>
            </div>
          )}
        </div>

        {/* Recent Investments */}
        <div className="ds-card">
          <div className="ds-card-header">
            <p className="ds-card-title">Recent Investments</p>
            <Link href="/investments" className="ds-icon-btn" style={{ textDecoration:'none' }}>
              <ExternalLink size={13} />
            </Link>
          </div>
          {recentInvestments.length > 0 ? recentInvestments.map(inv => (
            <div key={inv.id} className="ds-list-item">
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div className="ds-list-icon"><DollarSign size={15} /></div>
                <div>
                  <p style={{ fontSize:12.5, fontWeight:500, color:'#1a1a1a', marginBottom:3 }}>{inv.plan_name}</p>
                  <span className={`ds-badge ${inv.status || 'active'}`}>
                    <span className="ds-badge-dot" />{inv.status || 'Active'}
                  </span>
                </div>
              </div>
              <div style={{ textAlign:'right', flexShrink:0 }}>
                <p style={{ fontSize:12.5, fontWeight:600, color:'#1a1a1a' }}>{formatCurrency(inv.amount || 0)}</p>
                <p style={{ fontSize:11, color:'#16a34a', fontWeight:500 }}>+{formatCurrency(inv.total_profit || 0)}</p>
              </div>
            </div>
          )) : (
            <div className="ds-empty">
              <div className="ds-empty-icon"><Wallet size={18} /></div>
              <p className="ds-empty-title">No investments yet</p>
              <p className="ds-empty-sub">Start growing your money</p>
              <Link href="/investments" className="ds-btn-primary ds-btn-sm" style={{ textDecoration:'none', display:'inline-flex' }}>
                <Plus size={12} /> Invest
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Portfolio Performance placeholder */}
      <div className="ds-card">
        <div className="ds-card-header">
          <p className="ds-card-title" style={{ display:'flex', alignItems:'center', gap:7 }}>
            <BarChart3 size={14} color="#aaa" /> Portfolio Performance
          </p>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <div className="ds-tabs" style={{ padding:'3px' }}>
              {(['week','month','year'] as const).map(r => (
                <button key={r} className={`ds-tab ${timeRange === r ? 'active' : ''}`} onClick={() => setTimeRange(r)}
                  style={{ padding:'5px 10px', fontSize:11 }}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
            <button className="ds-icon-btn"><Download size={13} /></button>
          </div>
        </div>
        <div style={{ height:220, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:8, color:'#ddd' }}>
          <Activity size={32} />
          <p style={{ fontSize:12, color:'#ccc' }}>Chart will appear here</p>
          <p style={{ fontSize:11, color:'#ddd' }}>Connect your analytics source</p>
        </div>
      </div>
    </div>
  );
}