// src/app/admin/users/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card } from '@/layout/components/Card';
import { Button } from '@/layout/components/Button';
import { Input } from '@/layout/components/Input';
import { Dialog } from '@/layout/components/Dialog';
import { adminService } from '@/libs/services/admin.service';
import { useToast } from '@/libs/src/contexts/ToastContext';
import { formatDate } from '@/libs/utils/format';
import { User } from '@/libs/types';
import {
  Search,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Phone,
  Award,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const { showToast } = useToast();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getAllUsers();
      const usersArray = Array.isArray(data) ? data : [];
      setUsers(usersArray);
      if (usersArray.length === 0) {
        console.log('No users found');
      }
    } catch (err: unknown) {
      console.error('Failed to fetch users:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      showToast('Failed to fetch users', 'error');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleSubscription = async (userId: number) => {
    try {
      await adminService.toggleUserSubscription(userId);
      showToast('Subscription status updated', 'success');
      fetchUsers();
    } catch (error) {
      showToast('Failed to update subscription', 'error');
    }
  };

  const handleUpdateRole = async (userId: number, role: string) => {
    try {
      await adminService.updateUserRole(userId, role);
      showToast('User role updated', 'success');
      fetchUsers();
    } catch (error) {
      showToast('Failed to update role', 'error');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await adminService.deleteUser(userId);
        showToast('User deleted successfully', 'success');
        fetchUsers();
      } catch (error) {
        showToast('Failed to delete user', 'error');
      }
    }
  };

  // Safe filter - ensure users is an array
  const filteredUsers = Array.isArray(users) ? users.filter((user: User) =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.phone_number && user.phone_number.includes(searchTerm))
  ) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Failed to load users</p>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <Button onClick={fetchUsers} variant="primary" className="bg-orange-500 hover:bg-orange-600">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="mt-1 text-gray-600">
            Manage all platform users, their roles, and subscriptions
          </p>
        </div>
        <div className="flex gap-3">
          <div className="w-64">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>
          <Button variant="outline" onClick={fetchUsers}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user: User) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                          <span className="text-sm font-medium text-orange-600">
                            {user.username?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{user.username}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {user.phone_number && (
                          <p className="text-sm flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {user.phone_number}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          Joined: {formatDate(user.created_at)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                        className="rounded-lg border border-gray-300 px-2 py-1 text-sm focus:border-orange-500 focus:outline-none"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                          user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {user.is_active ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          onClick={() => handleToggleSubscription(user.id)}
                          className={`inline-flex w-full items-center justify-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition-colors ${
                            user.is_subscribed ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Award className="h-3 w-3" />
                          {user.is_subscribed ? 'Subscribed' : 'Subscribe'}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{formatDate(user.created_at)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                          className="rounded-lg p-1 hover:bg-gray-100 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="rounded-lg p-1 hover:bg-red-100 text-red-600 transition-colors"
                          title="Delete User"
                        >
                          <Ban className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    {searchTerm ? 'No matching users found' : 'No users found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* User Details Modal */}
      <Dialog open={showUserModal} onClose={() => setShowUserModal(false)}>
        {selectedUser && (
          <div className="max-w-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">User Details</h2>
              <p className="text-gray-600">View and manage user information</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Username</label>
                  <p className="mt-1">{selectedUser.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="mt-1">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="mt-1">{selectedUser.phone_number || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Role</label>
                  <p className="mt-1 capitalize">{selectedUser.role}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="mt-1">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                      selectedUser.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {selectedUser.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Subscription</label>
                  <p className="mt-1">{selectedUser.is_subscribed ? 'Active' : 'Inactive'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Joined</label>
                  <p className="mt-1">{formatDate(selectedUser.created_at)}</p>
                </div>
              </div>

              {(selectedUser.bank_name || selectedUser.account_number) && (
                <div className="border-t pt-4">
                  <h3 className="mb-2 font-semibold">Bank Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedUser.bank_name && (
                      <div>
                        <label className="text-sm text-gray-500">Bank Name</label>
                        <p>{selectedUser.bank_name}</p>
                      </div>
                    )}
                    {selectedUser.account_number && (
                      <div>
                        <label className="text-sm text-gray-500">Account Number</label>
                        <p>{selectedUser.account_number}</p>
                      </div>
                    )}
                    {selectedUser.account_name && (
                      <div>
                        <label className="text-sm text-gray-500">Account Name</label>
                        <p>{selectedUser.account_name}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="outline" onClick={() => setShowUserModal(false)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  handleToggleSubscription(selectedUser.id);
                  setShowUserModal(false);
                }}
                variant="primary"
                className="bg-orange-500 hover:bg-orange-600"
              >
                {selectedUser.is_subscribed ? 'Remove Subscription' : 'Add Subscription'}
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}