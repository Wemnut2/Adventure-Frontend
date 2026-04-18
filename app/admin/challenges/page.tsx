// src/app/admin/challenges/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Dialog } from '@/layout/components/Dialog';
import { adminService } from '@/libs/services/admin.service';
import { useToast } from '@/libs/src/contexts/ToastContext';
import { formatCurrency, formatDate, formatDateTime } from '@/libs/utils/format';
import { ChallengeParticipant as ImportedChallengeParticipant } from '@/libs/types';
import { ADMIN_STYLES } from '../_style/adminPageStyles';
import {
  Search, Eye, RefreshCw, Users, Award,
  TrendingUp, Phone, MapPin, FileText, Shield, CheckCircle, AlertCircle,
} from 'lucide-react';

interface Participant extends Partial<ImportedChallengeParticipant> {
  id: number;
  user: { id: number; email: string; username: string; phone_number?: string; };
  full_name: string;
  challenge_status: 'pending' | 'active' | 'completed' | 'failed';
  registration_fee_paid: boolean;
  insurance_fee_paid: boolean;
  total_prize: number;
  challenge_reward_claimed?: boolean;
}

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

function StatusBadge({ status }: { status: string }) {
  const s = ['active','pending','completed','failed'].includes(status) ? status : 'inactive';
  return (
    <span className={`adm-badge ${s}`}>
      <span className="adm-badge-dot" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function FeeBadge({ paid, label, onApprove }: { paid: boolean; label: string; onApprove?: () => void }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
      <span style={{ fontSize:11, color:'#bbb', width:70 }}>{label}:</span>
      <span className={`adm-badge ${paid ? 'paid' : 'unpaid'}`}>
        <span className="adm-badge-dot" />{paid ? 'Paid' : 'Unpaid'}
      </span>
      {!paid && onApprove && (
        <button className="adm-btn-success adm-btn-sm" onClick={onApprove} style={{ padding:'3px 9px', fontSize:11 }}>Approve</button>
      )}
    </div>
  );
}

export default function AdminChallengesPage() {
  const [participants, setParticipants]         = useState<Participant[]>([]);
  const [loading, setLoading]                   = useState(true);
  const [error, setError]                       = useState<string | null>(null);
  const [searchTerm, setSearchTerm]             = useState('');
  const [statusFilter, setStatusFilter]         = useState('all');
  const [selectedP, setSelectedP]               = useState<Participant | null>(null);
  const [showDetails, setShowDetails]           = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveType, setApproveType]           = useState<'registration' | 'insurance'>('registration');
  const [approveUserId, setApproveUserId]       = useState<number | null>(null);
  const { showToast } = useToast();

  const fetchParticipants = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await adminService.getChallengeParticipants();
      setParticipants(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch participants';
      setError(msg); showToast(msg, 'error'); setParticipants([]);
    } finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { fetchParticipants(); }, [fetchParticipants]);

  const handleApproveFee = async (userId: number, type: 'registration' | 'insurance') => {
    try {
      await adminService.approveChallengeFee(userId, type);
      showToast(`${type === 'registration' ? 'Registration' : 'Insurance'} fee approved`, 'success');
      fetchParticipants(); setShowApproveModal(false);
    } catch { showToast('Failed to approve fee', 'error'); }
  };

  const handleUpdateStatus = async (userId: number, status: string, prize?: number) => {
    try {
      await adminService.updateChallengeStatus(userId, status as Participant['challenge_status'], prize);
      showToast(`Status updated to ${status}`, 'success');
      fetchParticipants(); setShowDetails(false);
    } catch { showToast('Failed to update status', 'error'); }
  };

  const handleClaimReward = async (userId: number) => {
    if (!confirm('Mark this reward as claimed?')) return;
    try {
      await adminService.updateChallengeStatus(userId, 'completed', undefined);
      showToast('Reward claimed', 'success'); fetchParticipants();
    } catch { showToast('Failed to claim reward', 'error'); }
  };

  const filtered = participants.filter(p => {
    const q = searchTerm.toLowerCase();
    return (
      (p.full_name?.toLowerCase().includes(q) || p.user?.email?.toLowerCase().includes(q) ||
       p.user?.username?.toLowerCase().includes(q) || p.contact_number?.includes(q)) &&
      (statusFilter === 'all' || p.challenge_status === statusFilter)
    );
  });

  const stats = {
    total:    participants.length,
    pending:  participants.filter(p => p.challenge_status === 'pending').length,
    active:   participants.filter(p => p.challenge_status === 'active').length,
    completed:participants.filter(p => p.challenge_status === 'completed').length,
    totalPrize: participants.reduce((s, p) => s + (p.total_prize || 0), 0),
    feesCollected: (participants.filter(p => p.registration_fee_paid).length + participants.filter(p => p.insurance_fee_paid).length) * 110,
  };

  return (
    <div className="adm adm-root">
      <style>{ADMIN_STYLES}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 className="adm-title">Challenge Management</h1>
          <p className="adm-subtitle">Approve fees, update statuses, track participants</p>
        </div>
        <button className="adm-btn-ghost" onClick={fetchParticipants}><RefreshCw size={13} /> Refresh</button>
      </div>

      {/* Stats */}
      <div className="adm-stat-grid" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))' }}>
        {[
          { label:'Participants',    value: stats.total },
          { label:'Pending',         value: stats.pending },
          { label:'Active',          value: stats.active },
          { label:'Completed',       value: stats.completed },
          { label:'Prize Pool',      value: formatCurrency(stats.totalPrize) },
          { label:'Fees Collected',  value: formatCurrency(stats.feesCollected) },
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
          <input className="adm-search-input" placeholder="Search name, email, phone…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <select className="adm-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Table */}
      {loading ? <Spinner text="Loading participants…" /> : error ? (
        <div className="adm-loader-page">
          <div className="adm-loader-inner">
            <AlertCircle size={26} color="#e05252" />
            <p className="adm-loader-text" style={{ color:'#e05252' }}>{error}</p>
            <button className="adm-btn-primary adm-btn-sm" style={{ marginTop:12 }} onClick={fetchParticipants}>Try Again</button>
          </div>
        </div>
      ) : (
        <div className="adm-table-card">
          <div style={{ overflowX:'auto' }}>
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Participant</th><th>Contact</th><th>Fees</th>
                  <th>Status</th><th>Prize</th><th>Start Date</th><th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr className="adm-empty-row"><td colSpan={7}>{searchTerm || statusFilter !== 'all' ? 'No matching participants' : 'No challenge participants yet'}</td></tr>
                ) : filtered.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div className="adm-avatar neutral" style={{ fontFamily:"'DM Sans',sans-serif" }}>
                          {p.full_name?.charAt(0).toUpperCase() || 'P'}
                        </div>
                        <div>
                          <p style={{ fontWeight:500, fontSize:12.5, color:'#1a1a1a' }}>{p.full_name || 'N/A'}</p>
                          <p style={{ fontSize:11.5, color:'#aaa' }}>{p.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      {p.contact_number && (
                        <p style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, marginBottom:3 }}>
                          <Phone size={11} color="#ccc" />{p.contact_number}
                        </p>
                      )}
                      {p.location && (
                        <p style={{ display:'flex', alignItems:'center', gap:5, fontSize:11.5, color:'#bbb' }}>
                          <MapPin size={11} />{p.location}
                        </p>
                      )}
                    </td>
                    <td>
                      <FeeBadge paid={p.registration_fee_paid} label="Reg." onApprove={() => {
                        setApproveUserId(p.user.id); setApproveType('registration'); setShowApproveModal(true);
                      }} />
                      <FeeBadge paid={p.insurance_fee_paid} label="Ins." onApprove={() => {
                        setApproveUserId(p.user.id); setApproveType('insurance'); setShowApproveModal(true);
                      }} />
                    </td>
                    <td><StatusBadge status={p.challenge_status} /></td>
                    <td style={{ fontWeight:600, color:'#16a34a' }}>{formatCurrency(p.total_prize || 0)}</td>
                    <td style={{ color:'#aaa', fontSize:12 }}>{p.challenge_start_date ? formatDate(p.challenge_start_date) : '—'}</td>
                    <td>
                      <button className="adm-icon-btn" onClick={() => { setSelectedP(p); setShowDetails(true); }}>
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      <Dialog open={showDetails} onClose={() => setShowDetails(false)}>
        {selectedP && (
          <div className="adm" style={{ maxWidth:680, maxHeight:'85vh', overflowY:'auto' }}>
            <style>{ADMIN_STYLES}</style>
            <p className="adm-modal-title">Participant Details</p>
            <p className="adm-modal-sub">{selectedP.full_name} · {selectedP.user?.email}</p>

            {/* Personal */}
            <div className="adm-detail-section">
              <p className="adm-detail-sec-title"><Users size={12} /> Personal Information</p>
              <div className="adm-detail-grid">
                {[
                  ['Full Name',       selectedP.full_name],
                  ['Email',           selectedP.user?.email],
                  ['Username',        selectedP.user?.username],
                  ['Phone',           selectedP.contact_number || selectedP.user?.phone_number || 'N/A'],
                  ['Gender',          selectedP.gender],
                  ['Age',             selectedP.age],
                  ['Marital Status',  selectedP.marital_status],
                  ['Monthly Income',  formatCurrency(selectedP.monthly_income || 0)],
                  ['Location',        selectedP.location],
                ].map(([l,v]) => v != null ? (
                  <div key={String(l)}><p className="adm-detail-label">{l}</p><p className="adm-detail-value">{String(v)}</p></div>
                ) : null)}
              </div>
            </div>

            {/* Challenge */}
            <div className="adm-detail-section">
              <p className="adm-detail-sec-title"><Award size={12} /> Challenge Information</p>
              <div className="adm-detail-grid">
                <div>
                  <p className="adm-detail-label">Status</p>
                  <div style={{ marginTop:4 }}><StatusBadge status={selectedP.challenge_status} /></div>
                </div>
                <div>
                  <p className="adm-detail-label">Prize</p>
                  <p className="adm-detail-value" style={{ color:'#16a34a', fontWeight:600 }}>{formatCurrency(selectedP.total_prize || 0)}</p>
                </div>
                <div>
                  <p className="adm-detail-label">Start Date</p>
                  <p className="adm-detail-value">{selectedP.challenge_start_date ? formatDateTime(selectedP.challenge_start_date) : 'Not started'}</p>
                </div>
                <div>
                  <p className="adm-detail-label">End Date</p>
                  <p className="adm-detail-value">{selectedP.challenge_end_date ? formatDateTime(selectedP.challenge_end_date) : 'Not set'}</p>
                </div>
                <div>
                  <p className="adm-detail-label">Reward Claimed</p>
                  <p className="adm-detail-value">{selectedP.challenge_reward_claimed ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>

            {/* Medical & Housing */}
            <div className="adm-detail-section">
              <p className="adm-detail-sec-title"><Shield size={12} /> Medical & Housing</p>
              <div className="adm-detail-grid">
                {[
                  ['Hearing Status',    selectedP.hearing_status?.replace(/_/g,' ')],
                  ['Housing Situation', selectedP.housing_situation?.replace(/_/g,' ')],
                  ['Preferred Payment', selectedP.preferred_payment_method?.replace(/_/g,' ')],
                ].map(([l,v]) => (
                  <div key={String(l)}><p className="adm-detail-label">{l}</p><p className="adm-detail-value">{v || 'N/A'}</p></div>
                ))}
              </div>
            </div>

            {/* Signatures */}
            <div className="adm-detail-section">
              <p className="adm-detail-sec-title"><FileText size={12} /> Signatures</p>
              <div className="adm-detail-grid">
                <div>
                  <p className="adm-detail-label">Participant</p>
                  <code className="adm-mono">{selectedP.participant_signature || 'Not signed'}</code>
                  {selectedP.participant_signature_date && <p style={{ fontSize:11, color:'#ccc', marginTop:3 }}>{formatDate(selectedP.participant_signature_date)}</p>}
                </div>
                <div>
                  <p className="adm-detail-label">CEO</p>
                  <code className="adm-mono">{selectedP.ceo_signature || 'Not signed'}</code>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="adm-modal-actions" style={{ flexWrap:'wrap' }}>
              <button className="adm-btn-ghost" onClick={() => setShowDetails(false)}>Close</button>
              {selectedP.challenge_status === 'pending' && (
                <button className="adm-btn-success" onClick={() => {
                  const prize = prompt('Enter prize amount:', '1000000');
                  if (prize) handleUpdateStatus(selectedP.user.id, 'active', parseFloat(prize));
                }}>
                  <CheckCircle size={13} /> Start Challenge
                </button>
              )}
              {selectedP.challenge_status === 'active' && (
                <button className="adm-btn-primary" onClick={() => handleUpdateStatus(selectedP.user.id, 'completed')}>
                  <Award size={13} /> Complete Challenge
                </button>
              )}
              {selectedP.challenge_status === 'completed' && !selectedP.challenge_reward_claimed && (
                <button className="adm-btn-primary" onClick={() => handleClaimReward(selectedP.user.id)}>
                  <DollarSign size={13} /> Claim Reward
                </button>
              )}
            </div>
          </div>
        )}
      </Dialog>

      {/* Approve Fee Confirm Modal */}
      <Dialog open={showApproveModal} onClose={() => setShowApproveModal(false)}>
        <div className="adm" style={{ maxWidth:380 }}>
          <style>{ADMIN_STYLES}</style>
          <p className="adm-modal-title">Approve Fee</p>
          <p className="adm-modal-sub">
            Confirm approval of the <b>{approveType}</b> fee payment?
          </p>
          <div className="adm-modal-actions">
            <button className="adm-btn-ghost" onClick={() => setShowApproveModal(false)}>Cancel</button>
            <button className="adm-btn-success" onClick={() => approveUserId && handleApproveFee(approveUserId, approveType)}>
              <CheckCircle size={13} /> Approve Payment
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

// needed import at top for DollarSign icon
import { DollarSign } from 'lucide-react';