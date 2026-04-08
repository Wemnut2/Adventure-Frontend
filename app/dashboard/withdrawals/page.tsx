// src/app/(dashboard)/withdrawals/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/layout/sections/dashboard/MainLayout';
import { Card } from '@/layout/components/Card';
import { Button } from '@/layout/components/Button';
import { Input } from '@/layout/components/Input';
import { Dialog } from '@/layout/components/Dialog';
import { useAuthStore } from '@/libs/stores/auth.store';
import { useInvestmentStore } from '@/libs/stores/investment.store';
import { useToast } from '@/libs/src/contexts/ToastContext';
import { formatCurrency } from '@/libs/utils/format';
import { 
  Wallet, 
  Banknote, 
  Bitcoin, 
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function WithdrawalsPage() {
  const { user, updateAccountInfo } = useAuthStore();
  const { investments, transactions, fetchTransactions } = useInvestmentStore();
  const { showToast } = useToast();
  const [showBankForm, setShowBankForm] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'bank' | 'btc' | 'eth' | 'usdt'>('bank');
  const [bankInfo, setBankInfo] = useState({
    bank_name: user?.bank_name || '',
    account_number: user?.account_number || '',
    account_name: user?.account_name || '',
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const totalBalance = investments
    .filter(inv => inv.status === 'completed')
    .reduce((sum, inv) => sum + inv.amount + inv.total_profit, 0);

  const pendingWithdrawals = transactions
    .filter(t => t.transaction_type === 'withdrawal' && t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const completedWithdrawals = transactions
    .filter(t => t.transaction_type === 'withdrawal' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleSaveBankInfo = async () => {
    try {
      await updateAccountInfo(bankInfo);
      showToast('Bank information saved successfully', 'success');
      setShowBankForm(false);
    } catch (error) {
      showToast('Failed to save bank information', 'error');
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    
    if (amount <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    if (amount > totalBalance) {
      showToast('Insufficient balance', 'error');
      return;
    }

    if (amount < 10) {
      showToast('Minimum withdrawal amount is $10', 'error');
      return;
    }

    if (selectedMethod === 'bank' && (!bankInfo.bank_name || !bankInfo.account_number)) {
      showToast('Please add your bank information first', 'error');
      setShowBankForm(true);
      return;
    }

    // Here you would call the withdrawal API
    showToast('Withdrawal request submitted successfully', 'success');
    setWithdrawAmount('');
  };

  const withdrawalHistory = transactions
    .filter(t => t.transaction_type === 'withdrawal')
    .slice(0, 10);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Withdrawals</h1>
          <p className="mt-1 text-gray-600">
            Withdraw your earnings to your bank account or crypto wallet
          </p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="bg-linear-to-r from-blue-600 to-blue-700 text-white">
            <div className="p-6">
              <p className="text-blue-100">Total Balance</p>
              <p className="mt-2 text-3xl font-bold">{formatCurrency(totalBalance)}</p>
              <p className="mt-1 text-sm text-blue-100">Available for withdrawal</p>
            </div>
          </Card>

          <Card className="bg-linear-to-r from-yellow-600 to-yellow-700 text-white">
            <div className="p-6">
              <p className="text-yellow-100">Pending Withdrawals</p>
              <p className="mt-2 text-3xl font-bold">{formatCurrency(pendingWithdrawals)}</p>
              <p className="mt-1 text-sm text-yellow-100">Awaiting processing</p>
            </div>
          </Card>

          <Card className="bg-linear-to-r from-green-600 to-green-700 text-white">
            <div className="p-6">
              <p className="text-green-100">Total Withdrawn</p>
              <p className="mt-2 text-3xl font-bold">{formatCurrency(completedWithdrawals)}</p>
              <p className="mt-1 text-sm text-green-100">Lifetime withdrawals</p>
            </div>
          </Card>
        </div>

        {/* Withdrawal Form */}
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Request Withdrawal</h2>
          
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Select Withdrawal Method
              </label>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <button
                  onClick={() => setSelectedMethod('bank')}
                  className={`flex items-center justify-center gap-2 rounded-lg border-2 p-3 transition-all ${
                    selectedMethod === 'bank'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <Banknote className="h-5 w-5" />
                  <span>Bank Transfer</span>
                </button>
                <button
                  onClick={() => setSelectedMethod('btc')}
                  className={`flex items-center justify-center gap-2 rounded-lg border-2 p-3 transition-all ${
                    selectedMethod === 'btc'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <Bitcoin className="h-5 w-5" />
                  <span>Bitcoin</span>
                </button>
                <button
                  onClick={() => setSelectedMethod('eth')}
                  className={`flex items-center justify-center gap-2 rounded-lg border-2 p-3 transition-all ${
                    selectedMethod === 'eth'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {/* <Ethereum className="h-5 w-5" /> */}
                  <span>Ethereum</span>
                </button>
                <button
                  onClick={() => setSelectedMethod('usdt')}
                  className={`flex items-center justify-center gap-2 rounded-lg border-2 p-3 transition-all ${
                    selectedMethod === 'usdt'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <Wallet className="h-5 w-5" />
                  <span>USDT</span>
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Amount (USD)
              </label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                min="10"
                step="1"
              />
              <p className="mt-1 text-sm text-gray-500">
                Minimum withdrawal: $10
              </p>
            </div>

            {selectedMethod === 'bank' && (
              <div className="rounded-lg bg-blue-50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium">Bank Information</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowBankForm(true)}
                  >
                    {user?.bank_name ? 'Update Info' : 'Add Info'}
                  </Button>
                </div>
                {user?.bank_name ? (
                  <div className="space-y-1 text-sm">
                    <p><strong>Bank:</strong> {user.bank_name}</p>
                    <p><strong>Account Number:</strong> {user.account_number}</p>
                    <p><strong>Account Name:</strong> {user.account_name}</p>
                  </div>
                ) : (
                  <p className="text-yellow-600">No bank information added yet</p>
                )}
              </div>
            )}

            <Button
              onClick={handleWithdraw}
              disabled={!withdrawAmount || parseFloat(withdrawAmount) > totalBalance}
              fullWidth
              size="lg"
            >
              Request Withdrawal
            </Button>
          </div>
        </Card>

        {/* Withdrawal History */}
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Withdrawal History</h2>
          <div className="space-y-3">
            {withdrawalHistory.length > 0 ? (
              withdrawalHistory.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    {transaction.status === 'completed' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : transaction.status === 'pending' ? (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium">
                        {transaction.transaction_type === 'withdrawal' ? 'Withdrawal' : transaction.transaction_type}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.transaction_type === 'withdrawal' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {transaction.transaction_type === 'withdrawal' ? '-' : '+'}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <span className={`text-sm ${
                      transaction.status === 'completed' ? 'text-green-600' :
                      transaction.status === 'pending' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No withdrawal history</p>
            )}
          </div>
        </Card>
      </div>

      {/* Bank Information Dialog */}
      <Dialog open={showBankForm} onClose={() => setShowBankForm(false)}>
        <div className="max-w-md">
          <h2 className="mb-4 text-xl font-bold">Bank Information</h2>
          <div className="space-y-4">
            <Input
              label="Bank Name"
              placeholder="e.g., Chase Bank"
              value={bankInfo.bank_name}
              onChange={(e) => setBankInfo({ ...bankInfo, bank_name: e.target.value })}
            />
            <Input
              label="Account Number"
              placeholder="Enter account number"
              value={bankInfo.account_number}
              onChange={(e) => setBankInfo({ ...bankInfo, account_number: e.target.value })}
            />
            <Input
              label="Account Name"
              placeholder="Enter account holder name"
              value={bankInfo.account_name}
              onChange={(e) => setBankInfo({ ...bankInfo, account_name: e.target.value })}
            />
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowBankForm(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSaveBankInfo} className="flex-1">
                Save Information
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </MainLayout>
  );
}