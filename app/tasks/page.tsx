// src/app/(dashboard)/tasks/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { MainLayout } from '@/layout/sections/dashboard/MainLayout';
import { useTaskStore } from '@/libs/stores/task.store';
import { useAuthStore } from '@/libs/stores/auth.store';
import { formatCurrency } from '@/libs/utils/format';
import { Task, UserTask } from '@/libs/types';
import { DASH_STYLES } from '@/app/styles/dashboardStyles';
import {
  Play, X, CheckCircle, Clock, AlertCircle, Trophy,
  Award, ArrowRight, Upload, RefreshCw, Zap, Target,
  Search, Grid, List, Calendar, DollarSign, Medal, Crown, Check,
} from 'lucide-react';

/* ─── Constants ── */
const TIERS = [
  {
    id: 'bronze' as const, name: 'Bronze', icon: Award,
    priceKey: 'bronze_price', rewardKey: 'bronze_reward',
    description: 'Perfect for beginners',
    features: ['Basic rewards', 'Standard support', 'Flexible completion'],
  },
  {
    id: 'silver' as const, name: 'Silver', icon: Medal,
    priceKey: 'silver_price', rewardKey: 'silver_reward',
    description: 'Most popular choice',
    features: ['Enhanced rewards', 'Priority support', 'Bonus opportunities'],
  },
  {
    id: 'gold' as const, name: 'Gold', icon: Crown,
    priceKey: 'gold_price', rewardKey: 'gold_reward',
    description: 'Maximum rewards',
    features: ['Premium rewards', 'VIP support', 'Exclusive perks'],
  },
] as const;

const STATUS_LABEL: Record<string, string> = {
  pending_payment: 'Awaiting Payment',
  pending_review:  'Under Review',
  in_progress:     'In Progress',
  completed:       'Completed',
  failed:          'Failed',
};

/* ─── Helpers ── */
function Spinner() {
  return (
    <div className="ds-spinner-page">
      <svg className="ds-spinner" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
    </div>
  );
}

function TierBadge({ tier }: { tier: string }) {
  const cls = tier === 'bronze' ? 'ds-tier-bronze' : tier === 'silver' ? 'ds-tier-silver' : 'ds-tier-gold';
  return (
    <span className={`ds-badge ${cls}`} style={{ border: undefined }}>
      {tier.charAt(0).toUpperCase() + tier.slice(1)}
    </span>
  );
}

export default function TasksPage() {
  const { availableTasks, myTasks, isLoading, fetchAvailableTasks, fetchMyTasks, startTask, uploadPayment, completeTask } = useTaskStore();

  const [activeTab, setActiveTab]         = useState<'available' | 'my-tasks'>('available');
  const [viewMode, setViewMode]           = useState<'grid' | 'list'>('grid');
  const [selectedTask, setSelectedTask]   = useState<Task | null>(null);
  const [selectedTier, setSelectedTier]   = useState<typeof TIERS[number] | null>(null);
  const [uploadingFor, setUploadingFor]   = useState<number | null>(null);
  const [uploadFile, setUploadFile]       = useState<File | null>(null);
  const [uploading, setUploading]         = useState(false);
  const [isStarting, setIsStarting]       = useState(false);
  const [searchQuery, setSearchQuery]     = useState('');
  const [filterTier, setFilterTier]       = useState('all');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([fetchAvailableTasks(), fetchMyTasks()]);
  }, []);

  const handleStartTask = async () => {
    if (!selectedTask || !selectedTier) return;
    setIsStarting(true);
    try {
      await startTask(selectedTask.id, selectedTier.id);
      await Promise.all([fetchMyTasks(), fetchAvailableTasks()]);
      setSelectedTask(null); setSelectedTier(null); setActiveTab('my-tasks');
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Could not start task. Please try again.');
    } finally { setIsStarting(false); }
  };

  const handleUploadPayment = async (id: number) => {
    if (!uploadFile) return;
    setUploading(true);
    try {
      await uploadPayment(id, uploadFile);
      setUploadingFor(null); setUploadFile(null); await fetchMyTasks();
    } catch (err: any) { alert(err?.response?.data?.error || 'Upload failed.'); }
    finally { setUploading(false); }
  };

  const handleCompleteTask = async (id: number) => {
    if (!uploadFile) return;
    setUploading(true);
    try {
      await completeTask(id, uploadFile);
      setUploadingFor(null); setUploadFile(null); await fetchMyTasks();
    } catch (err: any) { alert(err?.response?.data?.error || 'Submission failed.'); }
    finally { setUploading(false); }
  };

  const filteredTasks = (availableTasks || []).filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMyTasks = (myTasks || []).filter(t =>
    t.task_title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (filterTier === 'all' || t.tier === filterTier)
  );

  if (isLoading) return <MainLayout><Spinner /></MainLayout>;

  return (
    <MainLayout>
      <div className="ds ds-page ds-fade-up">
        <style>{DASH_STYLES}</style>

        {/* Header */}
        <div>
          <h1 className="ds-page-title">Challenge Arena</h1>
          <p className="ds-page-subtitle">Complete tasks, earn rewards, level up</p>
        </div>

        {/* Stats */}
        <div className="ds-stat-grid" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))' }}>
          {[
            { label:'Available',    value: availableTasks?.length || 0,                                            icon: Target },
            { label:'Active',       value: myTasks?.filter(t => t.status === 'in_progress').length || 0,            icon: Play   },
            { label:'Completed',    value: myTasks?.filter(t => t.status === 'completed').length || 0,              icon: Trophy },
            { label:'Total Earned', value: formatCurrency(myTasks?.reduce((s,t) => t.status==='completed' ? s+Number(t.reward_amount) : s, 0) || 0), icon: DollarSign },
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

        {/* Controls */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:10, alignItems:'center', justifyContent:'space-between' }}>
          <div className="ds-tabs">
            <button className={`ds-tab ${activeTab === 'available' ? 'active' : ''}`} onClick={() => setActiveTab('available')}>
              Available ({filteredTasks.length})
            </button>
            <button className={`ds-tab ${activeTab === 'my-tasks' ? 'active' : ''}`} onClick={() => setActiveTab('my-tasks')}>
              My Tasks ({filteredMyTasks.length})
            </button>
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <div className="ds-search-wrap">
              <Search size={13} color="#ccc" />
              <input className="ds-search-input" placeholder="Search challenges…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
            {activeTab === 'my-tasks' && (
              <select className="ds-select" value={filterTier} onChange={e => setFilterTier(e.target.value)}>
                <option value="all">All Tiers</option>
                <option value="bronze">Bronze</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
              </select>
            )}
            <div className="ds-tabs" style={{ padding:'3px', gap:2 }}>
              <button className={`ds-tab ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')} style={{ padding:'6px 10px' }}>
                <Grid size={13} />
              </button>
              <button className={`ds-tab ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')} style={{ padding:'6px 10px' }}>
                <List size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Available Tasks */}
        {activeTab === 'available' && (
          <div style={{ display:'grid', gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill,minmax(280px,1fr))' : '1fr', gap:14 }}>
            {filteredTasks.length === 0 ? (
              <div className="ds-empty" style={{ gridColumn:'1/-1', background:'#fafafa', borderRadius:14, border:'1px solid rgba(0,0,0,0.07)' }}>
                <div className="ds-empty-icon"><Target size={18} /></div>
                <p className="ds-empty-title">No challenges found</p>
                <p className="ds-empty-sub">Check back later for new challenges</p>
              </div>
            ) : filteredTasks.map(task => (
              <div key={task.id} className="ds-task-card">
                {/* Card top */}
                <div style={{ padding:'18px 18px 14px' }}>
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:8, gap:10 }}>
                    <p style={{ fontSize:14, fontWeight:600, color:'#1a1a1a' }}>{task.title}</p>
                    {task.requires_subscription && (
                      <span className="ds-badge ds-tier-gold" style={{ flexShrink:0 }}><Crown size={9} /> Premium</span>
                    )}
                  </div>
                  <p style={{ fontSize:12, color:'#aaa', lineHeight:1.55, marginBottom:14 }}>{task.description}</p>

                  {/* Tier preview */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:16 }}>
                    {TIERS.map(t => {
                      const Icon = t.icon;
                      return (
                        <div key={t.id} style={{ textAlign:'center', padding:'10px 6px', background:'#fafafa', border:'1px solid rgba(0,0,0,0.07)', borderRadius:9 }}>
                          <Icon size={13} color="#888" style={{ margin:'0 auto 4px', display:'block' }} />
                          <p style={{ fontSize:11, fontWeight:500, color:'#555', marginBottom:2 }}>{t.name}</p>
                          <p style={{ fontSize:11, fontWeight:600, color:'#1a1a1a' }}>
                            {formatCurrency(Number(task[t.priceKey as keyof Task]))}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <button className="ds-btn-primary" style={{ width:'100%' }} onClick={() => setSelectedTask(task)}>
                    Start Challenge <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* My Tasks */}
        {activeTab === 'my-tasks' && (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {filteredMyTasks.length === 0 ? (
              <div className="ds-empty" style={{ background:'#fafafa', borderRadius:14, border:'1px solid rgba(0,0,0,0.07)' }}>
                <div className="ds-empty-icon"><Medal size={18} /></div>
                <p className="ds-empty-title">No tasks yet</p>
                <p className="ds-empty-sub">Start your first challenge today</p>
                <button className="ds-btn-primary ds-btn-sm" onClick={() => setActiveTab('available')}>Browse Challenges</button>
              </div>
            ) : filteredMyTasks.map((task: UserTask) => (
              <div key={task.id} className="ds-card" style={{ padding:'18px' }}>
                <div style={{ display:'flex', flexWrap:'wrap', gap:16 }}>

                  {/* Left: info */}
                  <div style={{ flex:'1 1 280px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6, flexWrap:'wrap' }}>
                      <p style={{ fontSize:13.5, fontWeight:600, color:'#1a1a1a' }}>{task.task_title}</p>
                      <span className={`ds-badge ${task.status}`}>
                        <span className="ds-badge-dot" />
                        {STATUS_LABEL[task.status] || task.status.replace(/_/g,' ')}
                      </span>
                      <TierBadge tier={task.tier} />
                    </div>
                    <p style={{ fontSize:12, color:'#aaa', marginBottom:12, lineHeight:1.55 }}>{task.task_description}</p>

                    {task.status === 'in_progress' && (
                      <div>
                        <p style={{ fontSize:11, color:'#bbb', marginBottom:4 }}>Progress</p>
                        <div className="ds-progress-bar"><div className="ds-progress-fill" style={{ width:'60%' }} /></div>
                      </div>
                    )}

                    <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:12 }}>
                      <span className="ds-meta-pill"><Calendar size={11} />Started {new Date(task.started_at).toLocaleDateString()}</span>
                      <span className="ds-meta-pill"><DollarSign size={11} />+{formatCurrency(Number(task.reward_amount))}</span>
                    </div>
                  </div>

                  {/* Right: actions */}
                  <div style={{ flexShrink:0, width:260 }}>
                    {task.status === 'pending_payment' && (
                      uploadingFor === task.id ? (
                        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                          <div className="ds-upload" onClick={() => fileRef.current?.click()}>
                            <Upload size={18} color="#ccc" style={{ margin:'0 auto' }} />
                            <p className="ds-upload-label">{uploadFile ? uploadFile.name : 'Click to upload payment proof'}</p>
                            <p className="ds-upload-hint">PNG, JPG up to 5MB</p>
                          </div>
                          <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => setUploadFile(e.target.files?.[0] || null)} />
                          <div style={{ display:'flex', gap:8 }}>
                            <button className="ds-btn-ghost ds-btn-sm" style={{ flex:1 }} onClick={() => { setUploadingFor(null); setUploadFile(null); }}>Cancel</button>
                            <button className="ds-btn-primary ds-btn-sm" style={{ flex:1 }} disabled={!uploadFile || uploading} onClick={() => handleUploadPayment(task.id)}>
                              {uploading ? '…' : 'Submit'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button className="ds-btn-primary" style={{ width:'100%' }} onClick={() => setUploadingFor(task.id)}>
                          <Upload size={13} /> Upload Payment Proof
                        </button>
                      )
                    )}

                    {task.status === 'pending_review' && (
                      <div className="ds-info-strip">
                        <Clock size={13} style={{ flexShrink:0, marginTop:1 }} />
                        <div>
                          <p style={{ fontWeight:500, marginBottom:2 }}>Under Review</p>
                          <p>Waiting for admin approval. You'll be notified once approved.</p>
                        </div>
                      </div>
                    )}

                    {task.status === 'in_progress' && (
                      uploadingFor === task.id ? (
                        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                          <div className="ds-upload" onClick={() => fileRef.current?.click()}>
                            <CheckCircle size={18} color="#16a34a" style={{ margin:'0 auto' }} />
                            <p className="ds-upload-label">{uploadFile ? uploadFile.name : 'Upload completion proof'}</p>
                            <p className="ds-upload-hint">Image or Video</p>
                          </div>
                          <input ref={fileRef} type="file" accept="image/*,video/*" hidden onChange={e => setUploadFile(e.target.files?.[0] || null)} />
                          <div style={{ display:'flex', gap:8 }}>
                            <button className="ds-btn-ghost ds-btn-sm" style={{ flex:1 }} onClick={() => { setUploadingFor(null); setUploadFile(null); }}>Cancel</button>
                            <button className="ds-btn-primary ds-btn-sm" style={{ flex:1 }} disabled={!uploadFile || uploading} onClick={() => handleCompleteTask(task.id)}>
                              {uploading ? '…' : 'Submit for Review'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button className="ds-btn-primary" style={{ width:'100%' }} onClick={() => setUploadingFor(task.id)}>
                          <CheckCircle size={13} /> Mark as Complete
                        </button>
                      )
                    )}

                    {task.status === 'completed' && (
                      <div className="ds-success-strip" style={{ flexDirection:'column', gap:6, alignItems:'center', textAlign:'center' }}>
                        <CheckCircle size={18} color="#16a34a" />
                        <p style={{ fontWeight:600, fontSize:13, color:'#15803d' }}>Completed</p>
                        <p style={{ fontSize:20, fontWeight:700, color:'#15803d' }}>+{formatCurrency(Number(task.reward_amount))}</p>
                        <p style={{ fontSize:11, color:'#16a34a' }}>Reward Earned</p>
                      </div>
                    )}

                    {task.status === 'failed' && (
                      <div style={{ background:'#fff5f5', border:'1px solid rgba(220,38,38,0.15)', borderRadius:10, padding:'14px', textAlign:'center' }}>
                        <X size={18} color="#dc2626" style={{ margin:'0 auto 6px' }} />
                        <p style={{ fontWeight:600, color:'#b91c1c', fontSize:13, marginBottom:4 }}>Task Failed</p>
                        <p style={{ fontSize:12, color:'#e05252' }}>{task.admin_notes || 'Task was rejected'}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task Selection Modal */}
      {selectedTask && (
        <div className="ds-modal-overlay" onClick={() => setSelectedTask(null)}>
          <div className="ds-modal wide" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:18 }}>
              <div>
                <p className="ds-modal-title">{selectedTask.title}</p>
                <p className="ds-modal-sub">{selectedTask.requires_subscription ? 'Premium Challenge' : 'Standard Challenge'}</p>
              </div>
              <button className="ds-icon-btn" onClick={() => setSelectedTask(null)}><X size={15} /></button>
            </div>

            <p style={{ fontSize:12.5, color:'#888', lineHeight:1.65, marginBottom:20 }}>{selectedTask.description}</p>

            {/* Tier selection */}
            <p style={{ fontSize:11.5, fontWeight:600, color:'#555', marginBottom:10 }}>Select Your Tier</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:10, marginBottom:20 }}>
              {TIERS.map(tier => {
                const Icon = tier.icon;
                const price  = Number(selectedTask[tier.priceKey  as keyof Task]);
                const reward = Number(selectedTask[tier.rewardKey as keyof Task]);
                const isSelected = selectedTier?.id === tier.id;
                return (
                  <div key={tier.id} className={`ds-tier-opt ${isSelected ? 'selected' : ''}`} onClick={() => setSelectedTier(tier)}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                      <div style={{ width:28, height:28, borderRadius:7, background:'#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <Icon size={13} color="#888" />
                      </div>
                      <p style={{ fontSize:13, fontWeight:600, color:'#1a1a1a' }}>{tier.name}</p>
                    </div>
                    <p style={{ fontSize:11, color:'#bbb', marginBottom:10 }}>{tier.description}</p>
                    <div style={{ fontSize:12 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                        <span style={{ color:'#aaa' }}>Investment</span>
                        <span style={{ fontWeight:600, color:'#1a1a1a' }}>{formatCurrency(price)}</span>
                      </div>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                        <span style={{ color:'#aaa' }}>Reward</span>
                        <span style={{ fontWeight:600, color:'#16a34a' }}>+{formatCurrency(reward)}</span>
                      </div>
                      <div style={{ display:'flex', justifyContent:'space-between' }}>
                        <span style={{ color:'#aaa' }}>ROI</span>
                        <span style={{ fontWeight:500, color:'#555' }}>{((reward - price) / price * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                    {isSelected && (
                      <div style={{ position:'absolute', top:10, right:10 }}>
                        <Check size={14} color="#f97316" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Tier benefits */}
            {selectedTier && (
              <div className="ds-info-strip" style={{ marginBottom:20, flexDirection:'column', alignItems:'flex-start', gap:8 }}>
                <p style={{ fontSize:11, fontWeight:600, color:'#888', textTransform:'uppercase', letterSpacing:'0.05em' }}>Tier Benefits</p>
                {selectedTier.features.map((f, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:7, fontSize:12.5, color:'#555' }}>
                    <Check size={12} color="#16a34a" />{f}
                  </div>
                ))}
              </div>
            )}

            <div className="ds-modal-actions">
              <button className="ds-btn-ghost" onClick={() => setSelectedTask(null)}>Cancel</button>
              <button className="ds-btn-primary" disabled={!selectedTier || isStarting} onClick={handleStartTask}>
                {isStarting ? '…' : <><Zap size={13} /> Start Challenge</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}