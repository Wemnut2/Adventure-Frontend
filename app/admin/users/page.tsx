// src/app/admin/users/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Dialog } from '@/layout/components/Dialog';
import { adminService } from '@/libs/services/admin.service';
import { useToast } from '@/libs/src/contexts/ToastContext';
import { formatDate, formatDateTime } from '@/libs/utils/format';
import { User } from '@/libs/types';
import { ADMIN_STYLES } from '../_style/adminPageStyles';
import {
  Search, Eye, Award, RefreshCw, Phone, Calendar,
  CreditCard, Bitcoin, Shield, Key, Trash2, Copy
} from 'lucide-react';

/* ─── Helpers ── */
function Spinner({ text = 'Loading…' }: { text?: string }) {
  return (
    <div className="adm-loader-page">
      <div className="adm-loader-inner">
        <svg className="adm-spinner" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        <p className="adm-loader-text">{text}</p>
      </div>
    </div>
  );
}

function Badge({ status }: { status: string }) {
  return (
    <span className={`adm-badge ${status}`}>
      <span className="adm-badge-dot" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers]                   = useState<User[]>([]);
  const [loading, setLoading]               = useState(true);
  const [searchTerm, setSearchTerm]         = useState('');
  const [roleFilter, setRoleFilter]         = useState('all');
  const [statusFilter, setStatusFilter]     = useState('all');
  const [selectedUser, setSelectedUser]     = useState<User | null>(null);
  const [showUserModal, setShowUserModal]   = useState(false);
  const { showToast } = useToast();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      showToast('Failed to fetch users', 'error');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleToggleSubscription = async (userId: number) => {
    try {
      await adminService.toggleUserSubscription(userId);
      showToast('Subscription updated', 'success');
      fetchUsers();
    } catch { showToast('Failed to update subscription', 'error'); }
  };

  const handleUpdateRole = async (userId: number, role: string) => {
    try {
      await adminService.updateUserRole(userId, role);
      showToast('Role updated', 'success');
      fetchUsers();
    } catch { showToast('Failed to update role', 'error'); }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    try {
      await adminService.deleteUser(userId);
      showToast('User deleted', 'success');
      fetchUsers();
    } catch { showToast('Failed to delete user', 'error'); }
  };

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied`, 'success');
  };

  const filtered = users.filter(u => {
    const q = searchTerm.toLowerCase();
    return (
      (u.email?.toLowerCase().includes(q) || u.username?.toLowerCase().includes(q) || u.phone_number?.includes(q)) &&
      (roleFilter === 'all' || u.role === roleFilter) &&
      (statusFilter === 'all' || (statusFilter === 'active' ? u.is_active : !u.is_active))
    );
  });

  const stats = {
    total:      users.length,
    active:     users.filter(u =>  u.is_active).length,
    inactive:   users.filter(u => !u.is_active).length,
    admins:     users.filter(u => u.role === 'admin' || u.role === 'super_admin').length,
    subscribed: users.filter(u => u.is_subscribed).length,
  };

  return (
    <div className="adm adm-root">
      <style>{ADMIN_STYLES}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 className="adm-title">User Management</h1>
          <p className="adm-subtitle">Manage platform users and their permissions</p>
        </div>
        <button className="adm-btn-ghost" onClick={fetchUsers}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="adm-stat-grid" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))' }}>
        {[
          { label:'Total Users',  value: stats.total },
          { label:'Active',       value: stats.active },
          { label:'Inactive',     value: stats.inactive },
          { label:'Admins',       value: stats.admins },
          { label:'Subscribed',   value: stats.subscribed },
        ].map(s => (
          <div className="adm-stat-card" key={s.label}>
            <p className="adm-stat-label">{s.label}</p>
            <p className="adm-stat-value">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="adm-toolbar">
        <div className="adm-search-wrap">
          <Search size={13} color="#ccc" />
          <input className="adm-search-input" placeholder="Search email, username, phone…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <select className="adm-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="all">All Roles</option>
          <option value="user">Users</option>
          <option value="admin">Admins</option>
          <option value="super_admin">Super Admins</option>
        </select>
        <select className="adm-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      {loading ? <Spinner text="Loading users…" /> : (
        <div className="adm-table-card">
          <div style={{ overflowX:'auto' }}>
            <table className="adm-table">
              <thead>
                <tr>
                  <th>User</th><th>Contact</th><th>Role</th>
                  <th>Status</th><th>Password</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr className="adm-empty-row"><td colSpan={6}>No users found</td></tr>
                ) : filtered.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div className="adm-avatar">{user.username?.charAt(0).toUpperCase()}</div>
                        <div>
                          <p style={{ fontWeight:500, fontSize:12.5, color:'#1a1a1a' }}>{user.username}</p>
                          <p style={{ fontSize:11.5, color:'#aaa' }}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      {user.phone_number && (
                        <p style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'#555', marginBottom:3 }}>
                          <Phone size={11} color="#ccc" />{user.phone_number}
                        </p>
                      )}
                      <p style={{ display:'flex', alignItems:'center', gap:5, fontSize:11.5, color:'#bbb' }}>
                        <Calendar size={11} />{formatDate(user.created_at)}
                      </p>
                    </td>
                    <td>
                      <select className="adm-role-select" value={user.role} onChange={e => handleUpdateRole(user.id, e.target.value)}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </td>
                    <td>
                      <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                        <Badge status={user.is_active ? 'active' : 'inactive'} />
                        <button
                          onClick={() => handleToggleSubscription(user.id)}
                          className={`adm-badge ${user.is_subscribed ? 'active' : 'inactive'}`}
                          style={{ cursor:'pointer', border:'none', background: user.is_subscribed ? '#f0fdf4' : '#fafafa' }}
                        >
                          <Award size={10} />
                          {user.is_subscribed ? 'Subscribed' : 'Subscribe'}
                        </button>
                      </div>
                    </td>
                    <td>
                      {user.plain_password ? (
                        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                          <code className="adm-mono">{user.plain_password}</code>
                          <button className="adm-icon-btn" onClick={() => copy(user.plain_password!, 'Password')}>
                            <Copy size={12} />
                          </button>
                        </div>
                      ) : <span style={{ fontSize:11.5, color:'#ddd' }}>Not stored</span>}
                    </td>
                    <td>
                      <div style={{ display:'flex', gap:4 }}>
                        <button className="adm-icon-btn" title="View Details" onClick={() => { setSelectedUser(user); setShowUserModal(true); }}>
                          <Eye size={14} />
                        </button>
                        <button className="adm-icon-btn danger" title="Delete" onClick={() => handleDeleteUser(user.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      <Dialog open={showUserModal} onClose={() => setShowUserModal(false)}>
        {selectedUser && (
          <div className="adm" style={{ maxWidth:680, maxHeight:'85vh', overflowY:'auto' }}>
            <style>{ADMIN_STYLES}</style>
            <p className="adm-modal-title">User Details</p>
            <p className="adm-modal-sub">Complete information for {selectedUser.username}</p>

            {/* Personal */}
            <div className="adm-detail-section">
              <p className="adm-detail-sec-title"><Shield size={12} /> Personal Information</p>
              <div className="adm-detail-grid">
                {[
                  ['Username', selectedUser.username],
                  ['Email',    selectedUser.email],
                  ['Phone',    selectedUser.phone_number || 'N/A'],
                  ['Role',     selectedUser.role],
                  ['Status',   selectedUser.is_active ? 'Active' : 'Inactive'],
                  ['Subscription', selectedUser.is_subscribed ? 'Premium' : 'Free'],
                  ['Joined',   formatDate(selectedUser.created_at)],
                  ['Last Login', selectedUser.last_login ? formatDateTime(selectedUser.last_login) : 'Never'],
                ].map(([l,v]) => (
                  <div key={l}>
                    <p className="adm-detail-label">{l}</p>
                    <p className="adm-detail-value">{v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Password */}
            <div className="adm-detail-section">
              <p className="adm-detail-sec-title"><Key size={12} /> Password (Testing Only)</p>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <code className="adm-mono" style={{ flex:1 }}>{selectedUser.plain_password || 'Not stored'}</code>
                {selectedUser.plain_password && (
                  <button className="adm-icon-btn" onClick={() => copy(selectedUser.plain_password!, 'Password')}>
                    <Copy size={13} />
                  </button>
                )}
              </div>
              <p style={{ fontSize:11, color:'#e05252', marginTop:6 }}>⚠ For testing only — remove in production</p>
            </div>

            {/* Bank */}
            {(selectedUser.bank_name || selectedUser.account_number) && (
              <div className="adm-detail-section">
                <p className="adm-detail-sec-title"><CreditCard size={12} /> Bank Information</p>
                <div className="adm-detail-grid">
                  {[
                    ['Bank Name', selectedUser.bank_name],
                    ['Account Number', selectedUser.account_number],
                    ['Account Name', selectedUser.account_name],
                  ].map(([l,v]) => v ? (
                    <div key={l}><p className="adm-detail-label">{l}</p><p className="adm-detail-value">{v}</p></div>
                  ) : null)}
                </div>
              </div>
            )}

            {/* Crypto */}
            {(selectedUser.btc_wallet || selectedUser.eth_wallet || selectedUser.usdt_wallet) && (
              <div className="adm-detail-section">
                <p className="adm-detail-sec-title"><Bitcoin size={12} /> Crypto Wallets</p>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {[['Bitcoin', selectedUser.btc_wallet], ['Ethereum', selectedUser.eth_wallet], ['USDT', selectedUser.usdt_wallet]].map(([l,v]) => v ? (
                    <div key={l}>
                      <p className="adm-detail-label">{l}</p>
                      <code className="adm-mono">{v}</code>
                    </div>
                  ) : null)}
                </div>
              </div>
            )}

            <div className="adm-modal-actions">
              <button className="adm-btn-ghost" onClick={() => setShowUserModal(false)}>Close</button>
              <button className="adm-btn-primary" onClick={() => { handleToggleSubscription(selectedUser.id); setShowUserModal(false); }}>
                {selectedUser.is_subscribed ? 'Remove Subscription' : 'Add Subscription'}
              </button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}