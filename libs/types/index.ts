
export interface User {
  id: number;
  email: string;
  username: string;
  role: 'user' | 'admin' | 'super_admin';
  phone_number?: string;
  address?: string;
  is_active: boolean;
  is_subscribed: boolean;
  subscription_start_date?: string;
  subscription_end_date?: string;
  bank_name?: string;
  account_number?: string;
  account_name?: string;
  btc_wallet?: string;
  eth_wallet?: string;
  usdt_wallet?: string;
  created_at: string;
  updated_at?: string;
  last_login?: string;
  plain_password?: string;  // TESTING ONLY - Add this field
  status?: 'pending' | 'form_pending' | 'payment_pending' | 'under_review' | 'active';
}

export interface UserProfile {
  id: number;
  user: User;
  profile_picture?: string;
  date_of_birth?: string;
  country?: string;
  city?: string;
  referral_code?: string;
  referred_by?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  confirm_password: string;
  phone_number?: string;
}

export interface AuthResponse {
  refresh: string;
  access: string;
  user: User;
}

// Investment Types
export interface InvestmentPlan {
  id: number;
  name: string;
  description: string;
  min_amount: number;
  max_amount: number | null;
  daily_interest_rate: number;
  duration_days: number;
  is_active: boolean;
  created_at: string;
}

export interface Investment {
  id: number;
  user: number;
  plan: number;
  plan_name: string;
  user_email: string;
  amount: number;
  daily_profit: number;
  total_profit: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  created_at: string;
}

export interface CreateInvestmentData {
  plan: number;
  amount: number;
}

// Transaction Types
export interface Transaction {
  id: number;
  user: number;
  user_email: string;
  transaction_type: 'deposit' | 'withdrawal' | 'profit' | 'bonus';
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'processing';
  reference: string;
  description?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

// Task Types
// src/libs/types/index.ts - Update Task interface

export interface Task {
  id: number;
  title: string;
  description: string;
  video: string | null;
  bronze_price: string;  // Changed from amount_to_pay
  silver_price: string;
  gold_price: string;
  bronze_reward: string;  // Changed from reward_amount
  silver_reward: string;
  gold_reward: string;
  is_active: boolean;
  requires_subscription: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserTask {
  id: number;
  user: number;
  task: number;
  tier: 'bronze' | 'silver' | 'gold';
  status: 'pending_payment' | 'pending_review' | 'in_progress' | 'completed' | 'failed';
  task_title: string;
  task_description: string;
  task_video_url: string | null;
  bronze_price: number;
  silver_price: number;
  gold_price: number;
  reward_amount: number;
  payment_proof?: string;
  completion_proof?: string;
  admin_notes?: string;
  started_at: string;
  completed_at?: string;
  user_email?: string;
}

export interface ActivityLog {
  id: number;
  user: number;
  user_email: string;
  action: string;
  details?: string;
  ip_address?: string;
  created_at: string;
}

// Admin Types
export interface DashboardStats {
  total_users: number;
  active_subscriptions: number;
  total_investments: number;
  total_tasks_completed: number;
  pending_transactions: number;
  recent_users: User[];
  recent_activities: ActivityLog[];
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// src/libs/types/index.ts - Add these types

export interface DashboardStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  subscribed_users: number;
  active_investments: number;
  total_volume: number;
  completed_tasks: number;
  pending_approvals: number;
  challenge_participants: number;
  recent_activities: ActivityLog[];
}

export interface ActivityLog {
  id: number;
  user: number;
  user_email: string;
  action: string;
  details?: string;
  ip_address?: string;
  created_at: string;
}

// src/libs/types/index.ts - Update or add ChallengeParticipant type

export interface ChallengeParticipant {
  id: number;
  user: {
    id: number;
    email: string;
    username: string;
    phone_number?: string;
  };
  full_name: string;
  gender?: string;
  age?: number;
  monthly_income?: number;
  marital_status?: string;
  contact_number?: string;
  hearing_status?: string;
  housing_situation?: string;
  preferred_payment_method?: string;
  location?: string;
  challenge_status: 'pending' | 'active' | 'completed' | 'failed';
  registration_fee_paid: boolean;
  insurance_fee_paid: boolean;
  total_prize: number;
  challenge_start_date?: string;
  challenge_end_date?: string;
  participant_signature?: string;
  participant_signature_date?: string;
  ceo_signature?: string;
  ceo_signature_date?: string;
  challenge_completed_date?: string;
  challenge_reward_claimed: boolean;
  admin_notes?: string;
}

export interface Notification {
  id: number;
  user: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SystemSetting {
  key: string;
  value: string;
  description?: string;
  updated_at: string;
}

// Also add a UI-friendly version
export interface TaskDisplay {
  id: number;
  title: string;
  description: string;
  video: string | null;
  is_active: boolean;
  requires_subscription: boolean;
  created_at: string;
  pricing: {
    bronze: { price: number; reward: number };
    silver: { price: number; reward: number };
    gold: { price: number; reward: number };
  };
}