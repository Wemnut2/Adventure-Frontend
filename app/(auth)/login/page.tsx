// src/app/(auth)/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { AxiosError } from 'axios';
import { Button } from '@/layout/components/Button';
import { Input } from '@/layout/components/Input';
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

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin' || user.role === 'super_admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) await loadUser();
    };
    checkAuth();
  }, [loadUser]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
      showToast('Welcome back!', 'success');
    } catch (error) {
      const axiosError = error as AxiosError<{ detail: string }>;
      if (axiosError.response?.status === 401) {
        showToast('Invalid email or password.', 'error');
      } else if (axiosError.response?.data?.detail) {
        showToast(axiosError.response.data.detail, 'error');
      } else {
        showToast('Something went wrong. Please try again.', 'error');
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #f5f5f5 0%, #ebebeb 100%)',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Google Font import via style tag */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');

        .login-card {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid rgba(0,0,0,0.06);
          box-shadow:
            0 1px 2px rgba(0,0,0,0.04),
            0 8px 32px rgba(0,0,0,0.07);
        }

        .gradient-btn {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: #ffffff;
          border: none;
          border-radius: 10px;
          padding: 11px 20px;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.02em;
          width: 100%;
          cursor: pointer;
          transition: opacity 0.18s ease, transform 0.18s ease;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .gradient-btn:hover:not(:disabled) {
          opacity: 0.88;
          transform: translateY(-1px);
        }

        .gradient-btn:active {
          transform: translateY(0);
        }

        .gradient-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .outline-btn {
          background: transparent;
          color: #1a1a1a;
          border: 1px solid rgba(0,0,0,0.14);
          border-radius: 10px;
          padding: 11px 20px;
          font-size: 13px;
          font-weight: 500;
          width: 100%;
          cursor: pointer;
          transition: background 0.18s ease, border-color 0.18s ease;
          font-family: 'DM Sans', sans-serif;
          text-align: center;
          display: block;
          letter-spacing: 0.02em;
        }

        .outline-btn:hover {
          background: rgba(0,0,0,0.03);
          border-color: rgba(0,0,0,0.24);
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .field-label {
          font-size: 11.5px;
          font-weight: 500;
          color: #6b6b6b;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }

        .field-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .field-icon {
          position: absolute;
          left: 12px;
          color: #b0b0b0;
          pointer-events: none;
          display: flex;
          align-items: center;
        }

        .field-input {
          width: 100%;
          padding: 10px 12px 10px 38px;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          color: #1a1a1a;
          background: #fafafa;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 10px;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          box-sizing: border-box;
        }

        .field-input::placeholder {
          color: #c0c0c0;
          font-size: 13px;
        }

        .field-input:focus {
          border-color: rgba(0,0,0,0.3);
          box-shadow: 0 0 0 3px rgba(0,0,0,0.05);
          background: #fff;
        }

        .field-input.has-error {
          border-color: #e05252;
        }

        .field-error {
          font-size: 11px;
          color: #e05252;
          margin-top: 2px;
        }

        .eye-btn {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          cursor: pointer;
          color: #b0b0b0;
          display: flex;
          align-items: center;
          padding: 0;
          transition: color 0.15s ease;
        }

        .eye-btn:hover { color: #555; }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 4px 0;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(0,0,0,0.08);
        }

        .divider-text {
          font-size: 11.5px;
          color: #b0b0b0;
          white-space: nowrap;
        }

        .wordmark {
          font-family: 'DM Serif Display', serif;
          font-size: 22px;
          color: #1a1a1a;
          letter-spacing: -0.01em;
        }

        .wordmark span {
          color: #888;
        }
      `}</style>

      <div className="login-card" style={{ width: '100%', maxWidth: '400px', padding: '40px 36px' }}>

        {/* Brand */}
        <div style={{ marginBottom: '32px' }}>
          <p className="wordmark">Adventure<span>.</span></p>
          <p style={{ fontSize: '13px', color: '#888', marginTop: '6px', fontWeight: 400 }}>
            Sign in to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Email */}
          <div className="field-group">
            <label className="field-label">Email</label>
            <div className="field-wrapper">
              <span className="field-icon">
                <Mail size={15} />
              </span>
              <input
                className={`field-input${errors.email ? ' has-error' : ''}`}
                type="email"
                placeholder="you@example.com"
                {...register('email')}
              />
            </div>
            {errors.email && <p className="field-error">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="field-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="field-label">Password</label>
              <Link
                href="/forgot-password"
                style={{ fontSize: '11.5px', color: '#888', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseOver={e => (e.currentTarget.style.color = '#1a1a1a')}
                onMouseOut={e => (e.currentTarget.style.color = '#888')}
              >
                Forgot password?
              </Link>
            </div>
            <div className="field-wrapper">
              <span className="field-icon">
                <Lock size={15} />
              </span>
              <input
                className={`field-input${errors.password ? ' has-error' : ''}`}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                style={{ paddingRight: '38px' }}
                {...register('password')}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <p className="field-error">{errors.password.message}</p>}
          </div>

          {/* Remember me */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              style={{ accentColor: '#1a1a1a', width: '13px', height: '13px', cursor: 'pointer' }}
              onChange={(e) => {
                if (e.target.checked) {
                  localStorage.setItem('remember_me', 'true');
                } else {
                  localStorage.removeItem('remember_me');
                }
              }}
            />
            <span style={{ fontSize: '12px', color: '#888' }}>Remember me</span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="gradient-btn"
            disabled={isSubmitting || loginMutation.isPending}
            style={{ marginTop: '4px' }}
          >
            {isSubmitting || loginMutation.isPending ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 0.8s linear infinite' }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Signing in…
              </>
            ) : (
              'Sign In'
            )}
          </button>

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

          {/* Divider */}
          <div className="divider">
            <div className="divider-line" />
            <span className="divider-text">No account yet?</span>
            <div className="divider-line" />
          </div>

          {/* Register */}
          <Link href="/register" style={{ textDecoration: 'none' }}>
            <span className="outline-btn">Create an account</span>
          </Link>

        </form>

        {/* Footer */}
        <p style={{ marginTop: '28px', fontSize: '11px', color: '#bbb', textAlign: 'center', lineHeight: '1.6' }}>
          By continuing, you agree to our{' '}
          <Link href="/terms" style={{ color: '#888', textDecoration: 'none' }}>Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" style={{ color: '#888', textDecoration: 'none' }}>Privacy Policy</Link>
        </p>

      </div>
    </div>
  );
}