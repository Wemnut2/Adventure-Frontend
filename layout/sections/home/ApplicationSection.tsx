"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Send, User, MapPin, DollarSign, FileText, MessageCircle, AlertCircle, XCircle, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiService } from "@/libs/services/api";
import {
  openWhatsApp,
  openTelegram,
  openWhatsAppSecondary,
  openTelegramSecondary,
  whatsAppMessages,
  getAvailableContacts,
} from "@/libs/utils/whatsapp";
import { useAuthStore } from "@/libs/stores/auth.store";

export interface UserProfile {
  id: number;
  user: number;
  full_name?: string;
  gender?: string;
  age?: number;
  monthly_income?: number;
  marital_status?: string;
  contact_number?: string;
  hearing_status?: string;
  housing_situation?: string;
  preferred_payment_method?: string;
  location?: string;
  challenge_status?: 'pending' | 'active' | 'completed' | 'failed' | 'payment_pending';
  registration_fee_paid?: boolean;
  insurance_fee_paid?: boolean;
  total_prize?: number;
  challenge_start_date?: string;
  challenge_end_date?: string;
  participant_signature?: string;
  participant_signature_date?: string;
  ceo_signature?: string;
  ceo_signature_date?: string;
  challenge_completed_date?: string;
  challenge_reward_claimed?: boolean;
  admin_notes?: string;
  created_at?: string;
  updated_at?: string;
}

type FormData = {
  fullName: string; address: string; gender: string; age: string;
  monthlyIncome: string; maritalStatus: string; contactNumber: string;
  email: string; hearingStatus: string; housingSituation: string;
  preferredPayment: string; location: string; startDate: string;
  reason: string; participantSignature: string; participantSignatureDate: string;
};

import { AxiosError } from 'axios';

interface ApiErrorResponse {
  [key: string]: string | string[] | undefined;
  non_field_errors?: string[];
}
type FormErrors = { [key in keyof FormData]?: string } & { general?: string };

/* ─── Shared styles ─────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');

  .app-root * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }

  /* Layout */
  .app-page   { min-height: 100vh; background: #f5f5f5; }
  .app-hero   { background: #fff; padding: 40px 24px 32px; text-align: center; border-bottom: 1px solid rgba(0,0,0,0.06); }
  .app-tag    {
    display: inline-flex; align-items: center;
    background: #fff8f4; border: 1px solid rgba(249,115,22,0.2);
    border-radius: 20px; padding: 3px 12px; margin-bottom: 14px;
    font-size: 10.5px; font-weight: 600; letter-spacing: 0.06em;
    text-transform: uppercase; color: #f97316;
  }
  .app-title   { font-family: 'DM Serif Display', serif; font-size: 26px; color: #1a1a1a; letter-spacing: -0.02em; margin-bottom: 6px; }
  .app-sub     { font-size: 12px; color: #aaa; }

  .app-body  { max-width: 640px; margin: 0 auto; padding: 28px 16px 60px; }

  /* Cards */
  .form-card {
    background: #fff;
    border: 1px solid rgba(0,0,0,0.07);
    border-radius: 14px;
    padding: 22px 20px;
    margin-bottom: 14px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }

  /* Section header */
  .sec-head {
    display: flex; align-items: center; gap: 8px;
    padding-bottom: 14px; margin-bottom: 16px;
    border-bottom: 1px solid rgba(0,0,0,0.06);
  }
  .sec-icon {
    width: 26px; height: 26px; border-radius: 7px;
    background: #f5f5f5;
    display: flex; align-items: center; justify-content: center;
    color: #888;
  }
  .sec-title {
    font-size: 11px; font-weight: 600; letter-spacing: 0.07em;
    text-transform: uppercase; color: #888;
  }

  /* Field */
  .field-wrap  { display: flex; flex-direction: column; gap: 5px; }
  .field-label { font-size: 11.5px; font-weight: 500; color: #555; }
  .req-star    { color: #f97316; margin-left: 2px; }

  .field-input, .field-select, .field-textarea {
    width: 100%; padding: 9px 12px;
    background: #fafafa; border: 1px solid rgba(0,0,0,0.1);
    border-radius: 9px; font-size: 12.5px; color: #1a1a1a;
    font-family: 'DM Sans', sans-serif;
    outline: none; transition: border-color 0.15s, box-shadow 0.15s;
    -webkit-appearance: none;
  }
  .field-input::placeholder, .field-textarea::placeholder { color: #ccc; font-size: 12.5px; }
  .field-input:focus, .field-select:focus, .field-textarea:focus {
    border-color: rgba(0,0,0,0.25); box-shadow: 0 0 0 3px rgba(0,0,0,0.04); background: #fff;
  }
  .field-input.err, .field-select.err, .field-textarea.err {
    border-color: #e05252;
  }
  .field-input.err:focus, .field-select.err:focus { box-shadow: 0 0 0 3px rgba(224,82,82,0.08); }
  .field-textarea { resize: vertical; min-height: 96px; }
  .field-error { display: flex; align-items: center; gap: 4px; font-size: 11px; color: #e05252; margin-top: 1px; }

  /* 2-col grid */
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .col-span-2 { grid-column: 1 / -1; }
  @media (max-width: 540px) { .grid2 { grid-template-columns: 1fr; } .col-span-2 { grid-column: 1; } }

  /* Error alert */
  .err-alert {
    background: #fff5f5; border: 1px solid rgba(224,82,82,0.2);
    border-radius: 12px; padding: 14px 16px; margin-bottom: 16px;
    display: flex; gap: 10px; align-items: flex-start;
  }
  .err-list { flex: 1; }
  .err-alert-title { font-size: 12px; font-weight: 600; color: #c62828; margin-bottom: 8px; }
  .err-list-item   { font-size: 11.5px; color: #c62828; margin-bottom: 3px; }
  .err-close { background: none; border: none; cursor: pointer; color: #e05252; padding: 0; }

  /* Submit button */
  .submit-btn {
    width: 100%; padding: 13px;
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    color: #fff; border: none; border-radius: 11px;
    font-size: 13px; font-weight: 500; font-family: 'DM Sans', sans-serif;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    gap: 8px; letter-spacing: 0.01em;
    transition: opacity 0.18s, transform 0.18s;
    margin-top: 6px;
  }
  .submit-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
  .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

  /* Ghost / secondary button */
  .ghost-btn {
    width: 100%; padding: 11px;
    background: transparent; color: #555;
    border: 1px solid rgba(0,0,0,0.1); border-radius: 11px;
    font-size: 12.5px; font-weight: 500; font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: background 0.15s, border-color 0.15s;
    display: flex; align-items: center; justify-content: center; gap: 7px;
  }
  .ghost-btn:hover { background: #f5f5f5; border-color: rgba(0,0,0,0.18); color: #1a1a1a; }

  /* Spinner */
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner { animation: spin 0.7s linear infinite; }

  /* Status card (centered states) */
  .status-page { min-height: 100vh; background: #f5f5f5; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .status-card {
    background: #fff; border: 1px solid rgba(0,0,0,0.07);
    border-radius: 18px; padding: 36px 32px; max-width: 420px; width: 100%;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }
  .status-icon-wrap {
    width: 52px; height: 52px; border-radius: 50%;
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 18px;
  }
  .status-icon-wrap.neutral {
    background: #f5f5f5;
  }
  .status-title  { font-family: 'DM Serif Display', serif; font-size: 22px; color: #1a1a1a; letter-spacing: -0.02em; margin-bottom: 8px; }
  .status-body   { font-size: 12.5px; color: #888; line-height: 1.6; margin-bottom: 20px; }

  .info-strip {
    background: #fafafa; border: 1px solid rgba(0,0,0,0.07);
    border-radius: 10px; padding: 14px 16px; margin-bottom: 18px; text-align: left;
  }
  .info-strip-title { font-size: 11.5px; font-weight: 600; color: #555; margin-bottom: 10px; }
  .info-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 7px; }
  .info-row:last-child { margin-bottom: 0; }
  .info-label { font-size: 12px; color: #aaa; }
  .info-value { font-size: 12px; font-weight: 500; color: #1a1a1a; }
  .info-value.orange { color: #f97316; }

  .stack { display: flex; flex-direction: column; gap: 8px; }

  /* FAB help button */
  .fab {
    position: fixed; bottom: 24px; right: 24px; z-index: 40;
  }
  .fab-btn {
    width: 44px; height: 44px;
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    border: none; border-radius: 50%; cursor: pointer; color: #fff;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 14px rgba(249,115,22,0.35);
    transition: opacity 0.15s, transform 0.15s;
  }
  .fab-btn:hover { opacity: 0.9; transform: scale(1.05); }

  .fab-popup {
    position: absolute; bottom: 54px; right: 0;
    background: #fff; border: 1px solid rgba(0,0,0,0.08);
    border-radius: 12px; padding: 12px;
    min-width: 220px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    animation: dropIn 0.15s ease;
  }
  .fab-popup-label { font-size: 11px; color: #aaa; padding: 0 4px 8px; display: block; }
  .fab-popup-item {
    width: 100%; display: flex; align-items: center; gap: 8px;
    padding: 8px 10px; border-radius: 8px; border: none; background: none;
    cursor: pointer; font-size: 12.5px; font-family: 'DM Sans', sans-serif;
    color: #444; transition: background 0.12s;
    text-align: left;
  }
  .fab-popup-item:hover { background: #f5f5f5; color: #1a1a1a; }

  @keyframes dropIn { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: translateY(0); } }
`;

/* ─── Tiny helpers ──────────────────────────────────────────────────────── */
function Field({ label, required, children, error }: {
  label: string; required?: boolean; children: React.ReactNode; error?: string;
}) {
  return (
    <div className="field-wrap">
      <label className="field-label">
        {label}{required && <span className="req-star">*</span>}
      </label>
      {children}
      {error && (
        <p className="field-error">
          <AlertCircle size={11} />{error}
        </p>
      )}
    </div>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="sec-head">
      <span className="sec-icon"><Icon size={13} /></span>
      <span className="sec-title">{title}</span>
    </div>
  );
}

function ErrorAlert({ errors, onClose }: { errors: FormErrors; onClose: () => void }) {
  const entries = Object.entries(errors).filter(([, v]) => v);
  if (!entries.length) return null;
  return (
    <div className="err-alert">
      <XCircle size={15} color="#e05252" style={{ flexShrink: 0, marginTop: 1 }} />
      <div className="err-list">
        <p className="err-alert-title">Please fix {entries.length} error{entries.length > 1 ? 's' : ''} before submitting</p>
      </div>
      <button className="err-close" onClick={onClose}><XCircle size={14} /></button>
    </div>
  );
}

function QuickSupportButton() {
  const [open, setOpen] = useState(false);
  const user = useAuthStore(s => s.user);
  const contacts = getAvailableContacts();

  const handle = useCallback((type: string, isSecondary: boolean) => {
    const msg = `Hello, I need help with the challenge application. Email: ${user?.email || 'N/A'}`;
    if (type === 'whatsapp') {
      if (isSecondary) {
        openWhatsAppSecondary(msg);
      } else {
        openWhatsApp(msg);
      }
    } else {
      if (isSecondary) {
        openTelegramSecondary(msg);
      } else {
        openTelegram(msg);
      }
    }
    setOpen(false);
  }, [user?.email]);

  useEffect(() => {
    if (!open) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.fab')) {
        setOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [open]);

  return (
    <div className="fab">
      {open && (
        <div className="fab-popup">
          <span className="fab-popup-label">Need help? Contact support:</span>
          {contacts.map((c, i) => (
            <button key={i} className="fab-popup-item" onClick={() => handle(c.type, !c.isPrimary)}>
              <MessageCircle size={13} />{c.label}
            </button>
          ))}
        </div>
      )}
      <button className="fab-btn" onClick={() => setOpen(!open)}>
        <HelpCircle size={18} />
      </button>
    </div>
  );
}

// Subscription Required Screen Component (integrated)
const SubscriptionRequiredScreen = ({ userEmail }: { userEmail: string; onRefreshNeeded: () => void }) => {
  const [showFeeModal, setShowFeeModal] = useState(false);
  const { refreshUserStatus } = useDashboard();
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const msg = whatsAppMessages.payment(userEmail);

  // Fast polling (every 3 seconds) for immediate dashboard redirect
  useEffect(() => {
    let isMounted = true;
    
    const checkPaymentStatus = async () => {
      try {
        const { data: profile } = await apiService.get("/auth/profile/");
        
        // Check if both fees are paid
        if (profile.registration_fee_paid && profile.insurance_fee_paid) {
          if (isMounted && pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
          // Immediate redirect to dashboard
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    };

    // Poll every 3 seconds for fast response
    pollingRef.current = setInterval(checkPaymentStatus, 3000);
    
    // Also trigger a refresh when component mounts
    refreshUserStatus();

    return () => {
      isMounted = false;
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [refreshUserStatus, router]);

  const contacts = [
    { 
      label: 'WhatsApp Support 1',  
      sub: 'Primary',   
      icon: <MessageCircle size={15} />, 
      action: () => openWhatsApp(msg) 
    },
    { 
      label: 'WhatsApp Support 2',  
      sub: 'Secondary', 
      icon: <MessageCircle size={15} />, 
      action: () => openWhatsAppSecondary(msg) 
    },
    { 
      label: 'Telegram Support 1',  
      sub: 'Primary',   
      icon: <MessageCircle size={15} />, 
      action: () => openTelegram(msg) 
    },
    { 
      label: 'Telegram Support 2',  
      sub: 'Secondary', 
      icon: <MessageCircle size={15} />, 
      action: () => openTelegramSecondary(msg) 
    },
  ];

  return (
    <div className="status-page">
      <div className="status-card" style={{ maxWidth: 480 }}>
        <div className="status-icon-wrap">
          <DollarSign size={24} color="#fff" />
        </div>
        <p className="status-title">Premium Access Required</p>
        <p className="status-body">
          Your application has been submitted! To activate your challenge participation, please complete the payment.
        </p>

        <div className="info-strip">
          <p className="info-strip-title">Payment Summary</p>
          <div className="info-row">
            <span className="info-label">Registration Fee</span>
            <span className="info-value">$500</span>
          </div>
          <div className="info-row">
            <span className="info-label">Insurance Fee</span>
            <span className="info-value">$100</span>
          </div>
          <div className="info-row" style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 8, marginTop: 4 }}>
            <span className="info-label" style={{ fontWeight: 600, color: '#555' }}>Total</span>
            <span className="info-value" style={{ fontWeight: 600, color: '#f97316' }}>$600</span>
          </div>
        </div>

        <button className="submit-btn" onClick={() => setShowFeeModal(true)} style={{ marginBottom: 12 }}>
          <Eye size={16} /> View Payment Details
        </button>

        <p className="contact-label" style={{ marginTop: 8, marginBottom: 10 }}>Contact us to complete payment:</p>
        <div className="stack">
          {contacts.map((c, i) => (
            <button key={i} className="contact-btn" onClick={c.action}>
              <span className="contact-btn-icon">{c.icon}</span>
              <span>
                <p className="contact-btn-label">{c.label}</p>
                <p className="contact-btn-sub">{c.sub}</p>
              </span>
              <span className="contact-btn-arrow">›</span>
            </button>
          ))}
        </div>
        
        <p className="status-body" style={{ marginTop: 16, marginBottom: 0, fontSize: 11 }}>
          ⚡ The page will automatically redirect to your dashboard once payment is confirmed.
        </p>
      </div>

      {/* Payment Details Modal */}
      {showFeeModal && (
        <div className="modal-overlay" onClick={() => setShowFeeModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon-wrap">
              <DollarSign size={22} color="#fff" />
            </div>
            <p className="modal-title">Payment Details</p>
            <p className="modal-sub">One-time payment to unlock full access</p>

            <div className="fee-breakdown">
              <div className="fee-item">
                <span className="fee-item-label">Registration Fee</span>
                <span className="fee-item-value">$500</span>
              </div>
              <div className="fee-item">
                <span className="fee-item-label">Insurance Fee</span>
                <span className="fee-item-value">$100</span>
              </div>
              <div className="fee-divider"></div>
              <div className="fee-total">
                <span className="fee-total-label">Total Investment</span>
                <span className="fee-total-value">$600</span>
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
              Contact our support team to complete your payment via WhatsApp or Telegram
            </p>

            <button className="modal-close-btn" onClick={() => setShowFeeModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      <style>{`
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
        .contact-btn-label { font-size: 12.5px; font-weight: 500; color: #1a1a1a; margin: 0; }
        .contact-btn-sub { font-size: 11px; color: #bbb; margin-top: 1px; }
        .contact-btn-arrow { margin-left: auto; color: #ccc; font-size: 16px; line-height: 1; }
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
      `}</style>
    </div>
  );
};

// Import useDashboard hook
import { useDashboard } from "@/libs/providers/DashboardProvider";
import { Eye } from 'lucide-react';

/* ─── Main component ────────────────────────────────────────────────────── */
export default function ApplicationSection({ skipProfileCheck = false }: { skipProfileCheck?: boolean }) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "", address: "", gender: "", age: "", monthlyIncome: "",
    maritalStatus: "", contactNumber: "", email: "", hearingStatus: "",
    housingSituation: "", preferredPayment: "", location: "", startDate: "",
    reason: "", participantSignature: "", participantSignatureDate: "",
  });

  const [submitted, setSubmitted]                       = useState(false);
  const [loading, setLoading]                       = useState(false);
  const [initialLoading, setInitialLoading]         = useState(true);
  const [submittedEmail, setSubmittedEmail]         = useState("");
  const [hasExistingApplication, setHasExisting]   = useState(false);
  const [existingProfile, setExistingProfile] = useState<UserProfile | null>(null);
  const [formErrors, setFormErrors]                 = useState<FormErrors>({});
  const [showErrorAlert, setShowErrorAlert]         = useState(true);
  const [showSubscriptionScreen, setShowSubscriptionScreen] = useState(false);

  const loadUser = useAuthStore(s => s.loadUser);
  const user     = useAuthStore(s => s.user);
  const router   = useRouter();

  useEffect(() => {
    const check = async () => {
      if (skipProfileCheck || !user) { setInitialLoading(false); return; }
      try {
        const { data: profile } = await apiService.get("/auth/profile/");
        if (profile.full_name) {
          setHasExisting(true);
          setExistingProfile(profile);
          
          // Check if payment is pending
          if (profile.challenge_status === 'payment_pending' && (!profile.registration_fee_paid || !profile.insurance_fee_paid)) {
            setShowSubscriptionScreen(true);
            setSubmitted(true);
          } 
          // If fees are already paid, redirect to dashboard
          else if (profile.registration_fee_paid && profile.insurance_fee_paid) {
            router.push("/dashboard");
            return;
          }
          // If other status, show existing application
          else {
            setSubmitted(true);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setInitialLoading(false);
      }
    };
    check();
  }, [user, skipProfileCheck, router]);

  const validateForm = (): boolean => {
    const e: FormErrors = {};
    if (!formData.fullName.trim())    e.fullName      = "Full name is required";
    if (!formData.address.trim())     e.address       = "Address is required";
    if (!formData.gender)             e.gender        = "Please select gender";
    if (!formData.age)                e.age           = "Age is required";
    if (!formData.monthlyIncome.trim()) e.monthlyIncome = "Monthly income is required";
    if (!formData.maritalStatus)      e.maritalStatus = "Please select marital status";
    if (!formData.contactNumber.trim()) e.contactNumber = "Contact number is required";
    if (!formData.email.trim())       e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "Invalid email address";
    if (!formData.location.trim())    e.location = "Location is required";
    if (!formData.reason.trim())      e.reason = "Please tell us why we should pick you";
    if (formData.age && (parseInt(formData.age) < 18 || parseInt(formData.age) > 100))
      e.age = "Age must be between 18 and 100";
    if (formData.contactNumber && !/^[\d\s\-+()]{10,}$/.test(formData.contactNumber))
      e.contactNumber = "Enter a valid phone number";
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const set = (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormData(p => ({ ...p, [field]: e.target.value }));
      if (formErrors[field]) setFormErrors(p => ({ ...p, [field]: undefined }));
    };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) { setShowErrorAlert(true); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    if (hasExistingApplication) { alert("You already have an active application."); return; }

    setLoading(true); setFormErrors({});
    try {
      await apiService.post("/auth/challenge/submit/", {
        full_name: formData.fullName, address: formData.address, gender: formData.gender,
        age: parseInt(formData.age), monthly_income: formData.monthlyIncome,
        marital_status: formData.maritalStatus, contact_number: formData.contactNumber,
        email: formData.email, hearing_status: formData.hearingStatus || null,
        housing_situation: formData.housingSituation || null,
        preferred_payment_method: formData.preferredPayment || null,
        location: formData.location, challenge_start_date: formData.startDate || null,
        reason: formData.reason,
        participant_signature: formData.participantSignature || null,
        participant_signature_date: formData.participantSignatureDate || null,
      });
      await apiService.patch("/auth/profile/", { status: "payment_pending" });
      await loadUser();
      setSubmitted(true);
      setSubmittedEmail(formData.email);
      setHasExisting(true);
      // Show subscription screen immediately
      setShowSubscriptionScreen(true);
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data) {
        const apiErrors = err.response.data as ApiErrorResponse;
        
        const fe: FormErrors = {};
        Object.keys(apiErrors).forEach((k) => {
          const value = apiErrors[k];
          const v = Array.isArray(value) ? value[0] : value;
          if (k === 'non_field_errors') {
            fe.general = v as string;
          } else {
            fe[k as keyof FormData] = v as string;
          }
        });
        setFormErrors(fe);
        setShowErrorAlert(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (err instanceof Error) {
        console.error('Error:', err.message);
        setFormErrors({ general: err.message });
        setShowErrorAlert(true);
      } else {
        setFormErrors({ general: 'An unexpected error occurred' });
        setShowErrorAlert(true);
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── Loading ── */
  if (initialLoading) return (
    <div className="status-page">
      <style>{STYLES}</style>
      <div style={{ textAlign: 'center' }}>
        <svg className="spinner" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        <p style={{ marginTop: 12, fontSize: 12, color: '#aaa', fontFamily: "'DM Sans',sans-serif" }}>Loading your application…</p>
      </div>
    </div>
  );

  /* ── Show subscription screen when payment is pending ── */
  if (showSubscriptionScreen && submitted && hasExistingApplication) {
    return (
      <>
        <style>{STYLES}</style>
        <SubscriptionRequiredScreen 
          userEmail={user?.email || submittedEmail} 
          onRefreshNeeded={() => {
            // Force a hard refresh of the user data
            loadUser();
          }}
        />
        <QuickSupportButton />
      </>
    );
  }

  /* ── Existing application (other statuses) ── */
  if (hasExistingApplication && existingProfile && !showSubscriptionScreen) {
    const contacts = getAvailableContacts();
    return (
      <>
        <style>{STYLES}</style>
        <div className="status-page">
          <div className="status-card" style={{ maxWidth: 480 }}>
            <div className="status-icon-wrap neutral">
              <AlertCircle size={22} color="#888" />
            </div>
            <p className="status-title">Already Submitted</p>
            <p className="status-body">
              You&apos;ve already submitted a challenge application. Contact support if you need to make any changes.
            </p>
            <div className="info-strip" style={{ textAlign: 'left' }}>
              <p className="info-strip-title">Application Status</p>
              <div className="info-row">
                <span className="info-label">Status</span>
                <span className="info-value orange">
                  {existingProfile.challenge_status?.replace(/_/g, ' ') || 'Pending'}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Registration Fee</span>
                <span className="info-value">{existingProfile.registration_fee_paid ? 'Paid ✓' : 'Pending'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Insurance Fee</span>
                <span className="info-value">{existingProfile.insurance_fee_paid ? 'Paid ✓' : 'Pending'}</span>
              </div>
            </div>
            <p style={{ fontSize: 11.5, color: '#aaa', marginBottom: 10 }}>Need to update your info? Contact us:</p>
            <div className="stack">
              {contacts.map((c, i) => (
                <button key={i} className="contact-btn" onClick={() => {
                    const msg = whatsAppMessages.updateApplication(user?.email || '', existingProfile.challenge_status || 'pending');
                    
                    if (c.type === 'whatsapp') {
                      if (c.isPrimary) {
                        openWhatsApp(msg);
                      } else {
                        openWhatsAppSecondary(msg);
                      }
                    } else {
                      if (c.isPrimary) {
                        openTelegram(msg);
                      } else {
                        openTelegramSecondary(msg);
                      }
                    }
                  }}>
                  <span className="contact-btn-icon"><MessageCircle size={14} /></span>
                  <span>
                    <p className="contact-btn-label">{c.label}</p>
                    <p className="contact-btn-sub">{c.isPrimary ? 'Primary Support' : 'Secondary Support'}</p>
                  </span>
                  <span className="contact-btn-arrow">›</span>
                </button>
              ))}
              <button className="ghost-btn" onClick={() => router.push('/dashboard')}>Return to Dashboard</button>
            </div>
          </div>
        </div>
        <QuickSupportButton />
      </>
    );
  }

  /* ── Fresh form ── */
  const ic = (field: keyof FormData) => formErrors[field] ? 'err' : '';

  return (
    <>
      <style>{STYLES}</style>
      <div className="app-root app-page">

        {/* Hero */}
        <div className="app-hero">
          <span className="app-tag">Application Form</span>
          <h1 className="app-title">Ready to Challenge Yourself?</h1>
          <p className="app-sub">Fill in your details below. Fields marked * are required.</p>
        </div>

        <div className="app-body">

          {/* Error alert */}
          {Object.keys(formErrors).length > 0 && showErrorAlert && (
            <ErrorAlert errors={formErrors} onClose={() => setShowErrorAlert(false)} />
          )}

          <form onSubmit={handleSubmit}>

            {/* Personal */}
            <div className="form-card">
              <SectionHeader icon={User} title="Personal Information" />
              <div className="grid2">
                <div className="col-span-2">
                  <Field label="Full Name" required error={formErrors.fullName}>
                    <input type="text" required value={formData.fullName} onChange={set("fullName")} placeholder="John Doe" className={`field-input ${ic("fullName")}`} />
                  </Field>
                </div>
                <Field label="Email" required error={formErrors.email}>
                  <input type="email" required value={formData.email} onChange={set("email")} placeholder="john@example.com" className={`field-input ${ic("email")}`} />
                </Field>
                <Field label="Phone Number" required error={formErrors.contactNumber}>
                  <input type="tel" required value={formData.contactNumber} onChange={set("contactNumber")} placeholder="+1 (000) 000-0000" className={`field-input ${ic("contactNumber")}`} />
                </Field>
                <Field label="Gender" required error={formErrors.gender}>
                  <select required value={formData.gender} onChange={set("gender")} className={`field-select ${ic("gender")}`}>
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </Field>
                <Field label="Age" required error={formErrors.age}>
                  <input type="number" required value={formData.age} onChange={set("age")} placeholder="25" min="18" max="100" className={`field-input ${ic("age")}`} />
                </Field>
                <Field label="Marital Status" required error={formErrors.maritalStatus}>
                  <select required value={formData.maritalStatus} onChange={set("maritalStatus")} className={`field-select ${ic("maritalStatus")}`}>
                    <option value="">Select status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </Field>
                <Field label="Hearing Status" error={formErrors.hearingStatus}>
                  <select value={formData.hearingStatus} onChange={set("hearingStatus")} className="field-select">
                    <option value="">Optional</option>
                    <option value="good">Good</option>
                    <option value="partial">Partial Loss</option>
                    <option value="full">Full Loss</option>
                    <option value="impaired">Impaired</option>
                  </select>
                </Field>
              </div>
            </div>

            {/* Location */}
            <div className="form-card">
              <SectionHeader icon={MapPin} title="Location & Housing" />
              <div className="grid2">
                <div className="col-span-2">
                  <Field label="Address" required error={formErrors.address}>
                    <input type="text" required value={formData.address} onChange={set("address")} placeholder="123 Main St, Los Angeles, CA" className={`field-input ${ic("address")}`} />
                  </Field>
                </div>
                <Field label="City / Location" required error={formErrors.location}>
                  <input type="text" required value={formData.location} onChange={set("location")} placeholder="Los Angeles" className={`field-input ${ic("location")}`} />
                </Field>
                <Field label="Housing Situation" error={formErrors.housingSituation}>
                  <select value={formData.housingSituation} onChange={set("housingSituation")} className="field-select">
                    <option value="">Optional</option>
                    <option value="own">Own House</option>
                    <option value="rent">Rented</option>
                    <option value="lease">Leasing</option>
                    <option value="family">Living with Family</option>
                    <option value="other">Other</option>
                  </select>
                </Field>
              </div>
            </div>

            {/* Financial */}
            <div className="form-card">
              <SectionHeader icon={DollarSign} title="Financial Information" />
              <div className="grid2">
                <Field label="Monthly Income" required error={formErrors.monthlyIncome}>
                  <input type="text" required value={formData.monthlyIncome} onChange={set("monthlyIncome")} placeholder="e.g. $150,000" className={`field-input ${ic("monthlyIncome")}`} />
                </Field>
                <Field label="Preferred Payment Method" error={formErrors.preferredPayment}>
                  <select value={formData.preferredPayment} onChange={set("preferredPayment")} className="field-select">
                    <option value="">Optional</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="btc">Bitcoin</option>
                    <option value="eth">Ethereum</option>
                    <option value="usdt">USDT</option>
                    <option value="cash">Cash</option>
                  </select>
                </Field>
                <Field label="Challenge Start Date" error={formErrors.startDate}>
                  <input type="date" value={formData.startDate} onChange={set("startDate")} className="field-input" />
                </Field>
              </div>
            </div>

            {/* Declaration */}
            <div className="form-card">
              <SectionHeader icon={FileText} title="Declaration & Signature" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Field label="Why should we pick you?" required error={formErrors.reason}>
                  <textarea required value={formData.reason} onChange={set("reason")} placeholder="Tell us what makes you the right candidate…" className={`field-textarea ${ic("reason")}`} />
                </Field>
                <div className="grid2">
                  <Field label="Signature" error={formErrors.participantSignature}>
                    <input type="text" value={formData.participantSignature} onChange={set("participantSignature")} placeholder="Full name as signature" className="field-input" />
                  </Field>
                  <Field label="Signature Date" error={formErrors.participantSignatureDate}>
                    <input type="date" value={formData.participantSignatureDate} onChange={set("participantSignatureDate")} className="field-input" />
                  </Field>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? (
                <>
                  <svg className="spinner" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Submitting…
                </>
              ) : (
                <><Send size={14} /> Submit Application</>
              )}
            </button>
          </form>
        </div>
      </div>

      <QuickSupportButton />
    </>
  );
}