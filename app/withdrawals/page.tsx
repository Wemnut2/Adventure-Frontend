'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/layout/sections/dashboard/MainLayout';
import { useAuthStore } from '@/libs/stores/auth.store';
import { useInvestmentStore } from '@/libs/stores/investment.store';
import { openWhatsApp } from '@/libs/utils/whatsapp';
import { formatCurrency } from '@/libs/utils/format';
import {
  Wallet, Banknote, Bitcoin,
  AlertCircle, CheckCircle, Clock,
  X, ChevronRight, DollarSign, Info,
} from 'lucide-react';
import { investmentService } from '@/libs/services/investment.service';

type Method = 'bank' | 'btc' | 'eth' | 'usdt';

const METHODS: {
  id: Method;
  label: string;
  icon: React.ElementType;
  placeholder: string;
  userField: string;
}[] = [
  { id: 'bank',  label: 'Bank Transfer', icon: Banknote, placeholder: 'Bank name — account number', userField: 'bank_name'   },
  { id: 'btc',   label: 'Bitcoin',       icon: Bitcoin,  placeholder: 'BTC wallet address',         userField: 'btc_wallet'  },
  { id: 'eth',   label: 'Ethereum',      icon: Wallet,   placeholder: 'ETH wallet address',         userField: 'eth_wallet'  },
  { id: 'usdt',  label: 'USDT',          icon: Wallet,   placeholder: 'USDT wallet address',        userField: 'usdt_wallet' },
];

const FEE_RATE = 0.05;
const MIN_WITHDRAWAL = 500;

const inputClass =
  'w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-colors';

export default function WithdrawalsPage() {
  const { user, updateAccountInfo } = useAuthStore();
  const { investments, transactions, fetchTransactions } = useInvestmentStore();

  const [selectedMethod, setSelectedMethod] = useState<Method>('bank');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [paymentInfo, setPaymentInfo] = useState({
    bank_name:      user?.bank_name      || '',
    account_number: user?.account_number || '',
    account_name:   user?.account_name   || '',
    btc_wallet:     user?.btc_wallet     || '',
    eth_wallet:     user?.eth_wallet     || '',
    usdt_wallet:    user?.usdt_wallet    || '',
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  // ── Calculations ──────────────────────────────────────
  const investmentsArr  = Array.isArray(investments)  ? investments  : [];
  const transactionsArr = Array.isArray(transactions) ? transactions : [];

  const totalBalance = investmentsArr
    .filter((i) => i.status === 'completed')
    .reduce((sum, i) => sum + (i.amount || 0) + (i.total_profit || 0), 0);

  const pendingWithdrawals = transactionsArr
    .filter((t) => t.transaction_type === 'withdrawal' && t.status === 'pending')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const completedWithdrawals = transactionsArr
    .filter((t) => t.transaction_type === 'withdrawal' && t.status === 'completed')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const availableBalance = Math.max(0, totalBalance - pendingWithdrawals);

  const withdrawalHistory = transactionsArr
    .filter((t) => t.transaction_type === 'withdrawal')
    .slice(0, 10);

  const parsedAmount = parseFloat(withdrawAmount) || 0;
  const fee = parsedAmount * FEE_RATE;
  const netAmount = parsedAmount - fee;

  // ── Get saved wallet info ─────────────────────────────
  const getWalletDetails = (): string | null => {
    if (selectedMethod === 'bank') {
      return user?.bank_name && user?.account_number
        ? `${user.bank_name} | ${user.account_number} | ${user.account_name}`
        : null;
    }
    if (selectedMethod === 'btc')  return user?.btc_wallet  || null;
    if (selectedMethod === 'eth')  return user?.eth_wallet  || null;
    if (selectedMethod === 'usdt') return user?.usdt_wallet || null;
    return null;
  };

  const walletDetails = getWalletDetails();

  // ── Validate ──────────────────────────────────────────
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!withdrawAmount || parsedAmount <= 0) {
      errs.amount = 'Please enter an amount';
    } else if (parsedAmount < MIN_WITHDRAWAL) {
      errs.amount = `Minimum withdrawal is ${formatCurrency(MIN_WITHDRAWAL)}`;
    } else if (parsedAmount > availableBalance) {
      errs.amount = 'Insufficient balance';
    }
    if (!walletDetails) {
      errs.method = 'Please add your payment details first';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Submit withdrawal ─────────────────────────────────
  const handleWithdraw = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await investmentService.requestWithdrawal({
        amount: parsedAmount,
        method: selectedMethod,
        wallet_details: walletDetails!,
      });

      // Open WhatsApp with details
      const methodLabel = METHODS.find((m) => m.id === selectedMethod)?.label;
      const message =
        `Hello, I have submitted a withdrawal request.\n\n` +
        `📋 Reference: ${res.reference}\n` +
        `💰 Amount: ${formatCurrency(parsedAmount)}\n` +
        `💸 Fee (5%): ${formatCurrency(fee)}\n` +
        `✅ Net Amount: ${formatCurrency(netAmount)}\n` +
        `💳 Method: ${methodLabel}\n` +
        `📋 Details: ${walletDetails}\n` +
        `👤 Email: ${user?.email}\n\n` +
        `Please process my withdrawal. Thank you.`;

      openWhatsApp(message);
      setWithdrawAmount('');
      await fetchTransactions();
    } catch {
      alert('Failed to submit withdrawal. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Save payment details ──────────────────────────────
  const handleSaveInfo = async () => {
    setSaving(true);
    try {
      await updateAccountInfo(paymentInfo);
      setShowModal(false);
    } catch {
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 pb-10">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Withdrawals</h1>
          <p className="text-sm text-gray-500 mt-1">
            Withdraw earnings to your bank or crypto wallet
          </p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-gray-900 to-orange-900 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-4 h-4 text-orange-300" />
              <p className="text-sm text-orange-200">Available Balance</p>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(availableBalance)}</p>
            <p className="text-xs text-orange-300 mt-1">Ready to withdraw</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-yellow-500" />
              <p className="text-sm text-gray-500">Pending</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(pendingWithdrawals)}</p>
            <p className="text-xs text-gray-400 mt-1">Awaiting processing</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <p className="text-sm text-gray-500">Total Withdrawn</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(completedWithdrawals)}</p>
            <p className="text-xs text-gray-400 mt-1">Lifetime withdrawals</p>
          </div>
        </div>

        {/* Withdrawal Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-gray-900">Request Withdrawal</h2>

          {/* Fee notice */}
          <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3">
            <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">
              A <strong>5% processing fee</strong> applies to all withdrawals.
              Minimum withdrawal is <strong>{formatCurrency(MIN_WITHDRAWAL)}</strong>.
            </p>
          </div>

          {/* Method selector */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Withdrawal Method</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {METHODS.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => { setSelectedMethod(m.id); setErrors({}); }}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      selectedMethod === m.id
                        ? 'border-orange-400 bg-orange-50 text-orange-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment details */}
          <div className={`flex items-center justify-between p-3.5 rounded-xl border ${
            walletDetails ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'
          }`}>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-800">
                {selectedMethod === 'bank' ? 'Bank Details' : `${METHODS.find(m => m.id === selectedMethod)?.label} Wallet`}
              </p>
              {walletDetails ? (
                <p className="text-xs text-gray-600 mt-0.5 truncate">{walletDetails}</p>
              ) : (
                <p className="text-xs text-yellow-700 mt-0.5">No details saved yet</p>
              )}
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="shrink-0 ml-3 flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-medium"
            >
              {walletDetails ? 'Update' : 'Add'} <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          {errors.method && <p className="text-xs text-red-500 -mt-3">{errors.method}</p>}

          {/* Amount */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1.5">Amount (USD)</p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
              <input
                type="number"
                placeholder="0.00"
                value={withdrawAmount}
                onChange={(e) => { setWithdrawAmount(e.target.value); setErrors({}); }}
                min={MIN_WITHDRAWAL}
                className="w-full pl-7 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-colors"
              />
            </div>
            {errors.amount ? (
              <p className="text-xs text-red-500 mt-1">{errors.amount}</p>
            ) : (
              <p className="text-xs text-gray-400 mt-1">
                Available: {formatCurrency(availableBalance)}
              </p>
            )}

            {/* Quick amounts */}
            <div className="flex flex-wrap gap-2 mt-2">
              {[500, 1000, 2000, 5000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => { setWithdrawAmount(String(amt)); setErrors({}); }}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-orange-100 hover:text-orange-700 rounded-lg transition-colors font-medium"
                >
                  {formatCurrency(amt)}
                </button>
              ))}
              <button
                onClick={() => { setWithdrawAmount(String(Math.floor(availableBalance))); setErrors({}); }}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-orange-100 hover:text-orange-700 rounded-lg transition-colors font-medium"
              >
                Max
              </button>
            </div>
          </div>

          {/* Fee breakdown */}
          {parsedAmount >= MIN_WITHDRAWAL && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Withdrawal amount</span>
                <span>{formatCurrency(parsedAmount)}</span>
              </div>
              <div className="flex justify-between text-red-500">
                <span>Processing fee (5%)</span>
                <span>-{formatCurrency(fee)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2">
                <span>You receive</span>
                <span className="text-green-600">{formatCurrency(netAmount)}</span>
              </div>
            </div>
          )}

          <button
            onClick={handleWithdraw}
            disabled={!withdrawAmount || submitting}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M11.975 0C5.369 0 0 5.369 0 11.975c0 2.096.548 4.06 1.504 5.765L.057 23.429l5.82-1.525A11.93 11.93 0 0 0 11.975 24C18.581 24 24 18.631 24 11.975 24 5.369 18.581 0 11.975 0zm0 21.904a9.902 9.902 0 0 1-5.032-1.369l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.28c0-5.456 4.437-9.893 9.881-9.893 5.445 0 9.881 4.437 9.881 9.881 0 5.456-4.436 9.916-9.881 9.916z"/>
            </svg>
            {submitting ? 'Submitting...' : 'Request via WhatsApp'}
          </button>
        </div>

        {/* Withdrawal History */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Withdrawal History</h2>
          </div>
          {withdrawalHistory.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {withdrawalHistory.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      tx.status === 'completed' ? 'bg-green-100' :
                      tx.status === 'pending'   ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      {tx.status === 'completed'
                        ? <CheckCircle className="w-4 h-4 text-green-600" />
                        : tx.status === 'pending'
                        ? <Clock className="w-4 h-4 text-yellow-600" />
                        : <AlertCircle className="w-4 h-4 text-red-600" />
                      }
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Withdrawal
                      </p>
                      <p className="text-xs text-gray-400 font-mono">{tx.reference}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(tx.created_at).toLocaleDateString('en-US', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">-{formatCurrency(tx.amount)}</p>
                    <p className="text-xs text-gray-400">
                      Net: {formatCurrency(tx.amount * 0.95)}
                    </p>
                    <span className={`text-xs font-medium capitalize ${
                      tx.status === 'completed' ? 'text-green-600' :
                      tx.status === 'pending'   ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-14 text-center">
              <Wallet className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No withdrawal history yet</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Payment Details Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">

            {/* Modal header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
              <h2 className="font-bold text-gray-900">Payment Details</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 p-5 space-y-5">

              {/* Bank */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Banknote className="w-4 h-4 text-gray-500" />
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Bank Transfer</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Bank Name</label>
                    <input type="text" value={paymentInfo.bank_name} onChange={(e) => setPaymentInfo({ ...paymentInfo, bank_name: e.target.value })} placeholder="e.g. First Bank" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Account Number</label>
                    <input type="text" value={paymentInfo.account_number} onChange={(e) => setPaymentInfo({ ...paymentInfo, account_number: e.target.value })} placeholder="0123456789" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Account Name</label>
                    <input type="text" value={paymentInfo.account_name} onChange={(e) => setPaymentInfo({ ...paymentInfo, account_name: e.target.value })} placeholder="John Doe" className={inputClass} />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100" />

              {/* Crypto */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Bitcoin className="w-4 h-4 text-gray-500" />
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Crypto Wallets</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Bitcoin (BTC)</label>
                    <input type="text" value={paymentInfo.btc_wallet} onChange={(e) => setPaymentInfo({ ...paymentInfo, btc_wallet: e.target.value })} placeholder="BTC wallet address" className={inputClass} />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-blue-500"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.193 18.613l-3.3-3.3 1.415-1.415 1.885 1.886 4.593-4.593 1.415 1.414-6.008 6.008z"/></svg>
                      Ethereum (ETH)
                    </label>
                    <input type="text" value={paymentInfo.eth_wallet} onChange={(e) => setPaymentInfo({ ...paymentInfo, eth_wallet: e.target.value })} placeholder="0x... ETH wallet address" className={inputClass} />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-green-500"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.5 13.5h-9v-3h9v3z"/></svg>
                      USDT (TRC20 / ERC20)
                    </label>
                    <input type="text" value={paymentInfo.usdt_wallet} onChange={(e) => setPaymentInfo({ ...paymentInfo, usdt_wallet: e.target.value })} placeholder="USDT wallet address" className={inputClass} />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-100 shrink-0 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors text-sm">
                Cancel
              </button>
              <button onClick={handleSaveInfo} disabled={saving} className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors text-sm">
                {saving ? 'Saving...' : 'Save Details'}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}