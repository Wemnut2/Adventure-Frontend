// src/app/admin/transactions/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminService } from '@/libs/services/admin.service';
import { useToast } from '@/libs/src/contexts/ToastContext';
import { formatCurrency, formatDateTime } from '@/libs/utils/format';
import { Transaction } from '@/libs/types';
import { ADMIN_STYLES } from '../_style/adminPageStyles';
import { Search, Download } from 'lucide-react';

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
  const s = status === 'completed' ? 'completed' : status === 'pending' ? 'pending' : 'failed';
  return (
    <span className={`adm-badge ${s}`}>
      <span className="adm-badge-dot" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading]           = useState(true);
  const [searchTerm, setSearchTerm]     = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { showToast } = useToast();

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllTransactions();
      setTransactions(data);
    } catch { showToast('Failed to fetch transactions', 'error'); }
    finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const handleApprove = async (id: number) => {
    try {
      await adminService.approveTransaction(id);
      showToast('Transaction approved', 'success'); fetchTransactions();
    } catch { showToast('Failed to approve', 'error'); }
  };

  const handleExport = () => {
    const csv = transactions.map(t => ({
      Date: formatDateTime(t.created_at), User: t.user_email,
      Type: t.transaction_type, Amount: t.amount,
      Reference: t.reference, Status: t.status,
    }));
    console.log('Export CSV:', csv);
    showToast('Export started', 'info');
  };

  const filtered = transactions.filter(t => {
    const q = searchTerm.toLowerCase();
    return (
      (t.reference?.toLowerCase().includes(q) || t.user_email?.toLowerCase().includes(q)) &&
      (statusFilter === 'all' || t.status === statusFilter)
    );
  });

  const stats = {
    total:       transactions.length,
    pending:     transactions.filter(t => t.status === 'pending').length,
    completed:   transactions.filter(t => t.status === 'completed').length,
    totalVolume: transactions.reduce((s, t) => s + (t.amount || 0), 0),
  };

  return (
    <div className="adm adm-root">
      <style>{ADMIN_STYLES}</style>

      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 className="adm-title">Transactions</h1>
          <p className="adm-subtitle">Review and process all platform transactions</p>
        </div>
        <button className="adm-btn-ghost" onClick={handleExport}><Download size={13} /> Export Report</button>
      </div>

      {/* Stats */}
      <div className="adm-stat-grid" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))' }}>
        {[
          { label:'Total',        value: stats.total,                        sub:'All time' },
          { label:'Pending',      value: stats.pending,                      sub:'Awaiting approval' },
          { label:'Completed',    value: stats.completed,                    sub:'Processed' },
          { label:'Total Volume', value: formatCurrency(stats.totalVolume),  sub:'All transactions' },
        ].map(s => (
          <div className="adm-stat-card" key={s.label}>
            <p className="adm-stat-label">{s.label}</p>
            <p className="adm-stat-value">{s.value}</p>
            <p className="adm-stat-sub">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="adm-toolbar">
        <div className="adm-search-wrap">
          <Search size={13} color="#ccc" />
          <input className="adm-search-input" placeholder="Search reference or email…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <select className="adm-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? <Spinner text="Loading transactions…" /> : (
        <div className="adm-table-card">
          <div style={{ overflowX:'auto' }}>
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Date</th><th>User</th><th>Type</th>
                  <th>Amount</th><th>Reference</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr className="adm-empty-row">
                    <td colSpan={7}>{searchTerm || statusFilter !== 'all' ? 'No matching transactions' : 'No transactions yet'}</td>
                  </tr>
                ) : filtered.map(t => (
                  <tr key={t.id}>
                    <td style={{ whiteSpace:'nowrap', color:'#aaa' }}>{formatDateTime(t.created_at)}</td>
                    <td>{t.user_email}</td>
                    <td style={{ textTransform:'capitalize' }}>{t.transaction_type}</td>
                    <td style={{ fontWeight:600, whiteSpace:'nowrap', color: t.transaction_type === 'withdrawal' ? '#e05252' : '#16a34a' }}>
                      {t.transaction_type === 'withdrawal' ? '−' : '+'}{formatCurrency(t.amount)}
                    </td>
                    <td><code className="adm-mono">{t.reference}</code></td>
                    <td><StatusBadge status={t.status} /></td>
                    <td>
                      {t.status === 'pending' && (
                        <button className="adm-btn-success adm-btn-sm" onClick={() => handleApprove(t.id)}>Approve</button>
                      )}
                      {t.status === 'completed' && (
                        <span style={{ fontSize:11, color:'#16a34a' }}>Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length > 0 && (
            <div className="adm-table-footer">
              <span className="adm-table-count">Showing {filtered.length} of {transactions.length} transactions</span>
              <div style={{ display:'flex', gap:6 }}>
                <button className="adm-btn-ghost adm-btn-sm" disabled>Previous</button>
                <button className="adm-btn-ghost adm-btn-sm" disabled>Next</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}