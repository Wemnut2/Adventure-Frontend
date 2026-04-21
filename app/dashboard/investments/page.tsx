'use client';

import { useState, useEffect } from 'react';
import { useInvestmentStore } from '@/libs/stores/investment.store';
import { useToast } from '@/libs/src/contexts/ToastContext';
import { formatCurrency, formatDate } from '@/libs/utils/format';
import { DASH_STYLES } from '@/app/styles/dashboardStyles';
import {
  openWhatsApp,
  openWhatsAppSecondary,
  openTelegram,
  openTelegramSecondary,
} from '@/libs/utils/whatsapp';
import {
  TrendingUp, DollarSign, Timer, CheckCircle,
  Clock, ArrowRight, AlertCircle, X, ChevronLeft,
} from 'lucide-react';
import { InvestmentPlan } from '@/libs/types';

interface InfoRowProps { label: string; value: string | number; }

const STATUS_CFG: Record<string, { label: string; cls: string }> = {
  pending:         { label: 'Pending Verification', cls: 'pending'   },
  active:          { label: 'Active',               cls: 'active'    },
  completed:       { label: 'Completed',            cls: 'completed' },
  cancelled:       { label: 'Cancelled',            cls: 'failed'    },
  pending_payment: { label: 'Pending Verification', cls: 'pending'   },
};

/* ─── Platform picker styles ── */
const PLATFORM_STYLES = `
  .modal-step { animation: stepIn .2s ease; }
  @keyframes stepIn { from { opacity:0; transform:translateX(8px) } to { opacity:1; transform:translateX(0) } }

  .modal-back {
    display: inline-flex; align-items: center; gap: 5px;
    background: none; border: none; cursor: pointer;
    color: #bbb; font-size: 12px; font-family: 'DM Sans', sans-serif;
    padding: 0; margin-bottom: 16px; transition: color .15s;
  }
  .modal-back:hover { color: #555; }

  .invest-summary {
    display: flex; align-items: center; gap: 10px;
    background: #fafafa; border: 1px solid rgba(0,0,0,0.07);
    border-radius: 10px; padding: 10px 12px; margin-bottom: 18px;
  }
  .invest-summary-icon {
    width: 32px; height: 32px; border-radius: 8px; background: #fff3ea;
    border: 1px solid rgba(249,115,22,0.15);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .invest-summary-text { flex: 1; min-width: 0; }
  .invest-summary-title { font-size: 12.5px; font-weight: 600; color: #1a1a1a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .invest-summary-meta { font-size: 11px; color: #aaa; margin-top: 1px; }
  .invest-summary-amount { font-size: 13px; font-weight: 700; color: #f97316; flex-shrink: 0; }

  .platform-label {
    font-size: 11px; font-weight: 600; color: #bbb; text-transform: uppercase;
    letter-spacing: 0.05em; margin-bottom: 10px;
  }
  .platform-stack { display: flex; flex-direction: column; gap: 8px; }

  .platform-btn {
    width: 100%; display: flex; align-items: center; gap: 10px;
    padding: 11px 14px; background: #fafafa;
    border: 1.5px solid rgba(0,0,0,0.08); border-radius: 10px;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    font-size: 12.5px; font-weight: 500; color: #1a1a1a;
    transition: background .15s, border-color .15s, transform .1s;
    text-align: left;
  }
  .platform-btn:hover { background: #f5f5f5; border-color: rgba(0,0,0,0.14); transform: translateY(-1px); }
  .platform-btn:active { transform: translateY(0); }
  .platform-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .platform-btn.wa:hover  { background: #f0faf4; border-color: rgba(37,211,102,0.30); }
  .platform-btn.tg:hover  { background: #f0f7ff; border-color: rgba(0,136,204,0.30); }

  .platform-btn-icon {
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .platform-btn-icon.wa { background: #25D366; color: #fff; }
  .platform-btn-icon.tg { background: #0088CC; color: #fff; }

  .platform-btn-text { flex: 1; }
  .platform-btn-name { display: block; font-size: 12.5px; font-weight: 500; color: #1a1a1a; }
  .platform-btn-sub  { display: block; font-size: 11px; color: #bbb; margin-top: 1px; }
  .platform-btn-arrow { color: #ccc; font-size: 16px; flex-shrink: 0; }

  .platform-divider {
    display: flex; align-items: center; gap: 8px; margin: 10px 0;
  }
  .platform-divider-line { flex: 1; height: 1px; background: rgba(0,0,0,0.07); }
  .platform-divider-text { font-size: 10.5px; color: #ccc; font-weight: 500; letter-spacing: 0.03em; }

  .platform-hint {
    font-size: 11px; color: #bbb; text-align: center; margin-top: 14px; line-height: 1.6;
  }
`;

/* ─── Platform icons ── */
function WaIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.33 4.94L2.05 22l5.32-1.4c1.46.8 3.11 1.22 4.81 1.22 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.91-9.91-9.91z"/>
    </svg>
  );
}
function TgIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.2c-.06-.06-.15-.04-.22-.02-.09.02-1.55.99-4.37 2.89-.41.28-.79.42-1.12.41-.37-.01-1.08-.21-1.61-.38-.65-.21-1.16-.32-1.12-.68.02-.19.28-.38.78-.58 3.04-1.32 5.07-2.19 6.09-2.62 2.9-1.21 3.5-1.42 3.89-1.42.09 0 .28.02.4.12.1.08.13.19.14.27-.01.06-.01.13-.02.2z"/>
    </svg>
  );
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
      <span style={{ color: '#aaa' }}>{label}</span>
      <span style={{ fontWeight: 500, color: '#1a1a1a' }}>{value}</span>
    </div>
  );
}

function Spinner() {
  return (
    <div className="ds-spinner-page">
      <svg className="ds-spinner" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
    </div>
  );
}

export default function InvestmentsPage() {
  const { plans, userInvestments, isLoading, fetchPlans, fetchUserInvestments, createInvestment } = useInvestmentStore();
  const { showToast } = useToast();

  const [selectedPlan, setSelectedPlan]         = useState<InvestmentPlan | null>(null);
  const [amount, setAmount]                     = useState('');
  const [showModal, setShowModal]               = useState(false);
  const [showPlatformStep, setShowPlatformStep] = useState(false);
  const [investing, setInvesting]               = useState(false);
  const [activeTab, setActiveTab]               = useState<'plans' | 'my'>('plans');

  useEffect(() => { fetchPlans(); fetchUserInvestments(); }, [fetchUserInvestments, fetchPlans]);
  useEffect(() => {
    const t = setInterval(fetchUserInvestments, 60000);
    return () => clearInterval(t);
  }, [fetchUserInvestments]);

  /* Validation before advancing to platform step */
  const handleRequestInvestment = () => {
    if (!selectedPlan || !amount) { showToast('Please enter an amount', 'error'); return; }
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) { showToast('Please enter a valid amount', 'error'); return; }
    if (num < selectedPlan.min_amount) { showToast(`Minimum is ${formatCurrency(selectedPlan.min_amount)}`, 'error'); return; }
    if (selectedPlan.max_amount && num > selectedPlan.max_amount) { showToast(`Maximum is ${formatCurrency(selectedPlan.max_amount)}`, 'error'); return; }
    setShowPlatformStep(true);
  };

  /* Called when user picks a platform — fires API + opens messaging app */
  const handlePlatformSelect = async (openFn: (msg: string) => void) => {
    if (!selectedPlan) return;
    const num    = parseFloat(amount);
    const profit = num * selectedPlan.expected_return / 100;

    const message =
      `Hello, I'd like to make an investment payment:\n\n` +
      `📌 Plan: ${selectedPlan.name}\n` +
      `💰 Investment Amount: ${formatCurrency(num)}\n` +
      `📈 Expected Return: +${selectedPlan.expected_return}%\n` +
      `🎯 Total Return: ${formatCurrency(num + profit)}\n` +
      `💵 Profit: +${formatCurrency(profit)}\n` +
      `⏳ Duration: ${selectedPlan.duration_days} days\n\n` +
      `Please confirm and provide payment details. Thank you!`;

    /* Open the platform immediately */
    openFn(message);

    /* Fire the API in the background */
    setInvesting(true);
    try {
      await createInvestment(selectedPlan.id, num);
      showToast('Investment request sent! Admin will verify it.', 'success');
      await fetchUserInvestments();
      setActiveTab('my');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      showToast(error?.response?.data?.message || error?.message || 'Investment failed', 'error');
    } finally {
      setInvesting(false);
      closeModal();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setShowPlatformStep(false);
    setSelectedPlan(null);
    setAmount('');
  };

  const totalInvested = userInvestments.reduce((s, i) => s + i.amount, 0);
  const totalExpected = userInvestments.reduce((s, i) => s + i.expected_return_amount, 0);
  const activeCount   = userInvestments.filter(i => i.status === 'active').length;

  const num    = parseFloat(amount) || 0;
  const profit = selectedPlan ? num * selectedPlan.expected_return / 100 : 0;

  if (isLoading) return <><Spinner /></>;

  return (
    <>
      <div className="ds ds-page ds-fade-up">
        <style>{DASH_STYLES + PLATFORM_STYLES}</style>

        <div>
          <h1 className="ds-page-title">Investment Plans</h1>
          <p className="ds-page-subtitle">Choose a plan, invest, and watch your money grow</p>
        </div>

        {/* Stats */}
        <div className="ds-stat-grid" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))' }}>
          {[
            { label:'Total Invested',  value: formatCurrency(totalInvested), icon: DollarSign },
            { label:'Expected Return', value: formatCurrency(totalExpected), icon: TrendingUp },
            { label:'Active',          value: activeCount,                   icon: Timer      },
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
          <button className={`ds-tab ${activeTab === 'plans' ? 'active' : ''}`} onClick={() => setActiveTab('plans')}>
            Available Plans
          </button>
          <button className={`ds-tab ${activeTab === 'my' ? 'active' : ''}`} onClick={() => setActiveTab('my')}>
            My Investments ({userInvestments.length})
          </button>
        </div>

        {/* ── Plans ── */}
        {activeTab === 'plans' && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:14 }}>
            {(plans || []).map(plan => (
              <div key={plan.id} className="ds-card" style={{ display:'flex', flexDirection:'column' }}>
                <div style={{ padding:'18px 18px 0', flex:1 }}>
                  <div style={{ width:38, height:38, borderRadius:10, background:'#f5f5f5', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12 }}>
                    <TrendingUp size={16} color="#888" />
                  </div>
                  <p style={{ fontSize:14, fontWeight:600, color:'#1a1a1a', marginBottom:4 }}>{plan.name}</p>
                  {plan.description && <p style={{ fontSize:12, color:'#aaa', lineHeight:1.55, marginBottom:14 }}>{plan.description}</p>}

                  <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, paddingBottom:8, borderBottom:'1px solid rgba(0,0,0,0.06)' }}>
                      <span style={{ color:'#aaa' }}>Expected Return</span>
                      <span style={{ fontWeight:600, color:'#16a34a' }}>+{plan.expected_return}%</span>
                    </div>
                    <InfoRow label="Duration"       value={`${plan.duration_days} days`}      />
                    <InfoRow label="Min Investment" value={formatCurrency(plan.min_amount)}   />
                  </div>
                </div>
                <div style={{ padding:'0 18px 18px' }}>
                  <button className="ds-btn-primary" style={{ width:'100%' }}
                    onClick={() => { setSelectedPlan(plan); setAmount(''); setShowPlatformStep(false); setShowModal(true); }}>
                    Invest Now <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── My Investments ── */}
        {activeTab === 'my' && (
          userInvestments.length === 0 ? (
            <div className="ds-empty" style={{ background:'#fafafa', border:'1px solid rgba(0,0,0,0.07)', borderRadius:14 }}>
              <div className="ds-empty-icon"><DollarSign size={18} /></div>
              <p className="ds-empty-title">No investments yet</p>
              <p className="ds-empty-sub">Browse investment plans to get started</p>
              <button className="ds-btn-primary ds-btn-sm" onClick={() => setActiveTab('plans')}>Browse Plans</button>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {userInvestments.map(inv => {
                const sc = STATUS_CFG[inv.status] || STATUS_CFG.pending;
                return (
                  <div key={inv.id} className="ds-card" style={{ padding:'18px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:10 }}>
                      <p style={{ fontSize:13.5, fontWeight:600, color:'#1a1a1a' }}>{inv.plan_name}</p>
                      <span className={`ds-badge ${sc.cls}`}><span className="ds-badge-dot" />{sc.label}</span>
                    </div>
                    {inv.plan_description && <p style={{ fontSize:12, color:'#aaa', marginBottom:12 }}>{inv.plan_description}</p>}

                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))', gap:12, marginBottom:10 }}>
                      {[
                        ['Invested',        formatCurrency(inv.amount)],
                        ['Expected Return', formatCurrency(inv.expected_return_amount)],
                        ['Daily Profit',    formatCurrency(inv.daily_profit)],
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
                          <span>Progress</span>
                          <span style={{ color:'#f97316', fontWeight:500 }}>{inv.progress_percentage}% · {inv.days_remaining} days remaining</span>
                        </div>
                        <div className="ds-progress-bar"><div className="ds-progress-fill" style={{ width:`${inv.progress_percentage}%` }} /></div>
                      </div>
                    )}
                    {inv.status === 'pending_payment' && (
                      <div className="ds-warn-strip" style={{ marginTop:10 }}>
                        <Clock size={13} style={{ flexShrink:0, marginTop:1 }} />
                        <span>Awaiting admin verification. This usually takes 24–48 hours.</span>
                      </div>
                    )}
                    {inv.status === 'completed' && (
                      <div className="ds-success-strip" style={{ marginTop:10 }}>
                        <CheckCircle size={13} style={{ flexShrink:0, marginTop:1 }} />
                        <span>Investment completed! You earned <strong>{formatCurrency(inv.total_profit)}</strong> profit.</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>

      {/* ── Modal ── */}
      {showModal && selectedPlan && (() => {

        /* ── Step 2: Platform selection ── */
        if (showPlatformStep) {
          const platforms = [
            { label:'WhatsApp Support 1', sub:'Primary channel',   type:'wa', action: () => handlePlatformSelect(openWhatsApp) },
            { label:'WhatsApp Support 2', sub:'Secondary channel', type:'wa', action: () => handlePlatformSelect(openWhatsAppSecondary) },
            { label:'Telegram Support 1', sub:'Primary channel',   type:'tg', action: () => handlePlatformSelect(openTelegram) },
            { label:'Telegram Support 2', sub:'Secondary channel', type:'tg', action: () => handlePlatformSelect(openTelegramSecondary) },
          ];
          const waGroup = platforms.filter(p => p.type === 'wa');
          const tgGroup = platforms.filter(p => p.type === 'tg');

          return (
            <div className="ds-modal-overlay" onClick={closeModal}>
              <div className="ds-modal modal-step" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:4 }}>
                  <div>
                    <p className="ds-modal-title">Choose Payment Channel</p>
                    <p className="ds-modal-sub">Select a platform to proceed with payment</p>
                  </div>
                  <button className="ds-icon-btn" onClick={closeModal}><X size={15} /></button>
                </div>

                {/* Back */}
                <button className="modal-back" onClick={() => setShowPlatformStep(false)}>
                  <ChevronLeft size={13} /> Back to details
                </button>

                {/* Compact summary */}
                <div className="invest-summary">
                  <div className="invest-summary-icon">
                    <TrendingUp size={14} color="#f97316" />
                  </div>
                  <div className="invest-summary-text">
                    <p className="invest-summary-title">{selectedPlan.name}</p>
                    <p className="invest-summary-meta">+{selectedPlan.expected_return}% return · {selectedPlan.duration_days} days</p>
                  </div>
                  <p className="invest-summary-amount">{formatCurrency(parseFloat(amount))}</p>
                </div>

                {/* WhatsApp */}
                <p className="platform-label">WhatsApp</p>
                <div className="platform-stack" style={{ marginBottom:0 }}>
                  {waGroup.map((p, i) => (
                    <button key={i} className={`platform-btn ${p.type}`} onClick={p.action} disabled={investing}>
                      <span className={`platform-btn-icon ${p.type}`}><WaIcon /></span>
                      <span className="platform-btn-text">
                        <span className="platform-btn-name">{p.label}</span>
                        <span className="platform-btn-sub">{p.sub}</span>
                      </span>
                      <span className="platform-btn-arrow">›</span>
                    </button>
                  ))}
                </div>

                {/* Divider */}
                <div className="platform-divider">
                  <span className="platform-divider-line" />
                  <span className="platform-divider-text">or</span>
                  <span className="platform-divider-line" />
                </div>

                {/* Telegram */}
                <p className="platform-label">Telegram</p>
                <div className="platform-stack">
                  {tgGroup.map((p, i) => (
                    <button key={i} className={`platform-btn ${p.type}`} onClick={p.action} disabled={investing}>
                      <span className={`platform-btn-icon ${p.type}`}><TgIcon /></span>
                      <span className="platform-btn-text">
                        <span className="platform-btn-name">{p.label}</span>
                        <span className="platform-btn-sub">{p.sub}</span>
                      </span>
                      <span className="platform-btn-arrow">›</span>
                    </button>
                  ))}
                </div>

                <p className="platform-hint">
                  Your investment details will be pre-filled in the message.<br />
                  {investing ? 'Processing your request…' : 'Our team will confirm your payment and activate your plan.'}
                </p>
              </div>
            </div>
          );
        }

        /* ── Step 1: Amount entry + details ── */
        return (
          <div className="ds-modal-overlay" onClick={closeModal}>
            <div className="ds-modal modal-step" onClick={e => e.stopPropagation()}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
                <div>
                  <p className="ds-modal-title">Invest in {selectedPlan.name}</p>
                  <p className="ds-modal-sub">{selectedPlan.description}</p>
                </div>
                <button className="ds-icon-btn" onClick={closeModal}><X size={15} /></button>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <div>
                  <label className="ds-input-label">Investment Amount (USD)</label>
                  <input
                    className="ds-input" type="number" value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder={`Min: ${selectedPlan.min_amount}`}
                  />
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <p className="ds-input-hint">Min: {formatCurrency(selectedPlan.min_amount)}</p>
                    {selectedPlan.max_amount && <p className="ds-input-hint">Max: {formatCurrency(selectedPlan.max_amount)}</p>}
                  </div>
                </div>

                {amount && num > 0 && (
                  <div className="ds-fee-strip">
                    <div className="ds-fee-row">
                      <span style={{ color:'#aaa' }}>Investment</span>
                      <span style={{ fontWeight:500 }}>{formatCurrency(num)}</span>
                    </div>
                    <div className="ds-fee-row">
                      <span style={{ color:'#aaa' }}>Expected Return ({selectedPlan.expected_return}%)</span>
                      <span style={{ fontWeight:500, color:'#16a34a' }}>{formatCurrency(num + profit)}</span>
                    </div>
                    <div className="ds-fee-divider" />
                    <div className="ds-fee-row" style={{ fontWeight:600 }}>
                      <span style={{ color:'#aaa' }}>Profit</span>
                      <span style={{ color:'#16a34a' }}>+{formatCurrency(profit)}</span>
                    </div>
                  </div>
                )}

                <div className="ds-info-strip">
                  <AlertCircle size={13} style={{ flexShrink:0, marginTop:1 }} />
                  <span>After investing, admin verifies your request. Once verified, a <strong>{selectedPlan.duration_days}-day</strong> countdown starts and you&apos;ll earn daily profits.</span>
                </div>
              </div>

              <div className="ds-modal-actions">
                <button className="ds-btn-ghost" onClick={closeModal}>Cancel</button>
                <button className="ds-btn-primary" onClick={handleRequestInvestment}>
                  Request Investment
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}