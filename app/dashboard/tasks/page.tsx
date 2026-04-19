// src/app/dashboard/tasks/page.tsx
'use client';

import { useState, useEffect, useCallback  } from 'react';
import { useToast } from '@/libs/src/contexts/ToastContext';
import { formatCurrency, formatDate } from '@/libs/utils/format';
import { apiService } from '@/libs/services/api';
import { DASH_STYLES } from '@/app/styles/dashboardStyles';
import {
  TrendingUp, DollarSign, Timer, CheckCircle,
  Clock, ArrowRight, Medal, Star, Crown, AlertCircle, X,
} from 'lucide-react';

interface Task {
  id: number; title: string; description: string; video_url: string | null;
  bronze_price: number; silver_price: number; gold_price: number;
  bronze_reward: number; silver_reward: number; gold_reward: number; is_active: boolean;
}

interface TaskInvestment {
  id: number; task_title: string; tier: string; amount: number;
  reward_amount: number; status: string; start_date?: string; end_date?: string;
  days_remaining: number; progress_percentage: number; profit: number; created_at: string;
}

interface ApiResponse<T> {
  results?: T[];
  data?: T[];
}

const TIERS = [
  { id: 'bronze', name: 'Bronze', icon: Medal  },
  { id: 'silver', name: 'Silver', icon: Star   },
  { id: 'gold',   name: 'Gold',   icon: Crown  },
] as const;

const STATUS_CFG: Record<string, { label: string; cls: string }> = {
  pending:   { label: 'Pending Verification', cls: 'pending'   },
  active:    { label: 'Active — Countdown',   cls: 'active'    },
  completed: { label: 'Completed',            cls: 'completed' },
  cancelled: { label: 'Cancelled',            cls: 'failed'    },
};

function Spinner() {
  return (
    <div className="ds-spinner-page">
      <svg className="ds-spinner" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
    </div>
  );
}

export default function InvestmentTasksPage() {
  const [tasks, setTasks]               = useState<Task[]>([]);
  const [investments, setInvestments]   = useState<TaskInvestment[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [activeTab, setActiveTab]       = useState<'tasks' | 'my'>('tasks');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [showModal, setShowModal]       = useState(false);
  const [investing, setInvesting]       = useState(false);
  const { showToast } = useToast();

const fetchTasks = useCallback(async () => {
    try {
      const res = await apiService.get('/tasks/tasks/');
      const data = res.data as Task[] | ApiResponse<Task>;
      const tasksArray = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];
      setTasks(tasksArray);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load tasks';
      setError(errorMsg);
      showToast('Failed to load tasks', 'error');
      setTasks([]);
    } finally { 
      setLoading(false); 
    }
  }, [showToast]);

  const fetchMyInvestments = useCallback(async () => {
    try {
      const res = await apiService.get('/tasks/investments/');
      const data = res.data as TaskInvestment[] | ApiResponse<TaskInvestment>;
      const investmentsArray = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];
      setInvestments(investmentsArray);
    } catch (err) {
      console.error('Error fetching investments:', err);
      setInvestments([]);
    }
  }, []);

  useEffect(() => { 
    fetchTasks(); 
    fetchMyInvestments(); 
  }, [fetchTasks, fetchMyInvestments]);

  useEffect(() => {
    const interval = setInterval(() => fetchMyInvestments(), 60000);
    return () => clearInterval(interval);
  }, [fetchMyInvestments]);

  const handleInvest = async () => {
    if (!selectedTask || !selectedTier) return;
    
    setInvesting(true);
    try {
      await apiService.post(`/tasks/investments/${selectedTask.id}/invest/`, { tier: selectedTier });
      showToast(`Investment request sent for ${selectedTier} tier.`, 'success');
      setShowModal(false); 
      setSelectedTask(null); 
      setSelectedTier(null);
      await fetchMyInvestments(); 
      setActiveTab('my');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } }; message?: string };
      showToast(error?.response?.data?.error || error?.message || 'Investment failed', 'error');
    } finally { 
      setInvesting(false); 
    }
  };

  

  const totalInvested   = investments.reduce((s, i) => s + (i.amount || 0), 0);
  const totalExpected   = investments.reduce((s, i) => s + (i.reward_amount || 0), 0);
  const activeCount     = investments.filter(i => i.status === 'active').length;

  return (
    <>
      <div  className="ds ds-page ds-fade-up">
        <style>{DASH_STYLES}</style>

        <div>
          <h1 className="ds-page-title">Investment Tasks</h1>
          <p className="ds-page-subtitle">Choose a task, select your tier, and start earning</p>
        </div>

        {/* Stats */}
        <div className="ds-stat-grid" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))' }}>
          {[
            { label:'Total Invested',    value: formatCurrency(totalInvested), icon: DollarSign },
            { label:'Expected Return',   value: formatCurrency(totalExpected), icon: TrendingUp },
            { label:'Active',            value: activeCount,                    icon: Timer      },
          ].map(s => {
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

        {/* Tabs */}
        <div className="ds-tabs">
          <button className={`ds-tab ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>
            Available Tasks ({tasks.length})
          </button>
          <button className={`ds-tab ${activeTab === 'my' ? 'active' : ''}`} onClick={() => setActiveTab('my')}>
            My Investments ({investments.length})
          </button>
        </div>

        {/* Available Tasks */}
        {activeTab === 'tasks' && (
          loading ? <Spinner /> :
          error ? (
            <div className="ds-empty" style={{ background:'#fff5f5', border:'1px solid rgba(220,38,38,0.12)', borderRadius:14 }}>
              <div className="ds-empty-icon" style={{ background:'#fff5f5' }}><AlertCircle size={18} color="#dc2626" /></div>
              <p className="ds-empty-title">Failed to load tasks</p>
              <p className="ds-empty-sub">{error}</p>
              <button className="ds-btn-primary ds-btn-sm" onClick={fetchTasks}>Try Again</button>
            </div>
          ) :
          tasks.length === 0 ? (
            <div className="ds-empty" style={{ background:'#fafafa', border:'1px solid rgba(0,0,0,0.07)', borderRadius:14 }}>
              <div className="ds-empty-icon"><DollarSign size={18} /></div>
              <p className="ds-empty-title">No tasks available</p>
              <p className="ds-empty-sub">Check back later for new tasks</p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {tasks.map(task => (
                <div key={task.id} className="ds-card">
                  <div style={{ padding:'18px' }}>
                    <p style={{ fontSize:14, fontWeight:600, color:'#1a1a1a', marginBottom:6 }}>{task.title}</p>
                    <p style={{ fontSize:12, color:'#aaa', lineHeight:1.6, marginBottom:16 }}>{task.description}</p>

                    {/* Tier cards */}
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:10 }}>
                      {TIERS.map(tier => {
                        const Icon  = tier.icon;
                        const price  = task[`${tier.id}_price`  as keyof Task] as number;
                        const reward = task[`${tier.id}_reward` as keyof Task] as number;
                        const pct    = price > 0 ? ((reward - price) / price * 100).toFixed(0) : '0';
                        return (
                          <div key={tier.id} className="ds-tier-opt"
                            onClick={() => { setSelectedTask(task); setSelectedTier(tier.id); setShowModal(true); }}>
                            <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:10 }}>
                              <div style={{ width:26, height:26, borderRadius:7, background:'#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                <Icon size={13} color="#888" />
                              </div>
                              <p style={{ fontSize:12.5, fontWeight:600, color:'#1a1a1a' }}>{tier.name}</p>
                            </div>
                            <div style={{ fontSize:12, display:'flex', flexDirection:'column', gap:5 }}>
                              <div style={{ display:'flex', justifyContent:'space-between' }}>
                                <span style={{ color:'#aaa' }}>Investment</span>
                                <span style={{ fontWeight:600 }}>{formatCurrency(price)}</span>
                              </div>
                              <div style={{ display:'flex', justifyContent:'space-between' }}>
                                <span style={{ color:'#aaa' }}>Reward</span>
                                <span style={{ fontWeight:600, color:'#16a34a' }}>+{formatCurrency(reward)}</span>
                              </div>
                              <div style={{ display:'flex', justifyContent:'space-between' }}>
                                <span style={{ color:'#aaa' }}>Profit</span>
                                <span style={{ fontWeight:500, color:'#555' }}>+{pct}%</span>
                              </div>
                            </div>
                            <button className="ds-btn-ghost ds-btn-sm" style={{ width:'100%', marginTop:10, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                              Select <ArrowRight size={11} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* My Investments */}
        {activeTab === 'my' && (
          investments.length === 0 ? (
            <div className="ds-empty" style={{ background:'#fafafa', border:'1px solid rgba(0,0,0,0.07)', borderRadius:14 }}>
              <div className="ds-empty-icon"><DollarSign size={18} /></div>
              <p className="ds-empty-title">No investments yet</p>
              <p className="ds-empty-sub">Browse available tasks to get started</p>
              <button className="ds-btn-primary ds-btn-sm" onClick={() => setActiveTab('tasks')}>Browse Tasks</button>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {investments.map(inv => {
                const sc     = STATUS_CFG[inv.status] || STATUS_CFG.pending;
                const tier   = TIERS.find(t => t.id === inv.tier);
                const TierIcon = tier?.icon || Medal;

                return (
                  <div key={inv.id} className="ds-card" style={{ padding:'18px' }}>
                    {/* Top row */}
                    <div style={{ display:'flex', alignItems:'center', flexWrap:'wrap', gap:8, marginBottom:12 }}>
                      <TierIcon size={14} color="#888" />
                      <p style={{ fontSize:13.5, fontWeight:600, color:'#1a1a1a' }}>{inv.task_title}</p>
                      <span className={`ds-badge ${sc.cls}`}><span className="ds-badge-dot" />{sc.label}</span>
                    </div>

                    {/* Meta grid */}
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))', gap:12, marginBottom:12 }}>
                      {[
                        ['Invested',         formatCurrency(inv.amount)],
                        ['Expected Return',  formatCurrency(inv.reward_amount)],
                        ['Profit',           `+${formatCurrency(inv.profit)}`],
                        ['Invested On',      formatDate(inv.created_at)],
                      ].map(([l,v]) => (
                        <div key={l}>
                          <p style={{ fontSize:11, color:'#bbb', marginBottom:3 }}>{l}</p>
                          <p style={{ fontSize:12.5, fontWeight:600, color:'#1a1a1a' }}>{v}</p>
                        </div>
                      ))}
                    </div>

                    {/* Progress */}
                    {inv.status === 'active' && (
                      <div>
                        <div style={{ display:'flex', justifyContent:'space-between', fontSize:11.5, color:'#bbb', marginBottom:5 }}>
                          <span>30-Day Countdown</span>
                          <span style={{ color:'#f97316', fontWeight:500 }}>{inv.days_remaining} days remaining</span>
                        </div>
                        <div className="ds-progress-bar"><div className="ds-progress-fill" style={{ width:`${inv.progress_percentage}%` }} /></div>
                      </div>
                    )}

                    {inv.status === 'pending' && (
                      <div className="ds-warn-strip" style={{ marginTop:10 }}>
                        <Clock size={13} style={{ flexShrink:0, marginTop:1 }} />
                        <span>Awaiting admin verification. Once verified, your 30-day countdown will start.</span>
                      </div>
                    )}

                    {inv.status === 'completed' && (
                      <div className="ds-success-strip" style={{ marginTop:10 }}>
                        <CheckCircle size={13} style={{ flexShrink:0, marginTop:1 }} />
                        <span>Investment completed! You earned <strong>{formatCurrency(inv.profit)}</strong> profit.</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>

      {/* Invest Confirm Modal */}
      {showModal && selectedTask && selectedTier && (() => {
        const tier   = TIERS.find(t => t.id === selectedTier)!;
        const Icon   = tier.icon;
        const price  = selectedTask[`${selectedTier}_price`  as keyof Task] as number;
        const reward = selectedTask[`${selectedTier}_reward` as keyof Task] as number;
        const profit = reward - price;
        const pct    = price > 0 ? ((profit / price) * 100).toFixed(0) : '0';
        return (
          <div className="ds-modal-overlay" onClick={() => setShowModal(false)}>
            <div className="ds-modal" onClick={e => e.stopPropagation()}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
                <div>
                  <p className="ds-modal-title">Invest in {selectedTask.title}</p>
                  <p className="ds-modal-sub">{selectedTask.description}</p>
                </div>
                <button className="ds-icon-btn" onClick={() => setShowModal(false)}><X size={15} /></button>
              </div>

              {/* Tier summary */}
              <div className="ds-fee-strip" style={{ marginBottom:16 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                  <Icon size={14} color="#888" />
                  <p style={{ fontSize:13, fontWeight:600, color:'#1a1a1a' }}>{tier.name} Tier</p>
                </div>
                {[
                  ['Investment Amount', formatCurrency(price)],
                  ['Reward Amount',     formatCurrency(reward)],
                  ['Profit',            `+${formatCurrency(profit)} (${pct}%)`],
                ].map(([l,v]) => (
                  <div className="ds-fee-row" key={l}>
                    <span style={{ color:'#aaa' }}>{l}</span>
                    <span style={{ fontWeight:500 }}>{v}</span>
                  </div>
                ))}
              </div>

              <div className="ds-info-strip" style={{ marginBottom:20 }}>
                <span>After investing, admin verifies your request. Once verified, a <strong>30-day countdown</strong> starts and you&apos;ll earn your reward upon completion.</span>
              </div>

              <div className="ds-modal-actions">
                <button className="ds-btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="ds-btn-primary" disabled={investing} onClick={handleInvest}>
                  {investing ? '…' : 'Request Investment'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}