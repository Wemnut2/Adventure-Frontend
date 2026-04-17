'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/libs/stores/auth.store';
import { apiService } from '@/libs/services/api';
import ApplicationSection from '@/layout/sections/home/ApplicationSection';
import { 
  openWhatsApp, openWhatsAppSecondary,
  openTelegram, openTelegramSecondary,
  whatsAppMessages 
} from '@/libs/utils/whatsapp';

function WaIcon({ className = "text-white" }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 ${className}`} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.33 4.94L2.05 22l5.32-1.4c1.46.8 3.11 1.22 4.81 1.22 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.91-9.91-9.91z"/>
    </svg>
  );
}

function TgIcon({ className = "text-white" }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 ${className}`} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.2c-.06-.06-.15-.04-.22-.02-.09.02-1.55.99-4.37 2.89-.41.28-.79.42-1.12.41-.37-.01-1.08-.21-1.61-.38-.65-.21-1.16-.32-1.12-.68.02-.19.28-.38.78-.58 3.04-1.32 5.07-2.19 6.09-2.62 2.9-1.21 3.5-1.42 3.89-1.42.09 0 .28.02.4.12.1.08.13.19.14.27-.01.06-.01.13-.02.2z"/>
    </svg>
  );
}

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
    </div>
  );
}

function PaymentPendingScreen({ userEmail, bothPaid }: { userEmail: string; bothPaid: boolean }) {
  const router = useRouter();
  const msg = whatsAppMessages.payment(userEmail);

  useEffect(() => {
    if (bothPaid) router.replace('/dashboard');
  }, [bothPaid, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Required</h2>
          <p className="text-gray-500 text-sm">
            Your form was received. Pay both fees via support to unlock your dashboard.
          </p>
        </div>

        <div className="bg-orange-50 rounded-xl p-4 mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Registration Fee</span>
            <span className="font-semibold text-gray-900">$500</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Insurance Fee</span>
            <span className="font-semibold text-gray-900">$500</span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-orange-200">
            <span className="text-gray-700 font-medium">Total</span>
            <span className="font-bold text-gray-900">$1000</span>
          </div>
        </div>

        <p className="text-sm font-medium text-gray-700 mb-3 text-center">Contact support to complete payment:</p>

        <div className="space-y-3">
          <button
            onClick={() => openWhatsApp(msg)}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors font-medium"
          >
            <WaIcon /> WhatsApp Support 1
          </button>
          <button
            onClick={() => openWhatsAppSecondary(msg)}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-green-100 hover:bg-green-200 text-green-800 rounded-xl transition-colors font-medium"
          >
            <WaIcon className="text-green-700" /> WhatsApp Support 2
          </button>
          <button
            onClick={() => openTelegram(msg)}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors font-medium"
          >
            <TgIcon /> Telegram Support 1
          </button>
          <button
            onClick={() => openTelegramSecondary(msg)}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-xl transition-colors font-medium"
          >
            <TgIcon className="text-blue-700" /> Telegram Support 2
          </button>
        </div>
      </div>
    </div>
  );
}

type GateState = 'loading' | 'no_form' | 'payment_pending' | 'paid';

export default function AccessGate({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const pathname = usePathname();
  const [gateState, setGateState] = useState<GateState>('loading');
  const [bothPaid, setBothPaid] = useState(false);

  // List of routes that are allowed after fees are paid
  const allowedRoutes = [
    '/dashboard', '/profile', '/investments', '/withdrawals',
    '/history', '/tasks', '/settings'
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (!user) return;

    const check = async () => {
      try {
        const res = await apiService.get('/auth/profile/');
        const profile = res.data;
        
        console.log('AccessGate - Profile data:', {
          full_name: profile.full_name,
          registration_fee_paid: profile.registration_fee_paid,
          insurance_fee_paid: profile.insurance_fee_paid,
          challenge_status: profile.challenge_status,
          current_path: pathname
        });

        const formFilled = !!profile.full_name;
        const regPaid: boolean = !!profile.registration_fee_paid;
        const insPaid: boolean = !!profile.insurance_fee_paid;
        const allPaid = regPaid && insPaid;

        console.log('AccessGate - Status:', { formFilled, regPaid, insPaid, allPaid });

        setBothPaid(allPaid);

        if (!formFilled) {
          console.log('AccessGate - No form filled, showing form');
          setGateState('no_form');
        } else if (!allPaid) {
          console.log('AccessGate - Payment pending');
          setGateState('payment_pending');
        } else {
          console.log('AccessGate - Both paid, ready for dashboard');
          setGateState('paid');
        }
      } catch (error) {
        console.error('AccessGate - Error checking profile:', error);
        setGateState('no_form');
      }
    };

    check();
  }, [isAuthenticated, user, router, pathname]);

  if (!isAuthenticated) return null;
  if (!user || gateState === 'loading') return <Spinner />;

  if (gateState === 'no_form') {
    return <ApplicationSection skipProfileCheck={true} />;
  }

  if (gateState === 'payment_pending') {
    return <PaymentPendingScreen userEmail={user.email} bothPaid={bothPaid} />;
  }

  if (gateState === 'paid') {
    // Check if the current route is allowed
    const isAllowedRoute = allowedRoutes.some(route => pathname?.startsWith(route));
    
    if (!isAllowedRoute) {
      // If trying to access a non-allowed route, redirect to dashboard
      console.log('AccessGate - Invalid route, redirecting to dashboard from:', pathname);
      router.replace('/dashboard');
      return <Spinner />;
    }
    
    // Allow access to all allowed routes (dashboard, profile, withdrawals, etc.)
    console.log('AccessGate - Allowing access to:', pathname);
    return <>{children}</>;
  }

  return null;
}