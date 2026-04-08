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

  const password = watch('password');

  // Calculate password strength
  const getPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (pass.match(/[A-Z]/)) strength++;
    if (pass.match(/[a-z]/)) strength++;
    if (pass.match(/[0-9]/)) strength++;
    if (pass.match(/[^A-Za-z0-9]/)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password || '');

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    if (passwordStrength <= 4) return 'bg-green-500';
    return 'bg-green-600';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    if (passwordStrength <= 4) return 'Strong';
    return 'Very Strong';
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerMutation.mutateAsync(data);
      showToast(
        'Registration successful! Please login with your credentials.',
        'success'
      );
      
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.response?.data?.email) {
        showToast('Email already exists. Please use a different email.', 'error');
      } else if (error.response?.data?.username) {
        showToast('Username already taken. Please choose another.', 'error');
      } else if (error.response?.status === 400) {
        showToast('Please check all fields and try again.', 'error');
      } else {
        showToast('Registration failed. Please try again later.', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <UserPlus className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">
            Join AD Investment Platform today
          </p>
        </div>

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
            placeholder="+1234567890"
            icon={<Phone className="h-5 w-5 text-gray-400" />}
            error={errors.phone_number?.message}
            {...register('phone_number')}
          />

          {/* Password Field */}
          <div className="space-y-2">
            <div className="relative">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  className={`
                    w-full rounded-lg border border-gray-300 px-4 py-2 pl-10
                    focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                  `}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
            
            {password && password.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Password strength:</span>
                  <span className={`font-semibold ${
                    passwordStrength <= 2 ? 'text-red-600' :
                    passwordStrength <= 3 ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {getPasswordStrengthText()}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  />
                </div>
                <ul className="space-y-1 text-xs">
                  <li className="flex items-center gap-2">
                    {password.length >= 8 ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3 text-gray-400" />
                    )}
                    <span className={password.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                      At least 8 characters
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    {/[A-Z]/.test(password) ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3 text-gray-400" />
                    )}
                    <span className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-500'}>
                      One uppercase letter
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    {/[a-z]/.test(password) ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3 text-gray-400" />
                    )}
                    <span className={/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-500'}>
                      One lowercase letter
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    {/[0-9]/.test(password) ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3 text-gray-400" />
                    )}
                    <span className={/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-500'}>
                      One number
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    {/[^A-Za-z0-9]/.test(password) ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3 text-gray-400" />
                    )}
                    <span className={/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : 'text-gray-500'}>
                      One special character
                    </span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                className={`
                  w-full rounded-lg border border-gray-300 px-4 py-2 pl-10
                  focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${errors.confirm_password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                `}
                {...register('confirm_password')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirm_password && (
              <p className="mt-1 text-sm text-red-600">{errors.confirm_password.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="terms"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              required
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the{' '}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isSubmitting || registerMutation.isPending}
          >
            Create Account
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Already have an account?
              </span>
            </div>
          </div>

          <Link href="/login">
            <Button
              type="button"
              variant="outline"
              size="lg"
              fullWidth
            >
              Sign In Instead
            </Button>
          </Link>
        </form>
      </Card>
    </div>
  );
}