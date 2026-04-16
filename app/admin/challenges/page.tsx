// src/app/admin/challenges/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card } from '@/layout/components/Card';
import { Button } from '@/layout/components/Button';
import { Input } from '@/layout/components/Input';
import { Dialog } from '@/layout/components/Dialog';
import { adminService } from '@/libs/services/admin.service';
import { useToast } from '@/libs/src/contexts/ToastContext';
import { formatCurrency, formatDate, formatDateTime } from '@/libs/utils/format';
import { ChallengeParticipant, ChallengeParticipant as ImportedChallengeParticipant } from '@/libs/types';
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  AlertCircle,
  RefreshCw,
  Users,
  DollarSign,
  Award,
  Calendar,
  Phone,
  MapPin,
  FileText,
  TrendingUp,
  Shield
} from 'lucide-react';

interface LocalChallengeParticipant extends Partial<ImportedChallengeParticipant> {
  id: number;
  user: {
    id: number;
    email: string;
    username: string;
    phone_number?: string;
  };
  full_name: string;
  challenge_status: 'pending' | 'active' | 'completed' | 'failed';
  registration_fee_paid: boolean;
  insurance_fee_paid: boolean;
  total_prize: number;
  challenge_reward_claimed?: boolean;
}

export default function AdminChallengesPage() {
  const [participants, setParticipants] = useState<LocalChallengeParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedParticipant, setSelectedParticipant] = useState<LocalChallengeParticipant | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveType, setApproveType] = useState<'registration' | 'insurance'>('registration');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const { showToast } = useToast();

  const fetchParticipants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getChallengeParticipants();
      const participantsArray = Array.isArray(data) ? data : [];
      setParticipants(participantsArray);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('Failed to fetch challenge participants:', error);
      setError(error?.message || 'Failed to fetch participants');
      showToast('Failed to fetch participants', 'error');
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  const handleApproveFee = async (userId: number, feeType: 'registration' | 'insurance') => {
    try {
      await adminService.approveChallengeFee(userId, feeType);
      showToast(`${feeType === 'registration' ? 'Registration' : 'Insurance'} fee approved successfully`, 'success');
      fetchParticipants();
      setShowApproveModal(false);
    } catch (error) {
      showToast(`Failed to approve ${feeType} fee`, 'error');
    }
  };

  const handleUpdateStatus = async (userId: number, status: string, prize?: number) => {
    try {
      await adminService.updateChallengeStatus(userId, status as 'pending' | 'active' | 'completed' | 'failed', prize);
      showToast(`Challenge status updated to ${status}`, 'success');
      fetchParticipants();
      setShowDetailsModal(false);
    } catch (error) {
      showToast('Failed to update challenge status', 'error');
    }
  };

  const handleClaimReward = async (userId: number) => {
    if (confirm('Are you sure you want to mark this reward as claimed?')) {
      try {
        await adminService.updateChallengeStatus(userId, 'completed', undefined);
        showToast('Reward claimed successfully', 'success');
        fetchParticipants();
      } catch (error) {
        showToast('Failed to claim reward', 'error');
      }
    }
  };

  const filteredParticipants = participants.filter((participant) => {
    const matchesSearch = 
      participant.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.contact_number?.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || participant.challenge_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
          <TrendingUp className="h-3 w-3" />
          Active
        </span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
          <Clock className="h-3 w-3" />
          Pending
        </span>;
      case 'completed':
        return <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
          <CheckCircle className="h-3 w-3" />
          Completed
        </span>;
      case 'failed':
        return <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
          <XCircle className="h-3 w-3" />
          Failed
        </span>;
      default:
        return null;
    }
  };

  const getFeeStatusBadge = (paid: boolean) => {
    return paid ? (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
        <CheckCircle className="h-3 w-3" />
        Paid
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
        <XCircle className="h-3 w-3" />
        Unpaid
      </span>
    );
  };

  const stats = {
    total: participants.length,
    pending: participants.filter(p => p.challenge_status === 'pending').length,
    active: participants.filter(p => p.challenge_status === 'active').length,
    completed: participants.filter(p => p.challenge_status === 'completed').length,
    totalPrize: participants.reduce((sum, p) => sum + (p.total_prize || 0), 0),
    registrationFeesCollected: participants.filter(p => p.registration_fee_paid).length * 110,
    insuranceFeesCollected: participants.filter(p => p.insurance_fee_paid).length * 110,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading challenge participants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Failed to load participants</p>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <Button onClick={fetchParticipants} variant="primary" className="bg-orange-500 hover:bg-orange-600">
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
          <h1 className="text-2xl font-bold">Challenge Management</h1>
          <p className="mt-1 text-gray-600">
            Manage challenge participants, approve fees, and track progress
          </p>
        </div>
        <Button variant="outline" onClick={fetchParticipants}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Participants</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Challenges</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Prize Pool</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.totalPrize)}</p>
            </div>
            <Award className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Fees Collected</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.registrationFeesCollected + stats.insuranceFeesCollected)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <div className="w-64">
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Participants Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Participant</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Fees</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Prize</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredParticipants.length > 0 ? (
                filteredParticipants.map((participant) => (
                  <tr key={participant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                          <span className="text-sm font-medium text-orange-600">
                            {participant.full_name?.charAt(0).toUpperCase() || 'P'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{participant.full_name || 'N/A'}</p>
                          <p className="text-sm text-gray-500">{participant.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {participant.contact_number && (
                          <p className="text-sm flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {participant.contact_number}
                          </p>
                        )}
                        {participant.location && (
                          <p className="text-sm flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {participant.location}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Registration:</span>
                          {getFeeStatusBadge(participant.registration_fee_paid)}
                          {!participant.registration_fee_paid && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedUserId(participant.user.id);
                                setApproveType('registration');
                                setShowApproveModal(true);
                              }}
                              className="text-xs"
                            >
                              Approve
                            </Button>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Insurance:</span>
                          {getFeeStatusBadge(participant.insurance_fee_paid)}
                          {!participant.insurance_fee_paid && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedUserId(participant.user.id);
                                setApproveType('insurance');
                                setShowApproveModal(true);
                              }}
                              className="text-xs"
                            >
                              Approve
                            </Button>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(participant.challenge_status)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-600">
                      {formatCurrency(participant.total_prize || 0)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {participant.challenge_start_date ? formatDate(participant.challenge_start_date) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedParticipant(participant);
                          setShowDetailsModal(true);
                        }}
                        className="rounded-lg p-1 hover:bg-gray-100 transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    {searchTerm || statusFilter !== 'all' ? 'No matching participants found' : 'No challenge participants yet'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Participant Details Modal */}
      <Dialog open={showDetailsModal} onClose={() => setShowDetailsModal(false)}>
        {selectedParticipant && (
          <div className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Challenge Participant Details</h2>
              <p className="text-gray-600">Complete information about the participant</p>
            </div>

            <div className="space-y-6">
              {/* Personal Information */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-500" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Full Name</label>
                    <p className="font-medium">{selectedParticipant.full_name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p>{selectedParticipant.user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Username</label>
                    <p>{selectedParticipant.user?.username}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Phone</label>
                    <p>{selectedParticipant.contact_number || selectedParticipant.user?.phone_number || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Gender</label>
                    <p className="capitalize">{selectedParticipant.gender || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Age</label>
                    <p>{selectedParticipant.age || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Marital Status</label>
                    <p className="capitalize">{selectedParticipant.marital_status || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Monthly Income</label>
                    <p>{formatCurrency(selectedParticipant.monthly_income || 0)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Location</label>
                    <p>{selectedParticipant.location || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Challenge Information */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Challenge Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Challenge Status</label>
                    <div className="mt-1">{getStatusBadge(selectedParticipant.challenge_status)}</div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Total Prize</label>
                    <p className="font-semibold text-green-600">{formatCurrency(selectedParticipant.total_prize || 0)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Start Date</label>
                    <p>{selectedParticipant.challenge_start_date ? formatDateTime(selectedParticipant.challenge_start_date) : 'Not started'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">End Date</label>
                    <p>{selectedParticipant.challenge_end_date ? formatDateTime(selectedParticipant.challenge_end_date) : 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Completed Date</label>
                    <p>{selectedParticipant.challenge_completed_date ? formatDateTime(selectedParticipant.challenge_completed_date) : 'Not completed'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Reward Claimed</label>
                    <p>{selectedParticipant.challenge_reward_claimed ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>

              {/* Medical & Housing Information */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  Medical & Housing Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Hearing Status</label>
                    <p className="capitalize">{selectedParticipant.hearing_status?.replace(/_/g, ' ') || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Housing Situation</label>
                    <p className="capitalize">{selectedParticipant.housing_situation?.replace(/_/g, ' ') || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Preferred Payment Method</label>
                    <p className="capitalize">{selectedParticipant.preferred_payment_method?.replace(/_/g, ' ') || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Admin Notes */}
              {selectedParticipant.admin_notes && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gray-500" />
                    Admin Notes
                  </h3>
                  <p className="text-gray-600">{selectedParticipant.admin_notes}</p>
                </div>
              )}

              {/* Signatures */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">Signatures</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Participant Signature</label>
                    <p className="font-mono text-sm">{selectedParticipant.participant_signature || 'Not signed'}</p>
                    {selectedParticipant.participant_signature_date && (
                      <p className="text-xs text-gray-500 mt-1">{formatDateTime(selectedParticipant.participant_signature_date)}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">CEO Signature</label>
                    <p className="font-mono text-sm">{selectedParticipant.ceo_signature || 'Not signed'}</p>
                    {selectedParticipant.ceo_signature_date && (
                      <p className="text-xs text-gray-500 mt-1">{formatDateTime(selectedParticipant.ceo_signature_date)}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                Close
              </Button>
              
              {selectedParticipant.challenge_status === 'pending' && (
                <Button
                  onClick={() => {
                    const prize = prompt('Enter prize amount for this challenge:', '1000000');
                    if (prize) {
                      handleUpdateStatus(selectedParticipant.user.id, 'active', parseFloat(prize));
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Start Challenge
                </Button>
              )}
              
              {selectedParticipant.challenge_status === 'active' && (
                <Button
                  onClick={() => handleUpdateStatus(selectedParticipant.user.id, 'completed')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Award className="mr-2 h-4 w-4" />
                  Complete Challenge
                </Button>
              )}
              
              {selectedParticipant.challenge_status === 'completed' && !selectedParticipant.challenge_reward_claimed && (
                <Button
                  onClick={() => handleClaimReward(selectedParticipant.user.id)}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Claim Reward
                </Button>
              )}
            </div>
          </div>
        )}
      </Dialog>

      {/* Approve Fee Modal */}
      <Dialog open={showApproveModal} onClose={() => setShowApproveModal(false)}>
        <div className="max-w-md">
          <h2 className="text-xl font-bold mb-4">Approve Fee Payment</h2>
          <p className="text-gray-600 mb-4">
            Are you sure you want to approve the {approveType === 'registration' ? 'registration' : 'insurance'} fee?
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowApproveModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={() => selectedUserId && handleApproveFee(selectedUserId, approveType)}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Approve Payment
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}