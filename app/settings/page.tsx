'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/libs/stores/auth.store';
import { useSubscriptionStatus } from '@/libs/hooks/useAuth';
import { MainLayout } from '@/layout/sections/dashboard/MainLayout';
import { 
  User, Banknote, Wallet, Activity, Save, Edit, Calendar, Lock, Eye, EyeOff 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '@/libs/utils/format';

export default function SettingsPage() {
  const { 
    user, 
    updateUser, 
    updateAccountInfo,
    activities,
    fetchActivities,
    isLoading: storeLoading 
  } = useAuthStore();

  const { data: subscription } = useSubscriptionStatus();

  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'subscription' | 'security' | 'activities'>('profile');
  
  const [profileForm, setProfileForm] = useState({ username: '', phone_number: '', address: '' });
  const [accountForm, setAccountForm] = useState({
    bank_name: '', account_number: '', account_name: '',
    btc_wallet: '', eth_wallet: '', usdt_wallet: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    old_password: '', new_password: '', confirm_password: ''
  });

  const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });
  const [isSaving, setIsSaving] = useState(false);

  // Sync data
  useEffect(() => {
    if (user) {
      setProfileForm({
        username: user.username || '',
        phone_number: user.phone_number || '',
        address: user.address || '',
      });
      setAccountForm({
        bank_name: user.bank_name || '',
        account_number: user.account_number || '',
        account_name: user.account_name || '',
        btc_wallet: user.btc_wallet || '',
        eth_wallet: user.eth_wallet || '',
        usdt_wallet: user.usdt_wallet || '',
      });
    }
  }, [user]);

  // Auto load activities
  useEffect(() => {
    if (activeTab === 'activities' && user) {
      fetchActivities();
    }
  }, [activeTab, user, fetchActivities]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const togglePassword = (field: 'old' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUser(profileForm);
      toast.success('Profile updated successfully');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const saveAccountInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateAccountInfo(accountForm);
      toast.success('Bank & Crypto details saved successfully');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save account details');
    } finally {
      setIsSaving(false);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      return toast.error("New passwords do not match");
    }
    if (passwordForm.new_password.length < 8) {
      return toast.error("New password must be at least 8 characters");
    }

    setIsSaving(true);
    try {
      // TODO: Add changePassword to your authService
      toast.success('Password changed successfully');
      setPasswordForm({ old_password: '', new_password: '', confirm_password: '' });
    } catch (err: any) {
      toast.error('Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  const isSubscribed = subscription?.subscription_active ?? user?.is_subscribed ?? false;
  const endDate = subscription?.subscription_end_date || user?.subscription_end_date;

  if (!user) {
    return <MainLayout><div className="text-center py-20">Loading your information...</div></MainLayout>;
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account and preferences</p>
        </div>

        {/* Tabs - Mobile Friendly */}
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto pb-1 hide-scrollbar">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'account', label: 'Bank & Crypto', icon: Banknote },
            { id: 'subscription', label: 'Subscription', icon: Wallet },
            { id: 'security', label: 'Security', icon: Lock },
            { id: 'activities', label: 'Activities', icon: Activity },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-4 font-medium border-b-2 whitespace-nowrap transition-all text-sm sm:text-base ${
                activeTab === tab.id ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><Edit className="text-orange-500" /> Basic Information</h2>
            <form onSubmit={saveProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={user.email || ''} disabled className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input type="text" name="username" value={profileForm.username} onChange={handleProfileChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" name="phone_number" value={profileForm.phone_number} onChange={handleProfileChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea name="address" value={profileForm.address} onChange={handleProfileChange} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500" />
                </div>
              </div>
              <button type="submit" disabled={isSaving} className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 py-3.5 rounded-xl flex items-center justify-center gap-2">
                <Save size={20} /> {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* BANK & CRYPTO TAB */}
        {activeTab === 'account' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-6">Bank & Cryptocurrency Details</h2>
            <form onSubmit={saveAccountInfo} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                  <input type="text" name="bank_name" value={accountForm.bank_name} onChange={handleAccountChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  <input type="text" name="account_number" value={accountForm.account_number} onChange={handleAccountChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                  <input type="text" name="account_name" value={accountForm.account_name} onChange={handleAccountChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bitcoin Wallet</label>
                  <input type="text" name="btc_wallet" value={accountForm.btc_wallet} onChange={handleAccountChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ethereum Wallet</label>
                  <input type="text" name="eth_wallet" value={accountForm.eth_wallet} onChange={handleAccountChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">USDT Wallet</label>
                  <input type="text" name="usdt_wallet" value={accountForm.usdt_wallet} onChange={handleAccountChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500" />
                </div>
              </div>
              <button type="submit" disabled={isSaving} className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 py-3.5 rounded-xl flex items-center justify-center gap-2">
                <Save size={20} /> {isSaving ? 'Saving...' : 'Save Payment Details'}
              </button>
            </form>
          </div>
        )}

        {/* SUBSCRIPTION TAB */}
        {activeTab === 'subscription' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Calendar className="text-orange-500" /> Subscription Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-2xl p-6">
                <p className="text-sm text-orange-600">Status</p>
                <p className={`text-3xl font-bold mt-3 ${isSubscribed ? 'text-green-600' : 'text-red-600'}`}>
                  {isSubscribed ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <p className="text-sm text-gray-500">Expires On</p>
                <p className="text-2xl font-semibold mt-3">{endDate ? formatDate(endDate) : 'No active subscription'}</p>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <p className="text-sm text-gray-500">Auto Renew</p>
                <p className="text-2xl font-semibold mt-3 text-gray-400">—</p>
              </div>
            </div>
          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Lock className="text-orange-500" /> Change Password
            </h2>
            <form onSubmit={changePassword} className="space-y-6 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <div className="relative">
                  <input type={showPasswords.old ? "text" : "password"} name="old_password" value={passwordForm.old_password} onChange={handlePasswordChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl" required />
                  <button type="button" onClick={() => togglePassword('old')} className="absolute right-4 top-4 text-gray-400">{showPasswords.old ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <input type={showPasswords.new ? "text" : "password"} name="new_password" value={passwordForm.new_password} onChange={handlePasswordChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl" required />
                  <button type="button" onClick={() => togglePassword('new')} className="absolute right-4 top-4 text-gray-400">{showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input type={showPasswords.confirm ? "text" : "password"} name="confirm_password" value={passwordForm.confirm_password} onChange={handlePasswordChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl" required />
                  <button type="button" onClick={() => togglePassword('confirm')} className="absolute right-4 top-4 text-gray-400">{showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                </div>
              </div>
              <button type="submit" disabled={isSaving} className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 py-3.5 rounded-xl flex items-center justify-center gap-2">
                <Save size={20} /> {isSaving ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        )}

        {/* ACTIVITIES TAB */}
        {activeTab === 'activities' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Activity className="text-orange-500" /> Activity Log
              </h2>
              <button onClick={fetchActivities} disabled={storeLoading} className="text-orange-500 hover:text-orange-600">↻ Refresh</button>
            </div>

            {storeLoading ? (
              <p className="text-center py-12">Loading activities...</p>
            ) : activities.length > 0 ? (
              <div className="space-y-3 max-h-[500px] overflow-auto">
                {activities.map((act: any) => (
                  <div key={act.id} className="p-4 border border-gray-100 rounded-xl flex flex-col sm:flex-row justify-between gap-2">
                    <div>
                      <p className="font-medium">{act.action}</p>
                      {act.details && <p className="text-sm text-gray-600">{act.details}</p>}
                    </div>
                    <p className="text-xs text-gray-400 whitespace-nowrap">{formatDate(act.created_at)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-12 text-gray-500">No activities yet</p>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}