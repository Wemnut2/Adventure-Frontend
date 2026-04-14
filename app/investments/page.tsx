'use client';

import { useState } from 'react';
import { MainLayout } from '@/layout/sections/dashboard/MainLayout';
import {
  useInvestmentPlans,
  useMyInvestments,
  useTransactions,
  useCreateInvestment,
} from '@/libs/hooks/useInvestments';
import { formatCurrency } from '@/libs/utils/format';
import { ArrowRight, TrendingUp } from 'lucide-react';

export default function InvestmentPage() {
  const [activeTab, setActiveTab] = useState<'plans' | 'my' | 'transactions'>('plans');

  const { plans, isLoading: plansLoading } = useInvestmentPlans();
  const { investments, isLoading: investmentsLoading } = useMyInvestments();
  const { transactions, isLoading: transactionsLoading } = useTransactions();
  const createInvestment = useCreateInvestment();

  return (
    <MainLayout>
      <div className="space-y-6 pb-10">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investments</h1>
          <p className="text-sm text-gray-500 mt-1">
            Grow your money with smart plans.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          {(['plans', 'my', 'transactions'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'plans'
                ? 'Plans'
                : tab === 'my'
                ? `My Investments (${(investments ?? []).length})`
                : 'Transactions'}
            </button>
          ))}
        </div>

        {/* ================= PLANS ================= */}
        {activeTab === 'plans' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

            {plansLoading ? (
              <p className="col-span-3 text-center text-gray-400 py-10">
                Loading plans...
              </p>
            ) : (plans ?? []).length > 0 ? (
              (plans ?? []).map((plan) => (
                <div
                  key={plan.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all p-5 flex flex-col"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                      {plan.name}
                    </h3>
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                  </div>

                  <p className="text-sm text-gray-500 mb-4">
                    {plan.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-400">
                      Min:{' '}
                      <span className="text-gray-800 font-medium">
                        {formatCurrency(Number(plan.min_amount))}
                      </span>
                    </p>

                    <p className="text-sm text-gray-400">
                      ROI:{' '}
                      <span className="text-green-600 font-bold">
                        {plan.roi}%
                      </span>
                    </p>

                    <p className="text-sm text-gray-400">
                      Duration:{' '}
                      <span className="text-gray-800">
                        {plan.duration_days} days
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      createInvestment.mutate({
                        planId: plan.id,
                        amount: Number(plan.min_amount),
                      })
                    }
                    className="mt-auto w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition"
                  >
                    Invest <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-400 py-10">
                No investment plans available
              </p>
            )}
          </div>
        )}

        {/* ================= MY INVESTMENTS ================= */}
        {activeTab === 'my' && (
          <div className="space-y-4">

            {investmentsLoading ? (
              <p className="text-center text-gray-400 py-10">
                Loading investments...
              </p>
            ) : (investments ?? []).length > 0 ? (
              (investments ?? []).map((inv) => (
                <div
                  key={inv.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {inv.plan_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(inv.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <span className="text-green-600 font-bold">
                      +{formatCurrency(Number(inv.expected_return))}
                    </span>
                  </div>

                  <div className="mt-3 text-sm text-gray-500">
                    Invested: {formatCurrency(Number(inv.amount))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-10">
                No investments yet
              </p>
            )}
          </div>
        )}

        {/* ================= TRANSACTIONS ================= */}
        {activeTab === 'transactions' && (
          <div className="space-y-4">

            {transactionsLoading ? (
              <p className="text-center text-gray-400 py-10">
                Loading transactions...
              </p>
            ) : (transactions ?? []).length > 0 ? (
              (transactions ?? []).map((tx) => (
                <div
                  key={tx.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex justify-between"
                >
                  <div>
                    <p className="text-sm text-gray-900 font-medium">
                      {tx.type}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <p className="text-green-600 font-semibold">
                    {formatCurrency(Number(tx.amount))}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-10">
                No transactions yet
              </p>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}