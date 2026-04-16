'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/libs/stores/auth.store';
import { useSubscriptionStatus, useChangePassword } from '@/libs/hooks/useAuth';
import { MainLayout } from '@/layout/sections/dashboard/MainLayout';
import {
  User, CreditCard, Shield, LayoutGrid, Activity,
  Save, Pencil, X, Eye, EyeOff, RefreshCw, CheckCircle2,
  AlertCircle, ChevronRight, Wallet, Building2, Lock,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '@/libs/utils/format';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'profile' | 'payment' | 'security' | 'subscription' | 'activity';

const getPasswordChecks = (password: string, confirm: string) => ({
  length: password.length >= 8,
  upper: /[A-Z]/.test(password),
  lower: /[a-z]/.test(password),
  number: /[0-9]/.test(password),
  special: /[^A-Za-z0-9]/.test(password),
  match: password && confirm && password === confirm,
});

const isPasswordValid = (checks: ReturnType<typeof getPasswordChecks>) =>
  checks.length && checks.upper && checks.lower && checks.number && checks.special && checks.match;

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ name }: { name: string }) {
  const initials = (name ?? '?').slice(0, 2).toUpperCase();
  return (
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg shadow-orange-200">
      {initials}
    </div>
  );
}

function FieldGroup({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

function TextInput({
  name, value, onChange, disabled = false, type = 'text', placeholder = '',
}: {
  name: string; value: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean; type?: string; placeholder?: string;
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-white
        focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400
        disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
        placeholder:text-gray-300 transition-all duration-200"
    />
  );
}

function SaveBtn({ loading, label = 'Save changes', disabled = false }: { loading: boolean; label?: string; disabled?: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600
        active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
        text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm shadow-orange-200"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
      {loading ? 'Saving…' : label}
    </button>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-1">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap">{label}</span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-gray-100 rounded-2xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}

// ─── Tabs config ──────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; Icon: React.ElementType; mobileLabel: string }[] = [
  { id: 'profile',      label: 'Profile',      mobileLabel: 'Profile',  Icon: User },
  { id: 'payment',      label: 'Bank & Crypto', mobileLabel: 'Payment',  Icon: Wallet },
  { id: 'security',     label: 'Security',     mobileLabel: 'Security', Icon: Shield },
  { id: 'subscription', label: 'Subscription', mobileLabel: 'Plan',     Icon: LayoutGrid },
  { id: 'activity',     label: 'Activity',     mobileLabel: 'Activity', Icon: Activity },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const {
    user,
    updateUser,
    updateAccountInfo,
    activities,
    fetchActivities,
    isLoading: storeLoading,
  } = useAuthStore();

  const { data: subscription, refetch: refetchSub } = useSubscriptionStatus();
  const changePasswordMutation = useChangePassword();

  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [editingProfile, setEditingProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  const [profileForm, setProfileForm] = useState({
    username: '', phone_number: '', address: '',
  });
  const [paymentForm, setPaymentForm] = useState({
    bank_name: '', account_number: '', account_name: '',
    btc_wallet: '', eth_wallet: '', usdt_wallet: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    old_password: '', new_password: '', confirm_password: '',
  });
  const [showPw, setShowPw] = useState({ old: false, new: false, confirm: false });

  const passwordChecks = getPasswordChecks(
    passwordForm.new_password,
    passwordForm.confirm_password
  );

  useEffect(() => {
    if (!user) return;
    setProfileForm({
      username:     user.username     ?? '',
      phone_number: user.phone_number ?? '',
      address:      user.address      ?? '',
    });
    setPaymentForm({
      bank_name:      user.bank_name      ?? '',
      account_number: user.account_number ?? '',
      account_name:   user.account_name   ?? '',
      btc_wallet:     user.btc_wallet     ?? '',
      eth_wallet:     user.eth_wallet     ?? '',
      usdt_wallet:    user.usdt_wallet    ?? '',
    });
  }, [user]);

  useEffect(() => {
    if (activeTab === 'activity' && user) fetchActivities();
  }, [activeTab, user, fetchActivities]);

  const handleProfile = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setProfileForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handlePayment = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPaymentForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPasswordForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUser(profileForm);
      setEditingProfile(false);
      toast.success('Profile updated successfully');
    } catch (err: any) {
      toast.error(err?.message ?? err?.response?.data?.message ?? 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const savePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateAccountInfo(paymentForm);
      toast.success('Payment details saved');
    } catch (err: any) {
      toast.error(err?.message ?? err?.response?.data?.message ?? 'Failed to save payment details');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error('Passwords do not match', {
        duration: 4000,
        icon: '❌',
      });
      return;
    }
    
    if (!isPasswordValid(passwordChecks)) {
      toast.error('Password does not meet requirements', {
        duration: 4000,
        icon: '⚠️',
      });
      return;
    }
    
    // Show loading toast
    const loadingToast = toast.loading('Changing password...');
    
    try {
      await changePasswordMutation.mutateAsync({
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password,
      });
      
      // Dismiss loading and show success
      toast.dismiss(loadingToast);
      toast.success('Password changed successfully! 🔐', {
        duration: 5000,
        icon: '✅',
      });
      
      // Show success message in UI
      setPasswordChangeSuccess(true);
      
      // Clear form
      setPasswordForm({ old_password: '', new_password: '', confirm_password: '' });
      
      // Hide success message after 5 seconds
      setTimeout(() => setPasswordChangeSuccess(false), 5000);
      
    } catch (err: any) {
      toast.dismiss(loadingToast);
      
      // Handle specific error cases
      const errorMessage = err?.response?.data?.old_password?.[0] || 
                          err?.response?.data?.message || 
                          err?.message || 
                          'Failed to change password';
      
      if (errorMessage.includes('Wrong password') || errorMessage.includes('old_password')) {
        toast.error('Current password is incorrect', {
          duration: 4000,
          icon: '🔒',
        });
      } else {
        toast.error(errorMessage, {
          duration: 5000,
        });
      }
    }
  };

  const isSubscribed = subscription?.subscription_active ?? user?.is_subscribed ?? false;
  const subEndDate   = subscription?.subscription_end_date ?? user?.subscription_end_date;

  if (!user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-orange-400" />
            <p className="text-sm text-gray-400">Loading your account…</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto pb-24 sm:pb-16 px-0 sm:px-0 space-y-5">

        {/* ── Page header ── */}
        <div className="px-4 sm:px-0 pt-2 sm:pt-0">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Settings</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage your profile, payment details, and security</p>
        </div>

        {/* ── User banner ── */}
        <Card className="mx-4 sm:mx-0 px-5 py-4">
          <div className="flex items-center gap-4">
            <Avatar name={user.username} />
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-gray-900 truncate">{user.username}</p>
              <p className="text-sm text-gray-400 truncate">{user.email}</p>
              <p className="text-xs text-gray-300 mt-0.5">Member since {formatDate(user.created_at)}</p>
            </div>
            <div className="flex-shrink-0">
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                isSubscribed
                  ? 'bg-green-50 text-green-700 border border-green-100'
                  : 'bg-gray-50 text-gray-500 border border-gray-100'
              }`}>
                {isSubscribed
                  ? <><CheckCircle2 className="w-3 h-3" /> Active</>
                  : <><AlertCircle className="w-3 h-3" /> No plan</>}
              </span>
            </div>
          </div>
        </Card>

        {/* ── Tabs — scrollable on mobile ── */}
        <div className="px-4 sm:px-0">
          <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl overflow-x-auto scrollbar-hide">
            {TABS.map(({ id, label, mobileLabel, Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  activeTab === id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{mobileLabel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ════════════════ PROFILE ════════════════ */}
        {activeTab === 'profile' && (
          <Card className="mx-4 sm:mx-0 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm font-bold text-gray-900">Personal information</p>
                <p className="text-xs text-gray-400 mt-0.5">Your public profile details</p>
              </div>
              <button
                onClick={() => {
                  setEditingProfile(e => !e);
                  if (editingProfile) {
                    setProfileForm({
                      username:     user.username     ?? '',
                      phone_number: user.phone_number ?? '',
                      address:      user.address      ?? '',
                    });
                  }
                }}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all duration-200 ${
                  editingProfile
                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    : 'bg-orange-50 text-orange-500 hover:bg-orange-100'
                }`}
              >
                {editingProfile ? <><X className="w-3.5 h-3.5" /> Cancel</> : <><Pencil className="w-3.5 h-3.5" /> Edit</>}
              </button>
            </div>

            <form onSubmit={saveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FieldGroup label="Email" hint="Cannot be changed">
                  <TextInput name="email" value={user.email ?? ''} disabled />
                </FieldGroup>

                <FieldGroup label="Username">
                  <TextInput
                    name="username"
                    value={profileForm.username}
                    onChange={handleProfile}
                    disabled={!editingProfile}
                    placeholder="your_username"
                  />
                </FieldGroup>

                <FieldGroup label="Phone number">
                  <TextInput
                    name="phone_number"
                    type="tel"
                    value={profileForm.phone_number}
                    onChange={handleProfile}
                    disabled={!editingProfile}
                    placeholder="+1(543) 000 000 0000"
                  />
                </FieldGroup>

                <div className="sm:col-span-2">
                  <FieldGroup label="Address">
                    <textarea
                      name="address"
                      value={profileForm.address}
                      onChange={handleProfile}
                      disabled={!editingProfile}
                      rows={2}
                      placeholder="Your home or business address"
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl resize-none
                        focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400
                        disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
                        placeholder:text-gray-300 transition-all duration-200"
                    />
                  </FieldGroup>
                </div>
              </div>

              {editingProfile && (
                <div className="pt-2 flex items-center gap-3">
                  <SaveBtn loading={saving} />
                  <p className="text-xs text-gray-400">Changes saved to your account instantly</p>
                </div>
              )}
            </form>
          </Card>
        )}

        {/* ════════════════ PAYMENT ════════════════ */}
        {activeTab === 'payment' && (
          <div className="mx-4 sm:mx-0 space-y-4">
            <Card className="p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Bank account</p>
                  <p className="text-xs text-gray-400">For USD withdrawals</p>
                </div>
              </div>

              <form onSubmit={savePayment} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <FieldGroup label="Bank name">
                      <TextInput name="bank_name" value={paymentForm.bank_name} onChange={handlePayment} placeholder="e.g. First Bank, GTBank, Zenith" />
                    </FieldGroup>
                  </div>
                  <FieldGroup label="Account number">
                    <TextInput name="account_number" value={paymentForm.account_number} onChange={handlePayment} placeholder="10-digit NUBAN" />
                  </FieldGroup>
                  <FieldGroup label="Account name">
                    <TextInput name="account_name" value={paymentForm.account_name} onChange={handlePayment} placeholder="Name on account" />
                  </FieldGroup>
                </div>

                <SectionDivider label="Crypto wallets" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FieldGroup label="Bitcoin (BTC)">
                    <TextInput name="btc_wallet" value={paymentForm.btc_wallet} onChange={handlePayment} placeholder="bc1q…" />
                  </FieldGroup>
                  <FieldGroup label="Ethereum (ETH)">
                    <TextInput name="eth_wallet" value={paymentForm.eth_wallet} onChange={handlePayment} placeholder="0x…" />
                  </FieldGroup>
                  <div className="sm:col-span-2">
                    <FieldGroup label="USDT (TRC-20)">
                      <TextInput name="usdt_wallet" value={paymentForm.usdt_wallet} onChange={handlePayment} placeholder="T…" />
                    </FieldGroup>
                  </div>
                </div>

                <div className="pt-1">
                  <SaveBtn loading={saving} label="Save payment details" />
                </div>
              </form>
            </Card>

            <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4">
              <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed">
                Ensure your payment details are accurate. Incorrect information may cause withdrawal delays or failures.
              </p>
            </div>
          </div>
        )}

        {/* ════════════════ SECURITY ════════════════ */}
        {activeTab === 'security' && (
          <div className="mx-4 sm:mx-0 space-y-4">
            <Card className="p-5 sm:p-6 max-w-md">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Lock className="w-4 h-4 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Change password</p>
                  <p className="text-xs text-gray-400">Keep your account secure</p>
                </div>
              </div>

              {/* Success message banner */}
              {passwordChangeSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <p className="text-sm text-green-700">Your password has been updated successfully!</p>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                {(
                  [
                    { field: 'old' as const,     name: 'old_password',     label: 'Current password' },
                    { field: 'new' as const,     name: 'new_password',     label: 'New password' },
                    { field: 'confirm' as const, name: 'confirm_password', label: 'Confirm new password' },
                  ] as const
                ).map(({ field, name, label }) => (
                  <FieldGroup key={name} label={label}>
                    <div className="relative">
                      <input
                        type={showPw[field] ? 'text' : 'password'}
                        name={name}
                        value={passwordForm[name]}
                        onChange={handlePassword}
                        required
                        className="w-full px-4 py-3 pr-12 text-sm border border-gray-200 rounded-xl
                          focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400
                          placeholder:text-gray-300 transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(p => ({ ...p, [field]: !p[field] }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition"
                      >
                        {showPw[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </FieldGroup>
                ))}

                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 font-semibold mb-2">
                    Password must include:
                  </p>
                  <ul className="text-xs space-y-1.5">
                    {[
                      { label: 'At least 8 characters', valid: passwordChecks.length },
                      { label: 'One uppercase letter (A–Z)', valid: passwordChecks.upper },
                      { label: 'One lowercase letter (a–z)', valid: passwordChecks.lower },
                      { label: 'One number (0–9)', valid: passwordChecks.number },
                      { label: 'One special character (!@#$...)', valid: passwordChecks.special },
                      { label: 'Passwords match', valid: passwordChecks.match },
                    ].map((item, idx) => (
                      <li
                        key={idx}
                        className={`flex items-center gap-2 ${
                          item.valid ? 'text-green-600' : 'text-gray-400'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.valid ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        />
                        {item.label}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-1">
                  <SaveBtn
                    loading={changePasswordMutation.isPending}
                    label="Change password"
                    disabled={!isPasswordValid(passwordChecks)}
                  />
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* ════════════════ SUBSCRIPTION ════════════════ */}
        {activeTab === 'subscription' && (
          <div className="mx-4 sm:mx-0 space-y-4">
            <Card className="p-5 sm:p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-sm font-bold text-gray-900">Subscription status</p>
                  <p className="text-xs text-gray-400 mt-0.5">Your current plan details</p>
                </div>
                <button
                  onClick={() => refetchSub?.()}
                  className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className={`rounded-xl p-4 border ${isSubscribed ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'}`}>
                  <p className="text-xs text-gray-400 mb-1">Status</p>
                  <div className="flex items-center gap-1.5">
                    {isSubscribed
                      ? <CheckCircle2 className="w-4 h-4 text-green-600" />
                      : <AlertCircle className="w-4 h-4 text-gray-400" />}
                    <p className={`text-sm font-bold ${isSubscribed ? 'text-green-700' : 'text-gray-500'}`}>
                      {isSubscribed ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Expires on</p>
                  <p className="text-sm font-bold text-gray-900">
                    {subEndDate ? formatDate(subEndDate) : '—'}
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Auto-renew</p>
                  <p className="text-sm font-semibold text-gray-400">Not set</p>
                </div>
              </div>

              {!isSubscribed && (
                <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-xl">
                  <p className="text-sm font-bold text-orange-800">No active subscription</p>
                  <p className="text-xs text-orange-600 mt-0.5 mb-3">
                    Subscribe to unlock premium investment plans and features.
                  </p>
                  <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 transition">
                    View plans <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ════════════════ ACTIVITY ════════════════ */}
        {activeTab === 'activity' && (
          <Card className="mx-4 sm:mx-0 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm font-bold text-gray-900">Activity log</p>
                <p className="text-xs text-gray-400 mt-0.5">Your recent account actions</p>
              </div>
              <button
                onClick={fetchActivities}
                disabled={storeLoading}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl
                  bg-orange-50 text-orange-500 hover:bg-orange-100 disabled:opacity-50 transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${storeLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {storeLoading ? (
              <div className="flex items-center justify-center py-12 gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-orange-400" />
                <p className="text-sm text-gray-400">Loading activities…</p>
              </div>
            ) : (activities ?? []).length > 0 ? (
              <div className="space-y-0 divide-y divide-gray-50">
                {(activities as any[]).map((act, idx) => (
                  <div key={act.id ?? idx} className="flex items-start justify-between py-3.5 gap-4">
                    <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Activity className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{act.action}</p>
                      {act.details && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate">{act.details}</p>
                      )}
                      {act.ip_address && (
                        <p className="text-xs text-gray-300 mt-0.5">IP: {act.ip_address}</p>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 flex-shrink-0 pt-0.5 whitespace-nowrap">
                      {formatDate(act.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-gray-300" />
                </div>
                <p className="text-sm text-gray-400">No activities yet</p>
                <p className="text-xs text-gray-300">Actions you take will appear here</p>
              </div>
            )}
          </Card>
        )}

      </div>
    </MainLayout>
  );
}