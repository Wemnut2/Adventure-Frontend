// src/types/index.ts

// User Types
export interface User {
    id: number;
    email: string;
    username: string;
    role: 'user' | 'admin' | 'super_admin';
    phone_number?: string;
    address?: string;
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
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    reference: string;
    description?: string;
    admin_notes?: string;
    created_at: string;
    updated_at: string;
  }
  
  // Task Types
  export interface Task {
    id: number;
    title: string;
    description: string;
    amount_to_pay: number;
    reward_amount: number;
    is_active: boolean;
    requires_subscription: boolean;
    created_at: string;
  }
  
  export interface UserTask {
    id: number;
    user: number;
    task: number;
    task_title: string;
    task_description: string;
    task_reward: number;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    payment_proof?: string;
    completion_proof?: string;
    admin_notes?: string;
    started_at: string;
    completed_at?: string;
  }
  
// src/types/index.ts - Add ActivityLog type
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
    recent_activities: any[];
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

  export interface User {
  id: number;
  email: string;
  username: string;

  // ✅ ADD IT HERE (INSIDE THE INTERFACE)
  status: "form_pending" | "payment_pending" | "under_review" | "active";

  role: 'user' | 'admin' | 'super_admin';
  phone_number?: string;
  address?: string;
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
}