// src/app/(auth)/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { AxiosError } from 'axios';
import { Button } from '@/layout/components/Button';
import { Input } from '@/layout/components/Input';
import { Card } from '@/layout/components/Card';
import { useToast } from '@/libs/src/contexts/ToastContext';
import { useLogin } from '@/libs/hooks/useAuth';
import { useAuthStore } from '@/libs/stores/auth.store';
import { loginSchema, LoginFormData } from '@/libs/src/schemas/auth.schema';

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();
  const { user, isAuthenticated, loadUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Redirect based on role when authenticated
  useEffect(() => {
    const redirectBasedOnRole = async () => {
      if (isAuthenticated && user) {
        // Redirect based on user role
        if (user.role === 'admin' || user.role === 'super_admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }
    };

    redirectBasedOnRole();
  }, [isAuthenticated, user, router]);

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        await loadUser();
      }
    };
    checkAuth();
  }, [loadUser]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await loginMutation.mutateAsync(data);
      showToast('Login successful! Redirecting...', 'success');
      
      // The auth store will update user and isAuthenticated
      // The useEffect above will handle redirection based on role
    } catch (error) {
      const axiosError = error as AxiosError<{ detail: string }>;
      console.error('Login error:', axiosError);

      if (axiosError.response?.status === 401) {
        showToast('Invalid email or password. Please try again.', 'error');
      } else if (axiosError.response?.status === 400) {
        showToast('Please check your credentials and try again.', 'error');
      } else if (axiosError.response?.data?.detail) {
        showToast(axiosError.response.data.detail, 'error');
      } else {
        showToast('Login failed. Please try again later.', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <LogIn className="h-8 w-8 text-orange-500" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>

          <p className="text-gray-600">
            Sign in to The Adventure Challenge
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            icon={<Mail className="h-5 w-5 text-gray-400" />}
            error={errors.email?.message}
            {...register('email')}
          />

          {/* Password with toggle */}
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              icon={<Lock className="h-5 w-5 text-gray-400" />}
              error={errors.password?.message}
              {...register('password')}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-gray-500 hover:text-orange-500 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                onChange={(e) => {
                  if (e.target.checked) {
                    localStorage.setItem('remember_me', 'true');
                  } else {
                    localStorage.removeItem('remember_me');
                  }
                }}
              />
              Remember me
            </label>

            <Link
              href="/forgot-password"
              className="text-sm text-orange-500 hover:text-orange-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isSubmitting || loginMutation.isPending}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Sign In
          </Button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Don&apos;t have an account?
              </span>
            </div>
          </div>

          {/* Register */}
          <Link href="/register">
            <Button
              type="button"
              variant="outline"
              size="lg"
              fullWidth
              className="border-orange-500 text-orange-500 hover:bg-orange-50"
            >
              Create New Account
            </Button>
          </Link>
        </form>

        {/* Demo Credentials (Optional - remove in production) */}
        <div className="mt-6 p-4 bg-orange-50 rounded-lg">
          <p className="text-xs font-semibold text-orange-800 mb-2">Demo Credentials:</p>
          <div className="space-y-1 text-xs text-orange-700">
            <p>👤 User: user@example.com / password123</p>
            <p>👑 Admin: admin@example.com / admin123</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>By signing in, you agree to our</p>
          <p>
            <Link href="/terms" className="text-orange-500 hover:underline">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-orange-500 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>

      </Card>
    </div>
  );
}