"use client";

import { useState, useEffect, useCallback } from "react";
import { Send, CheckCircle, User, MapPin, DollarSign, FileText, MessageCircle, AlertCircle, XCircle, HelpCircle } from "lucide-react";
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

// Define the error response type
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

  /* Payment modal */
  .modal-overlay { position: fixed; inset: 0; z-index: 50; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; padding: 20px; }
  .modal-card {
    background: #fff; border-radius: 18px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.14);
    max-width: 400px; width: 100%; padding: 28px 24px;
    max-height: 90vh; overflow-y: auto;
    animation: dropIn 0.18s ease;
  }
  @keyframes dropIn { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: translateY(0); } }
  .modal-icon-wrap {
    width: 48px; height: 48px; border-radius: 50%; background: #f5f5f5;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 14px; color: #888;
  }
  .modal-title { font-family: 'DM Serif Display', serif; font-size: 20px; color: #1a1a1a; text-align: center; margin-bottom: 6px; letter-spacing: -0.01em; }
  .modal-sub   { font-size: 12px; color: #aaa; text-align: center; margin-bottom: 20px; }

  .contact-btn {
    width: 100%; display: flex; align-items: center; gap: 12px;
    padding: 12px 14px; border-radius: 10px; cursor: pointer;
    background: #fafafa; border: 1px solid rgba(0,0,0,0.08);
    text-align: left; margin-bottom: 8px; transition: background 0.15s, border-color 0.15s;
  }
  .contact-btn:hover { background: #f0f0f0; border-color: rgba(0,0,0,0.16); }
  .contact-btn-icon {
    width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: #e5e5e5; color: #555;
  }
  .contact-btn-label  { font-size: 12.5px; font-weight: 500; color: #1a1a1a; }
  .contact-btn-sub    { font-size: 11px; color: #aaa; margin-top: 1px; }
  .contact-btn-arrow  { margin-left: auto; color: #ccc; }
  .modal-later { background: none; border: none; cursor: pointer; width: 100%; padding: 10px; font-size: 12px; color: #aaa; margin-top: 4px; transition: color 0.15s; font-family: 'DM Sans', sans-serif; }
  .modal-later:hover { color: #555; }

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
        {/* {entries.map(([k, msg]) => (
          <p className="err-list-item" key={k}>
            <b style={{ fontWeight: 500 }}>{k.replace(/([A-Z])/g, ' $1').trim()}:</b> {msg}
          </p>
        ))} */}
      </div>
      <button className="err-close" onClick={onClose}><XCircle size={14} /></button>
    </div>
  );
}

function QuickSupportButton() {
  const [open, setOpen] = useState(false);
  const user = useAuthStore(s => s.user);
  const contacts = getAvailableContacts();

  // Add useCallback to prevent unnecessary re-renders
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

  // Add effect to handle click outside
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

function PaymentMethodModal({ isOpen, onClose, onSelect }: {
  isOpen: boolean; onClose: () => void;
  onSelect: (method: string) => void; userEmail: string;
}) {
  if (!isOpen) return null;
  const contacts = getAvailableContacts();
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-icon-wrap"><MessageCircle size={22} /></div>
        <p className="modal-title">Complete Payment</p>
        <p className="modal-sub">Choose your preferred platform to proceed with payment.</p>
        {contacts.map((c, i) => (
          <button
            key={i}
            className="contact-btn"
            onClick={() => onSelect(`${c.type}-${c.isPrimary ? 'primary' : 'secondary'}`)}
          >
            <span className="contact-btn-icon"><MessageCircle size={15} /></span>
            <span>
              <p className="contact-btn-label">{c.label}</p>
              <p className="contact-btn-sub">{c.isPrimary ? 'Primary Support' : 'Secondary Support'}</p>
            </span>
            <span className="contact-btn-arrow">›</span>
          </button>
        ))}
        <button className="modal-later" onClick={onClose}>I&apos;ll do this later</button>
      </div>
    </div>
  );
}

/* ─── Main component ────────────────────────────────────────────────────── */
export default function ApplicationSection({ skipProfileCheck = false }: { skipProfileCheck?: boolean }) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "", address: "", gender: "", age: "", monthlyIncome: "",
    maritalStatus: "", contactNumber: "", email: "", hearingStatus: "",
    housingSituation: "", preferredPayment: "", location: "", startDate: "",
    reason: "", participantSignature: "", participantSignatureDate: "",
  });

  const [submitted, setSubmitted]                   = useState(false);
  const [loading, setLoading]                       = useState(false);
  const [initialLoading, setInitialLoading]         = useState(true);
  const [showPaymentModal, setShowPaymentModal]     = useState(false);
  const [submittedEmail, setSubmittedEmail]         = useState("");
  const [hasExistingApplication, setHasExisting]   = useState(false);
  const [existingProfile, setExistingProfile] = useState<UserProfile | null>(null);
  const [formErrors, setFormErrors]                 = useState<FormErrors>({});
  const [showErrorAlert, setShowErrorAlert]         = useState(true);

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
          if (profile.registration_fee_paid && profile.insurance_fee_paid) {
            router.push("/dashboard"); return;
          }
          setSubmitted(true);
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

  const handlePaymentSelect = (method: string) => {
    const msg = whatsAppMessages.payment(user?.email || submittedEmail);
    if (method === 'whatsapp-primary')  openWhatsApp(msg);
    if (method === 'whatsapp-secondary') openWhatsAppSecondary(msg);
    if (method === 'telegram-primary')  openTelegram(msg);
    if (method === 'telegram-secondary') openTelegramSecondary(msg);
    setShowPaymentModal(false);
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
  setShowPaymentModal(true);
  setHasExisting(true);
} catch (err: unknown) {
  // Type guard to check if it's an AxiosError
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
    // Handle regular errors
    console.error('Error:', err.message);
    setFormErrors({ general: err.message });
    setShowErrorAlert(true);
  } else {
    // Handle unknown errors
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

  /* ── Payment pending ── */
  if (submitted && hasExistingApplication && existingProfile?.challenge_status === 'payment_pending') return (
    <>
      <style>{STYLES}</style>
      <div className="status-page">
        <div className="status-card">
          <div className="status-icon-wrap">
            <CheckCircle size={24} color="#fff" />
          </div>
          <p className="status-title">Application Submitted</p>
          <p className="status-body">
            Your application has been received. Complete your payment to activate your challenge participation.
          </p>
          <div className="info-strip">
            <p className="info-strip-title">Payment Summary</p>
            <div className="info-row">
              <span className="info-label">Registration Fee</span>
              <span className="info-value">$110</span>
            </div>
            <div className="info-row">
              <span className="info-label">Insurance Fee</span>
              <span className="info-value">$110</span>
            </div>
            <div className="info-row" style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 8, marginTop: 4 }}>
              <span className="info-label" style={{ fontWeight: 600, color: '#555' }}>Total</span>
              <span className="info-value" style={{ fontWeight: 600 }}>$220</span>
            </div>
          </div>
          <div className="stack">
            <button className="submit-btn" onClick={() => setShowPaymentModal(true)}>
              <Send size={14} /> Proceed to Payment
            </button>
            <button className="ghost-btn" onClick={() => router.push('/dashboard')}>
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
      <QuickSupportButton />
      <PaymentMethodModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} onSelect={handlePaymentSelect} userEmail={user?.email || submittedEmail} />
    </>
  );

  /* ── Existing application (other statuses) ── */
  if (hasExistingApplication && existingProfile) {
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
      <PaymentMethodModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} onSelect={handlePaymentSelect} userEmail={user?.email || submittedEmail} />
    </>
  );
}