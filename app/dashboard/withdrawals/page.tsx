// src/app/(dashboard)/withdrawals/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/libs/stores/auth.store';
import { useInvestmentStore } from '@/libs/stores/investment.store';
import { openWhatsApp, openTelegram } from '@/libs/utils/whatsapp';
import { formatCurrency } from '@/libs/utils/format';
import { Wallet, Banknote, Bitcoin, AlertCircle, CheckCircle, Clock, X, ChevronRight, DollarSign, Info, Loader2 } from 'lucide-react';
import { investmentService } from '@/libs/services/investment.service';
import { DASH_STYLES } from '@/app/styles/dashboardStyles';
import { InvestmentTransaction, UserInvestment } from '@/libs/types';

type Method = 'bank' | 'btc' | 'eth' | 'usdt';

const METHODS: { id: Method; label: string; icon: React.ElementType; userField: string; }[] = [
  { id: 'bank',  label: 'Bank Transfer', icon: Banknote, userField: 'bank_name'   },
  { id: 'btc',   label: 'Bitcoin',       icon: Bitcoin,  userField: 'btc_wallet'  },
  { id: 'eth',   label: 'Ethereum',      icon: Wallet,   userField: 'eth_wallet'  },
  { id: 'usdt',  label: 'USDT',          icon: Wallet,   userField: 'usdt_wallet' },
];

const MIN_WITHDRAWAL = 500;
const FEE_RATE = 0.05;

function WaIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.33 4.94L2.05 22l5.32-1.4c1.46.8 3.11 1.22 4.81 1.22 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.91-9.91-9.91z"/></svg>;
}

function TgIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.2c-.06-.06-.15-.04-.22-.02-.09.02-1.55.99-4.37 2.89-.41.28-.79.42-1.12.41-.37-.01-1.08-.21-1.61-.38-.65-.21-1.16-.32-1.12-.68.02-.19.28-.38.78-.58 3.04-1.32 5.07-2.19 6.09-2.62 2.9-1.21 3.5-1.42 3.89-1.42.09 0 .28.02.4.12.1.08.13.19.14.27-.01.06-.01.13-.02.2z"/></svg>;
}

export default function WithdrawalsPage() {
  const { user, updateAccountInfo } = useAuthStore();
  const { userInvestments, transactions, fetchUserInvestments, fetchTransactions, isLoading } = useInvestmentStore();

  const [selectedMethod, setSelectedMethod] = useState<Method>('bank');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [paymentInfo, setPaymentInfo] = useState({
    bank_name: user?.bank_name || '',
    account_number: user?.account_number || '',
    account_name: user?.account_name || '',
    btc_wallet: user?.btc_wallet || '',
    eth_wallet: user?.eth_wallet || '',
    usdt_wallet: user?.usdt_wallet || '',
  });

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchUserInvestments(),
        fetchTransactions()
      ]);
    };
    loadData();
  }, [fetchUserInvestments, fetchTransactions]);

  // Update payment info when user changes
  useEffect(() => {
    if (user) {
      setPaymentInfo({
        bank_name: user.bank_name || '',
        account_number: user.account_number || '',
        account_name: user.account_name || '',
        btc_wallet: user.btc_wallet || '',
        eth_wallet: user.eth_wallet || '',
        usdt_wallet: user.usdt_wallet || ''
      });
    }
  }, [user]);

  // Ensure we have arrays
  const investmentsArr = Array.isArray(userInvestments) ? userInvestments : [];
  const transactionsArr = Array.isArray(transactions) ? transactions : [];

  // Calculate total balance from completed investments
  const totalBalance = investmentsArr
    .filter((i: UserInvestment) => i.status === 'completed')
    .reduce((sum: number, i: UserInvestment) => sum + (i.amount || 0) + (i.total_profit || 0), 0);

  // Filter withdrawal transactions
  const withdrawalTransactions = transactionsArr.filter(
    (tx: InvestmentTransaction) => tx.transaction_type === 'withdrawal'
  );

  const pendingW = withdrawalTransactions
    .filter((tx: InvestmentTransaction) => tx.status === 'pending')
    .reduce((sum: number, tx: InvestmentTransaction) => sum + (tx.amount || 0), 0);

  const completedW = withdrawalTransactions
    .filter((tx: InvestmentTransaction) => tx.status === 'completed')
    .reduce((sum: number, tx: InvestmentTransaction) => sum + (tx.amount || 0), 0);

  const availableBalance = Math.max(0, totalBalance - pendingW);
  const history = withdrawalTransactions.slice(0, 10);
  const parsedAmount = parseFloat(withdrawAmount) || 0;
  const fee = parsedAmount * FEE_RATE;
  const netAmount = parsedAmount - fee;

  const getWalletDetails = (): string | null => {
    if (selectedMethod === 'bank') {
      return user?.bank_name && user?.account_number
        ? `${user.bank_name} | ${user.account_number} | ${user.account_name}`
        : null;
    }
    if (selectedMethod === 'btc') return user?.btc_wallet || null;
    if (selectedMethod === 'eth') return user?.eth_wallet || null;
    if (selectedMethod === 'usdt') return user?.usdt_wallet || null;
    return null;
  };

  const walletDetails = getWalletDetails();

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!withdrawAmount || parsedAmount <= 0) {
      e.amount = 'Please enter an amount';
    } else if (parsedAmount < MIN_WITHDRAWAL) {
      e.amount = `Minimum is ${formatCurrency(MIN_WITHDRAWAL)}`;
    } else if (parsedAmount > availableBalance) {
      e.amount = 'Insufficient balance';
    }
    if (!walletDetails) {
      e.method = 'Please add your payment details first';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleWithdraw = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await investmentService.requestWithdrawal({
        amount: parsedAmount,
        method: selectedMethod,
        wallet_details: walletDetails!
      });
      const methodLabel = METHODS.find(m => m.id === selectedMethod)?.label;
      setSupportMessage(
        `Hello, I have submitted a withdrawal request.\n\n` +
        `📋 Reference: ${res.reference}\n` +
        `💰 Amount: ${formatCurrency(parsedAmount)}\n` +
        `💸 Fee (5%): ${formatCurrency(fee)}\n` +
        `✅ Net: ${formatCurrency(netAmount)}\n` +
        `💳 Method: ${methodLabel}\n` +
        `📋 Details: ${walletDetails}\n` +
        `👤 Email: ${user?.email}\n\n` +
        `Please process my withdrawal. Thank you.`
      );
      setShowSupportModal(true);
      setWithdrawAmount('');
      await fetchTransactions();
    } catch (err) {
      console.error('Withdrawal error:', err);
      alert('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveInfo = async () => {
    setSaving(true);
    try {
      await updateAccountInfo(paymentInfo);
      setShowModal(false);
      await fetchUserInvestments();
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const getTxStatus = (status?: string): { label: string; color: string; icon: React.ReactElement } => {
    const statusMap: Record<string, { label: string; color: string; icon: React.ReactElement }> = {
      completed: {
        label: 'Completed',
        color: '#16a34a',
        icon: <CheckCircle size={14} color="#16a34a" />
      },
      processing: {
        label: 'Processing',
        color: '#0284c7',
        icon: <Clock size={14} color="#0284c7" />
      },
      pending: {
        label: 'Pending',
        color: '#d97706',
        icon: <Clock size={14} color="#d97706" />
      },
      failed: {
        label: 'Failed',
        color: '#dc2626',
        icon: <AlertCircle size={14} color="#dc2626" />
      },
    };
    return statusMap[status || 'pending'] || statusMap.pending;
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <div className="ds ds-page ds-fade-up">
          <style>{DASH_STYLES}</style>
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500 mx-auto mb-3" />
              <p className="text-gray-500">Loading withdrawal data...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="ds ds-page ds-fade-up">
        <style>{DASH_STYLES}</style>

        <div>
          <h1 className="ds-page-title">Withdrawals</h1>
          <p className="ds-page-subtitle">Transfer earnings to your bank or crypto wallet</p>
        </div>

        {/* Balance stats */}
        <div className="ds-stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))' }}>
          {[
            { label: 'Available Balance', value: formatCurrency(availableBalance), sub: 'Ready to withdraw', icon: DollarSign },
            { label: 'Pending', value: formatCurrency(pendingW), sub: 'Awaiting processing', icon: Clock },
            { label: 'Total Withdrawn', value: formatCurrency(completedW), sub: 'Lifetime withdrawals', icon: CheckCircle },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div className="ds-stat-card" key={s.label}>
                <div className="ds-stat-icon-pill"><Icon size={14} /></div>
                <p className="ds-stat-value">{s.value}</p>
                <p className="ds-stat-label">{s.label}</p>
                <p className="ds-stat-sub">{s.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Form */}
        <div className="ds-card">
          <div className="ds-card-header"><p className="ds-card-title">Request Withdrawal</p></div>
          <div className="ds-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="ds-info-strip">
              <Info size={13} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>A <strong>5% processing fee</strong> applies to all withdrawals. Minimum is <strong>{formatCurrency(MIN_WITHDRAWAL)}</strong>.</span>
            </div>

            {/* Method */}
            <div>
              <label className="ds-input-label">Withdrawal Method</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(100px,1fr))', gap: 8 }}>
                {METHODS.map(m => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      className={`ds-method-btn ${selectedMethod === m.id ? 'active' : ''}`}
                      onClick={() => { setSelectedMethod(m.id); setErrors({}); }}
                    >
                      <Icon size={16} />{m.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment details strip */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              background: walletDetails ? '#f0fdf4' : '#fffbeb',
              border: `1px solid ${walletDetails ? 'rgba(22,163,74,0.2)' : 'rgba(217,119,6,0.2)'}`,
              borderRadius: 10
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12.5, fontWeight: 500, color: '#1a1a1a' }}>
                  {selectedMethod === 'bank' ? 'Bank Details' : `${METHODS.find(m => m.id === selectedMethod)?.label} Wallet`}
                </p>
                {walletDetails
                  ? <p style={{ fontSize: 11.5, color: '#555', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{walletDetails}</p>
                  : <p style={{ fontSize: 11.5, color: '#b45309', marginTop: 2 }}>No details saved yet</p>}
              </div>
              <button
                onClick={() => setShowModal(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: '#f97316', fontSize: 12, fontWeight: 500, flexShrink: 0, marginLeft: 12 }}
              >
                {walletDetails ? 'Update' : 'Add'} <ChevronRight size={12} />
              </button>
            </div>
            {errors.method && <p className="ds-input-error" style={{ marginTop: -10 }}>{errors.method}</p>}

            {/* Amount */}
            <div>
              <label className="ds-input-label">Amount (USD)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa', fontSize: 13 }}>$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={e => { setWithdrawAmount(e.target.value); setErrors({}); }}
                  className="ds-input"
                  style={{ paddingLeft: 26 }}
                />
              </div>
              {errors.amount
                ? <p className="ds-input-error">{errors.amount}</p>
                : <p className="ds-input-hint">Available: {formatCurrency(availableBalance)}</p>}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {[500, 1000, 2000, 5000].map(amt => (
                  <button key={amt} className="ds-btn-ghost ds-btn-sm" onClick={() => { setWithdrawAmount(String(amt)); setErrors({}); }}>
                    {formatCurrency(amt)}
                  </button>
                ))}
                <button className="ds-btn-ghost ds-btn-sm" onClick={() => { setWithdrawAmount(String(Math.floor(availableBalance))); setErrors({}); }}>Max</button>
              </div>
            </div>

            {/* Fee breakdown */}
            {parsedAmount >= MIN_WITHDRAWAL && (
              <div className="ds-fee-strip">
                <div className="ds-fee-row"><span style={{ color: '#aaa' }}>Withdrawal amount</span><span style={{ fontWeight: 500 }}>{formatCurrency(parsedAmount)}</span></div>
                <div className="ds-fee-row"><span style={{ color: '#aaa' }}>Processing fee (5%)</span><span style={{ color: '#e05252' }}>−{formatCurrency(fee)}</span></div>
                <div className="ds-fee-divider" />
                <div className="ds-fee-row" style={{ fontWeight: 600 }}><span style={{ color: '#1a1a1a' }}>You receive</span><span style={{ color: '#16a34a' }}>{formatCurrency(netAmount)}</span></div>
              </div>
            )}

            <button
              className="ds-btn-primary"
              disabled={!withdrawAmount || submitting}
              onClick={handleWithdraw}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <WaIcon /><TgIcon />
              {submitting ? 'Submitting…' : 'Request via WhatsApp & Telegram'}
            </button>
          </div>
        </div>

        {/* History */}
        <div className="ds-card">
          <div className="ds-card-header"><p className="ds-card-title">Withdrawal History</p></div>
          {history.length > 0 ? (
            history.map(tx => {
              const statusInfo = getTxStatus(tx.status);
              return (
                <div key={tx.id} className="ds-list-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="ds-list-icon">{statusInfo.icon}</div>
                    <div>
                      <p style={{ fontSize: 12.5, fontWeight: 500, color: '#1a1a1a' }}>Withdrawal</p>
                      <p style={{ fontSize: 11, fontFamily: 'monospace', color: '#bbb', marginTop: 2 }}>{tx.reference}</p>
                      <p style={{ fontSize: 11, color: '#ccc' }}>
                        {new Date(tx.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#e05252' }}>−{formatCurrency(tx.amount)}</p>
                    <p style={{ fontSize: 11, color: '#bbb' }}>Net: {formatCurrency(tx.amount * 0.95)}</p>
                    <p style={{ fontSize: 11, fontWeight: 500, color: statusInfo.color, textTransform: 'capitalize' }}>{statusInfo.label}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="ds-empty">
              <div className="ds-empty-icon"><Wallet size={18} /></div>
              <p className="ds-empty-title">No withdrawals yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Details Modal */}
      {showModal && (
        <div className="ds-modal-overlay">
          <div className="ds-modal">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div>
                <p className="ds-modal-title">Payment Details</p>
                <p className="ds-modal-sub">Add your bank and crypto wallet info</p>
              </div>
              <button className="ds-icon-btn" onClick={() => setShowModal(false)}><X size={15} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxHeight: '60vh', overflowY: 'auto' }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bank Transfer</p>
              {[
                ['Bank Name', 'bank_name', 'e.g. Chase Bank'],
                ['Account Number', 'account_number', '0123456789'],
                ['Account Name', 'account_name', 'John Doe']
              ].map(([l, k, ph]) => (
                <div key={k}>
                  <label className="ds-input-label">{l}</label>
                  <input
                    className="ds-input"
                    type="text"
                    placeholder={ph}
                    value={paymentInfo[k as keyof typeof paymentInfo]}
                    onChange={e => setPaymentInfo(p => ({ ...p, [k]: e.target.value }))}
                  />
                </div>
              ))}
              <div className="ds-divider" />
              <p style={{ fontSize: 11, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Crypto Wallets</p>
              {[
                ['Bitcoin (BTC)', 'btc_wallet', 'BTC wallet address'],
                ['Ethereum (ETH)', 'eth_wallet', '0x… ETH address'],
                ['USDT', 'usdt_wallet', 'USDT wallet address']
              ].map(([l, k, ph]) => (
                <div key={k}>
                  <label className="ds-input-label">{l}</label>
                  <input
                    className="ds-input"
                    type="text"
                    placeholder={ph}
                    value={paymentInfo[k as keyof typeof paymentInfo]}
                    onChange={e => setPaymentInfo(p => ({ ...p, [k]: e.target.value }))}
                  />
                </div>
              ))}
            </div>

            <div className="ds-modal-actions">
              <button className="ds-btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="ds-btn-primary" disabled={saving} onClick={handleSaveInfo}>
                {saving ? 'Saving…' : 'Save Details'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Support Modal (post-withdrawal) */}
      {showSupportModal && (
        <div className="ds-modal-overlay">
          <div className="ds-modal" style={{ maxWidth: 360 }}>
            <p className="ds-modal-title">Contact Support</p>
            <p className="ds-modal-sub">Choose your preferred platform to complete the request</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Continue with WhatsApp', icon: <WaIcon />, action: () => { openWhatsApp(supportMessage); setShowSupportModal(false); } },
                { label: 'Continue with Telegram', icon: <TgIcon />, action: () => { openTelegram(supportMessage); setShowSupportModal(false); } },
              ].map((c, i) => (
                <button key={i} className="ds-contact-btn" onClick={c.action}>
                  <span className="ds-contact-icon">{c.icon}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 500 }}>{c.label}</span>
                  <span className="ds-contact-arrow">›</span>
                </button>
              ))}
            </div>
            <div className="ds-divider" style={{ margin: '14px 0' }} />
            <button
              style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12.5, color: '#aaa', padding: '6px' }}
              onClick={() => setShowSupportModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}