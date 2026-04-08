// src/app/(auth)/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { Button } from '@/layout/components/Button';
import { Input } from '@/layout/components/Input';
import { Card } from '@/layout/components/Card';
import { useToast } from '@/libs/src/contexts/ToastContext';
import { useLogin } from '@/libs/hooks/useAuth';
import { loginSchema, LoginFormData } from '@/libs/src/schemas/auth.schema';

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();

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

  // Redirect if already authenticated
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
      showToast('Login successful! Redirecting...', 'success');
      
      // Small delay before redirect
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle different error scenarios
      if (error.response?.status === 401) {
        showToast('Invalid email or password. Please try again.', 'error');
      } else if (error.response?.status === 400) {
        showToast('Please check your credentials and try again.', 'error');
      } else {
        showToast('Login failed. Please try again later.', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <LogIn className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to your AD Investment account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            icon={<Mail className="h-5 w-5 text-gray-400" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            icon={<Lock className="h-5 w-5 text-gray-400" />}
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                onChange={(e) => {
                  if (e.target.checked) {
                    // Implement remember me functionality
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
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isSubmitting || loginMutation.isPending}
          >
            Sign In
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Don't have an account?
              </span>
            </div>
          </div>

          <Link href="/register">
            <Button
              type="button"
              variant="outline"
              size="lg"
              fullWidth
            >
              Create New Account
            </Button>
          </Link>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>By signing in, you agree to our</p>
          <p>
            <Link href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}