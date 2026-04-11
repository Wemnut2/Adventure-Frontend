// src/app/(auth)/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Mail, Lock, User, Phone, Eye, EyeOff, UserPlus,
  CheckCircle, XCircle
} from 'lucide-react';
import { Button } from '@/layout/components/Button';
import { Input } from '@/layout/components/Input';
import { Card } from '@/layout/components/Card';
import { useToast } from '@/libs/src/contexts/ToastContext';
import { useRegister } from '@/libs/hooks/useAuth';
import { registerSchema, RegisterFormData } from '@/libs/src/schemas/auth.schema';

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirm_password: '',
      phone_number: '',
    },
  });

  const password = watch('password') || '';

  // Password strength
  const getPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[a-z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    return 'Strong';
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerMutation.mutateAsync(data);

      showToast(
        'Registration successful! Please login.',
        'success'
      );

      setTimeout(() => {
        router.push('/login');
      }, 1500);

    } catch (error: any) {
      console.error(error);

      if (error.response?.data?.email) {
        showToast('Email already exists', 'error');
      } else if (error.response?.data?.username) {
        showToast('Username already taken', 'error');
      } else {
        showToast('Registration failed', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <UserPlus className="h-8 w-8 text-orange-500" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>

          <p className="text-gray-600">
            Join The Adventure Challenge
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            icon={<Mail className="h-5 w-5 text-gray-400" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Username"
            type="text"
            placeholder="johndoe"
            icon={<User className="h-5 w-5 text-gray-400" />}
            error={errors.username?.message}
            {...register('username')}
          />

          <Input
            label="Phone Number (Optional)"
            type="tel"
            placeholder="+234..."
            icon={<Phone className="h-5 w-5 text-gray-400" />}
            error={errors.phone_number?.message}
            {...register('phone_number')}
          />

          {/* PASSWORD */}
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create password"
              icon={<Lock className="h-5 w-5 text-gray-400" />}
              error={errors.password?.message}
              {...register('password')}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-gray-500 hover:text-orange-500"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* PASSWORD STRENGTH */}
          {password && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Password strength</span>
                <span className="font-semibold text-orange-500">
                  {getStrengthText()}
                </span>
              </div>

              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getStrengthColor()} transition-all`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* CONFIRM PASSWORD */}
          <div className="relative">
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              icon={<Lock className="h-5 w-5 text-gray-400" />}
              error={errors.confirm_password?.message}
              {...register('confirm_password')}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[38px] text-gray-500 hover:text-orange-500"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* TERMS */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              className="mt-1 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              required
            />

            <label className="text-sm text-gray-600">
              I agree to the{' '}
              <Link href="/terms" className="text-orange-500 hover:underline">
                Terms
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-orange-500 hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* SUBMIT */}
          <Button
            type="submit"
            fullWidth
            isLoading={isSubmitting || registerMutation.isPending}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Create Account
          </Button>

          {/* LOGIN LINK */}
          <div className="text-center text-sm text-gray-500">
            Already have an account?
          </div>

          <Link href="/login">
            <Button
              type="button"
              variant="outline"
              fullWidth
              className="border-orange-500 text-orange-500 hover:bg-orange-50"
            >
              Sign In
            </Button>
          </Link>

        </form>
      </Card>
    </div>
  );
}