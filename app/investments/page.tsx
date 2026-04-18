// src/app/(dashboard)/investments/page.tsx
'use client';

import { useState } from 'react';
import { MainLayout } from '@/layout/sections/dashboard/MainLayout';
import { useInvestmentPlans, useMyInvestments, useTransactions, useCreateInvestment } from '@/libs/hooks/useInvestments';
import { formatCurrency } from '@/libs/utils/format';
import { ArrowUp, X, TrendingUp, DollarSign } from 'lucide-react';
import { InvestmentPlan } from '@/libs/types';
import { DASH_STYLES } from '@/app/styles/dashboardStyles';

/* ─── Invest Modal ── */
function InvestModal({ plan, onClose, onSuccess }: { plan: InvestmentPlan; onClose: () => void; onSuccess: () => void }) {
  const [amount, setAmount] = useState(String(plan.min_amount));
  const createInvestment    = useCreateInvestment();

  const num      = parseFloat(amount) || 0;
  const min      = Number(plan.min_amount);
  const max      = plan.max_amount ? Number(plan.max_amount) : Infinity;
  const isValid  = num >= min && num <= max;
  const expected = isValid ? num * (1 + Number(plan.roi) / 100) : null;

  const handleSubmit = () => {
    if (!isValid) return;
    createInvestment.mutate({ planId: plan.id, amount: num }, {
      onSuccess: () => { onSuccess(); onClose(); }
    });
  };

  return (
    <div className="ds-modal-overlay" onClick={onClose}>
      <div className="ds-modal" onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
          <div>
            <p className="ds-modal-title">Invest in {plan.name}</p>
            <p className="ds-modal-sub">Review the plan and confirm your amount</p>
          </div>
          <button className="ds-icon-btn" onClick={onClose}><X size={15} /></button>
        </div>

        {/* Plan summary strip */}
        <div className="ds-fee-strip" style={{ marginBottom:18 }}>
          {[
            ['Min. amount', formatCurrency(min)],
            ['ROI',         `${plan.roi}%`],
            ['Duration',    `${plan.duration_days} days`],
          ].map(([l,v]) => (
            <div className="ds-fee-row" key={l}>
              <span style={{ color:'#aaa' }}>{l}</span>
              <span style={{ fontWeight:500 }}>{v}</span>
            </div>
          ))}
        </div>

        <div style={{ marginBottom:18 }}>
          <label className="ds-input-label">Amount to invest</label>
          <input type="number" className="ds-input" value={amount} min={min} max={plan.max_amount ? max : undefined}
            onChange={e => setAmount(e.target.value)} placeholder="Enter amount" />
          {amount && !isValid ? (
            <p className="ds-input-error">{num < min ? `Minimum is ${formatCurrency(min)}` : `Maximum is ${formatCurrency(max)}`}</p>
          ) : expected ? (
            <p style={{ fontSize:11.5, color:'#16a34a', marginTop:4 }}>Expected return: {formatCurrency(expected)}</p>
          ) : null}
        </div>

        <div className="ds-modal-actions">
          <button className="ds-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="ds-btn-primary" disabled={!isValid || createInvestment.isPending} onClick={handleSubmit}>
            {createInvestment.isPending ? 'Processing…' : 'Confirm Investment'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main ── */
type Tab = 'plans' | 'my' | 'transactions';

export default function InvestmentPage() {
  const [activeTab, setActiveTab]     = useState<Tab>('plans');
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);

  const { plans,        isLoading: plansLoading }        = useInvestmentPlans();
  const { investments,  isLoading: investmentsLoading }  = useMyInvestments();
  const { transactions, isLoading: transactionsLoading } = useTransactions();

  const tabs: { key: Tab; label: string }[] = [
    { key: 'plans',        label: 'Plans' },
    { key: 'my',           label: `My Investments${(investments ?? []).length > 0 ? ` (${investments!.length})` : ''}` },
    { key: 'transactions', label: 'Transactions' },
  ];

  function Spinner() {
    return (
      <div className="ds-spinner-page">
        <svg className="ds-spinner" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      </div>
    );
  }

  function Empty({ msg }: { msg: string }) {
    return (
      <div className="ds-empty">
        <div className="ds-empty-icon"><TrendingUp size={18} /></div>
        <p className="ds-empty-title">{msg}</p>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="ds ds-page ds-fade-up" style={{ maxWidth:900 }}>
        <style>{DASH_STYLES}</style>

        <div>
          <h1 className="ds-page-title">Investments</h1>
          <p className="ds-page-subtitle">Grow your money with smart plans</p>
        </div>

        <div className="ds-tabs">
          {tabs.map(t => (
            <button key={t.key} className={`ds-tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Plans */}
        {activeTab === 'plans' && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:14 }}>
            {plansLoading ? <Spinner /> :
             (plans ?? []).length === 0 ? <Empty msg="No investment plans available." /> :
             (plans ?? []).map(plan => (
              <div key={plan.id} className="ds-card" style={{ display:'flex', flexDirection:'column' }}>
                <div style={{ padding:'16px 18px 0', flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                    <p style={{ fontSize:13.5, fontWeight:600, color:'#1a1a1a' }}>{plan.name}</p>
                    <span style={{ fontSize:11.5, fontWeight:600, background:'#f0fdf4', color:'#15803d', padding:'3px 10px', borderRadius:20 }}>{plan.roi}% ROI</span>
                  </div>
                  {plan.description && (
                    <p style={{ fontSize:12, color:'#aaa', lineHeight:1.55, marginBottom:12 }}>{plan.description}</p>
                  )}
                  <div style={{ display:'flex', flexDirection:'column', gap:7, marginBottom:14 }}>
                    {[
                      ['Min. amount', formatCurrency(Number(plan.min_amount))],
                      ['Duration',    `${plan.duration_days} days`],
                      ...(plan.max_amount ? [['Max. amount', formatCurrency(Number(plan.max_amount))]] : []),
                    ].map(([l,v]) => (
                      <div key={l} style={{ display:'flex', justifyContent:'space-between', fontSize:12 }}>
                        <span style={{ color:'#aaa' }}>{l}</span>
                        <span style={{ fontWeight:500, color:'#1a1a1a' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ padding:'0 18px 18px' }}>
                  <button className="ds-btn-primary" style={{ width:'100%' }} onClick={() => setSelectedPlan(plan)}>
                    <ArrowUp size={13} /> Invest Now
                  </button>
                </div>
              </div>
             ))}
          </div>
        )}

        {/* My Investments */}
        {activeTab === 'my' && (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {investmentsLoading ? <Spinner /> :
             (investments ?? []).length === 0 ? <Empty msg="No active investments yet." /> :
             (investments ?? []).map(inv => (
              <div key={inv.id} className="ds-card" style={{ padding:'16px 18px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                  <div>
                    <p style={{ fontSize:13.5, fontWeight:600, color:'#1a1a1a', marginBottom:3 }}>{inv.plan_name}</p>
                    <p style={{ fontSize:11.5, color:'#bbb' }}>
                      {new Date(inv.created_at).toLocaleDateString('en-NG', { day:'numeric', month:'short', year:'numeric' })}
                    </p>
                  </div>
                  <p style={{ fontSize:16, fontWeight:700, color:'#16a34a' }}>+{formatCurrency(Number(inv.expected_return))}</p>
                </div>
                <div className="ds-divider" />
                <div style={{ display:'flex', gap:20, marginTop:10, fontSize:12 }}>
                  <span style={{ color:'#aaa' }}>Invested: <span style={{ fontWeight:500, color:'#1a1a1a' }}>{formatCurrency(Number(inv.amount))}</span></span>
                  {inv.status && (
                    <span className={`ds-badge ${inv.status}`}><span className="ds-badge-dot" />{inv.status}</span>
                  )}
                </div>
              </div>
             ))}
          </div>
        )}

        {/* Transactions */}
        {activeTab === 'transactions' && (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {transactionsLoading ? <Spinner /> :
             (transactions ?? []).length === 0 ? <Empty msg="No transactions yet." /> :
             (transactions ?? []).map(tx => (
              <div key={tx.id} className="ds-card" style={{ padding:'14px 18px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <p style={{ fontSize:12.5, fontWeight:500, color:'#1a1a1a', textTransform:'capitalize', marginBottom:3 }}>{tx.type}</p>
                  <p style={{ fontSize:11.5, color:'#bbb' }}>
                    {new Date(tx.created_at).toLocaleDateString('en-NG', { day:'numeric', month:'short', year:'numeric' })}
                  </p>
                </div>
                <p style={{ fontSize:13.5, fontWeight:600, color:'#16a34a' }}>{formatCurrency(Number(tx.amount))}</p>
              </div>
             ))}
          </div>
        )}
      </div>

      {selectedPlan && (
        <InvestModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} onSuccess={() => setActiveTab('my')} />
      )}
    </MainLayout>
  );
}