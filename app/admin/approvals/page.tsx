// src/app/admin/approvals/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Dialog } from '@/layout/components/Dialog';
import { adminService } from '@/libs/services/admin.service';
import { useToast } from '@/libs/src/contexts/ToastContext';
import { formatCurrency, formatDate } from '@/libs/utils/format';
import { ADMIN_STYLES } from '../_style/adminPageStyles';
import {
  Search, Eye, CheckCircle, XCircle, RefreshCw,
 Award, Send, Medal, Star, Crown, X,
} from 'lucide-react';

interface TaskInvestment {
  id: number; user_email: string; task_title: string;
  tier: 'bronze' | 'silver' | 'gold'; amount: number; reward_amount: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  admin_notes?: string; start_date?: string; end_date?: string;
  created_at: string; days_remaining: number; progress_percentage: number; profit: number;
}

const TIER_ICONS = { bronze: Medal, silver: Star, gold: Crown };

function Spinner() {
  return (
    <div className="adm-loader-page">
      <div className="adm-loader-inner">
        <svg className="adm-spinner" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        <p className="adm-loader-text">Loading approvals…</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = status === 'active' ? 'active' : status === 'pending' ? 'pending' : status === 'completed' ? 'completed' : 'cancelled';
  const labels: Record<string, string> = {
    pending: 'Pending Verification', active: 'Active — Countdown',
    completed: 'Completed', cancelled: 'Cancelled',
  };
  return (
    <span className={`adm-badge ${s}`}>
      <span className="adm-badge-dot" />{labels[status] || status}
    </span>
  );
}

function TierBadge({ tier }: { tier: string }) {
  const Icon = TIER_ICONS[tier as keyof typeof TIER_ICONS] || Medal;
  const cls = tier === 'bronze' ? 'ds-tier-bronze' : tier === 'silver' ? 'ds-tier-silver' : 'ds-tier-gold';
  return (
    <span className={`adm-badge ${cls}`} style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:11 }}>
      <Icon size={9} />{tier.charAt(0).toUpperCase() + tier.slice(1)}
    </span>
  );
}

export default function AdminApprovalsPage() {
  const [investments, setInvestments]         = useState<TaskInvestment[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [searchTerm, setSearchTerm]           = useState('');
  const [statusFilter, setStatusFilter]       = useState('all');
  const [selectedInv, setSelectedInv]         = useState<TaskInvestment | null>(null);
  const [showDetails, setShowDetails]         = useState(false);
  const [showReject, setShowReject]           = useState(false);
  const [rejectReason, setRejectReason]       = useState('');
  const { showToast } = useToast();

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllTaskInvestments();
      setInvestments(Array.isArray(data) ? data : []);
    } catch { showToast('Failed to fetch task investments', 'error'); setInvestments([]); }
    finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleVerify = async (id: number) => {
    try { await adminService.verifyTaskInvestment(id); showToast('Verified! Countdown started.', 'success'); fetch(); }
    catch { showToast('Failed to verify', 'error'); }
  };

  const handleReject = async (id: number) => {
    try { await adminService.rejectTaskInvestment(id, rejectReason); showToast('Rejected', 'success'); setShowReject(false); setRejectReason(''); fetch(); }
    catch { showToast('Failed to reject', 'error'); }
  };

  const handleComplete = async (id: number) => {
    if (!confirm('Mark as completed?')) return;
    try { await adminService.completeTaskInvestment(id); showToast('Marked as completed', 'success'); fetch(); }
    catch { showToast('Failed', 'error'); }
  };

  const filtered = investments.filter(i =>
    (i.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     i.task_title?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || i.status === statusFilter)
  );

  const stats = {
    total:       investments.length,
    pending:     investments.filter(i => i.status === 'pending').length,
    active:      investments.filter(i => i.status === 'active').length,
    completed:   investments.filter(i => i.status === 'completed').length,
    totalAmount: investments.reduce((s, i) => s + (i.amount || 0), 0),
  };

  const detailRows = selectedInv ? [
    ['User',        selectedInv.user_email],
    ['Task',        selectedInv.task_title],
    ['Investment',  formatCurrency(selectedInv.amount)],
    ['Reward',      formatCurrency(selectedInv.reward_amount)],
    ['Profit',      formatCurrency(selectedInv.profit)],
    ['Invested On', formatDate(selectedInv.created_at)],
    ...(selectedInv.start_date ? [['Start Date', formatDate(selectedInv.start_date)]] : []),
    ...(selectedInv.end_date   ? [['End Date',   formatDate(selectedInv.end_date)]]   : []),
  ] : [];

  return (
    <div className="adm adm-root">
      <style>{ADMIN_STYLES}</style>

      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 className="adm-title">Investment Approvals</h1>
          <p className="adm-subtitle">Verify and manage user task investments</p>
        </div>
        <button className="adm-btn-ghost" onClick={fetch}><RefreshCw size={13} /> Refresh</button>
      </div>

      {/* Stats */}
      <div className="adm-stat-grid" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))' }}>
        {[
          { label:'Total',        value: stats.total },
          { label:'Pending',      value: stats.pending },
          { label:'Active',       value: stats.active },
          { label:'Completed',    value: stats.completed },
          { label:'Total Volume', value: formatCurrency(stats.totalAmount) },
        ].map(s => (
          <div className="adm-stat-card" key={s.label}>
            <p className="adm-stat-label">{s.label}</p>
            <p className="adm-stat-value">{s.value}</p>
          </div>
        ))}
      </div>

      {loading ? <Spinner /> : investments.length === 0 ? (
        <div className="adm-table-card" style={{ padding:'48px 24px', textAlign:'center' }}>
          <Award size={28} color="#ddd" style={{ marginBottom:12 }} />
          <p style={{ fontSize:12.5, color:'#bbb', marginBottom:6 }}>No investment requests yet</p>
          <p style={{ fontSize:11.5, color:'#ddd' }}>When users invest in tasks, their requests will appear here.</p>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="adm-toolbar">
            <div className="adm-search-wrap">
              <Search size={13} color="#ccc" />
              <input className="adm-search-input" placeholder="Search by user or task…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <select className="adm-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Table */}
          <div className="adm-table-card">
            <div style={{ overflowX:'auto' }}>
              <table className="adm-table">
                <thead>
                  <tr><th>User</th><th>Task / Tier</th><th>Amount</th><th>Reward</th><th>Status</th><th>Days Left</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr className="adm-empty-row"><td colSpan={7}>No matching results</td></tr>
                  ) : filtered.map(inv => (
                    <tr key={inv.id}>
                      <td style={{ fontSize:12 }}>{inv.user_email}</td>
                      <td>
                        <p style={{ fontWeight:500, fontSize:12.5, color:'#1a1a1a', marginBottom:4 }}>{inv.task_title}</p>
                        <TierBadge tier={inv.tier} />
                      </td>
                      <td style={{ fontWeight:600, color:'#1a1a1a' }}>{formatCurrency(inv.amount)}</td>
                      <td style={{ fontWeight:600, color:'#16a34a' }}>{formatCurrency(inv.reward_amount)}</td>
                      <td><StatusBadge status={inv.status} /></td>
                      <td>
                        {inv.status === 'active' ? (
                          <div>
                            <p style={{ fontSize:12.5, fontWeight:600, color:'#1a1a1a', marginBottom:4 }}>{inv.days_remaining}d</p>
                            <div style={{ width:64, height:3, background:'#f0f0f0', borderRadius:2 }}>
                              <div style={{ height:'100%', background:'linear-gradient(135deg,#f97316,#ea580c)', borderRadius:2, width:`${inv.progress_percentage}%` }} />
                            </div>
                          </div>
                        ) : <span style={{ color:'#ddd', fontSize:12 }}>—</span>}
                      </td>
                      <td>
                        <div style={{ display:'flex', gap:4 }}>
                          <button className="adm-icon-btn" title="View" onClick={() => { setSelectedInv(inv); setShowDetails(true); }}><Eye size={14} /></button>
                          {inv.status === 'pending' && (
                            <>
                              <button className="adm-icon-btn success" title="Verify" onClick={() => handleVerify(inv.id)}><CheckCircle size={14} /></button>
                              <button className="adm-icon-btn danger" title="Reject" onClick={() => { setSelectedInv(inv); setShowReject(true); }}><XCircle size={14} /></button>
                            </>
                          )}
                          {inv.status === 'active' && (
                            <button className="adm-icon-btn" title="Complete" onClick={() => handleComplete(inv.id)}><Award size={14} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Details Modal */}
      <Dialog open={showDetails} onClose={() => setShowDetails(false)}>
        {selectedInv && (
          <div className="adm" style={{ maxWidth:480 }}>
            <style>{ADMIN_STYLES}</style>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:18 }}>
              <div>
                <p className="adm-modal-title">Investment Details</p>
                <p className="adm-modal-sub">{selectedInv.task_title} · <TierBadge tier={selectedInv.tier} /></p>
              </div>
              <button className="adm-icon-btn" onClick={() => setShowDetails(false)}><X size={14} /></button>
            </div>
            <div className="adm-detail-section">
              <div className="adm-detail-grid">
                {detailRows.map(([l, v]) => (
                  <div key={String(l)}><p className="adm-detail-label">{l}</p><p className="adm-detail-value">{v}</p></div>
                ))}
                <div>
                  <p className="adm-detail-label">Tier</p>
                  <div style={{ marginTop:4 }}><TierBadge tier={selectedInv.tier} /></div>
                </div>
                <div>
                  <p className="adm-detail-label">Status</p>
                  <div style={{ marginTop:4 }}><StatusBadge status={selectedInv.status} /></div>
                </div>
              </div>
            </div>
            <div className="adm-modal-actions">
              <button className="adm-btn-ghost" onClick={() => setShowDetails(false)}>Close</button>
              {selectedInv.status === 'pending' && (
                <button className="adm-btn-success" onClick={() => { handleVerify(selectedInv.id); setShowDetails(false); }}>
                  <Send size={13} /> Verify & Start
                </button>
              )}
            </div>
          </div>
        )}
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={showReject} onClose={() => setShowReject(false)}>
        <div className="adm" style={{ maxWidth:420 }}>
          <style>{ADMIN_STYLES}</style>
          <p className="adm-modal-title">Reject Investment</p>
          <p className="adm-modal-sub">Provide a reason for the user</p>
          <textarea className="adm-field-textarea" rows={4} placeholder="Reason for rejection…"
            value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
          <div className="adm-modal-actions">
            <button className="adm-btn-ghost" onClick={() => setShowReject(false)}>Cancel</button>
            <button className="adm-btn-danger" onClick={() => selectedInv && handleReject(selectedInv.id)}>
              <XCircle size={13} /> Confirm Rejection
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}