// src/app/admin/tasks/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Dialog } from '@/layout/components/Dialog';
import { adminService } from '@/libs/services/admin.service';
import { useToast } from '@/libs/src/contexts/ToastContext';
import { formatCurrency } from '@/libs/utils/format';
import { Task } from '@/libs/types';
import { ADMIN_STYLES } from '../_style/adminPageStyles';
import { Plus, Edit, Trash2, RefreshCw, Medal, Star, Crown, AlertCircle } from 'lucide-react';

interface TaskFormData {
  title: string; description: string;
  bronze_price: string; silver_price: string; gold_price: string;
  bronze_reward: string; silver_reward: string; gold_reward: string;
  requires_subscription: boolean; is_active: boolean;
}

const EMPTY_FORM: TaskFormData = {
  title: '', description: '',
  bronze_price: '', silver_price: '', gold_price: '',
  bronze_reward: '', silver_reward: '', gold_reward: '',
  requires_subscription: false, is_active: true,
};

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

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="adm-loader-page">
      <div className="adm-loader-inner">
        <AlertCircle size={28} color="#e05252" />
        <p className="adm-loader-text" style={{ color:'#e05252', marginTop:10 }}>{message}</p>
        <button className="adm-btn-primary adm-btn-sm" style={{ marginTop:14 }} onClick={onRetry}>Try Again</button>
      </div>
    </div>
  );
}

function pct(reward: string, price: string) {
  const r = parseFloat(reward), p = parseFloat(price);
  if (!p) return '—';
  return `+${((r - p) / p * 100).toFixed(0)}%`;
}

export default function AdminTasksPage() {
  const [tasks, setTasks]               = useState<Task[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [showModal, setShowModal]       = useState(false);
  const [editingTask, setEditingTask]   = useState<Task | null>(null);
  const [form, setForm]                 = useState<TaskFormData>(EMPTY_FORM);
  const { showToast } = useToast();

  const fetchTasks = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await adminService.getAllTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(msg); showToast(msg, 'error'); setTasks([]);
    } finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const resetForm = () => { setForm(EMPTY_FORM); setEditingTask(null); };

  const handleSave = async () => {
    if (!form.title.trim())       { showToast('Task title is required', 'error'); return; }
    if (!form.description.trim()) { showToast('Description is required', 'error'); return; }
    try {
      if (editingTask) {
        await adminService.updateTask(editingTask.id, form);
        showToast('Task updated', 'success');
      } else {
        await adminService.createTask(form);
        showToast('Task created', 'success');
      }
      setShowModal(false); resetForm(); fetchTasks();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Save failed', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this task?')) return;
    try {
      await adminService.deleteTask(id);
      showToast('Task deleted', 'success'); fetchTasks();
    } catch { showToast('Failed to delete task', 'error'); }
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setForm({
      title: task.title, description: task.description,
      bronze_price: String(task.bronze_price), silver_price: String(task.silver_price), gold_price: String(task.gold_price),
      bronze_reward: String(task.bronze_reward), silver_reward: String(task.silver_reward), gold_reward: String(task.gold_reward),
      requires_subscription: task.requires_subscription, is_active: task.is_active,
    });
    setShowModal(true);
  };

  const set = (k: keyof TaskFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  const tiers = [
    { key: 'bronze', label: 'Bronze', icon: <Medal size={12} /> },
    { key: 'silver', label: 'Silver', icon: <Medal size={12} /> },
    { key: 'gold',   label: 'Gold',   icon: <Star  size={12} /> },
  ] as const;

  return (
    <div className="adm adm-root">
      <style>{ADMIN_STYLES}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 className="adm-title">Task Management</h1>
          <p className="adm-subtitle">Create and manage tasks with pricing tiers · {tasks.length} total</p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button className="adm-btn-ghost" onClick={fetchTasks}><RefreshCw size={13} /> Refresh</button>
          <button className="adm-btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            <Plus size={13} /> Create Task
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? <Spinner text="Loading tasks…" /> :
       error   ? <ErrorState message={error} onRetry={fetchTasks} /> :
       tasks.length === 0 ? (
        <div className="adm-table-card" style={{ padding:'48px 24px', textAlign:'center' }}>
          <p style={{ fontSize:12.5, color:'#bbb', marginBottom:14 }}>No tasks created yet</p>
          <button className="adm-btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            <Plus size={13} /> Create Your First Task
          </button>
        </div>
       ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {tasks.map(task => (
            <div key={task.id} className="adm-table-card" style={{ padding:'20px' }}>
              {/* Task header */}
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16, gap:12 }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <p style={{ fontSize:14, fontWeight:600, color:'#1a1a1a' }}>{task.title}</p>
                    <span className={`adm-badge ${task.is_active ? 'active' : 'inactive'}`}>
                      <span className="adm-badge-dot" />
                      {task.is_active ? 'Active' : 'Inactive'}
                    </span>
                    {task.requires_subscription && (
                      <span className="adm-badge premium"><Crown size={9} /> Premium</span>
                    )}
                  </div>
                  <p style={{ fontSize:12, color:'#aaa' }}>{task.description}</p>
                </div>
                <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                  <button className="adm-icon-btn" onClick={() => openEdit(task)} title="Edit"><Edit size={14} /></button>
                  <button className="adm-icon-btn danger" onClick={() => handleDelete(task.id)} title="Delete"><Trash2 size={14} /></button>
                </div>
              </div>

              {/* Tier grid */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:10 }}>
                {tiers.map(t => (
                  <div key={t.key} className="adm-tier-card">
                    <p className="adm-tier-title">{t.icon} {t.label} Package</p>
                    <div className="adm-tier-row">
                      <span className="adm-tier-row-label">Price</span>
                      <span className="adm-tier-row-val red">{formatCurrency(parseFloat(task[`${t.key}_price` as keyof Task] as string))}</span>
                    </div>
                    <div className="adm-tier-row">
                      <span className="adm-tier-row-label">Reward</span>
                      <span className="adm-tier-row-val green">+{formatCurrency(parseFloat(task[`${t.key}_reward` as keyof Task] as string))}</span>
                    </div>
                    <div className="adm-tier-row">
                      <span className="adm-tier-row-label">Profit</span>
                      <span className="adm-tier-row-val" style={{ color:'#555' }}>
                        {pct(task[`${t.key}_reward` as keyof Task] as string, task[`${t.key}_price` as keyof Task] as string)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
       )
      }

      {/* Create / Edit Modal */}
      <Dialog open={showModal} onClose={() => { setShowModal(false); resetForm(); }}>
        <div className="adm" style={{ maxWidth:560, maxHeight:'85vh', overflowY:'auto' }}>
          <style>{ADMIN_STYLES}</style>
          <p className="adm-modal-title">{editingTask ? 'Edit Task' : 'New Task'}</p>
          <p className="adm-modal-sub">{editingTask ? `Editing: ${editingTask.title}` : 'Set up a task with tier pricing'}</p>

          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div className="adm-field-wrap">
              <label className="adm-field-label">Task Title *</label>
              <input className="adm-field-input" value={form.title} onChange={set('title')} placeholder="Enter task title" />
            </div>
            <div className="adm-field-wrap">
              <label className="adm-field-label">Description *</label>
              <textarea className="adm-field-textarea" value={form.description} onChange={set('description')} placeholder="Describe what users need to do…" />
            </div>

            <div className="adm-divider" />

            {/* Tier fields */}
            {tiers.map(t => (
              <div key={t.key}>
                <p style={{ fontSize:11.5, fontWeight:600, color:'#555', display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
                  {t.icon} {t.label} Package
                </p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  <div className="adm-field-wrap">
                    <label className="adm-field-label">Price (USD)</label>
                    <input className="adm-field-input" type="number" step="0.01" value={form[`${t.key}_price` as keyof TaskFormData] as string} onChange={set(`${t.key}_price` as keyof TaskFormData)} placeholder="0.00" />
                  </div>
                  <div className="adm-field-wrap">
                    <label className="adm-field-label">Reward (USD)</label>
                    <input className="adm-field-input" type="number" step="0.01" value={form[`${t.key}_reward` as keyof TaskFormData] as string} onChange={set(`${t.key}_reward` as keyof TaskFormData)} placeholder="0.00" />
                  </div>
                </div>
              </div>
            ))}

            <div className="adm-divider" />

            <label className="adm-check-row">
              <input type="checkbox" checked={form.requires_subscription} onChange={set('requires_subscription')} />
              Requires Premium Subscription
            </label>
            <label className="adm-check-row">
              <input type="checkbox" checked={form.is_active} onChange={set('is_active')} />
              Active (visible to users)
            </label>
          </div>

          <div className="adm-modal-actions">
            <button className="adm-btn-ghost" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</button>
            <button className="adm-btn-primary" onClick={handleSave}>{editingTask ? 'Update Task' : 'Create Task'}</button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}