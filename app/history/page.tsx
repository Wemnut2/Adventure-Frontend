// src/app/(dashboard)/history/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/layout/sections/dashboard/MainLayout';
import { useInvestmentStore } from '@/libs/stores/investment.store';
import { useTaskStore } from '@/libs/stores/task.store';
import { useAuthStore } from '@/libs/stores/auth.store';
import { formatCurrency, formatDateTime } from '@/libs/utils/format';
import { Search, Download, Clock, Award, Medal, Trophy } from 'lucide-react';
import { DASH_STYLES } from '@/app/styles/dashboardStyles';

/* ─── Helpers ── */
function StatusBadge({ status }: { status: string }) {
  const s = status.replace(/_/g, '');
  const cls = ['completed','active'].includes(status) ? 'completed'
    : ['pending','pending_payment','pending_review'].includes(status) ? 'pending'
    : status === 'in_progress' ? 'in_progress'
    : 'failed';
  return (
    <span className={`ds-badge ${cls}`}>
      <span className="ds-badge-dot" />
      {status.replace(/_/g, ' ')}
    </span>
  );
}

function TierBadge({ tier }: { tier: string }) {
  const Icon = tier === 'bronze' ? Award : tier === 'silver' ? Medal : Trophy;
  const cls  = tier === 'bronze' ? 'ds-tier-bronze' : tier === 'silver' ? 'ds-tier-silver' : 'ds-tier-gold';
  return (
    <span className={`ds-badge ${cls}`} style={{ display:'inline-flex', alignItems:'center', gap:4 }}>
      <Icon size={9} />{tier}
    </span>
  );
}

function Empty({ message }: { message: string }) {
  return (
    <div className="ds-empty">
      <div className="ds-empty-icon"><Clock size={18} /></div>
      <p className="ds-empty-title">{message}</p>
    </div>
  );
}

function exportCSV(data: any[], name: string) {
  if (!data.length) { alert('No data to export'); return; }
  const headers = Object.keys(data[0]);
  const csv = [headers.join(','), ...data.map(r => headers.map(h => JSON.stringify(r[h] ?? '')).join(','))].join('\n');
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv], { type:'text/csv' })), download:`${name}_${new Date().toISOString().slice(0,10)}.csv` });
  a.click();
}

type Tab = 'investments' | 'transactions' | 'tasks' | 'activities';

/* ─── Page ── */
export default function HistoryPage() {
  const { investments, fetchInvestments, transactions, fetchTransactions, isLoading: invLoading } = useInvestmentStore();
  const { myTasks, fetchMyTasks, isLoading: tasksLoading }       = useTaskStore();
  const { activities, fetchActivities, isLoading: activitiesLoading } = useAuthStore();

  const [activeTab, setActiveTab] = useState<Tab>('investments');
  const [search, setSearch]       = useState('');

  useEffect(() => {
    fetchInvestments(); fetchTransactions(); fetchMyTasks(); fetchActivities();
  }, []);

  const q = search.toLowerCase();
  const investmentsArr  = (Array.isArray(investments)  ? investments  : []).filter(i => i?.plan_name?.toLowerCase().includes(q) || i?.status?.toLowerCase().includes(q));
  const transactionsArr = (Array.isArray(transactions) ? transactions : []).filter(t => t?.description?.toLowerCase().includes(q) || t?.reference?.toLowerCase().includes(q) || t?.transaction_type?.toLowerCase().includes(q));
  const tasksArr        = (Array.isArray(myTasks)      ? myTasks      : []).filter(t => t?.task_title?.toLowerCase().includes(q) || t?.status?.toLowerCase().includes(q));
  const activitiesArr   = (Array.isArray(activities)   ? activities   : []).filter(a => a?.action?.toLowerCase().includes(q) || a?.details?.toLowerCase().includes(q));

  const isLoading = invLoading || tasksLoading || activitiesLoading;

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'investments',  label: 'Investments',  count: investmentsArr.length  },
    { key: 'transactions', label: 'Transactions', count: transactionsArr.length },
    { key: 'tasks',        label: 'Tasks',        count: tasksArr.length        },
    { key: 'activities',   label: 'Activities',   count: activitiesArr.length   },
  ];

  if (isLoading) {
    return (
      <MainLayout>
        <div className="ds ds-spinner-page">
          <style>{DASH_STYLES}</style>
          <svg className="ds-spinner" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        </div>
      </MainLayout>
    );
  }

  function TableCard({ children, onExport }: { children: React.ReactNode; onExport: () => void }) {
    return (
      <div className="ds-table-card">
        <div style={{ overflowX:'auto' }}>{children}</div>
        <div className="ds-table-footer">
          <button className="ds-btn-ghost ds-btn-sm" style={{ display:'flex', alignItems:'center', gap:6 }} onClick={onExport}>
            <Download size={12} /> Export CSV
          </button>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="ds ds-page ds-fade-up">
        <style>{DASH_STYLES}</style>

        <div style={{ display:'flex', flexWrap:'wrap', alignItems:'flex-end', justifyContent:'space-between', gap:12 }}>
          <div>
            <h1 className="ds-page-title">History</h1>
            <p className="ds-page-subtitle">Your complete activity and transaction history</p>
          </div>
          <div className="ds-search-wrap">
            <Search size={13} color="#ccc" />
            <input className="ds-search-input" placeholder="Search history…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="ds-tabs" style={{ flexWrap:'wrap' }}>
          {tabs.map(t => (
            <button key={t.key} className={`ds-tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        {/* Investments */}
        {activeTab === 'investments' && (
          investmentsArr.length === 0 ? <Empty message="No investment history found" /> : (
            <TableCard onExport={() => exportCSV(investmentsArr, 'investments')}>
              <table className="ds-table">
                <thead><tr><th>Date</th><th>Plan</th><th>Amount</th><th>Profit</th><th>Status</th></tr></thead>
                <tbody>
                  {investmentsArr.map(inv => (
                    <tr key={inv.id}>
                      <td style={{ color:'#aaa', whiteSpace:'nowrap' }}>{formatDateTime(inv.created_at)}</td>
                      <td style={{ fontWeight:500 }}>{inv.plan_name || '—'}</td>
                      <td style={{ fontWeight:600 }}>{formatCurrency(inv.amount || 0)}</td>
                      <td style={{ color:'#16a34a', fontWeight:500 }}>+{formatCurrency(inv.total_profit || 0)}</td>
                      <td><StatusBadge status={inv.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableCard>
          )
        )}

        {/* Transactions */}
        {activeTab === 'transactions' && (
          transactionsArr.length === 0 ? <Empty message="No transaction history found" /> : (
            <TableCard onExport={() => exportCSV(transactionsArr, 'transactions')}>
              <table className="ds-table">
                <thead><tr><th>Date</th><th>Type</th><th>Amount</th><th>Reference</th><th>Status</th></tr></thead>
                <tbody>
                  {transactionsArr.map(tx => (
                    <tr key={tx.id}>
                      <td style={{ color:'#aaa', whiteSpace:'nowrap' }}>{formatDateTime(tx.created_at)}</td>
                      <td style={{ textTransform:'capitalize' }}>{tx.transaction_type || '—'}</td>
                      <td style={{ fontWeight:600, color: tx.transaction_type === 'withdrawal' ? '#e05252' : '#16a34a' }}>
                        {tx.transaction_type === 'withdrawal' ? '−' : '+'}{formatCurrency(tx.amount || 0)}
                      </td>
                      <td><code style={{ fontSize:11, fontFamily:'monospace', color:'#aaa' }}>{tx.reference || '—'}</code></td>
                      <td><StatusBadge status={tx.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableCard>
          )
        )}

        {/* Tasks */}
        {activeTab === 'tasks' && (
          tasksArr.length === 0 ? <Empty message="No task history found" /> : (
            <TableCard onExport={() => exportCSV(tasksArr, 'tasks')}>
              <table className="ds-table">
                <thead><tr><th>Started</th><th>Task</th><th>Tier</th><th>Reward</th><th>Completed</th><th>Status</th></tr></thead>
                <tbody>
                  {tasksArr.map(task => (
                    <tr key={task.id}>
                      <td style={{ color:'#aaa', whiteSpace:'nowrap' }}>{formatDateTime(task.started_at)}</td>
                      <td style={{ fontWeight:500 }}>{task.task_title || '—'}</td>
                      <td>{task.tier ? <TierBadge tier={task.tier} /> : '—'}</td>
                      <td style={{ fontWeight:600, color:'#16a34a' }}>+{formatCurrency(Number(task.reward_amount) || 0)}</td>
                      <td style={{ color:'#aaa' }}>{task.completed_at ? formatDateTime(task.completed_at) : '—'}</td>
                      <td><StatusBadge status={task.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableCard>
          )
        )}

        {/* Activities */}
        {activeTab === 'activities' && (
          activitiesArr.length === 0 ? <Empty message="No activity history found" /> : (
            <div className="ds-table-card">
              {activitiesArr.map(a => (
                <div key={a.id} className="ds-list-item">
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:12.5, fontWeight:500, color:'#1a1a1a', marginBottom:2 }}>{a.action || '—'}</p>
                    {a.details    && <p style={{ fontSize:11.5, color:'#aaa' }}>{a.details}</p>}
                    {a.ip_address && <p style={{ fontSize:11, color:'#ddd', marginTop:2 }}>IP: {a.ip_address}</p>}
                  </div>
                  <p style={{ fontSize:11, color:'#ccc', flexShrink:0, marginLeft:12 }}>{formatDateTime(a.created_at)}</p>
                </div>
              ))}
              <div className="ds-table-footer">
                <button className="ds-btn-ghost ds-btn-sm" style={{ display:'flex', alignItems:'center', gap:6 }} onClick={() => exportCSV(activitiesArr, 'activities')}>
                  <Download size={12} /> Export CSV
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </MainLayout>
  );
}