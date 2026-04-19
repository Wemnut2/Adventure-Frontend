// src/app/admin/user-investments/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Dialog } from '@/layout/components/Dialog';
import { adminService } from '@/libs/services/admin.service';
import { useToast } from '@/libs/src/contexts/ToastContext';
import { formatCurrency, formatDate } from '@/libs/utils/format';
import { ADMIN_STYLES } from '../_style/adminPageStyles';
import { Search, Eye, CheckCircle, XCircle, Award, RefreshCw, Send, X, Plus } from 'lucide-react';

interface Investment {
  id: number;
  user_email: string;
  plan_name: string;
  amount: number;
  expected_return_amount: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  days_remaining: number;
  progress_percentage: number;
  created_at: string;
  start_date?: string;
  end_date?: string;
}

interface TaskFormData {
  title: string;
  description: string;
  bronze_price: string;
  silver_price: string;
  gold_price: string;
  bronze_reward: string;
  silver_reward: string;
  gold_reward: string;
  requires_subscription: boolean;
  is_active: boolean;
}

const EMPTY_TASK_FORM: TaskFormData = {
  title: '',
  description: '',
  bronze_price: '',
  silver_price: '',
  gold_price: '',
  bronze_reward: '',
  silver_reward: '',
  gold_reward: '',
  requires_subscription: false,
  is_active: true,
};

function Spinner() {
  return (
    <div className="adm-loader-page">
      <div className="adm-loader-inner">
        <svg className="adm-spinner" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        <p className="adm-loader-text">Loading investments…</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cls = status === 'active' ? 'active' : status === 'pending' ? 'pending' : status === 'completed' ? 'completed' : 'cancelled';
  const labels: Record<string,string> = { pending:'Pending Verification', active:'Active', completed:'Completed', cancelled:'Cancelled' };
  return <span className={`adm-badge ${cls}`}><span className="adm-badge-dot" />{labels[status] || status}</span>;
}

export default function AdminUserInvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Investment['status'] | 'all'>('all');
  const [selectedInv, setSelectedInv] = useState<Investment | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  
  // Task creation modal states
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState<TaskFormData>(EMPTY_TASK_FORM);
  const [creatingTask, setCreatingTask] = useState(false);
  
  const { showToast } = useToast();

  const fetch = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await adminService.getAllUserInvestments();
      setInvestments(Array.isArray(data) ? data : []);
    } catch {
      showToast('Failed to fetch investments', 'error');
      setInvestments([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { 
    fetch(); 
  }, [fetch]);

  const handleVerify = async (id: number) => {
    try { await adminService.verifyUserInvestment(id); showToast('Verified! Countdown started.', 'success'); fetch(); }
    catch { showToast('Failed to verify', 'error'); }
  };

  const handleReject = async (id: number) => {
    try { await adminService.rejectUserInvestment(id, rejectReason); showToast('Rejected', 'success'); setShowReject(false); setRejectReason(''); fetch(); }
    catch { showToast('Failed to reject', 'error'); }
  };

  const handleComplete = async (id: number) => {
    if (!confirm('Mark as completed?')) return;
    try { await adminService.completeUserInvestment(id); showToast('Marked as completed', 'success'); fetch(); }
    catch { showToast('Failed', 'error'); }
  };

  // Task creation handlers
  const handleTaskFormChange = (field: keyof TaskFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setTaskForm(prev => ({ ...prev, [field]: value }));
  };

  // Update the handleCreateTask function to convert string values to numbers
const handleCreateTask = async () => {
  if (!taskForm.title.trim()) {
    showToast('Task title is required', 'error');
    return;
  }
  if (!taskForm.description.trim()) {
    showToast('Description is required', 'error');
    return;
  }

  setCreatingTask(true);
  try {
    await adminService.createTask({
      title: taskForm.title,
      description: taskForm.description,
      // Convert string to number using parseFloat
      bronze_price: parseFloat(taskForm.bronze_price) || 0,
      silver_price: parseFloat(taskForm.silver_price) || 0,
      gold_price: parseFloat(taskForm.gold_price) || 0,
      bronze_reward: parseFloat(taskForm.bronze_reward) || 0,
      silver_reward: parseFloat(taskForm.silver_reward) || 0,
      gold_reward: parseFloat(taskForm.gold_reward) || 0,
      requires_subscription: taskForm.requires_subscription,
      is_active: taskForm.is_active,
    });
    showToast('Task created successfully!', 'success');
    setShowTaskModal(false);
    setTaskForm(EMPTY_TASK_FORM);
  } catch {
    showToast('Failed to create task', 'error');
  } finally {
    setCreatingTask(false);
  }
};

  const filtered = investments.filter(i =>
    (i.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     i.plan_name?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || i.status === statusFilter)
  );

  const stats = {
    total:       investments.length,
    pending:     investments.filter(i => i.status === 'pending').length,
    active:      investments.filter(i => i.status === 'active').length,
    completed:   investments.filter(i => i.status === 'completed').length,
    totalAmount: investments.reduce((s: number, i: Investment) => s + (i.amount || 0), 0),
  };

  return (
    <div className="adm adm-root">
      <style>{ADMIN_STYLES}</style>

      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 className="adm-title">User Investments</h1>
          <p className="adm-subtitle">Verify and manage user investment requests</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="adm-btn-primary" onClick={() => setShowTaskModal(true)}>
            <Plus size={13} /> Create Task
          </button>
          <button className="adm-btn-ghost" onClick={fetch}>
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
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
          <p style={{ fontSize:11.5, color:'#ddd' }}>When users invest, their requests will appear here for verification.</p>
        </div>
      ) : (
        <>
          <div className="adm-toolbar">
            <div className="adm-search-wrap">
              <Search size={13} color="#ccc" />
              <input className="adm-search-input" placeholder="Search by user or plan…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <select className="adm-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value as Investment['status'] | 'all')}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="adm-table-card">
            <div style={{ overflowX:'auto' }}>
              <table className="adm-table">
                <thead>
                  <tr><th>User</th><th>Plan</th><th>Amount</th><th>Expected Return</th><th>Status</th><th>Days Left</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr className="adm-empty-row"><td colSpan={7}>No matching results</td></tr>
                  ) : filtered.map((inv: Investment) => (
                    <tr key={inv.id}>
                      <td style={{ fontSize:12 }}>{inv.user_email}</td>
                      <td style={{ fontWeight:500 }}>{inv.plan_name}</td>
                      <td style={{ fontWeight:600 }}>{formatCurrency(inv.amount)}</td>
                      <td style={{ fontWeight:600, color:'#16a34a' }}>{formatCurrency(inv.expected_return_amount)}</td>
                      <td><StatusBadge status={inv.status} /></td>
                      <td>
                        {inv.status === 'active' ? (
                          <div>
                            <p style={{ fontSize:12.5, fontWeight:600, marginBottom:4 }}>{inv.days_remaining}d</p>
                            <div style={{ width:64, height:3, background:'#f0f0f0', borderRadius:2 }}>
                              <div style={{ height:'100%', background:'linear-gradient(135deg,#f97316,#ea580c)', borderRadius:2, width:`${inv.progress_percentage}%` }} />
                            </div>
                          </div>
                        ) : <span style={{ color:'#ddd', fontSize:12 }}>—</span>}
                      </td>
                      <td>
                        <div style={{ display:'flex', gap:4 }}>
                          <button className="adm-icon-btn" onClick={() => { setSelectedInv(inv); setShowDetails(true); }}><Eye size={14} /></button>
                          {inv.status === 'pending' && (
                            <>
                              <button className="adm-icon-btn success" onClick={() => handleVerify(inv.id)}><CheckCircle size={14} /></button>
                              <button className="adm-icon-btn danger" onClick={() => { setSelectedInv(inv); setShowReject(true); }}><XCircle size={14} /></button>
                            </>
                          )}
                          {inv.status === 'active' && (
                            <button className="adm-icon-btn" onClick={() => handleComplete(inv.id)}><Award size={14} /></button>
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
                <p className="adm-modal-sub">{selectedInv.plan_name}</p>
              </div>
              <button className="adm-icon-btn" onClick={() => setShowDetails(false)}><X size={14} /></button>
            </div>
            <div className="adm-detail-section">
              <div className="adm-detail-grid">
                {[
                  ['User',            selectedInv.user_email],
                  ['Plan',            selectedInv.plan_name],
                  ['Amount',          formatCurrency(selectedInv.amount)],
                  ['Expected Return', formatCurrency(selectedInv.expected_return_amount)],
                  ['Invested On',     formatDate(selectedInv.created_at)],
                  ...(selectedInv.start_date ? [['Start Date', formatDate(selectedInv.start_date)]] : []),
                  ...(selectedInv.end_date   ? [['End Date',   formatDate(selectedInv.end_date)]]   : []),
                ].map(([l,v]) => (
                  <div key={String(l)}><p className="adm-detail-label">{l}</p><p className="adm-detail-value">{v}</p></div>
                ))}
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

      {/* Create Task Modal */}
      <Dialog open={showTaskModal} onClose={() => { setShowTaskModal(false); setTaskForm(EMPTY_TASK_FORM); }}>
        <div className="adm" style={{ maxWidth: 560, maxHeight: '85vh', overflowY: 'auto' }}>
          <style>{ADMIN_STYLES}</style>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <p className="adm-modal-title">Create New Task</p>
              <p className="adm-modal-sub">Set up a task with tier pricing</p>
            </div>
            <button className="adm-icon-btn" onClick={() => { setShowTaskModal(false); setTaskForm(EMPTY_TASK_FORM); }}>
              <X size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="adm-field-wrap">
              <label className="adm-field-label">Task Title *</label>
              <input 
                className="adm-field-input" 
                value={taskForm.title} 
                onChange={handleTaskFormChange('title')} 
                placeholder="Enter task title" 
              />
            </div>

            <div className="adm-field-wrap">
              <label className="adm-field-label">Description *</label>
              <textarea 
                className="adm-field-textarea" 
                rows={3} 
                value={taskForm.description} 
                onChange={handleTaskFormChange('description')} 
                placeholder="Describe the task..." 
              />
            </div>

            <div className="adm-divider" />

            {/* Bronze Tier */}
            <div>
              <p style={{ fontSize: 11.5, fontWeight: 600, color: '#555', marginBottom: 10 }}>
                Bronze Package
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="adm-field-wrap">
                  <label className="adm-field-label">Price (USD)</label>
                  <input 
                    className="adm-field-input" 
                    type="number" 
                    step="0.01" 
                    value={taskForm.bronze_price} 
                    onChange={handleTaskFormChange('bronze_price')} 
                    placeholder="0.00" 
                  />
                </div>
                <div className="adm-field-wrap">
                  <label className="adm-field-label">Reward (USD)</label>
                  <input 
                    className="adm-field-input" 
                    type="number" 
                    step="0.01" 
                    value={taskForm.bronze_reward} 
                    onChange={handleTaskFormChange('bronze_reward')} 
                    placeholder="0.00" 
                  />
                </div>
              </div>
            </div>

            {/* Silver Tier */}
            <div>
              <p style={{ fontSize: 11.5, fontWeight: 600, color: '#555', marginBottom: 10 }}>
                Silver Package
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="adm-field-wrap">
                  <label className="adm-field-label">Price (USD)</label>
                  <input 
                    className="adm-field-input" 
                    type="number" 
                    step="0.01" 
                    value={taskForm.silver_price} 
                    onChange={handleTaskFormChange('silver_price')} 
                    placeholder="0.00" 
                  />
                </div>
                <div className="adm-field-wrap">
                  <label className="adm-field-label">Reward (USD)</label>
                  <input 
                    className="adm-field-input" 
                    type="number" 
                    step="0.01" 
                    value={taskForm.silver_reward} 
                    onChange={handleTaskFormChange('silver_reward')} 
                    placeholder="0.00" 
                  />
                </div>
              </div>
            </div>

            {/* Gold Tier */}
            <div>
              <p style={{ fontSize: 11.5, fontWeight: 600, color: '#555', marginBottom: 10 }}>
                Gold Package
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="adm-field-wrap">
                  <label className="adm-field-label">Price (USD)</label>
                  <input 
                    className="adm-field-input" 
                    type="number" 
                    step="0.01" 
                    value={taskForm.gold_price} 
                    onChange={handleTaskFormChange('gold_price')} 
                    placeholder="0.00" 
                  />
                </div>
                <div className="adm-field-wrap">
                  <label className="adm-field-label">Reward (USD)</label>
                  <input 
                    className="adm-field-input" 
                    type="number" 
                    step="0.01" 
                    value={taskForm.gold_reward} 
                    onChange={handleTaskFormChange('gold_reward')} 
                    placeholder="0.00" 
                  />
                </div>
              </div>
            </div>

            <div className="adm-divider" />

            <label className="adm-check-row">
              <input 
                type="checkbox" 
                checked={taskForm.requires_subscription} 
                onChange={handleTaskFormChange('requires_subscription')} 
              />
              Requires Premium Subscription
            </label>

            <label className="adm-check-row">
              <input 
                type="checkbox" 
                checked={taskForm.is_active} 
                onChange={handleTaskFormChange('is_active')} 
              />
              Active (visible to users)
            </label>
          </div>

          <div className="adm-modal-actions">
            <button 
              className="adm-btn-ghost" 
              onClick={() => { setShowTaskModal(false); setTaskForm(EMPTY_TASK_FORM); }}
            >
              Cancel
            </button>
            <button 
              className="adm-btn-primary" 
              onClick={handleCreateTask} 
              disabled={creatingTask}
            >
              {creatingTask ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}