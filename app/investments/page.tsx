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
import { ArrowUp, X, TrendingUp } from 'lucide-react';
import { InvestmentPlan } from '@/libs/types';

// ─── Invest Modal ────────────────────────────────────────────────────────────

interface InvestModalProps {
  plan: InvestmentPlan;
  onClose: () => void;
  onSuccess: () => void;
}

function InvestModal({ plan, onClose, onSuccess }: InvestModalProps) {
  const [amount, setAmount] = useState<string>(String(plan.min_amount));
  const createInvestment = useCreateInvestment();

  const numAmount = parseFloat(amount) || 0;
  const min = Number(plan.min_amount);
  const max = plan.max_amount ? Number(plan.max_amount) : Infinity;
  const isValid = numAmount >= min && numAmount <= max;
  const expectedReturn = isValid
    ? numAmount * (1 + Number(plan.roi) / 100)
    : null;

  const handleSubmit = () => {
    if (!isValid) return;
    createInvestment.mutate(
      { planId: plan.id, amount: numAmount },
      {
        onSuccess: () => {
          onSuccess();
          onClose();
        },
      }
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-gray-100 shadow-lg w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">
            Invest in {plan.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Plan summary */}
        <div className="bg-gray-50 rounded-xl p-3 mb-5 flex gap-5">
          <div>
            <p className="text-xs text-gray-400">Min. amount</p>
            <p className="text-sm font-semibold text-gray-900 mt-0.5">
              {formatCurrency(min)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">ROI</p>
            <p className="text-sm font-semibold text-green-600 mt-0.5">
              {plan.roi}%
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Duration</p>
            <p className="text-sm font-semibold text-gray-900 mt-0.5">
              {plan.duration_days} days
            </p>
          </div>
        </div>

        {/* Amount input */}
        <div className="mb-5">
          <label className="block text-sm text-gray-500 mb-1.5">
            Amount to invest
          </label>
          <input
            type="number"
            value={amount}
            min={min}
            max={plan.max_amount ? max : undefined}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            placeholder="Enter amount"
          />
          {amount && !isValid ? (
            <p className="text-xs text-red-500 mt-1.5">
              {numAmount < min
                ? `Minimum amount is ${formatCurrency(min)}`
                : `Maximum amount is ${formatCurrency(max)}`}
            </p>
          ) : expectedReturn ? (
            <p className="text-xs text-green-600 mt-1.5">
              Expected return: {formatCurrency(expectedReturn)}
            </p>
          ) : null}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || createInvestment.isPending}
            className="flex-[2] py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition"
          >
            {createInvestment.isPending ? 'Processing…' : 'Confirm investment'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type Tab = 'plans' | 'my' | 'transactions';

export default function InvestmentPage() {
  const [activeTab, setActiveTab] = useState<Tab>('plans');
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);

  const { plans, isLoading: plansLoading } = useInvestmentPlans();
  const { investments, isLoading: investmentsLoading } = useMyInvestments();
  const { transactions, isLoading: transactionsLoading } = useTransactions();

  const tabs: { key: Tab; label: string }[] = [
    { key: 'plans', label: 'Plans' },
    {
      key: 'my',
      label: `My Investments${(investments ?? []).length > 0 ? ` (${investments!.length})` : ''}`,
    },
    { key: 'transactions', label: 'Transactions' },
  ];

  return (
    <MainLayout>
      <div className="space-y-6 pb-10 max-w-4xl">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investments</h1>
          <p className="text-sm text-gray-500 mt-1">
            Grow your money with smart plans.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── PLANS ── */}
        {activeTab === 'plans' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {plansLoading ? (
              <LoadingState cols={3} />
            ) : (plans ?? []).length === 0 ? (
              <EmptyState cols={3} message="No investment plans available." />
            ) : (
              (plans ?? []).map((plan) => (
                <div
                  key={plan.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col gap-3"
                >
                  {/* Card head */}
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                    <span className="text-xs font-semibold bg-green-50 text-green-700 px-2.5 py-1 rounded-full">
                      {plan.roi}% ROI
                    </span>
                  </div>

                  {plan.description && (
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {plan.description}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="flex flex-col gap-1.5">
                    <MetaRow label="Min. amount" value={formatCurrency(Number(plan.min_amount))} />
                    <MetaRow label="Duration" value={`${plan.duration_days} days`} />
                    {plan.max_amount && (
                      <MetaRow label="Max. amount" value={formatCurrency(Number(plan.max_amount))} />
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedPlan(plan)}
                    className="mt-auto w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition"
                  >
                    <ArrowUp className="w-4 h-4" />
                    Invest now
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── MY INVESTMENTS ── */}
        {activeTab === 'my' && (
          <div className="space-y-3">
            {investmentsLoading ? (
              <LoadingState />
            ) : (investments ?? []).length === 0 ? (
              <EmptyState message="You have no active investments yet." />
            ) : (
              (investments ?? []).map((inv) => (
                <div
                  key={inv.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {inv.plan_name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(inv.created_at).toLocaleDateString('en-NG', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <span className="text-green-600 font-semibold text-base">
                      +{formatCurrency(Number(inv.expected_return))}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-50 flex gap-5 text-sm text-gray-400">
                    <span>
                      Invested:{' '}
                      <span className="text-gray-800 font-medium">
                        {formatCurrency(Number(inv.amount))}
                      </span>
                    </span>
                    {inv.status && (
                      <span>
                        Status:{' '}
                        <span className="text-gray-800 font-medium capitalize">
                          {inv.status}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── TRANSACTIONS ── */}
        {activeTab === 'transactions' && (
          <div className="space-y-3">
            {transactionsLoading ? (
              <LoadingState />
            ) : (transactions ?? []).length === 0 ? (
              <EmptyState message="No transactions yet." />
            ) : (
              (transactions ?? []).map((tx) => (
                <div
                  key={tx.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {tx.type}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(tx.created_at).toLocaleDateString('en-NG', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-green-600">
                    {formatCurrency(Number(tx.amount))}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Invest Modal */}
      {selectedPlan && (
        <InvestModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onSuccess={() => {
            // Switch to My Investments tab after investing
            setActiveTab('my');
          }}
        />
      )}
    </MainLayout>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-800 font-medium">{value}</span>
    </div>
  );
}

function LoadingState({ cols }: { cols?: number }) {
  return (
    <p
      className={`${cols ? `col-span-${cols}` : ''} text-center text-gray-400 py-10 text-sm`}
    >
      Loading…
    </p>
  );
}

function EmptyState({ message, cols }: { message: string; cols?: number }) {
  return (
    <div
      className={`${cols ? `col-span-${cols}` : ''} text-center py-14 flex flex-col items-center gap-2`}
    >
      <TrendingUp className="w-8 h-8 text-gray-200" />
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
}