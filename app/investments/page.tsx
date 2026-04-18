// src/app/(dashboard)/investments/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/layout/sections/dashboard/MainLayout';
import { Card } from '@/layout/components/Card';
import { Button } from '@/layout/components/Button';
import { Input } from '@/layout/components/Input';
import { useInvestmentStore } from '@/libs/stores/investment.store';
import { useAuthStore } from '@/libs/stores/auth.store';
import { useToast } from '@/libs/src/contexts/ToastContext';
import { formatCurrency } from '@/libs/utils/format';
import { TrendingUp, DollarSign, Calendar, Shield, Loader2, ArrowRight } from 'lucide-react';

export default function InvestmentsPage() {
  const { user } = useAuthStore();
  const { plans, investments, fetchPlans, fetchInvestments, createInvestment, isLoading } = useInvestmentStore();
  const { showToast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPlans();
    fetchInvestments();
  }, []);

  const handleInvest = async () => {
    if (!selectedPlan || !amount) {
      showToast('Please select a plan and enter amount', 'error');
      return;
    }

    const numAmount = parseFloat(amount);
    if (numAmount < selectedPlan.min_amount) {
      showToast(`Minimum investment is ${formatCurrency(selectedPlan.min_amount)}`, 'error');
      return;
    }
    if (selectedPlan.max_amount && numAmount > selectedPlan.max_amount) {
      showToast(`Maximum investment is ${formatCurrency(selectedPlan.max_amount)}`, 'error');
      return;
    }

    try {
      await createInvestment(selectedPlan.id, numAmount);
      showToast('Investment request submitted! Admin will review it.', 'success');
      setShowModal(false);
      setAmount('');
      setSelectedPlan(null);
    } catch (error: any) {
      showToast(error?.response?.data?.message || 'Investment failed', 'error');
    }
  };

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalProfit = investments.reduce((sum, inv) => sum + inv.total_profit, 0);
  const activeInvestments = investments.filter(inv => inv.status === 'active').length;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investments</h1>
          <p className="text-sm text-gray-500 mt-1">Grow your wealth with our investment plans</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Invested</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalInvested)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-200" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Profit</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalProfit)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-200" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Investments</p>
                <p className="text-2xl font-bold text-blue-600">{activeInvestments}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-200" />
            </div>
          </Card>
        </div>

        {/* Investment Plans */}
        <h2 className="text-xl font-semibold mt-8">Available Investment Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="p-6 hover:shadow-lg transition-all">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-3">
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Daily Return</span>
                  <span className="font-semibold text-green-600">{plan.daily_interest_rate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold">{plan.duration_days} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Min Investment</span>
                  <span className="font-semibold">{formatCurrency(plan.min_amount)}</span>
                </div>
                {plan.max_amount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Investment</span>
                    <span className="font-semibold">{formatCurrency(plan.max_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-gray-600">Total Return</span>
                  <span className="font-semibold text-orange-600">
                    {formatCurrency(plan.min_amount + (plan.min_amount * plan.daily_interest_rate / 100 * plan.duration_days))}+
                  </span>
                </div>
              </div>
              
              <Button 
                onClick={() => {
                  setSelectedPlan(plan);
                  setShowModal(true);
                }}
                fullWidth
                className="bg-gradient-to-r from-orange-500 to-orange-600"
              >
                Invest Now <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          ))}
        </div>

        {/* My Investments */}
        {investments.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mt-8">My Investments</h2>
            <div className="space-y-3">
              {investments.map((investment) => (
                <Card key={investment.id} className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{investment.plan_name}</h3>
                      <p className="text-sm text-gray-500">Invested: {formatCurrency(investment.amount)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Daily Profit</p>
                      <p className="font-semibold text-green-600">{formatCurrency(investment.daily_profit)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Profit</p>
                      <p className="font-semibold text-green-600">{formatCurrency(investment.total_profit)}</p>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        investment.status === 'active' ? 'bg-green-100 text-green-700' :
                        investment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        investment.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {investment.status}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Investment Modal */}
        {showModal && selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold mb-4">Invest in {selectedPlan.name}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Investment Amount (USD)</label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Min: ${selectedPlan.min_amount}`}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Min: {formatCurrency(selectedPlan.min_amount)}
                    {selectedPlan.max_amount && ` | Max: ${formatCurrency(selectedPlan.max_amount)}`}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Daily Returns: {selectedPlan.daily_interest_rate}%</p>
                  <p className="text-sm text-gray-600">Duration: {selectedPlan.duration_days} days</p>
                  {amount && (
                    <p className="text-sm font-semibold text-orange-600 mt-2">
                      Est. Total Return: {formatCurrency(parseFloat(amount) + (parseFloat(amount) * selectedPlan.daily_interest_rate / 100 * selectedPlan.duration_days))}
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleInvest} className="flex-1 bg-orange-500 hover:bg-orange-600">
                    Confirm Investment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}