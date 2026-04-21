'use client';

import { useEffect, useState } from 'react';
import { useDashboard } from './DashboardProvider';
import {
  openWhatsApp, 
  openWhatsAppSecondary,
  openTelegram, 
  openTelegramSecondary,
  whatsAppMessages,
} from '@/libs/utils/whatsapp';
import { Eye } from 'lucide-react';

// Fee constants
const REGISTRATION_FEE = 500;
const INSURANCE_FEE = 100;
const TOTAL_FEE = REGISTRATION_FEE + INSURANCE_FEE;

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
    max-width: 460px; width: 100%;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }

  .gate-icon-wrap {
    width: 50px; height: 50px; border-radius: 50%;
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 18px; color: #fff;
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

  /* View Fee Button */
  .view-fee-btn {
    width: 100%;
    padding: 13px;
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    border: none;
    border-radius: 11px;
    color: #fff;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: opacity 0.15s, transform 0.15s;
    font-family: 'DM Sans', sans-serif;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(249,115,22,0.2);
  }

  .view-fee-btn:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  /* Features list */
  .features-list {
    background: #fafafa;
    border: 1px solid rgba(0,0,0,0.07);
    border-radius: 10px; padding: 16px; margin-bottom: 20px;
  }
  
  .feature-item {
    display: flex; align-items: center; gap: 10px;
    padding: 6px 0; font-size: 12.5px; color: #555;
  }
  
  .feature-check {
    width: 18px; height: 18px; border-radius: 50%;
    background: #f97316; color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; flex-shrink: 0;
  }

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

  /* Modal Styles */
  .modal-overlay {
    position: fixed; inset: 0; z-index: 100;
    background: rgba(0,0,0,0.45);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    animation: fadeIn 0.15s ease;
  }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .modal-card {
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.14);
    max-width: 400px; width: 100%;
    padding: 28px 24px;
    max-height: 90vh;
    overflow-y: auto;
    animation: slideUp 0.18s ease;
  }

  @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

  .modal-icon-wrap {
    width: 48px; height: 48px; border-radius: 50%;
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 14px; color: #fff;
  }

  .modal-title {
    font-family: 'DM Serif Display', serif;
    font-size: 20px; color: #1a1a1a;
    text-align: center; margin-bottom: 6px;
    letter-spacing: -0.01em;
  }

  .modal-sub {
    font-size: 12px; color: #aaa;
    text-align: center; margin-bottom: 20px;
  }

  /* Fee Breakdown in Modal */
  .fee-breakdown {
    background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    border: 1px solid rgba(0,0,0,0.06);
  }

  .fee-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .fee-item:last-of-type {
    margin-bottom: 0;
  }

  .fee-item-label {
    font-size: 13px;
    color: #666;
  }

  .fee-item-value {
    font-size: 14px;
    font-weight: 500;
    color: #1a1a1a;
  }

  .fee-divider {
    height: 1px;
    background: rgba(0,0,0,0.08);
    margin: 16px 0;
  }

  .fee-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .fee-total-label {
    font-size: 14px;
    font-weight: 600;
    color: #1a1a1a;
  }

  .fee-total-value {
    font-size: 20px;
    font-weight: 700;
    color: #f97316;
  }

  .fee-note {
    font-size: 11px;
    color: #aaa;
    text-align: center;
    margin-top: 16px;
    font-style: italic;
  }

  .info-strip {
    background: #fafafa;
    border: 1px solid rgba(0,0,0,0.07);
    border-radius: 10px;
    padding: 14px 16px;
    margin-bottom: 18px;
    text-align: left;
  }

  .info-strip-title {
    font-size: 11.5px;
    font-weight: 600;
    color: #555;
    margin-bottom: 10px;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 7px;
  }

  .info-row:last-child {
    margin-bottom: 0;
  }

  .info-label {
    font-size: 12px;
    color: #666;
  }

  .info-value {
    font-size: 12px;
    font-weight: 500;
    color: #1a1a1a;
  }

  .modal-close-btn {
    width: 100%;
    padding: 11px;
    background: transparent;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 11px;
    color: #888;
    font-size: 12.5px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    font-family: 'DM Sans', sans-serif;
  }

  .modal-close-btn:hover {
    background: #f5f5f5;
    color: #555;
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

function CrownIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2 20L4 8L9 13L12 6L15 13L20 8L22 20H2Z" />
      <path d="M4 20H20" strokeWidth="2" />
    </svg>
  );
}

function DollarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" />
    </svg>
  );
}

/* ─── Fee Information Modal ─────────────────────────────────────────────── */
function FeeInformationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon-wrap">
          <DollarIcon />
        </div>
        <p className="modal-title">Challenge Participation Fee</p>
        <p className="modal-sub">One-time payment to unlock full access</p>

        <div className="fee-breakdown">
          <div className="fee-item">
            <span className="fee-item-label">Registration Fee</span>
            <span className="fee-item-value">${REGISTRATION_FEE}</span>
          </div>
          <div className="fee-item">
            <span className="fee-item-label">Insurance Fee</span>
            <span className="fee-item-value">${INSURANCE_FEE}</span>
          </div>
          <div className="fee-divider"></div>
          <div className="fee-total">
            <span className="fee-total-label">Total Investment</span>
            <span className="fee-total-value">${TOTAL_FEE}</span>
          </div>
        </div>

        <div className="info-strip">
          <p className="info-strip-title">What&apos;s Included</p>
          <div className="info-row">
            <span className="info-label">✓ Challenge Access</span>
          </div>
          <div className="info-row">
            <span className="info-label">✓ Insurance Coverage</span>
          </div>
          <div className="info-row">
            <span className="info-label">✓ Prize Eligibility</span>
          </div>
          <div className="info-row">
            <span className="info-label">✓ Priority Support</span>
          </div>
        </div>

        <p className="fee-note">
          Contact our support team to complete your payment
        </p>

        <button className="modal-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default function SubscriptionRequiredScreen({ userEmail }: { userEmail: string }) {
  const { refreshUserStatus } = useDashboard();
  const [showFeeModal, setShowFeeModal] = useState(false);
  
  const msg = whatsAppMessages.payment(userEmail);

  // Poll for subscription status every 10 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      await refreshUserStatus();
    }, 10000);

    return () => clearInterval(interval);
  }, [refreshUserStatus]);

  const contacts = [
    { 
      label: 'WhatsApp Support 1',  
      sub: 'Primary',   
      icon: <WaIcon />, 
      action: () => openWhatsApp(msg) 
    },
    { 
      label: 'WhatsApp Support 2',  
      sub: 'Secondary', 
      icon: <WaIcon />, 
      action: () => openWhatsAppSecondary(msg) 
    },
    { 
      label: 'Telegram Support 1',  
      sub: 'Primary',   
      icon: <TgIcon />, 
      action: () => openTelegram(msg) 
    },
    { 
      label: 'Telegram Support 2',  
      sub: 'Secondary', 
      icon: <TgIcon />, 
      action: () => openTelegramSecondary(msg) 
    },
  ];

  return (
    <div className="gate-root gate-page">
      <style>{STYLES}</style>
      <div className="gate-card">

        {/* Icon */}
        <div className="gate-icon-wrap">
          <CrownIcon />
        </div>

        <p className="gate-title">Premium Access Required</p>
        <p className="gate-body">
          Subscribe to unlock full access to your investment dashboard and start growing your wealth.
        </p>

        {/* Premium Features */}
        <div className="features-list">
          <div className="feature-item">
            <span className="feature-check">✓</span>
            <span>Access to exclusive investment plans</span>
          </div>
          <div className="feature-item">
            <span className="feature-check">✓</span>
            <span>Real-time profit tracking</span>
          </div>
          <div className="feature-item">
            <span className="feature-check">✓</span>
            <span>Priority withdrawal processing</span>
          </div>
          <div className="feature-item">
            <span className="feature-check">✓</span>
            <span>Dedicated support team</span>
          </div>
        </div>

        {/* View Fee Details Button */}
        <button className="view-fee-btn" onClick={() => setShowFeeModal(true)}>
          <Eye size={16} />
          View Fee Details
        </button>

        {/* Contact options */}
        <p className="contact-label">Contact us to activate your subscription</p>
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
        
        <p className="gate-body" style={{ marginTop: 16, marginBottom: 0, fontSize: 11 }}>
          Already subscribed? The page will refresh automatically once your subscription is activated.
        </p>
      </div>

      {/* Fee Information Modal */}
      <FeeInformationModal 
        isOpen={showFeeModal} 
        onClose={() => setShowFeeModal(false)} 
      />
    </div>
  );
}