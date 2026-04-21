'use client';

import { useEffect, useState } from 'react';
import { useDashboard } from './DashboardProvider';
import {
  openWhatsApp, openWhatsAppSecondary,
  openTelegram, openTelegramSecondary,
  whatsAppMessages,
} from '@/libs/utils/whatsapp';
import { Check, Eye, X, RefreshCw } from 'lucide-react';

/* ─── Constants ── */
const REGISTRATION_FEE = 500;
const INSURANCE_FEE    = 100;
const TOTAL_FEE        = REGISTRATION_FEE + INSURANCE_FEE;

/* ─── Styles ── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');

  .sr-root * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }

  /* Page shell */
  .sr-page {
    min-height: 100vh; background: #f5f5f5;
    display: flex; align-items: center; justify-content: center;
    padding: 24px 16px;
  }

  /* Main card */
  .sr-card {
    background: #fff; border: 1px solid rgba(0,0,0,0.07);
    border-radius: 18px; padding: 36px 30px;
    max-width: 440px; width: 100%;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }

  /* Icon pill — neutral, same as AccessGate/PaymentPendingScreen */
  .sr-icon-pill {
    width: 48px; height: 48px; border-radius: 50%;
    background: #f5f5f5; color: #888;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 18px;
  }

  .sr-title {
    font-family: 'DM Serif Display', serif;
    font-size: 22px; color: #1a1a1a; letter-spacing: -0.02em;
    text-align: center; margin-bottom: 8px;
  }
  .sr-body {
    font-size: 12.5px; color: #aaa; text-align: center;
    line-height: 1.65; margin-bottom: 22px;
  }

  /* Primary CTA */
  .sr-btn-primary {
    width: 100%; padding: 12px;
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    color: #fff; border: none; border-radius: 10px;
    font-size: 13px; font-weight: 500; font-family: 'DM Sans', sans-serif;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    gap: 8px; margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(249,115,22,0.18);
    transition: opacity .15s, transform .15s;
  }
  .sr-btn-primary:hover { opacity: .9; transform: translateY(-1px); }

  /* Features strip */
  .sr-features {
    background: #fafafa; border: 1px solid rgba(0,0,0,0.07);
    border-radius: 10px; padding: 14px 16px; margin-bottom: 20px;
  }
  .sr-feature-row {
    display: flex; align-items: center; gap: 10px;
    padding: 5px 0; font-size: 12.5px; color: #555;
  }
  .sr-feature-check {
    width: 17px; height: 17px; border-radius: 50%;
    background: #f97316; color: #fff; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }

  /* Contact section label */
  .sr-contact-label {
    font-size: 11px; color: #bbb; text-align: center;
    letter-spacing: 0.03em; margin-bottom: 10px;
  }

  /* Contact buttons — same as AccessGate */
  .sr-contact-stack { display: flex; flex-direction: column; gap: 8px; }
  .sr-contact-btn {
    width: 100%; display: flex; align-items: center; gap: 10px;
    padding: 11px 14px; background: #fafafa;
    border: 1px solid rgba(0,0,0,0.08); border-radius: 10px;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    font-size: 12.5px; font-weight: 500; color: #1a1a1a;
    transition: background .15s, border-color .15s; text-align: left;
  }
  .sr-contact-btn:hover { background: #f0f0f0; border-color: rgba(0,0,0,0.16); }
  .sr-contact-icon {
    width: 30px; height: 30px; border-radius: 50%;
    background: #e5e5e5; color: #666;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .sr-contact-arrow { margin-left: auto; color: #ccc; font-size: 16px; line-height: 1; }

  /* Auto-refresh hint */
  .sr-refresh-hint {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    margin-top: 18px; font-size: 11px; color: #ccc;
  }

  /* ── Fee Modal ── */
  .sr-modal-overlay {
    position: fixed; inset: 0; z-index: 100;
    background: rgba(0,0,0,0.42); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px; animation: srFadeIn .15s ease;
  }
  @keyframes srFadeIn { from { opacity:0 } to { opacity:1 } }

  .sr-modal-card {
    background: #fff; border-radius: 18px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.12);
    max-width: 380px; width: 100%;
    padding: 28px 24px; max-height: 90vh; overflow-y: auto;
    animation: srSlideUp .18s ease;
  }
  @keyframes srSlideUp { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }

  .sr-modal-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    margin-bottom: 18px;
  }
  .sr-modal-title {
    font-family: 'DM Serif Display', serif;
    font-size: 20px; color: #1a1a1a; letter-spacing: -0.01em; margin-bottom: 3px;
  }
  .sr-modal-sub { font-size: 12px; color: #aaa; }

  .sr-modal-close {
    width: 28px; height: 28px; border-radius: 7px;
    background: #f5f5f5; border: none; cursor: pointer; color: #aaa;
    display: flex; align-items: center; justify-content: center;
    transition: background .15s, color .15s; flex-shrink: 0;
  }
  .sr-modal-close:hover { background: #eee; color: #333; }

  /* Fee breakdown */
  .sr-fee-strip {
    background: #fafafa; border: 1px solid rgba(0,0,0,0.07);
    border-radius: 10px; padding: 16px; margin-bottom: 16px;
  }
  .sr-fee-row {
    display: flex; justify-content: space-between; align-items: center;
    font-size: 12.5px; margin-bottom: 8px;
  }
  .sr-fee-row:last-child { margin-bottom: 0; }
  .sr-fee-label { color: #888; }
  .sr-fee-value { font-weight: 500; color: #1a1a1a; }
  .sr-fee-divider { height: 1px; background: rgba(0,0,0,0.07); margin: 10px 0; }
  .sr-fee-total-label { font-weight: 600; color: #1a1a1a; }
  .sr-fee-total-value { font-size: 20px; font-weight: 700; color: #f97316; }

  /* Included features in modal */
  .sr-included {
    background: #fafafa; border: 1px solid rgba(0,0,0,0.07);
    border-radius: 10px; padding: 14px 16px; margin-bottom: 18px;
  }
  .sr-included-title {
    font-size: 11px; font-weight: 600; color: #bbb;
    text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 10px;
  }
  .sr-included-row {
    display: flex; align-items: center; gap: 8px;
    font-size: 12.5px; color: #555; margin-bottom: 7px;
  }
  .sr-included-row:last-child { margin-bottom: 0; }
  .sr-included-dot { width: 5px; height: 5px; border-radius: 50%; background: #f97316; flex-shrink: 0; }

  .sr-fee-note {
    font-size: 11px; color: #ccc; text-align: center;
    line-height: 1.55; margin-bottom: 16px;
  }

  .sr-modal-ghost {
    width: 100%; padding: 10px;
    background: transparent; border: 1px solid rgba(0,0,0,0.1);
    border-radius: 10px; color: #888;
    font-size: 12.5px; font-weight: 500; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: background .15s, color .15s;
  }
  .sr-modal-ghost:hover { background: #f5f5f5; color: #555; }
`;

/* ─── Icons ── */
function WaIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.33 4.94L2.05 22l5.32-1.4c1.46.8 3.11 1.22 4.81 1.22 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.91-9.91-9.91z"/>
    </svg>
  );
}
function TgIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.2c-.06-.06-.15-.04-.22-.02-.09.02-1.55.99-4.37 2.89-.41.28-.79.42-1.12.41-.37-.01-1.08-.21-1.61-.38-.65-.21-1.16-.32-1.12-.68.02-.19.28-.38.78-.58 3.04-1.32 5.07-2.19 6.09-2.62 2.9-1.21 3.5-1.42 3.89-1.42.09 0 .28.02.4.12.1.08.13.19.14.27-.01.06-.01.13-.02.2z"/>
    </svg>
  );
}

/* ─── Fee Modal ── */
function FeeModal({ onClose }: { onClose: () => void }) {
  const included = [
    'Full challenge access',
    'Insurance coverage',
    'Prize eligibility',
    'Priority support',
  ];

  return (
    <div className="sr-modal-overlay" onClick={onClose}>
      <div className="sr-modal-card" onClick={e => e.stopPropagation()}>

        <div className="sr-modal-header">
          <div>
            <p className="sr-modal-title">Participation Fee</p>
            <p className="sr-modal-sub">One-time payment to unlock access</p>
          </div>
          <button className="sr-modal-close" onClick={onClose}><X size={14} /></button>
        </div>

        {/* Fee breakdown */}
        <div className="sr-fee-strip">
          <div className="sr-fee-row">
            <span className="sr-fee-label">Registration Fee</span>
            <span className="sr-fee-value">${REGISTRATION_FEE}</span>
          </div>
          <div className="sr-fee-row">
            <span className="sr-fee-label">Insurance Fee</span>
            <span className="sr-fee-value">${INSURANCE_FEE}</span>
          </div>
          <div className="sr-fee-divider" />
          <div className="sr-fee-row">
            <span className="sr-fee-total-label">Total Investment</span>
            <span className="sr-fee-total-value">${TOTAL_FEE}</span>
          </div>
        </div>

        {/* What's included */}
        <div className="sr-included">
          <p className="sr-included-title">What&apos;s included</p>
          {included.map(item => (
            <div key={item} className="sr-included-row">
              <span className="sr-included-dot" />
              {item}
            </div>
          ))}
        </div>

        <p className="sr-fee-note">
          Contact our support team to complete your payment and activate your account.
        </p>

        <button className="sr-modal-ghost" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

/* ─── Main component ── */
export default function SubscriptionRequiredScreen({ userEmail }: { userEmail: string }) {
  const { refreshUserStatus } = useDashboard();
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [polling, setPolling]           = useState(false);

  const msg = whatsAppMessages.payment(userEmail);

  // Poll for subscription status every 10 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      setPolling(true);
      await refreshUserStatus();
      setPolling(false);
    }, 10000);
    return () => clearInterval(interval);
  }, [refreshUserStatus]);

  const features = [
    'Access to exclusive investment plans',
    'Real-time profit tracking',
    'Priority withdrawal processing',
    'Dedicated support team',
  ];

  const contacts = [
    { label:'WhatsApp Support 1', sub:'Primary',   icon:<WaIcon />, action: () => openWhatsApp(msg)          },
    { label:'WhatsApp Support 2', sub:'Secondary', icon:<WaIcon />, action: () => openWhatsAppSecondary(msg)  },
    { label:'Telegram Support 1', sub:'Primary',   icon:<TgIcon />, action: () => openTelegram(msg)           },
    { label:'Telegram Support 2', sub:'Secondary', icon:<TgIcon />, action: () => openTelegramSecondary(msg)  },
  ];

  return (
    <div className="sr-root sr-page">
      <style>{STYLES}</style>

      <div className="sr-card">

        {/* Icon */}
        <div className="sr-icon-pill">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M2 20L4 8L9 13L12 6L15 13L20 8L22 20H2Z"/>
            <path d="M4 20H20" strokeWidth="2"/>
          </svg>
        </div>

        <p className="sr-title">Premium Access Required</p>
        <p className="sr-body">
          Subscribe to unlock full access to your investment dashboard and start growing your wealth.
        </p>

        {/* Feature list */}
        <div className="sr-features">
          {features.map(f => (
            <div key={f} className="sr-feature-row">
              <span className="sr-feature-check">
                <Check size={10} strokeWidth={3} />
              </span>
              {f}
            </div>
          ))}
        </div>

        {/* View fee CTA */}
        <button className="sr-btn-primary" onClick={() => setShowFeeModal(true)}>
          <Eye size={14} />
          View Fee Details
        </button>

        {/* Contact options */}
        <p className="sr-contact-label">Contact us to activate your subscription</p>
        <div className="sr-contact-stack">
          {contacts.map((c, i) => (
            <button key={i} className="sr-contact-btn" onClick={c.action}>
              <span className="sr-contact-icon">{c.icon}</span>
              <span>
                <span style={{ display:'block', fontSize:12.5, fontWeight:500, color:'#1a1a1a' }}>{c.label}</span>
                <span style={{ display:'block', fontSize:11, color:'#bbb', marginTop:1 }}>{c.sub}</span>
              </span>
              <span className="sr-contact-arrow">›</span>
            </button>
          ))}
        </div>

        {/* Auto-refresh hint */}
        <div className="sr-refresh-hint">
          <RefreshCw size={10} style={{ animation: polling ? 'spin .7s linear infinite' : undefined }} />
          Already subscribed? This page refreshes automatically once activated.
        </div>
      </div>

      {showFeeModal && <FeeModal onClose={() => setShowFeeModal(false)} />}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}