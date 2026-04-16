// src/libs/services/admin.service.ts
import { apiService } from './api';
import { User, Investment, Task, Transaction, DashboardStats, ActivityLog } from '@/libs/types';

// Define specific types for admin responses
interface RecentActivity {
  id: number;
  user_email: string;
  action: string;
  details?: string;
  created_at: string;
}

interface ChallengeParticipantRaw {
  id: number;
  user?: Partial<User>;
  user_id?: number;
  email?: string;
  username?: string;
  phone_number?: string;
  full_name?: string;
  fullname?: string;
  gender?: string;
  age?: number;
  monthly_income?: number;
  marital_status?: string;
  contact_number?: string;
  hearing_status?: string;
  housing_situation?: string;
  preferred_payment_method?: string;
  location?: string;
  challenge_status?: 'pending' | 'active' | 'completed' | 'failed';
  registration_fee_paid?: boolean;
  insurance_fee_paid?: boolean;
  total_prize?: number;
  challenge_start_date?: string;
  challenge_end_date?: string;
  participant_signature?: string;
  participant_signature_date?: string;
  ceo_signature?: string;
  ceo_signature_date?: string;
  challenge_completed_date?: string;
  challenge_reward_claimed?: boolean;
  admin_notes?: string;
}

interface ChallengeParticipant {
  id: number;
  user: User;
  full_name: string;
  challenge_status: 'pending' | 'active' | 'completed' | 'failed';
  registration_fee_paid: boolean;
  insurance_fee_paid: boolean;
  total_prize: number;
  challenge_start_date?: string;
  challenge_end_date?: string;
  location?: string;
  contact_number?: string;
}

interface ApproveFeeResponse {
  message: string;
  status: string;
}

interface UpdateChallengeStatusResponse {
  message: string;
  challenge_status: string;
}

class AdminService {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await apiService.get<DashboardStats>('/admin/dashboard/');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return default stats if endpoint fails
      return {
        total_users: 0,
        active_users: 0,
        inactive_users: 0,
        subscribed_users: 0,
        active_investments: 0,
        total_volume: 0,
        completed_tasks: 0,
        pending_approvals: 0,
        challenge_participants: 0,
        recent_activities: [],
        active_subscriptions: 0,
        total_investments: 0,
        total_tasks_completed: 0,
        pending_transactions: 0,
        recent_users: []
      };
    }
  }

  // User Management

async getAllUsers(): Promise<User[]> {
  try {
    const response = await apiService.get('/admin/users/');
    console.log('API Response for users:', response);
    console.log('Response data:', response.data);
    console.log('Is array?', Array.isArray(response.data));
    
    // Handle different response formats
    let usersData = response.data;
    
    // If the response has a results property (paginated response)
    if (usersData && usersData.results && Array.isArray(usersData.results)) {
      usersData = usersData.results;
    }
    
    // If the response is an object with users array
    if (usersData && usersData.users && Array.isArray(usersData.users)) {
      usersData = usersData.users;
    }
    
    return Array.isArray(usersData) ? usersData : [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

  async getUserDetail(id: number): Promise<User> {
    const response = await apiService.get<User>(`/admin/users/${id}/`);
    return response.data;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const response = await apiService.patch<User>(`/admin/users/${id}/`, data);
    return response.data;
  }

  async deleteUser(id: number): Promise<void> {
    await apiService.delete(`/admin/users/${id}/delete_user/`);
  }

  async toggleUserSubscription(id: number): Promise<{ status: string; is_subscribed: boolean }> {
    const response = await apiService.post<{ status: string; is_subscribed: boolean }>(
      `/admin/users/${id}/toggle_subscription/`
    );
    return response.data;
  }

  async updateUserRole(id: number, role: string): Promise<{ status: string; role: string }> {
    const response = await apiService.post<{ status: string; role: string }>(
      `/admin/users/${id}/update_role/`, 
      { role }
    );
    return response.data;
  }

  // Investment Management
    async getAllInvestments(): Promise<Investment[]> {
    try {
      const response = await apiService.get<Investment[]>('/admin/investments/');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching investments:', error);
      return [];
    }
}

  async approveInvestment(id: number): Promise<{ status: string }> {
    const response = await apiService.post<{ status: string }>(
      `/admin/investments/${id}/approve_investment/`
    );
    return response.data;
  }

// src/libs/services/admin.service.ts - Update task methods

// Task Management
async getAllTasks(): Promise<Task[]> {
  try {
    console.log('Fetching tasks from API...');
    const response = await apiService.get('/admin/tasks/');
    
    let tasksData = response.data;
    
    // Handle Django REST Framework paginated response
    if (tasksData && typeof tasksData === 'object') {
      if (tasksData.results && Array.isArray(tasksData.results)) {
        tasksData = tasksData.results;
      } else if (Array.isArray(tasksData)) {
        tasksData = tasksData;
      } else if (tasksData.tasks && Array.isArray(tasksData.tasks)) {
        tasksData = tasksData.tasks;
      } else {
        tasksData = [];
      }
    }
    
    return Array.isArray(tasksData) ? tasksData : [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}

async createTask(data: Partial<Task>): Promise<Task> {
  // Transform frontend data to backend format
  const payload = {
    title: data.title,
    description: data.description,
    bronze_price: data.bronze_price || '0',
    silver_price: data.silver_price || '0',
    gold_price: data.gold_price || '0',
    bronze_reward: data.bronze_reward || '0',
    silver_reward: data.silver_reward || '0',
    gold_reward: data.gold_reward || '0',
    requires_subscription: data.requires_subscription || false,
    is_active: data.is_active !== undefined ? data.is_active : true,
  };
  
  const response = await apiService.post('/admin/tasks/create_task/', payload);
  return response.data;
}

async updateTask(id: number, data: Partial<Task>): Promise<Task> {
  const payload = {
    title: data.title,
    description: data.description,
    bronze_price: data.bronze_price,
    silver_price: data.silver_price,
    gold_price: data.gold_price,
    bronze_reward: data.bronze_reward,
    silver_reward: data.silver_reward,
    gold_reward: data.gold_reward,
    requires_subscription: data.requires_subscription,
    is_active: data.is_active,
  };
  
  const response = await apiService.patch(`/admin/tasks/${id}/`, payload);
  return response.data;
}

async deleteTask(id: number): Promise<void> {
  await apiService.delete(`/admin/tasks/${id}/`);
}
  async assignTaskToUser(taskId: number, userId: number): Promise<{ status: string; created: boolean }> {
    const response = await apiService.post<{ status: string; created: boolean }>(
      `/admin/tasks/${taskId}/assign_task_to_user/`, 
      { user_id: userId }
    );
    return response.data;
  }

  // Transaction Management
  async getAllTransactions(): Promise<Transaction[]> {
    try {
      const response = await apiService.get<Transaction[]>('/admin/transactions/');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

  async approveTransaction(id: number, notes?: string): Promise<{ status: string }> {
    const response = await apiService.post<{ status: string }>(
      `/admin/transactions/${id}/approve_transaction/`, 
      { notes }
    );
    return response.data;
  }

  // Activity Management - Comment out if endpoint doesn't exist
  async getRecentActivities(): Promise<RecentActivity[]> {
    try {
      // Try to fetch from existing endpoint
      const response = await apiService.get<RecentActivity[]>('/admin/activities/recent/');
      return response.data;
    } catch (error) {
      console.warn('Recent activities endpoint not available, using fallback');
      // Return empty array as fallback
      return [];
    }
  }

  // Challenge Management
  // Add to src/libs/services/admin.service.ts

// Challenge Management
// src/libs/services/admin.service.ts - Update getChallengeParticipants method

async getChallengeParticipants(): Promise<ChallengeParticipant[]> {
  try {
    const response = await apiService.get('/admin/challenges/');
    let participantsData = response.data;
    
    if (participantsData && typeof participantsData === 'object') {
      if (participantsData.results && Array.isArray(participantsData.results)) {
        participantsData = participantsData.results;
      } else if (Array.isArray(participantsData)) {
        participantsData = participantsData;
      } else {
        participantsData = [];
      }
    }
    
    // Transform the data to ensure all required fields exist
    const transformedData = Array.isArray(participantsData) ? participantsData.map((p: ChallengeParticipantRaw) => ({
      id: p.id,
      user: {
        id: p.user?.id || p.user_id || 0,
        email: p.user?.email || p.email || '',
        username: p.user?.username || p.username || '',
        phone_number: p.user?.phone_number || p.phone_number || '',
        role: p.user?.role || 'user',
        is_active: p.user?.is_active ?? true,
        is_subscribed: p.user?.is_subscribed ?? false,
        created_at: p.user?.created_at || new Date().toISOString(),
      },
      full_name: p.full_name || p.fullname || '',
      gender: p.gender,
      age: p.age,
      monthly_income: p.monthly_income,
      marital_status: p.marital_status,
      contact_number: p.contact_number,
      hearing_status: p.hearing_status,
      housing_situation: p.housing_situation,
      preferred_payment_method: p.preferred_payment_method,
      location: p.location,
      challenge_status: p.challenge_status || 'pending',
      registration_fee_paid: p.registration_fee_paid || false,
      insurance_fee_paid: p.insurance_fee_paid || false,
      total_prize: p.total_prize || 0,
      challenge_start_date: p.challenge_start_date,
      challenge_end_date: p.challenge_end_date,
      participant_signature: p.participant_signature,
      participant_signature_date: p.participant_signature_date,
      ceo_signature: p.ceo_signature,
      ceo_signature_date: p.ceo_signature_date,
      challenge_completed_date: p.challenge_completed_date,
      challenge_reward_claimed: p.challenge_reward_claimed || false,
      admin_notes: p.admin_notes,
    })) : [];
    
    return transformedData;
  } catch (error) {
    console.error('Error fetching challenge participants:', error);
    return [];
  }
}

async getChallengeParticipantDetail(userId: number): Promise<ChallengeParticipant> {
  const response = await apiService.get(`/admin/challenges/${userId}/`);
  return response.data;
}

async approveChallengeFee(userId: number, feeType: 'registration' | 'insurance'): Promise<{ message: string; status: string }> {
  const response = await apiService.post(`/admin/challenges/${userId}/approve_fee/`, { fee_type: feeType });
  return response.data;
}

async updateChallengeStatus(
  userId: number, 
  status: 'pending' | 'active' | 'completed' | 'failed', 
  prize?: number
): Promise<{ message: string; challenge_status: string }> {
  const response = await apiService.put(`/admin/challenges/${userId}/`, { 
    challenge_status: status, 
    total_prize: prize 
  });
  return response.data;
}
  // Analytics - Comment out if endpoints don't exist
  async getPlatformAnalytics(startDate?: string, endDate?: string): Promise<{
    userGrowth: Array<{ date: string; count: number }>;
    investmentVolume: Array<{ date: string; amount: number }>;
    taskCompletion: Array<{ date: string; count: number }>;
    revenue: Array<{ date: string; amount: number }>;
  }> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      const response = await apiService.get(`/admin/analytics/?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.warn('Analytics endpoint not available');
      return {
        userGrowth: [],
        investmentVolume: [],
        taskCompletion: [],
        revenue: []
      };
    }
  }

  // Notifications
  async sendNotificationToUser(userId: number, title: string, message: string): Promise<{ status: string }> {
    const response = await apiService.post<{ status: string }>('/admin/notifications/send/', {
      user_id: userId,
      title,
      message
    });
    return response.data;
  }

  async sendBulkNotification(userIds: number[], title: string, message: string): Promise<{ status: string; sent_count: number }> {
    const response = await apiService.post<{ status: string; sent_count: number }>('/admin/notifications/bulk/', {
      user_ids: userIds,
      title,
      message
    });
    return response.data;
  }

  // Settings
  async getSystemSettings(): Promise<Record<string, string>> {
    try {
      const response = await apiService.get<Record<string, string>>('/admin/settings/');
      return response.data;
    } catch (error) {
      console.warn('Settings endpoint not available');
      return {};
    }
  }

  async updateSystemSetting(key: string, value: string): Promise<{ status: string }> {
    const response = await apiService.post<{ status: string }>('/admin/settings/update/', {
      key,
      value
    });
    return response.data;
  }
}

export const adminService = new AdminService();