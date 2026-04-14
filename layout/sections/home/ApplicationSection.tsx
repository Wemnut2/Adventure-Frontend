"use client";

import { useState } from "react";
import { Send, CheckCircle, User, MapPin, DollarSign, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiService } from "@/libs/services/api";
import { openWhatsApp, openTelegram, whatsAppMessages } from "@/libs/utils/whatsapp";
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

const inputClass =
  "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-colors";

const selectClass =
  "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-colors";

function Field({
  label, required, children,
}: {
  label: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label}{required && <span className="text-orange-500 ml-0.5">*</span>}
      </label>
      {children}
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

export default function ApplicationSection() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "", address: "", gender: "", age: "", monthlyIncome: "",
    maritalStatus: "", contactNumber: "", email: "", hearingStatus: "",
    housingSituation: "", preferredPayment: "", location: "", startDate: "",
    reason: "", participantSignature: "", participantSignatureDate: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadUser = useAuthStore((state) => state.loadUser);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.post("/auth/challenge/submit/", {
        full_name: formData.fullName,
        address: formData.address,
        gender: formData.gender,
        age: formData.age,
        monthly_income: formData.monthlyIncome,
        marital_status: formData.maritalStatus,
        contact_number: formData.contactNumber,
        email: formData.email,
        hearing_status: formData.hearingStatus,
        housing_situation: formData.housingSituation,
        preferred_payment: formData.preferredPayment,
        location: formData.location,
        start_date: formData.startDate,
        reason: formData.reason,
        participant_signature: formData.participantSignature,
        participant_signature_date: formData.participantSignatureDate,
      });

      await apiService.patch("/auth/profile/", { status: "payment_pending" });
      await loadUser();

      setSubmitted(true);

      const msg = whatsAppMessages.payment(user?.email || formData.email);
      openWhatsApp(msg);
      openTelegram(msg);

      router.replace("/apply");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
          <p className="text-sm text-gray-500 mt-1">
            You'll be contacted via WhatsApp & Telegram to complete your payment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-6 py-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/20 border border-orange-400/30 rounded-full mb-4">
          <span className="text-xs font-semibold text-orange-600 tracking-wide uppercase">Application Form</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Ready to Challenge Yourself?</h1>
        <p className="text-gray-400 text-sm">Fill in your details below. Limited spots available.</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Personal Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionHeader icon={User} title="Personal Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Field label="Full Name" required>
                  <input type="text" required value={formData.fullName} onChange={set("fullName")} placeholder="John Doe" className={inputClass} />
                </Field>
              </div>
              <Field label="Email" required>
                <input type="email" required value={formData.email} onChange={set("email")} placeholder="john@example.com" className={inputClass} />
              </Field>
              <Field label="Phone Number" required>
                <input type="tel" required value={formData.contactNumber} onChange={set("contactNumber")} placeholder="+1(546)..." className={inputClass} />
              </Field>
              <Field label="Gender" required>
                <select required value={formData.gender} onChange={set("gender")} className={selectClass}>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </Field>
              <Field label="Age" required>
                <input type="number" required value={formData.age} onChange={set("age")} placeholder="25" min="18" className={inputClass} />
              </Field>
              <Field label="Marital Status" required>
                <select required value={formData.maritalStatus} onChange={set("maritalStatus")} className={selectClass}>
                  <option value="">Select status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </Field>
              <Field label="Hearing Status">
                <input type="text" value={formData.hearingStatus} onChange={set("hearingStatus")} placeholder="e.g. Normal" className={inputClass} />
              </Field>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionHeader icon={MapPin} title="Location & Housing" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Field label="Address" required>
                  <input type="text" required value={formData.address} onChange={set("address")} placeholder="123 Main St, Los Angeles, CA" className={inputClass} />
                </Field>
              </div>
              <Field label="City / Location" required>
                <input type="text" required value={formData.location} onChange={set("location")} placeholder="Los Angeles" className={inputClass} />
              </Field>
              <Field label="Housing Situation">
                <input type="text" value={formData.housingSituation} onChange={set("housingSituation")} placeholder="e.g. Renting" className={inputClass} />
              </Field>
            </div>
          </div>

          {/* Financial */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionHeader icon={DollarSign} title="Financial Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Monthly Income" required>
                <input type="text" required value={formData.monthlyIncome} onChange={set("monthlyIncome")} placeholder="e.g. $150,000" className={inputClass} />
              </Field>
              <Field label="Preferred Payment Method">
                <input type="text" value={formData.preferredPayment} onChange={set("preferredPayment")} placeholder="e.g. Bank Transfer, USDT, ETH" className={inputClass} />
              </Field>
              <Field label="Challenge Start Date">
                <input type="date" value={formData.startDate} onChange={set("startDate")} className={inputClass} />
              </Field>
            </div>
          </div>

          {/* Declaration */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionHeader icon={FileText} title="Declaration & Signature" />
            <div className="space-y-4">
              <Field label="Why should we pick you?" required>
                <textarea required value={formData.reason} onChange={set("reason")} rows={4} placeholder="Tell us why you're the right candidate..." className={inputClass} />
              </Field>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Signature">
                  <input type="text" value={formData.participantSignature} onChange={set("participantSignature")} placeholder="Enter Your signature" className={inputClass} />
                </Field>
                <Field label="Signature Date">
                  <input type="date" value={formData.participantSignatureDate} onChange={set("participantSignatureDate")} className={inputClass} />
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
  );
}