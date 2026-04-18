'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/libs/stores/auth.store';
import { apiService } from '@/libs/services/api';
import ApplicationSection from '@/layout/sections/home/ApplicationSection';
import {
  openWhatsApp, openWhatsAppSecondary,
  openTelegram, openTelegramSecondary,
  whatsAppMessages,
} from '@/libs/utils/whatsapp';

/* ─── Shared styles ─────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');

  .gate-root * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }

  .gate-page {
    min-height: 100vh; background: #f5f5f5;
    display: flex; align-items: center; justify-content: center; padding: 20px;
  }

  .gate-card {
    background: #fff;
    border: 1px solid rgba(0,0,0,0.07);
    border-radius: 18px;
    padding: 36px 32px;
    max-width: 420px; width: 100%;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }

  .gate-icon-wrap {
    width: 50px; height: 50px; border-radius: 50%;
    background: #f5f5f5;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 18px; color: #888;
  }

  .gate-title {
    font-family: 'DM Serif Display', serif;
    font-size: 22px; color: #1a1a1a;
    letter-spacing: -0.02em; text-align: center;
    margin-bottom: 8px;
  }

  .gate-body {
    font-size: 12.5px; color: #aaa;
    text-align: center; line-height: 1.65;
    margin-bottom: 22px;
  }

  /* Summary strip */
  .summary-strip {
    background: #fafafa;
    border: 1px solid rgba(0,0,0,0.07);
    border-radius: 10px; padding: 14px 16px; margin-bottom: 20px;
  }
  .summary-title { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #aaa; margin-bottom: 10px; }
  .summary-row   { display: flex; justify-content: space-between; align-items: center; margin-bottom: 7px; }
  .summary-row:last-child { margin-bottom: 0; }
  .summary-label { font-size: 12px; color: #aaa; }
  .summary-value { font-size: 12px; font-weight: 500; color: #1a1a1a; }
  .summary-divider { height: 1px; background: rgba(0,0,0,0.06); margin: 8px 0; }

  /* Section label */
  .contact-label {
    font-size: 11px; color: #bbb; text-align: center;
    margin-bottom: 10px; letter-spacing: 0.03em;
  }

  /* Contact buttons */
  .contact-stack { display: flex; flex-direction: column; gap: 8px; }

  .contact-btn {
    width: 100%; display: flex; align-items: center; gap: 10px;
    padding: 11px 14px; background: #fafafa;
    border: 1px solid rgba(0,0,0,0.08); border-radius: 10px;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    font-size: 12.5px; font-weight: 500; color: #1a1a1a;
    transition: background 0.15s, border-color 0.15s;
    text-align: left;
  }
  .contact-btn:hover { background: #f0f0f0; border-color: rgba(0,0,0,0.16); }

  .contact-btn-icon {
    width: 30px; height: 30px; border-radius: 50%;
    background: #e5e5e5; color: #666;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .contact-btn-arrow { margin-left: auto; color: #ccc; font-size: 16px; line-height: 1; }

  /* Primary CTA */
  .primary-btn {
    width: 100%; padding: 12px;
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    color: #fff; border: none; border-radius: 10px;
    font-size: 13px; font-weight: 500; font-family: 'DM Sans', sans-serif;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    gap: 8px; margin-bottom: 8px;
    transition: opacity 0.18s, transform 0.18s;
  }
  .primary-btn:hover { opacity: 0.9; transform: translateY(-1px); }

  /* Spinner */
  @keyframes spin { to { transform: rotate(360deg); } }
  .gate-spinner {
    animation: spin 0.7s linear infinite;
    width: 30px; height: 30px;
  }
  .spinner-page {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: #f5f5f5;
  }
`;

/* ─── Icon components ───────────────────────────────────────────────────── */
function WaIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.33 4.94L2.05 22l5.32-1.4c1.46.8 3.11 1.22 4.81 1.22 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.91-9.91-9.91z"/>
    </svg>
  );
}

function TgIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.2c-.06-.06-.15-.04-.22-.02-.09.02-1.55.99-4.37 2.89-.41.28-.79.42-1.12.41-.37-.01-1.08-.21-1.61-.38-.65-.21-1.16-.32-1.12-.68.02-.19.28-.38.78-.58 3.04-1.32 5.07-2.19 6.09-2.62 2.9-1.21 3.5-1.42 3.89-1.42.09 0 .28.02.4.12.1.08.13.19.14.27-.01.06-.01.13-.02.2z"/>
    </svg>
  );
}

/* ─── Spinner ───────────────────────────────────────────────────────────── */
function Spinner() {
  return (
    <div className="spinner-page">
      <style>{STYLES}</style>
      <svg className="gate-spinner" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>
  );
}

/* ─── Payment Pending Screen ────────────────────────────────────────────── */
function PaymentPendingScreen({ userEmail, bothPaid }: { userEmail: string; bothPaid: boolean }) {
  const router = useRouter();
  const msg = whatsAppMessages.payment(userEmail);

  useEffect(() => {
    if (bothPaid) router.replace('/dashboard');
  }, [bothPaid, router]);

  const contacts = [
    { label: 'WhatsApp Support 1',  sub: 'Primary',   icon: <WaIcon />, action: () => openWhatsApp(msg) },
    { label: 'WhatsApp Support 2',  sub: 'Secondary', icon: <WaIcon />, action: () => openWhatsAppSecondary(msg) },
    { label: 'Telegram Support 1',  sub: 'Primary',   icon: <TgIcon />, action: () => openTelegram(msg) },
    { label: 'Telegram Support 2',  sub: 'Secondary', icon: <TgIcon />, action: () => openTelegramSecondary(msg) },
  ];

  return (
    <div className="gate-root gate-page">
      <style>{STYLES}</style>
      <div className="gate-card">

        {/* Icon */}
        <div className="gate-icon-wrap">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>

        <p className="gate-title">Payment Required</p>
        <p className="gate-body">
          Your application was received. Pay both fees through our support team to unlock your dashboard.
        </p>

        {/* Fee summary */}
        <div className="summary-strip">
          <p className="summary-title">Fee Breakdown</p>
          <div className="summary-row">
            <span className="summary-label">Registration Fee</span>
            <span className="summary-value">$500</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Insurance Fee</span>
            <span className="summary-value">$500</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-row">
            <span className="summary-label" style={{ fontWeight: 600, color: '#555' }}>Total</span>
            <span className="summary-value" style={{ fontWeight: 600 }}>$1,000</span>
          </div>
        </div>

        {/* Contact options */}
        <p className="contact-label">Reach out to complete your payment</p>
        <div className="contact-stack">
          {contacts.map((c, i) => (
            <button key={i} className="contact-btn" onClick={c.action}>
              <span className="contact-btn-icon">{c.icon}</span>
              <span>
                <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#1a1a1a' }}>{c.label}</span>
                <span style={{ display: 'block', fontSize: 11, color: '#bbb', marginTop: 1 }}>{c.sub}</span>
              </span>
              <span className="contact-btn-arrow">›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── AccessGate ────────────────────────────────────────────────────────── */
type GateState = 'loading' | 'no_form' | 'payment_pending' | 'paid';

const ALLOWED_ROUTES = [
  '/dashboard', '/profile', '/investments', '/withdrawals',
  '/history', '/tasks', '/settings',
];

export default function AccessGate({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const user            = useAuthStore(s => s.user);
  const router          = useRouter();
  const pathname        = usePathname();

  const [gateState, setGateState] = useState<GateState>('loading');
  const [bothPaid, setBothPaid]   = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/login'); return; }
    if (!user) return;

    const check = async () => {
      try {
        const { data: profile } = await apiService.get('/auth/profile/');
        const formFilled = !!profile.full_name;
        const allPaid    = !!profile.registration_fee_paid && !!profile.insurance_fee_paid;

        setBothPaid(allPaid);

        if (!formFilled)    setGateState('no_form');
        else if (!allPaid)  setGateState('payment_pending');
        else                setGateState('paid');
      } catch {
        setGateState('no_form');
      }
    };

    check();
  }, [isAuthenticated, user, router, pathname]);

  if (!isAuthenticated) return null;
  if (!user || gateState === 'loading') return <Spinner />;
  if (gateState === 'no_form')          return <ApplicationSection skipProfileCheck />;
  if (gateState === 'payment_pending')  return <PaymentPendingScreen userEmail={user.email} bothPaid={bothPaid} />;

  if (gateState === 'paid') {
    const isAllowed = ALLOWED_ROUTES.some(r => pathname?.startsWith(r));
    if (!isAllowed) { router.replace('/dashboard'); return <Spinner />; }
    return <>{children}</>;
  }

  return null;
}