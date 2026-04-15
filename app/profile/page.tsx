'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/libs/stores/auth.store';
import { useSubscriptionStatus } from '@/libs/hooks/useAuth';
import { MainLayout } from '@/layout/sections/dashboard/MainLayout';
import { 
  Edit, 
  Calendar, 
  Mail, 
  Phone, 
  Activity 
} from 'lucide-react';
import { formatDate } from '@/libs/utils/format';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { 
    user, 
    fetchActivities, 
    activities 
  } = useAuthStore();

  const { data: subscription } = useSubscriptionStatus();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    phone_number: '',
    address: '',
  });

  const isSubscribed = subscription?.subscription_active ?? user?.is_subscribed ?? false;
  const endDate = subscription?.subscription_end_date || user?.subscription_end_date;

  // Sync user data to form
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        phone_number: user.phone_number || '',
        address: user.address || '',
      });
    }
  }, [user]);

  // Fetch activities only once when user is loaded
  useEffect(() => {
    if (user?.id) {
      fetchActivities();
    }
  }, [user?.id, fetchActivities]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const saveChanges = async () => {
    if (!user) return;
    
    try {
      await useAuthStore.getState().updateUser(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update profile');
    }
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[70vh]">
          <p className="text-gray-500 text-lg">Loading profile...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-500 mt-1">Welcome back, {user.username}</p>
          </div>
          <Link
            href="/settings"
            className="mt-4 md:mt-0 flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl hover:bg-orange-600 transition"
          >
            <Edit size={18} /> Edit Full Settings
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Profile Card */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <div className="w-28 h-28 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center text-white text-5xl font-bold">
                {user.username?.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-3xl font-bold text-gray-900">{user.username}</h2>
                <p className="text-gray-500 flex items-center justify-center sm:justify-start gap-2 mt-1">
                  <Mail size={18} /> {user.email}
                </p>
                {user.phone_number && (
                  <p className="text-gray-500 flex items-center justify-center sm:justify-start gap-2 mt-1">
                    <Phone size={18} /> {user.phone_number}
                  </p>
                )}
              </div>
            </div>

            {/* Editable Information */}
            <div className="mt-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Personal Information</h3>
                <button
                  onClick={() => isEditing ? saveChanges() : setIsEditing(true)}
                  className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1"
                >
                  {isEditing ? 'Save Changes' : 'Edit'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-500">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500">Phone Number</label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 disabled:bg-gray-50"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-500">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="text-orange-500" />
                <h3 className="font-semibold">Subscription</h3>
              </div>
              <p className={`text-2xl font-bold ${isSubscribed ? 'text-green-600' : 'text-red-600'}`}>
                {isSubscribed ? 'Active' : 'Inactive'}
              </p>
              {endDate && (
                <p className="text-sm text-gray-500 mt-1">
                  Expires {formatDate(endDate)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="mt-10 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
          <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
            <Activity className="text-orange-500" /> Recent Activity
          </h3>
          
          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.slice(0, 6).map((act: any) => (
                <div key={act.id} className="flex items-start justify-between p-4 border border-gray-100 rounded-2xl">
                  <div>
                    <p className="font-medium">{act.action}</p>
                    {act.details && <p className="text-sm text-gray-500 mt-1">{act.details}</p>}
                  </div>
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    {formatDate(act.created_at)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-10 text-gray-400">No recent activities found</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
}