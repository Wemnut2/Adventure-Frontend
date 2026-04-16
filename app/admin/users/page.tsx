// src/app/admin/users/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card } from '@/layout/components/Card';
import { Button } from '@/layout/components/Button';
import { Input } from '@/layout/components/Input';
import { Dialog } from '@/layout/components/Dialog';
import { adminService } from '@/libs/services/admin.service';
import { useToast } from '@/libs/src/contexts/ToastContext';
import { formatDate, formatDateTime } from '@/libs/utils/format';
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
  Key,
  RefreshCw,
  Mail,
  Calendar,
  DollarSign,
  CreditCard,
  Bitcoin,
  Shield,
  MoreVertical,
  Edit,
  Trash2,
  Copy
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
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
    } catch (err: unknown) {
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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard`, 'success');
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone_number?.includes(searchTerm);
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.is_active) ||
      (statusFilter === 'inactive' && !user.is_active);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.is_active).length,
    inactive: users.filter(u => !u.is_active).length,
    admins: users.filter(u => u.role === 'admin' || u.role === 'super_admin').length,
    subscribed: users.filter(u => u.is_subscribed).length
  };

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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">User Management</h1>
          <p className="mt-1 text-gray-600">Manage all platform users and their permissions</p>
        </div>
        <Button onClick={fetchUsers} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Inactive</p>
          <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Admins</p>
          <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Subscribed</p>
          <p className="text-2xl font-bold text-orange-600">{stats.subscribed}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <Input
            placeholder="Search by email, username, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
        >
          <option value="all">All Roles</option>
          <option value="user">Users</option>
          <option value="admin">Admins</option>
          <option value="super_admin">Super Admins</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-orange-50 to-amber-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Actions</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Password</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-600">
                        <span className="text-sm font-medium text-white">
                          {user.username?.charAt(0).toUpperCase()}
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
                          <Phone className="h-3 w-3 text-gray-400" />
                          {user.phone_number}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(user.created_at)}
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
                          user.is_subscribed ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                        className="rounded-lg p-1.5 hover:bg-gray-100 transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="rounded-lg p-1.5 hover:bg-red-100 text-red-600 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                  <div className="relative group">
                    {user.plain_password ? (
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                          {user.plain_password}
                        </code>
                        <button
                          onClick={() => {
                            if (user.plain_password) {
                              navigator.clipboard.writeText(user.plain_password);
                              showToast('Password copied to clipboard', 'success');
                            }
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Copy className="h-4 w-4 text-gray-400 hover:text-orange-500" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Not stored</span>
                    )}
                  </div>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* User Details Modal */}
      <Dialog open={showUserModal} onClose={() => setShowUserModal(false)}>
        {selectedUser && (
          <div className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">User Details</h2>
              <p className="text-gray-600">Complete user information</p>
            </div>

            <div className="space-y-6">
              {/* Personal Info */}
              <div className="rounded-lg border p-4">
                <h3 className="mb-3 font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5 text-orange-500" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Username</label>
                    <p className="font-medium">{selectedUser.username}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="flex items-center gap-2">
                      {selectedUser.email}
                      <button onClick={() => copyToClipboard(selectedUser.email, 'Email')}>
                        <Copy className="h-3 w-3 text-gray-400" />
                      </button>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Phone</label>
                    <p>{selectedUser.phone_number || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Role</label>
                    <p className="capitalize">{selectedUser.role}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Status</label>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                      selectedUser.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {selectedUser.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h3 className="mb-3 font-semibold flex items-center gap-2">
                      <Key className="h-5 w-5 text-red-500" />
                      Password (Testing Only)
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm text-gray-500">Plain Text Password</label>
                        <div className="mt-1 flex items-center gap-2">
                          <code className="flex-1 rounded bg-gray-100 px-3 py-2 font-mono text-sm">
                            {selectedUser.plain_password || 'Not stored'}
                          </code>
                          {selectedUser.plain_password && (
                            <button
                              onClick={() => selectedUser.plain_password && copyToClipboard(selectedUser.plain_password, 'Password')}
                              className="rounded-lg p-2 hover:bg-gray-100"
                            >
                              <Copy className="h-4 w-4 text-gray-500" />
                            </button>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-red-500">
                          ⚠️ This is for testing only. Remove in production!
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Subscription</label>
                    <p>{selectedUser.is_subscribed ? 'Premium Member' : 'Free Member'}</p>
                  </div>
                </div>
              </div>

              {/* Bank Info */}
              {(selectedUser.bank_name || selectedUser.account_number) && (
                <div className="rounded-lg border p-4">
                  <h3 className="mb-3 font-semibold flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-green-500" />
                    Bank Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">Bank Name</label>
                      <p>{selectedUser.bank_name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Account Number</label>
                      <p>{selectedUser.account_number || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Account Name</label>
                      <p>{selectedUser.account_name || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Crypto Wallets */}
              {(selectedUser.btc_wallet || selectedUser.eth_wallet) && (
                <div className="rounded-lg border p-4">
                  <h3 className="mb-3 font-semibold flex items-center gap-2">
                    <Bitcoin className="h-5 w-5 text-orange-500" />
                    Crypto Wallets
                  </h3>
                  <div className="space-y-2">
                    {selectedUser.btc_wallet && (
                      <div>
                        <label className="text-sm text-gray-500">Bitcoin</label>
                        <p className="font-mono text-sm">{selectedUser.btc_wallet}</p>
                      </div>
                    )}
                    {selectedUser.eth_wallet && (
                      <div>
                        <label className="text-sm text-gray-500">Ethereum</label>
                        <p className="font-mono text-sm">{selectedUser.eth_wallet}</p>
                      </div>
                    )}
                    {selectedUser.usdt_wallet && (
                      <div>
                        <label className="text-sm text-gray-500">USDT</label>
                        <p className="font-mono text-sm">{selectedUser.usdt_wallet}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Account Timeline */}
              <div className="rounded-lg border p-4">
                <h3 className="mb-3 font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Account Timeline
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Created</label>
                    <p>{formatDateTime(selectedUser.created_at)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Last Updated</label>
                    <p>{selectedUser.updated_at ? formatDateTime(selectedUser.updated_at) : 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Last Login</label>
                    <p>{selectedUser.last_login ? formatDateTime(selectedUser.last_login) : 'Never'}</p>
                  </div>
                </div>
              </div>
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