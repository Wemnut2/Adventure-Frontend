// src/app/dashboard/tasks/page.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/libs/src/contexts/ToastContext';
import { formatCurrency, formatDate } from '@/libs/utils/format';
import { apiService } from '@/libs/services/api';
import { DASH_STYLES } from '@/app/styles/dashboardStyles';
import {
  TrendingUp, DollarSign, Timer, CheckCircle,
  Clock, ArrowRight, Medal, Star, Crown, AlertCircle, X,
  Play, Volume2, VolumeX, Maximize2, Minimize2,
} from 'lucide-react';
import Image from 'next/image';

/* ─── Video styles (injected alongside DASH_STYLES) ── */
const VIDEO_STYLES = `
  /* Thumbnail */
  .vp-thumb {
    position: relative; width: 100%; border-radius: 11px; overflow: hidden;
    background: #111; cursor: pointer; aspect-ratio: 16/9;
    box-shadow: 0 2px 12px rgba(0,0,0,0.10);
    transition: transform .18s, box-shadow .18s;
  }
  .vp-thumb:hover { transform: scale(1.015); box-shadow: 0 6px 24px rgba(0,0,0,0.16); }
  .vp-thumb:hover .vp-play-ring { transform: translate(-50%,-50%) scale(1.08); }

  .vp-thumb-img {
    width: 100%; height: 100%; object-fit: cover;
    display: block; transition: opacity .25s;
  }
  /* Dark overlay */
  .vp-overlay {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.28);
    transition: background .18s;
  }
  .vp-thumb:hover .vp-overlay { background: rgba(0,0,0,0.40); }

  /* Play ring */
  .vp-play-ring {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    width: 52px; height: 52px; border-radius: 50%;
    background: rgba(255,255,255,0.92);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 20px rgba(0,0,0,0.20);
    transition: transform .18s, background .15s;
  }
  .vp-thumb:hover .vp-play-ring { background: #fff; }

  /* Duration badge */
  .vp-badge {
    position: absolute; bottom: 10px; right: 10px;
    background: rgba(0,0,0,0.65); color: #fff;
    font-size: 11px; font-weight: 600; padding: 3px 8px;
    border-radius: 5px; backdrop-filter: blur(4px);
  }

  /* Label strip */
  .vp-label {
    display: flex; align-items: center; gap: 7px;
    margin-top: 10px; font-size: 12px; color: #888;
  }
  .vp-label-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #f97316;
  }

  /* No-video placeholder */
  .vp-placeholder {
    aspect-ratio: 16/9; border-radius: 11px;
    background: #fafafa; border: 1px solid rgba(0,0,0,0.07);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 8px; color: #ccc;
  }
  .vp-placeholder p { font-size: 12px; color: #ccc; }

  /* ── Lightbox overlay ── */
  .vp-lightbox {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(0,0,0,0.88); backdrop-filter: blur(6px);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 20px; animation: vpFadeIn .18s ease;
  }
  @keyframes vpFadeIn { from { opacity:0 } to { opacity:1 } }

  /* Header bar */
  .vp-lb-header {
    width: 100%; max-width: 900px; display: flex; align-items: center;
    justify-content: space-between; margin-bottom: 14px;
  }
  .vp-lb-title { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.75); }
  .vp-lb-close {
    width: 34px; height: 34px; border-radius: 50%;
    background: rgba(255,255,255,0.12); border: none; cursor: pointer;
    color: #fff; display: flex; align-items: center; justify-content: center;
    transition: background .15s;
  }
  .vp-lb-close:hover { background: rgba(255,255,255,0.22); }

  /* Video wrapper */
  .vp-lb-wrap {
    width: 100%; max-width: 900px; border-radius: 14px; overflow: hidden;
    background: #000; aspect-ratio: 16/9;
    box-shadow: 0 24px 80px rgba(0,0,0,0.6);
    animation: vpScaleIn .2s ease;
  }
  @keyframes vpScaleIn { from { transform: scale(.96); opacity:0 } to { transform: scale(1); opacity:1 } }

  .vp-iframe, .vp-native {
    width: 100%; height: 100%; display: block; border: none;
  }

  /* Native video controls bar */
  .vp-lb-controls {
    width: 100%; max-width: 900px; margin-top: 14px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .vp-ctrl-btn {
    display: flex; align-items: center; gap: 7px;
    background: rgba(255,255,255,0.10); border: 1px solid rgba(255,255,255,0.12);
    border-radius: 8px; padding: 7px 14px; color: rgba(255,255,255,0.8);
    font-size: 12px; font-weight: 500; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background .15s;
  }
  .vp-ctrl-btn:hover { background: rgba(255,255,255,0.18); }

  /* ESC hint */
  .vp-esc-hint {
    font-size: 11px; color: rgba(255,255,255,0.3);
    margin-top: 12px;
  }
`;

/* ─── Types ── */
interface Task {
  id: number; title: string; description: string;
  video: string | null; video_url: string | null;
  bronze_price: number; silver_price: number; gold_price: number;
  bronze_reward: number; silver_reward: number; gold_reward: number;
  is_active: boolean;
}

interface TaskInvestment {
  id: number; task_title: string; tier: string;
  amount: number; reward_amount: number; status: string;
  start_date?: string; end_date?: string;
  days_remaining: number; progress_percentage: number;
  profit: number; created_at: string;
}

interface ApiResponse<T> { results?: T[]; data?: T[]; }

const TIERS = [
  { id: 'bronze', name: 'Bronze', icon: Medal },
  { id: 'silver', name: 'Silver', icon: Star  },
  { id: 'gold',   name: 'Gold',   icon: Crown },
] as const;

const STATUS_CFG: Record<string, { label: string; cls: string }> = {
  pending:   { label: 'Pending Verification',  cls: 'pending'   },
  active:    { label: 'Active — Countdown',    cls: 'active'    },
  completed: { label: 'Completed',             cls: 'completed' },
  cancelled: { label: 'Cancelled',             cls: 'failed'    },
};

/* ─── Video helpers ── */
function getYouTubeId(url: string) {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  return m ? m[1] : null;
}

function getVimeoId(url: string) {
  const m = url.match(/vimeo\.com\/(\d+)/);
  return m ? m[1] : null;
}

function getEmbedUrl(src: string) {
  if (src.includes('youtube.com') || src.includes('youtu.be')) {
    const id = getYouTubeId(src);
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : src;
  }
  if (src.includes('vimeo.com')) {
    const id = getVimeoId(src);
    return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : src;
  }
  return null; // native
}

function getThumbnail(src: string): string | null {
  if (src.includes('youtube.com') || src.includes('youtu.be')) {
    const id = getYouTubeId(src);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
  }
  return null;
}

function isEmbedded(src: string) {
  return src.includes('youtube.com') || src.includes('youtu.be') || src.includes('vimeo.com');
}

/* ─── VideoPlayer ── */
function VideoPlayer({ src, title }: { src: string; title: string }) {
  const [open, setOpen]               = useState(false);
  const [thumbErr, setThumbErr]       = useState(false);
  const [muted, setMuted]             = useState(false);
  const [fullscreen, setFullscreen]   = useState(false);
  const videoRef                      = useRef<HTMLVideoElement>(null);
  const wrapRef                       = useRef<HTMLDivElement>(null);

  const thumbnail = getThumbnail(src);
  const embedded  = isEmbedded(src);
  const embedUrl  = getEmbedUrl(src);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  const toggleFullscreen = () => {
    if (!wrapRef.current) return;
    if (!document.fullscreenElement) {
      wrapRef.current.requestFullscreen().then(() => setFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setFullscreen(false)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (videoRef.current) { videoRef.current.muted = !videoRef.current.muted; setMuted(p => !p); }
  };

  return (
    <>
      {/* Thumbnail */}
      <div className="vp-thumb" onClick={() => setOpen(true)} role="button" aria-label={`Play ${title}`}>
        {thumbnail && !thumbErr ? (
          <Image
            src={thumbnail} alt={title} fill
            className="vp-thumb-img" onError={() => setThumbErr(true)}
            sizes="(max-width: 768px) 100vw, 600px"
          />
        ) : (
          <div style={{ width:'100%', height:'100%', background:'#111', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Play size={28} color="rgba(255,255,255,0.3)" />
          </div>
        )}
        <div className="vp-overlay" />
        <div className="vp-play-ring">
          <Play size={18} color="#f97316" style={{ marginLeft:2 }} />
        </div>
        {!embedded && <span className="vp-badge">Video</span>}
      </div>

      <div className="vp-label">
        <span className="vp-label-dot" />
        <span>
          {embedded
            ? src.includes('youtube') ? 'Watch on YouTube' : 'Watch on Vimeo'
            : 'Watch task overview'}
        </span>
      </div>

      {/* Lightbox */}
      {open && (
        <div className="vp-lightbox" onClick={() => setOpen(false)}>
          <div className="vp-lb-header" onClick={e => e.stopPropagation()}>
            <p className="vp-lb-title">{title}</p>
            <button className="vp-lb-close" onClick={() => setOpen(false)}><X size={15} /></button>
          </div>

          <div ref={wrapRef} className="vp-lb-wrap" onClick={e => e.stopPropagation()}>
            {embedded && embedUrl ? (
              <iframe className="vp-iframe" src={embedUrl} allowFullScreen title={title} allow="autoplay; fullscreen" />
            ) : (
              <video
                ref={videoRef} className="vp-native"
                src={src} controls autoPlay
                muted={muted}
              />
            )}
          </div>

          {/* Controls row — only shown for native video */}
          {!embedded && (
            <div className="vp-lb-controls" onClick={e => e.stopPropagation()}>
              <button className="vp-ctrl-btn" onClick={toggleMute}>
                {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                {muted ? 'Unmute' : 'Mute'}
              </button>
              <button className="vp-ctrl-btn" onClick={toggleFullscreen}>
                {fullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                {fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </button>
            </div>
          )}

          <p className="vp-esc-hint" onClick={e => e.stopPropagation()}>Press ESC or click outside to close</p>
        </div>
      )}
    </>
  );
}

/* ─── Spinner ── */
function Spinner() {
  return (
    <div className="ds-spinner-page">
      <svg className="ds-spinner" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
    </div>
  );
}

/* ─── Page ── */
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
      const d   = res.data as Task[] | ApiResponse<Task>;
      setTasks(Array.isArray(d) ? d : Array.isArray(d?.results) ? d.results! : []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load tasks';
      setError(msg); showToast('Failed to load tasks', 'error'); setTasks([]);
    } finally { setLoading(false); }
  }, [showToast]);

  const fetchMyInvestments = useCallback(async () => {
    try {
      const res = await apiService.get('/tasks/investments/');
      const d   = res.data as TaskInvestment[] | ApiResponse<TaskInvestment>;
      setInvestments(Array.isArray(d) ? d : Array.isArray(d?.results) ? d.results! : []);
    } catch { setInvestments([]); }
  }, []);

  useEffect(() => { fetchTasks(); fetchMyInvestments(); }, [fetchTasks, fetchMyInvestments]);
  useEffect(() => {
    const t = setInterval(fetchMyInvestments, 60000);
    return () => clearInterval(t);
  }, [fetchMyInvestments]);

  const handleInvest = async () => {
    if (!selectedTask || !selectedTier) return;
    setInvesting(true);
    try {
      await apiService.post(`/tasks/investments/${selectedTask.id}/invest/`, { tier: selectedTier });
      showToast(`Investment request sent for ${selectedTier} tier.`, 'success');
      setShowModal(false); setSelectedTask(null); setSelectedTier(null);
      await fetchMyInvestments(); setActiveTab('my');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } }; message?: string };
      showToast(e?.response?.data?.error || e?.message || 'Investment failed', 'error');
    } finally { setInvesting(false); }
  };

  const videoSrc = (task: Task) => task.video || task.video_url || null;

  const stats = [
    { label:'Total Invested',    value: formatCurrency(investments.reduce((s,i) => s + (i.amount || 0), 0)),        icon: DollarSign },
    { label:'Expected Return',   value: formatCurrency(investments.reduce((s,i) => s + (i.reward_amount || 0), 0)), icon: TrendingUp },
    { label:'Active',            value: investments.filter(i => i.status === 'active').length,                      icon: Timer      },
  ];

  return (
    <>
      <div className="ds ds-page ds-fade-up">
        <style>{DASH_STYLES + VIDEO_STYLES}</style>

        <div>
          <h1 className="ds-page-title">Investment Tasks</h1>
          <p className="ds-page-subtitle">Choose a task, select your tier, and start earning</p>
        </div>

        {/* Stats */}
        <div className="ds-stat-grid" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))' }}>
          {stats.map(s => {
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

        {/* ── Available Tasks ── */}
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
              {tasks.map(task => {
                const vid = videoSrc(task);
                return (
                  <div key={task.id} className="ds-card">
                    <div style={{ padding:18 }}>

                      {/* Task header */}
                      <p style={{ fontSize:14, fontWeight:600, color:'#1a1a1a', marginBottom:6 }}>{task.title}</p>
                      <p style={{ fontSize:12, color:'#aaa', lineHeight:1.6, marginBottom: vid ? 14 : 16 }}>{task.description}</p>

                      {/* Video — two-column on wide screens */}
                      {vid && (
                        <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) minmax(0,2fr)', gap:18, marginBottom:18, alignItems:'start' }}
                          className="vp-layout">
                          <style>{`@media(max-width:640px){.vp-layout{grid-template-columns:1fr!important}}`}</style>
                          <div>
                            <VideoPlayer src={vid} title={task.title} />
                          </div>
                          <div>
                            {/* Tier cards sit beside video on wide screens */}
                            <p style={{ fontSize:11, fontWeight:600, color:'#bbb', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:10 }}>Select a Tier</p>
                            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                              {TIERS.map(tier => {
                                const Icon  = tier.icon;
                                const price  = task[`${tier.id}_price`  as keyof Task] as number;
                                const reward = task[`${tier.id}_reward` as keyof Task] as number;
                                const pct    = price > 0 ? ((reward - price) / price * 100).toFixed(0) : '0';
                                return (
                                  <div key={tier.id}
                                    style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 12px', background:'#fafafa', border:'1.5px solid rgba(0,0,0,0.08)', borderRadius:10, cursor:'pointer', transition:'border-color .15s, background .15s' }}
                                    onClick={() => { setSelectedTask(task); setSelectedTier(tier.id); setShowModal(true); }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor='#f97316'; (e.currentTarget as HTMLDivElement).style.background='#fff8f4'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor='rgba(0,0,0,0.08)'; (e.currentTarget as HTMLDivElement).style.background='#fafafa'; }}
                                  >
                                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                      <div style={{ width:24, height:24, borderRadius:6, background:'#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                        <Icon size={12} color="#888" />
                                      </div>
                                      <div>
                                        <p style={{ fontSize:12.5, fontWeight:600, color:'#1a1a1a' }}>{tier.name}</p>
                                        <p style={{ fontSize:11, color:'#bbb' }}>+{pct}% profit</p>
                                      </div>
                                    </div>
                                    <div style={{ textAlign:'right' }}>
                                      <p style={{ fontSize:12.5, fontWeight:600, color:'#1a1a1a' }}>{formatCurrency(price)}</p>
                                      <p style={{ fontSize:11, color:'#16a34a', fontWeight:500 }}>→ {formatCurrency(reward)}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* No-video: tier grid */}
                      {!vid && (
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
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* ── My Investments ── */}
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
                const sc  = STATUS_CFG[inv.status] || STATUS_CFG.pending;
                const tier = TIERS.find(t => t.id === inv.tier);
                const TierIcon = tier?.icon || Medal;
                return (
                  <div key={inv.id} className="ds-card" style={{ padding:18 }}>
                    <div style={{ display:'flex', alignItems:'center', flexWrap:'wrap', gap:8, marginBottom:12 }}>
                      <TierIcon size={14} color="#888" />
                      <p style={{ fontSize:13.5, fontWeight:600, color:'#1a1a1a' }}>{inv.task_title}</p>
                      <span className={`ds-badge ${sc.cls}`}><span className="ds-badge-dot" />{sc.label}</span>
                    </div>

                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))', gap:12, marginBottom:12 }}>
                      {[
                        ['Invested',        formatCurrency(inv.amount)],
                        ['Expected Return', formatCurrency(inv.reward_amount)],
                        ['Profit',         `+${formatCurrency(inv.profit)}`],
                        ['Invested On',     formatDate(inv.created_at)],
                      ].map(([l, v]) => (
                        <div key={l}>
                          <p style={{ fontSize:11, color:'#bbb', marginBottom:3 }}>{l}</p>
                          <p style={{ fontSize:12.5, fontWeight:600, color:'#1a1a1a' }}>{v}</p>
                        </div>
                      ))}
                    </div>

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

      {/* ── Invest Confirm Modal ── */}
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

              <div className="ds-fee-strip" style={{ marginBottom:16 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                  <Icon size={14} color="#888" />
                  <p style={{ fontSize:13, fontWeight:600, color:'#1a1a1a' }}>{tier.name} Tier</p>
                </div>
                {[
                  ['Investment Amount', formatCurrency(price)],
                  ['Reward Amount',     formatCurrency(reward)],
                  ['Profit',           `+${formatCurrency(profit)} (${pct}%)`],
                ].map(([l, v]) => (
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