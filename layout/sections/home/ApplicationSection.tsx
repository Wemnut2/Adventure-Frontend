"use client";

import { useState, useEffect } from "react";
import { Send, CheckCircle, User, MapPin, DollarSign, FileText, MessageCircle, AlertCircle, XCircle, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiService } from "@/libs/services/api";
import { 
  openWhatsApp, 
  openTelegram, 
  openWhatsAppSecondary,
  openTelegramSecondary,
  whatsAppMessages,
  getAvailableContacts 
} from "@/libs/utils/whatsapp";
import { useAuthStore } from "@/libs/stores/auth.store";

type FormData = {
  fullName: string;
  address: string;
  gender: string;
  age: string;
  monthlyIncome: string;
  maritalStatus: string;
  contactNumber: string;
  email: string;
  hearingStatus: string;
  housingSituation: string;
  preferredPayment: string;
  location: string;
  startDate: string;
  reason: string;
  participantSignature: string;
  participantSignatureDate: string;
};

type FormErrors = {
  [key in keyof FormData]?: string;
} & {
  general?: string;
};

const inputClass =
  "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-colors";

const selectClass =
  "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-colors";

const errorInputClass =
  "w-full px-4 py-2.5 bg-white border border-red-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-colors";

function Field({
  label, required, children, error,
}: {
  label: string; required?: boolean; children: React.ReactNode; error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label}{required && <span className="text-orange-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 pb-3 border-b border-gray-200 mb-4">
      <div className="bg-orange-100 p-1.5 rounded-lg">
        <Icon className="w-4 h-4 text-orange-600" />
      </div>
      <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">{title}</h3>
    </div>
  );
}

// Error Alert Component
function ErrorAlert({ errors, onClose }: { errors: FormErrors; onClose: () => void }) {
  const errorCount = Object.keys(errors).filter(k => errors[k as keyof FormErrors]).length;
  
  if (errorCount === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-red-800 mb-2">
            Please fix the following errors ({errorCount}):
          </h4>
          <ul className="space-y-1">
            {Object.entries(errors).map(([field, message]) => 
              message ? (
                <li key={field} className="text-sm text-red-600 flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>
                    <span className="font-medium capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}:</span> {message}
                  </span>
                </li>
              ) : null
            )}
          </ul>
        </div>
        <button onClick={onClose} className="text-red-400 hover:text-red-600">
          <XCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// Quick Support Button
function QuickSupportButton() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const contacts = getAvailableContacts();

  const handleSupport = (type: string, isSecondary: boolean) => {
    const message = `Hello, I'm having issues with the challenge application form. My email is: ${user?.email || 'Not logged in'}. I need assistance.`;
    
    if (type === 'whatsapp') {
      isSecondary ? openWhatsAppSecondary(message) : openWhatsApp(message);
    } else {
      isSecondary ? openTelegramSecondary(message) : openTelegram(message);
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-200 p-3 min-w-64 animate-in slide-in-from-bottom-2 duration-200">
          <p className="text-xs text-gray-500 mb-2 px-2">Need help? Contact support:</p>
          <div className="space-y-1">
            {contacts.map((contact, index) => (
              <button
                key={index}
                onClick={() => handleSupport(contact.type, !contact.isPrimary)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                  contact.type === 'whatsapp'
                    ? 'hover:bg-green-50 text-green-700'
                    : 'hover:bg-blue-50 text-blue-700'
                }`}
              >
                {contact.type === 'whatsapp' ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.33 4.94L2.05 22l5.32-1.4c1.46.8 3.11 1.22 4.81 1.22 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.91-9.91-9.91z"/>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                  </svg>
                )}
                <span className="flex-1">{contact.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
      >
        <HelpCircle className="w-6 h-6" />
      </button>
    </div>
  );
}

// Enhanced Payment Selection Modal with multiple numbers
function PaymentMethodModal({ 
  isOpen, 
  onClose, 
  onSelect,
  userEmail 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSelect: (method: string) => void;
  userEmail: string;
}) {
  if (!isOpen) return null;

  const message = whatsAppMessages.payment(userEmail);
  const contacts = getAvailableContacts();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-orange-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Complete Your Payment</h3>
          <p className="text-sm text-gray-500">
            Choose your preferred platform to complete the payment process
          </p>
        </div>

        <div className="space-y-3">
          {contacts.map((contact, index) => (
            <button
              key={index}
              onClick={() => onSelect(`${contact.type}-${contact.isPrimary ? 'primary' : 'secondary'}`)}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors group ${
                contact.type === 'whatsapp'
                  ? contact.isPrimary
                    ? 'bg-green-50 hover:bg-green-100 border border-green-200'
                    : 'bg-green-50/50 hover:bg-green-100/70 border border-green-200/50'
                  : contact.isPrimary
                    ? 'bg-blue-50 hover:bg-blue-100 border border-blue-200'
                    : 'bg-blue-50/50 hover:bg-blue-100/70 border border-blue-200/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  contact.type === 'whatsapp'
                    ? contact.isPrimary ? 'bg-green-500' : 'bg-green-400'
                    : contact.isPrimary ? 'bg-blue-500' : 'bg-blue-400'
                }`}>
                  {contact.type === 'whatsapp' ? (
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.33 4.94L2.05 22l5.32-1.4c1.46.8 3.11 1.22 4.81 1.22 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.91-9.91-9.91z"/>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.05-.2-.06-.06-.15-.04-.22-.02-.09.02-1.55.99-4.37 2.89-.41.28-.79.42-1.12.41-.37-.01-1.08-.21-1.61-.38-.65-.21-1.16-.32-1.12-.68.02-.19.28-.38.78-.58 3.04-1.32 5.07-2.19 6.09-2.62 2.9-1.21 3.5-1.42 3.89-1.42.09 0 .28.02.4.12.12.1.15.23.17.33.02.1.02.21 0 .31z"/>
                    </svg>
                  )}
                </div>
                <div className="text-left">
                  <p className={`font-semibold text-gray-900 ${
                    contact.type === 'whatsapp' 
                      ? 'group-hover:text-green-700' 
                      : 'group-hover:text-blue-700'
                  }`}>
                    {contact.label}
                  </p>
                  <p className="text-xs text-gray-500">
                    {contact.isPrimary ? 'Primary Support' : 'Secondary Support'}
                  </p>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          I'll do this later
        </button>
      </div>
    </div>
  );
}

// Contact Support Button Component
function ContactSupportButton({ 
  type, 
  label, 
  phone, 
  username,
  variant = 'primary',
  isSecondary = false
}: { 
  type: 'whatsapp' | 'telegram';
  label: string;
  phone?: string;
  username?: string;
  variant?: 'primary' | 'secondary';
  isSecondary?: boolean;
}) {
  const user = useAuthStore((state) => state.user);
  
  const handleContact = () => {
    const message = whatsAppMessages.updateApplication(
      user?.email || '', 
      user?.profile?.challenge_status || 'pending'
    );
    
    if (type === 'whatsapp') {
      isSecondary ? openWhatsAppSecondary(message) : openWhatsApp(message, phone);
    } else {
      isSecondary ? openTelegramSecondary(message) : openTelegram(message, username);
    }
  };

  const isWhatsApp = type === 'whatsapp';
  const bgColor = variant === 'primary' 
    ? (isWhatsApp ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600')
    : (isWhatsApp ? 'bg-green-100 hover:bg-green-200 text-green-700' : 'bg-blue-100 hover:bg-blue-200 text-blue-700');

  return (
    <button
      onClick={handleContact}
      className={`w-full flex items-center justify-center gap-3 p-4 rounded-xl transition-colors ${bgColor} ${
        variant === 'primary' ? 'text-white' : ''
      }`}
    >
      {isWhatsApp ? (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.33 4.94L2.05 22l5.32-1.4c1.46.8 3.11 1.22 4.81 1.22 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.91-9.91-9.91z"/>
        </svg>
      ) : (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.05-.2-.06-.06-.15-.04-.22-.02-.09.02-1.55.99-4.37 2.89-.41.28-.79.42-1.12.41-.37-.01-1.08-.21-1.61-.38-.65-.21-1.16-.32-1.12-.68.02-.19.28-.38.78-.58 3.04-1.32 5.07-2.19 6.09-2.62 2.9-1.21 3.5-1.42 3.89-1.42.09 0 .28.02.4.12.12.1.15.23.17.33.02.1.02.21 0 .31z"/>
        </svg>
      )}
      <span className="font-medium">{label}</span>
    </button>
  );
}

export default function ApplicationSection({ skipProfileCheck = false }: { skipProfileCheck?: boolean }) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "", address: "", gender: "", age: "", monthlyIncome: "",
    maritalStatus: "", contactNumber: "", email: "", hearingStatus: "",
    housingSituation: "", preferredPayment: "", location: "", startDate: "",
    reason: "", participantSignature: "", participantSignatureDate: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [hasExistingApplication, setHasExistingApplication] = useState(false);
  const [existingProfile, setExistingProfile] = useState<any>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showErrorAlert, setShowErrorAlert] = useState(true);

  const loadUser = useAuthStore((state) => state.loadUser);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  // Check if user already has an application
  useEffect(() => {
    const checkExistingApplication = async () => {
      // If skipProfileCheck is true, don't check for existing application
      if (skipProfileCheck) {
        setInitialLoading(false);
        return;
      }
      
      if (!user) {
        setInitialLoading(false);
        return;
      }

      try {
        const response = await apiService.get("/auth/profile/");
        const profile = response.data;
        
        console.log('Profile data in ApplicationSection:', profile); // Debug log
        
        const hasFilledForm = !!profile.full_name;
        const hasPaid = profile.registration_fee_paid && profile.insurance_fee_paid;

        if (hasFilledForm) {
          setHasExistingApplication(true);
          setExistingProfile(profile);

          if (hasPaid) {
            router.push("/dashboard");
            return;
          }

          setSubmitted(true);
        }
      } catch (error) {
        console.error("Error checking application:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    checkExistingApplication();
  }, [user, skipProfileCheck]); 

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    // Required field validation
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.gender) errors.gender = "Please select gender";
    if (!formData.age) errors.age = "Age is required";
    if (!formData.monthlyIncome.trim()) errors.monthlyIncome = "Monthly income is required";
    if (!formData.maritalStatus) errors.maritalStatus = "Please select marital status";
    if (!formData.contactNumber.trim()) errors.contactNumber = "Contact number is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.location.trim()) errors.location = "Location is required";
    if (!formData.reason.trim()) errors.reason = "Please tell us why we should pick you";
    
    // Age validation
    if (formData.age && (parseInt(formData.age) < 18 || parseInt(formData.age) > 100)) {
      errors.age = "Age must be between 18 and 100";
    }
    
    // Phone validation
    if (formData.contactNumber && !/^[\d\s\-+()]{10,}$/.test(formData.contactNumber)) {
      errors.contactNumber = "Please enter a valid phone number";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePaymentMethodSelect = (method: string) => {
    const msg = whatsAppMessages.payment(user?.email || submittedEmail);
    
    if (method === 'whatsapp-primary') {
      openWhatsApp(msg);
    } else if (method === 'whatsapp-secondary') {
      openWhatsAppSecondary(msg);
    } else if (method === 'telegram-primary') {
      openTelegram(msg);
    } else if (method === 'telegram-secondary') {
      openTelegramSecondary(msg);
    }
    
    setShowPaymentModal(false);
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      setShowErrorAlert(true);
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    // Double-check for existing application
    if (hasExistingApplication) {
      alert("You already have an active application. Please contact support to make changes.");
      return;
    }
    
    setLoading(true);
    setFormErrors({});
    
    try {
      await apiService.post("/auth/challenge/submit/", {
        full_name: formData.fullName,
        address: formData.address,
        gender: formData.gender,
        age: parseInt(formData.age),
        monthly_income: formData.monthlyIncome,
        marital_status: formData.maritalStatus,
        contact_number: formData.contactNumber,
        email: formData.email,
        hearing_status: formData.hearingStatus || null,
        housing_situation: formData.housingSituation || null,
        preferred_payment_method: formData.preferredPayment || null,
        location: formData.location,
        challenge_start_date: formData.startDate || null,
        reason: formData.reason,
        participant_signature: formData.participantSignature || null,
        participant_signature_date: formData.participantSignatureDate || null,
      });

      await apiService.patch("/auth/profile/", { status: "payment_pending" });
      await loadUser();

      setSubmitted(true);
      setSubmittedEmail(formData.email);
      setShowPaymentModal(true);
      setHasExistingApplication(true);
    } catch (error: any) {
      console.error("Submission error:", error?.response?.data || error);
      
      // Handle API validation errors
      if (error?.response?.data) {
        const apiErrors = error.response.data;
        const formattedErrors: FormErrors = {};
        
        // Map API error fields to form fields
        Object.keys(apiErrors).forEach(key => {
          const fieldName = key as keyof FormData;
          if (fieldName in formData || key === 'non_field_errors') {
            if (key === 'non_field_errors') {
              formattedErrors.general = Array.isArray(apiErrors[key]) 
                ? apiErrors[key][0] 
                : apiErrors[key];
            } else {
              formattedErrors[fieldName] = Array.isArray(apiErrors[key]) 
                ? apiErrors[key][0] 
                : apiErrors[key];
            }
          }
        });
        
        setFormErrors(formattedErrors);
        setShowErrorAlert(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Generic error
        setFormErrors({ 
          general: "An unexpected error occurred. Please try again or contact support." 
        });
        setShowErrorAlert(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your application...</p>
        </div>
      </div>
    );
  }

  // If user has submitted but not paid (payment pending)
  if (submitted && hasExistingApplication && existingProfile?.challenge_status === 'payment_pending') {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center max-w-md w-full">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
            <p className="text-sm text-gray-500 mb-4">
              Your application has been received. Please complete your payment to activate your challenge participation.
            </p>
            
            <div className="bg-orange-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-orange-800 font-medium mb-2">Payment Status: Pending</p>
              <p className="text-xs text-orange-600">
                Registration Fee: $110 | Insurance Fee: $110
              </p>
            </div>
            
            <button
              onClick={() => setShowPaymentModal(true)}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors mb-3"
            >
              Proceed to Payment
            </button>
            
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
        
        <QuickSupportButton />
        
        <PaymentMethodModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSelect={handlePaymentMethodSelect}
          userEmail={user?.email || submittedEmail}
        />
      </>
    );
  }

  // If user has existing application (other statuses)
  if (hasExistingApplication && existingProfile) {
    const contacts = getAvailableContacts();
    
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-2xl w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Application Already Submitted
              </h2>
              <p className="text-gray-500">
                You've already submitted a challenge application. 
                If you need to make changes, please contact our support team.
              </p>
            </div>

            {/* Show current application status */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Application Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-orange-600">
                    {existingProfile.challenge_status?.replace(/_/g, ' ').toUpperCase() || 'Pending'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Registration Fee:</span>
                  <span className="font-medium">
                    {existingProfile.registration_fee_paid ? '✅ Paid' : '⏳ Pending'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Insurance Fee:</span>
                  <span className="font-medium">
                    {existingProfile.insurance_fee_paid ? '✅ Paid' : '⏳ Pending'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Submitted:</span>
                  <span className="font-medium">
                    {existingProfile.challenge_start_date 
                      ? new Date(existingProfile.challenge_start_date).toLocaleDateString() 
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact support options */}
            <div className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                Need to update your information? Contact us through:
              </p>
              
              <div className="grid grid-cols-1 gap-3">
                {contacts.map((contact, index) => (
                  <ContactSupportButton
                    key={index}
                    type={contact.type}
                    label={contact.label}
                    phone={contact.type === 'whatsapp' ? contact.value : undefined}
                    username={contact.type === 'telegram' ? contact.value : undefined}
                    variant={contact.isPrimary ? 'primary' : 'secondary'}
                    isSecondary={!contact.isPrimary}
                  />
                ))}
              </div>

              <button
                onClick={() => router.push('/dashboard')}
                className="w-full mt-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
        <QuickSupportButton />
      </>
    );
  }

  // Fresh application form
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white px-6 py-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/20 border border-orange-400/30 rounded-full mb-4">
            <span className="text-xs font-semibold text-orange-600 tracking-wide uppercase">Application Form</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Ready to Challenge Yourself?</h1>
          <p className="text-gray-400 text-sm">Fill in your details below. All fields are required unless marked optional.</p>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Error Alert */}
          {Object.keys(formErrors).length > 0 && showErrorAlert && (
            <ErrorAlert errors={formErrors} onClose={() => setShowErrorAlert(false)} />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <SectionHeader icon={User} title="Personal Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Field label="Full Name" required error={formErrors.fullName}>
                    <input 
                      type="text" 
                      required 
                      value={formData.fullName} 
                      onChange={set("fullName")} 
                      placeholder="John Doe" 
                      className={formErrors.fullName ? errorInputClass : inputClass} 
                    />
                  </Field>
                </div>
                <Field label="Email" required error={formErrors.email}>
                  <input 
                    type="email" 
                    required 
                    value={formData.email} 
                    onChange={set("email")} 
                    placeholder="john@example.com" 
                    className={formErrors.email ? errorInputClass : inputClass} 
                  />
                </Field>
                <Field label="Phone Number" required error={formErrors.contactNumber}>
                  <input 
                    type="tel" 
                    required 
                    value={formData.contactNumber} 
                    onChange={set("contactNumber")} 
                    placeholder="+1(546)..." 
                    className={formErrors.contactNumber ? errorInputClass : inputClass} 
                  />
                </Field>
                <Field label="Gender" required error={formErrors.gender}>
                  <select 
                    required 
                    value={formData.gender} 
                    onChange={set("gender")} 
                    className={formErrors.gender ? errorInputClass : selectClass}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </Field>
                <Field label="Age" required error={formErrors.age}>
                  <input 
                    type="number" 
                    required 
                    value={formData.age} 
                    onChange={set("age")} 
                    placeholder="25" 
                    min="18" 
                    max="100"
                    className={formErrors.age ? errorInputClass : inputClass} 
                  />
                </Field>
                <Field label="Marital Status" required error={formErrors.maritalStatus}>
                  <select 
                    required 
                    value={formData.maritalStatus} 
                    onChange={set("maritalStatus")} 
                    className={formErrors.maritalStatus ? errorInputClass : selectClass}
                  >
                    <option value="">Select status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </Field>
                <Field label="Hearing Status" error={formErrors.hearingStatus}>
                  <select 
                    value={formData.hearingStatus} 
                    onChange={set("hearingStatus")} 
                    className={selectClass}
                  >
                    <option value="">Select hearing status (Optional)</option>
                    <option value="good">Good</option>
                    <option value="partial">Partial Hearing Loss</option>
                    <option value="full">Full Hearing Loss</option>
                    <option value="impaired">Hearing Impaired</option>
                  </select>
                </Field>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <SectionHeader icon={MapPin} title="Location & Housing" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Field label="Address" required error={formErrors.address}>
                    <input 
                      type="text" 
                      required 
                      value={formData.address} 
                      onChange={set("address")} 
                      placeholder="123 Main St, Los Angeles, CA" 
                      className={formErrors.address ? errorInputClass : inputClass} 
                    />
                  </Field>
                </div>
                <Field label="City / Location" required error={formErrors.location}>
                  <input 
                    type="text" 
                    required 
                    value={formData.location} 
                    onChange={set("location")} 
                    placeholder="Los Angeles" 
                    className={formErrors.location ? errorInputClass : inputClass} 
                  />
                </Field>
                <Field label="Housing Situation" error={formErrors.housingSituation}>
                  <select 
                    value={formData.housingSituation} 
                    onChange={set("housingSituation")} 
                    className={selectClass}
                  >
                    <option value="">Select housing situation (Optional)</option>
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
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <SectionHeader icon={DollarSign} title="Financial Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Monthly Income" required error={formErrors.monthlyIncome}>
                  <input 
                    type="text" 
                    required 
                    value={formData.monthlyIncome} 
                    onChange={set("monthlyIncome")} 
                    placeholder="e.g. $150,000" 
                    className={formErrors.monthlyIncome ? errorInputClass : inputClass} 
                  />
                </Field>
                <Field label="Preferred Payment Method" error={formErrors.preferredPayment}>
                  <select 
                    value={formData.preferredPayment} 
                    onChange={set("preferredPayment")} 
                    className={selectClass}
                  >
                    <option value="">Select payment method (Optional)</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="btc">Bitcoin</option>
                    <option value="eth">Ethereum</option>
                    <option value="usdt">USDT</option>
                    <option value="cash">Cash</option>
                  </select>
                </Field>
                <Field label="Challenge Start Date" error={formErrors.startDate}>
                  <input 
                    type="date" 
                    value={formData.startDate} 
                    onChange={set("startDate")} 
                    className={inputClass} 
                  />
                </Field>
              </div>
            </div>

            {/* Declaration */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <SectionHeader icon={FileText} title="Declaration & Signature" />
              <div className="space-y-4">
                <Field label="Why should we pick you?" required error={formErrors.reason}>
                  <textarea 
                    required 
                    value={formData.reason} 
                    onChange={set("reason")} 
                    rows={4} 
                    placeholder="Tell us why you're the right candidate..." 
                    className={formErrors.reason ? errorInputClass : inputClass} 
                  />
                </Field>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Signature" error={formErrors.participantSignature}>
                    <input 
                      type="text" 
                      value={formData.participantSignature} 
                      onChange={set("participantSignature")} 
                      placeholder="Enter your full name as signature" 
                      className={inputClass} 
                    />
                  </Field>
                  <Field label="Signature Date" error={formErrors.participantSignatureDate}>
                    <input 
                      type="date" 
                      value={formData.participantSignatureDate} 
                      onChange={set("participantSignatureDate")} 
                      className={inputClass} 
                    />
                  </Field>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-2xl flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Submitting...
                </span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Application
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      <QuickSupportButton />
    </>
  );
}