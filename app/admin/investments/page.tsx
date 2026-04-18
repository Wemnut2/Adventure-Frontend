// src/app/admin/investments/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminService } from '@/libs/services/admin.service';
import { useToast } from '@/libs/src/contexts/ToastContext';
import { formatCurrency, formatDate } from '@/libs/utils/format';
import { Investment } from '@/libs/types';
import { ADMIN_STYLES } from '../_style/adminPageStyles';
import { Search, RefreshCw, AlertCircle } from 'lucide-react';

function Spinner({ text = 'Loading…' }: { text?: string }) {
  return (
    <div className="adm-loader-page">
      <div className="adm-loader-inner">
        <svg className="adm-spinner" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        <p className="adm-loader-text">{text}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = status === 'active' ? 'active' : status === 'pending' ? 'pending' : status === 'completed' ? 'completed' : 'cancelled';
  return (
    <span className={`adm-badge ${s}`}>
      <span className="adm-badge-dot" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function AdminInvestmentsPage() {
  const [investments, setInvestments]   = useState<Investment[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [searchTerm, setSearchTerm]     = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { showToast } = useToast();

  const fetchInvestments = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await adminService.getAllInvestments();
      setInvestments(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch investments';
      setError(msg); showToast(msg, 'error'); setInvestments([]);
    } finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { fetchInvestments(); }, [fetchInvestments]);

  const handleApprove = async (id: number) => {
    try {
      await adminService.approveInvestment(id);
      showToast('Investment approved', 'success'); fetchInvestments();
    } catch { showToast('Failed to approve', 'error'); }
  };

  const filtered = investments.filter(inv => {
    const q = searchTerm.toLowerCase();
    return (
      (inv.user_email?.toLowerCase().includes(q) || inv.plan_name?.toLowerCase().includes(q)) &&
      (statusFilter === 'all' || inv.status === statusFilter)
    );
  });

  const stats = {
    total:       investments.length,
    active:      investments.filter(i => i.status === 'active').length,
    pending:     investments.filter(i => i.status === 'pending').length,
    completed:   investments.filter(i => i.status === 'completed').length,
    totalAmount: investments.reduce((s, i) => s + (i.amount || 0), 0),
  };

  return (
    <div className="adm adm-root">
      <style>{ADMIN_STYLES}</style>

      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 className="adm-title">Investments</h1>
          <p className="adm-subtitle">Review and manage all user investments</p>
        </div>
        <button className="adm-btn-ghost" onClick={fetchInvestments}><RefreshCw size={13} /> Refresh</button>
      </div>

      {/* Stats */}
      <div className="adm-stat-grid" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))' }}>
        {[
          { label:'Total',        value: stats.total },
          { label:'Active',       value: stats.active },
          { label:'Pending',      value: stats.pending },
          { label:'Completed',    value: stats.completed },
          { label:'Total Amount', value: formatCurrency(stats.totalAmount) },
        ].map(s => (
          <div className="adm-stat-card" key={s.label}>
            <p className="adm-stat-label">{s.label}</p>
            <p className="adm-stat-value">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="adm-toolbar">
        <div className="adm-search-wrap">
          <Search size={13} color="#ccc" />
          <input className="adm-search-input" placeholder="Search user or plan…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <select className="adm-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? <Spinner text="Loading investments…" /> : error ? (
        <div className="adm-loader-page">
          <div className="adm-loader-inner">
            <AlertCircle size={26} color="#e05252" />
            <p className="adm-loader-text" style={{ color:'#e05252' }}>{error}</p>
            <button className="adm-btn-primary adm-btn-sm" style={{ marginTop:12 }} onClick={fetchInvestments}>Try Again</button>
          </div>
        </div>
      ) : (
        <div className="adm-table-card">
          <div style={{ overflowX:'auto' }}>
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Date</th><th>User</th><th>Plan</th>
                  <th>Amount</th><th>Profit</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr className="adm-empty-row">
                    <td colSpan={7}>{searchTerm || statusFilter !== 'all' ? 'No matching investments' : 'No investments yet'}</td>
                  </tr>
                ) : filtered.map(inv => (
                  <tr key={inv.id}>
                    <td style={{ color:'#aaa', whiteSpace:'nowrap' }}>{formatDate(inv.created_at)}</td>
                    <td>{inv.user_email}</td>
                    <td style={{ fontWeight:500 }}>{inv.plan_name}</td>
                    <td style={{ fontWeight:600 }}>{formatCurrency(inv.amount)}</td>
                    <td style={{ color:'#16a34a', fontWeight:500 }}>{formatCurrency(inv.total_profit)}</td>
                    <td><StatusBadge status={inv.status} /></td>
                    <td>
                      {inv.status === 'pending' && (
                        <button className="adm-btn-success adm-btn-sm" onClick={() => handleApprove(inv.id)}>Approve</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}