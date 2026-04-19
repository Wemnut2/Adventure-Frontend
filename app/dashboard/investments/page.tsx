// src/app/(dashboard)/investments/page.tsx (plan-based version)
'use client';

import { useState, useEffect } from 'react';
import { useInvestmentStore } from '@/libs/stores/investment.store';
import { useToast } from '@/libs/src/contexts/ToastContext';
import { formatCurrency, formatDate } from '@/libs/utils/format';
import { DASH_STYLES } from '@/app/styles/dashboardStyles';
import {
  TrendingUp, DollarSign, Timer, CheckCircle,
  Clock, ArrowRight, AlertCircle, X,
} from 'lucide-react';
import { InvestmentPlan } from '@/libs/types';
interface InfoRowProps {
  label: string;
  value: string | number;
}

const STATUS_CFG: Record<string, { label: string; cls: string }> = {
  pending:   { label: 'Pending Verification', cls: 'pending'   },
  active:    { label: 'Active',               cls: 'active'    },
  completed: { label: 'Completed',            cls: 'completed' },
  cancelled: { label: 'Cancelled',            cls: 'failed'    },
};


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
      <svg className="ds-spinner" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
    </div>
  );
}

export default function InvestmentsPage() {
  const { plans, userInvestments, isLoading, fetchPlans, fetchUserInvestments, createInvestment } = useInvestmentStore();
  const { showToast } = useToast();

  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [amount, setAmount]             = useState('');
  const [showModal, setShowModal]       = useState(false);
  const [activeTab, setActiveTab]       = useState<'plans' | 'my'>('plans');

  useEffect(() => { fetchPlans(); fetchUserInvestments(); }, [fetchUserInvestments, fetchPlans]);
  useEffect(() => {
    const t = setInterval(fetchUserInvestments, 60000);
    return () => clearInterval(t);
  }, [fetchUserInvestments]);

  const handleInvest = async () => {
    if (!selectedPlan || !amount) { showToast('Please select a plan and enter amount', 'error'); return; }
    const num = parseFloat(amount);
    if (num < selectedPlan.min_amount) { showToast(`Minimum is ${formatCurrency(selectedPlan.min_amount)}`, 'error'); return; }
    if (selectedPlan.max_amount && num > selectedPlan.max_amount) { showToast(`Maximum is ${formatCurrency(selectedPlan.max_amount)}`, 'error'); return; }
    try {
      await createInvestment(selectedPlan.id, num);
      showToast('Investment request sent! Admin will verify it.', 'success');
      setShowModal(false); setAmount(''); setSelectedPlan(null); setActiveTab('my');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      showToast(error?.response?.data?.message || error?.message || 'Investment failed', 'error');
    }
  };

  const totalInvested   = userInvestments.reduce((s, i) => s + i.amount,                  0);
  const totalExpected   = userInvestments.reduce((s, i) => s + i.expected_return_amount,  0);
  const activeCount     = userInvestments.filter(i => i.status === 'active').length;

  const num    = parseFloat(amount) || 0;
  const profit = selectedPlan ? num * selectedPlan.expected_return / 100 : 0;

  if (isLoading) return <><Spinner /></>;

  return (
    <>
      <div className="ds ds-page ds-fade-up">
        <style>{DASH_STYLES}</style>

        <div>
          <h1 className="ds-page-title">Investment Plans</h1>
          <p className="ds-page-subtitle">Choose a plan, invest, and watch your money grow</p>
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
          <button className={`ds-tab ${activeTab === 'plans' ? 'active' : ''}`} onClick={() => setActiveTab('plans')}>Available Plans</button>
          <button className={`ds-tab ${activeTab === 'my' ? 'active' : ''}`} onClick={() => setActiveTab('my')}>My Investments ({userInvestments.length})</button>
        </div>

        {/* Plans */}
        {activeTab === 'plans' && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:14 }}>
            {(plans || []).map(plan => (
              <div key={plan.id} className="ds-card" style={{ display:'flex', flexDirection:'column' }}>
                <div style={{ padding:'18px 18px 0', flex:1 }}>
                  {/* Icon pill */}
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
                    <InfoRow label="Duration" value={`${plan.duration_days} days`} />
                    <InfoRow label="Min Investment" value={formatCurrency(plan.min_amount)} />
                  </div>
                </div>
                <div style={{ padding:'0 18px 18px' }}>
                  <button className="ds-btn-primary" style={{ width:'100%' }}
                    onClick={() => { setSelectedPlan(plan); setAmount(''); setShowModal(true); }}>
                    Invest Now <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* My Investments */}
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
                        ['Invested',         formatCurrency(inv.amount)],
                        ['Expected Return',  formatCurrency(inv.expected_return_amount)],
                        ['Daily Profit',     formatCurrency(inv.daily_profit)],
                        ['Invested On',      formatDate(inv.created_at)],
                      ].map(([l,v]) => (
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

      {/* Invest Modal */}
      {showModal && selectedPlan && (
        <div className="ds-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="ds-modal" onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
              <div>
                <p className="ds-modal-title">Invest in {selectedPlan.name}</p>
                <p className="ds-modal-sub">{selectedPlan.description}</p>
              </div>
              <button className="ds-icon-btn" onClick={() => setShowModal(false)}><X size={15} /></button>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div>
                <label className="ds-input-label">Investment Amount (USD)</label>
                <input className="ds-input" type="number" value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder={`Min: ${selectedPlan.min_amount}`} />
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <p className="ds-input-hint">Min: {formatCurrency(selectedPlan.min_amount)}</p>
                  {selectedPlan.max_amount && <p className="ds-input-hint">Max: {formatCurrency(selectedPlan.max_amount)}</p>}
                </div>
              </div>

              {amount && num > 0 && (
                <div className="ds-fee-strip">
                  <div className="ds-fee-row"><span style={{ color:'#aaa' }}>Investment</span><span style={{ fontWeight:500 }}>{formatCurrency(num)}</span></div>
                  <div className="ds-fee-row"><span style={{ color:'#aaa' }}>Expected Return ({selectedPlan.expected_return}%)</span><span style={{ fontWeight:500, color:'#16a34a' }}>{formatCurrency(num + profit)}</span></div>
                  <div className="ds-fee-divider" />
                  <div className="ds-fee-row" style={{ fontWeight:600 }}><span style={{ color:'#aaa' }}>Profit</span><span style={{ color:'#16a34a' }}>+{formatCurrency(profit)}</span></div>
                </div>
              )}

              <div className="ds-info-strip">
                <AlertCircle size={13} style={{ flexShrink:0, marginTop:1 }} />
                <span>After investing, admin verifies your request. Once verified, a <strong>{selectedPlan.duration_days}-day</strong> countdown starts and you&apos;ll earn daily profits.</span>
              </div>
            </div>

            <div className="ds-modal-actions">
              <button className="ds-btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="ds-btn-primary" onClick={handleInvest}>Request Investment</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}