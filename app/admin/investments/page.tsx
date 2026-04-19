// src/app/admin/investment-plans/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Dialog } from '@/layout/components/Dialog';
import { adminService } from '@/libs/services/admin.service';
import { useToast } from '@/libs/src/contexts/ToastContext';
import { formatCurrency } from '@/libs/utils/format';
import { ADMIN_STYLES } from '../_style/adminPageStyles';
import { Plus, Edit, Trash2, RefreshCw, TrendingUp, X } from 'lucide-react';

interface InvestmentPlan {
  id: number; name: string; description: string;
  min_amount: number; max_amount: number | null;
  expected_return: number; duration_days: number;
  is_active: boolean; created_at: string;
}

const EMPTY_FORM = {
  name: '', description: '', min_amount: '', max_amount: '',
  expected_return: '', duration_days: '', is_active: true,
};

function Spinner() {
  return (
    <div className="adm-loader-page">
      <div className="adm-loader-inner">
        <svg className="adm-spinner" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        <p className="adm-loader-text">Loading plans…</p>
      </div>
    </div>
  );
}

export default function AdminInvestmentPlansPage() {
  const [plans, setPlans]               = useState<InvestmentPlan[]>([]);
  const [loading, setLoading]           = useState(true);
  const [showModal, setShowModal]       = useState(false);
  const [editingPlan, setEditingPlan]   = useState<InvestmentPlan | null>(null);
  const [form, setForm]                 = useState(EMPTY_FORM);
  const { showToast } = useToast();

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllInvestmentPlans();
      setPlans(Array.isArray(data) ? data : []);
    } catch { showToast('Failed to fetch investment plans', 'error'); }
    finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { fetch(); }, [fetch]);

  const resetForm = () => { setForm(EMPTY_FORM); setEditingPlan(null); };

  const handleSave = async () => {
    if (!form.name || !form.description || !form.min_amount || !form.expected_return || !form.duration_days) {
      showToast('Please fill all required fields', 'error'); return;
    }
    const payload = {
      name: form.name, description: form.description,
      min_amount: parseFloat(form.min_amount),
      max_amount: form.max_amount ? parseFloat(form.max_amount) : null,
      expected_return: parseFloat(form.expected_return),
      duration_days: parseInt(form.duration_days),
      is_active: form.is_active,
    };
    try {
      if (editingPlan) { await adminService.updateInvestmentPlan(editingPlan.id, payload); showToast('Plan updated', 'success'); }
      else             { await adminService.createInvestmentPlan(payload);                  showToast('Plan created', 'success'); }
      setShowModal(false); resetForm(); fetch();
    } catch { showToast('Failed to save plan', 'error'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this investment plan?')) return;
    try { await adminService.deleteInvestmentPlan(id); showToast('Plan deleted', 'success'); fetch(); }
    catch { showToast('Failed to delete', 'error'); }
  };

  const openEdit = (plan: InvestmentPlan) => {
    setEditingPlan(plan);
    setForm({
      name: plan.name, description: plan.description,
      min_amount: plan.min_amount.toString(),
      max_amount: plan.max_amount?.toString() || '',
      expected_return: plan.expected_return.toString(),
      duration_days: plan.duration_days.toString(),
      is_active: plan.is_active,
    });
    setShowModal(true);
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  return (
    <div className="adm adm-root">
      <style>{ADMIN_STYLES}</style>

      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 className="adm-title">Investment Plans</h1>
          <p className="adm-subtitle">Create and manage investment plans for users · {plans.length} total</p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button className="adm-btn-ghost" onClick={fetch}><RefreshCw size={13} /> Refresh</button>
          <button className="adm-btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            <Plus size={13} /> Create Plan
          </button>
        </div>
      </div>

      {loading ? <Spinner /> : plans.length === 0 ? (
        <div className="adm-table-card" style={{ padding:'48px 24px', textAlign:'center' }}>
          <TrendingUp size={28} color="#ddd" style={{ marginBottom:12 }} />
          <p style={{ fontSize:12.5, color:'#bbb', marginBottom:14 }}>No investment plans yet</p>
          <button className="adm-btn-primary adm-btn-sm" onClick={() => { resetForm(); setShowModal(true); }}>
            <Plus size={12} /> Create Your First Plan
          </button>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:12 }}>
          {plans.map(plan => (
            <div key={plan.id} className="adm-table-card" style={{ padding:'18px' }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:10 }}>
                <div>
                  <p style={{ fontSize:14, fontWeight:600, color:'#1a1a1a', marginBottom:5 }}>{plan.name}</p>
                  <span className={`adm-badge ${plan.is_active ? 'active' : 'inactive'}`}>
                    <span className="adm-badge-dot" />{plan.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div style={{ display:'flex', gap:4 }}>
                  <button className="adm-icon-btn" onClick={() => openEdit(plan)}><Edit size={13} /></button>
                  <button className="adm-icon-btn danger" onClick={() => handleDelete(plan.id)}><Trash2 size={13} /></button>
                </div>
              </div>

              {plan.description && <p style={{ fontSize:11.5, color:'#aaa', lineHeight:1.55, marginBottom:14 }}>{plan.description}</p>}

              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, paddingBottom:8, borderBottom:'1px solid rgba(0,0,0,0.05)' }}>
                  <span style={{ color:'#aaa' }}>Expected Return</span>
                  <span style={{ fontWeight:600, color:'#16a34a' }}>+{plan.expected_return}%</span>
                </div>
                {[
                  ['Min Investment', formatCurrency(plan.min_amount)],
                  ...(plan.max_amount ? [['Max Investment', formatCurrency(plan.max_amount)]] : []),
                  ['Duration',       `${plan.duration_days} days`],
                ].map(([l, v]) => (
                  <div key={l} style={{ display:'flex', justifyContent:'space-between', fontSize:12 }}>
                    <span style={{ color:'#aaa' }}>{l}</span>
                    <span style={{ fontWeight:500, color:'#1a1a1a' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Dialog open={showModal} onClose={() => { setShowModal(false); resetForm(); }}>
        <div className="adm" style={{ maxWidth:520 }}>
          <style>{ADMIN_STYLES}</style>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:18 }}>
            <div>
              <p className="adm-modal-title">{editingPlan ? 'Edit Plan' : 'New Investment Plan'}</p>
              <p className="adm-modal-sub">{editingPlan ? `Editing: ${editingPlan.name}` : 'Set up a plan visible to all users'}</p>
            </div>
            <button className="adm-icon-btn" onClick={() => { setShowModal(false); resetForm(); }}><X size={14} /></button>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div className="adm-field-wrap">
              <label className="adm-field-label">Plan Name *</label>
              <input className="adm-field-input" value={form.name} onChange={set('name')} placeholder="e.g., Starter Plan" />
            </div>
            <div className="adm-field-wrap">
              <label className="adm-field-label">Description *</label>
              <textarea className="adm-field-textarea" value={form.description} onChange={set('description')} placeholder="Describe the investment plan…" />
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <div className="adm-field-wrap">
                <label className="adm-field-label">Min Amount (USD) *</label>
                <input className="adm-field-input" type="number" step="0.01" value={form.min_amount} onChange={set('min_amount')} placeholder="100" />
              </div>
              <div className="adm-field-wrap">
                <label className="adm-field-label">Max Amount (USD)</label>
                <input className="adm-field-input" type="number" step="0.01" value={form.max_amount} onChange={set('max_amount')} placeholder="Optional" />
              </div>
              <div className="adm-field-wrap">
                <label className="adm-field-label">Expected Return (%) *</label>
                <input className="adm-field-input" type="number" step="0.01" value={form.expected_return} onChange={set('expected_return')} placeholder="30" />
              </div>
              <div className="adm-field-wrap">
                <label className="adm-field-label">Duration (Days) *</label>
                <input className="adm-field-input" type="number" value={form.duration_days} onChange={set('duration_days')} placeholder="30" />
              </div>
            </div>

            <label className="adm-check-row">
              <input type="checkbox" checked={form.is_active} onChange={set('is_active')} />
              Active (visible to users)
            </label>
          </div>

          <div className="adm-modal-actions">
            <button className="adm-btn-ghost" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</button>
            <button className="adm-btn-primary" onClick={handleSave}>{editingPlan ? 'Update Plan' : 'Create Plan'}</button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}