// src/app/(auth)/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Mail, Lock, User, Phone, Eye, EyeOff,
} from 'lucide-react';
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
    if (passwordStrength <= 2) return '#e05252';
    if (passwordStrength <= 3) return '#f97316';
    return '#10b981';
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
        'Registration successful! Please check your email to verify your account.',
        'success'
      );

      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (error: any) {
      console.error(error);

      if (error.response?.data?.email) {
        showToast('Email already exists', 'error');
      } else if (error.response?.data?.username) {
        showToast('Username already taken', 'error');
      } else {
        showToast('Registration failed. Please try again.', 'error');
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

        .register-card {
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
          text-decoration: none;
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

        .strength-bar {
          height: 4px;
          background: rgba(0,0,0,0.08);
          border-radius: 2px;
          overflow: hidden;
          margin-top: 4px;
        }

        .strength-fill {
          height: 100%;
          transition: width 0.3s ease, background-color 0.3s ease;
        }

        .checkbox-wrapper {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .checkbox-input {
          margin-top: 2px;
          width: 14px;
          height: 14px;
          cursor: pointer;
          accent-color: #1a1a1a;
        }

        .checkbox-label {
          font-size: 12px;
          color: #888;
          line-height: 1.5;
        }

        .checkbox-label a {
          color: #666;
          text-decoration: none;
          transition: color 0.15s;
        }

        .checkbox-label a:hover {
          color: #1a1a1a;
        }
      `}</style>

      <div className="register-card" style={{ width: '100%', maxWidth: '440px', padding: '40px 36px' }}>

        {/* Brand */}
        <div style={{ marginBottom: '32px' }}>
          <p className="wordmark">Adventure<span>.</span></p>
          <p style={{ fontSize: '13px', color: '#888', marginTop: '6px', fontWeight: 400 }}>
            Create your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Email */}
          <div className="field-group">
            <label className="field-label">Email Address</label>
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

          {/* Username */}
          <div className="field-group">
            <label className="field-label">Username</label>
            <div className="field-wrapper">
              <span className="field-icon">
                <User size={15} />
              </span>
              <input
                className={`field-input${errors.username ? ' has-error' : ''}`}
                type="text"
                placeholder="johndoe"
                {...register('username')}
              />
            </div>
            {errors.username && <p className="field-error">{errors.username.message}</p>}
          </div>

          {/* Phone Number */}
          <div className="field-group">
            <label className="field-label">Phone Number (Optional)</label>
            <div className="field-wrapper">
              <span className="field-icon">
                <Phone size={15} />
              </span>
              <input
                className={`field-input${errors.phone_number ? ' has-error' : ''}`}
                type="tel"
                placeholder="+1(546)..."
                {...register('phone_number')}
              />
            </div>
            {errors.phone_number && <p className="field-error">{errors.phone_number.message}</p>}
          </div>

          {/* Password */}
          <div className="field-group">
            <label className="field-label">Password</label>
            <div className="field-wrapper">
              <span className="field-icon">
                <Lock size={15} />
              </span>
              <input
                className={`field-input${errors.password ? ' has-error' : ''}`}
                type={showPassword ? 'text' : 'password'}
                placeholder="Create password"
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
            
            {/* Password Strength Indicator */}
            {password && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', color: '#b0b0b0' }}>Password strength</span>
                  <span style={{ 
                    fontSize: '11px', 
                    fontWeight: 500,
                    color: getStrengthColor() 
                  }}>
                    {getStrengthText()}
                  </span>
                </div>
                <div className="strength-bar">
                  <div 
                    className="strength-fill"
                    style={{ 
                      width: `${(passwordStrength / 5) * 100}%`,
                      backgroundColor: getStrengthColor()
                    }} 
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="field-group">
            <label className="field-label">Confirm Password</label>
            <div className="field-wrapper">
              <span className="field-icon">
                <Lock size={15} />
              </span>
              <input
                className={`field-input${errors.confirm_password ? ' has-error' : ''}`}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                style={{ paddingRight: '38px' }}
                {...register('confirm_password')}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.confirm_password && <p className="field-error">{errors.confirm_password.message}</p>}
          </div>

          {/* Terms and Conditions */}
          <div className="checkbox-wrapper">
            <input
              type="checkbox"
              className="checkbox-input"
              required
            />
            <span className="checkbox-label">
              I agree to the{' '}
              <Link href="/terms">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy">Privacy Policy</Link>
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="gradient-btn"
            disabled={isSubmitting || registerMutation.isPending}
            style={{ marginTop: '4px' }}
          >
            {isSubmitting || registerMutation.isPending ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 0.8s linear infinite' }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Creating account…
              </>
            ) : (
              'Create Account'
            )}
          </button>

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

          {/* Divider */}
          <div className="divider">
            <div className="divider-line" />
            <span className="divider-text">Already have an account?</span>
            <div className="divider-line" />
          </div>

          {/* Sign In Link */}
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <span className="outline-btn">Sign In</span>
          </Link>

        </form>

        {/* Footer */}
        <p style={{ marginTop: '28px', fontSize: '11px', color: '#bbb', textAlign: 'center', lineHeight: '1.6' }}>
          By creating an account, you agree to our{' '}
          <Link href="/terms" style={{ color: '#888', textDecoration: 'none' }}>Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" style={{ color: '#888', textDecoration: 'none' }}>Privacy Policy</Link>
        </p>

      </div>
    </div>
  );
}