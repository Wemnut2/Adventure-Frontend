// "use client";

// import { useState } from "react";
// import { Send, CheckCircle } from "lucide-react";

// export default function ApplicationSection() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     reason: "",
//   });
//   const [submitted, setSubmitted] = useState(false);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Application submitted:", formData);
//     setSubmitted(true);
//   };

//   return (
//     <section id="apply" className="py-20 bg-white">
//       <div className="container-custom">
//         <div className="max-w-2xl mx-auto">

//           {/* Header */}
//           <div className="text-center mb-10">
//             <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 rounded-sm mb-4">
//               <span className="text-xs font-semibold text-orange-600 tracking-wide uppercase">
//                 Apply Now
//               </span>
//             </div>
//             <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
//               Ready to Challenge Yourself?
//             </h2>
//             <p className="text-gray-500">
//               Limited spots available per challenge cycle. Apply early for consideration.
//             </p>
//           </div>

//           {/* Success State */}
//           {submitted ? (
//             <div className="bg-orange-50 border border-orange-200 rounded-xl p-10 text-center">
//               <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <CheckCircle className="w-7 h-7 text-white" />
//               </div>
//               <h3 className="text-lg font-bold text-gray-900 mb-2">Application Received!</h3>
//               <p className="text-sm text-gray-600">
//                 We'll review your application and contact you within 48 hours.
//               </p>
//             </div>
//           ) : (
//             <>
//               {/* Form */}
//               <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 md:p-8">
//                 <form onSubmit={handleSubmit} className="space-y-5">

//                   {/* Name */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                       Full Name <span className="text-orange-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       required
//                       value={formData.name}
//                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                       className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors"
//                       placeholder="John Doe"
//                     />
//                   </div>

//                   {/* Email */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                       Email Address <span className="text-orange-500">*</span>
//                     </label>
//                     <input
//                       type="email"
//                       required
//                       value={formData.email}
//                       onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                       className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors"
//                       placeholder="john@example.com"
//                     />
//                   </div>

//                   {/* Phone */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                       Phone Number <span className="text-orange-500">*</span>
//                     </label>
//                     <input
//                       type="tel"
//                       required
//                       value={formData.phone}
//                       onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                       className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors"
//                       placeholder="+1 234 567 8900"
//                     />
//                   </div>

//                   {/* Reason */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                       Why should we pick you? <span className="text-orange-500">*</span>
//                     </label>
//                     <textarea
//                       required
//                       rows={4}
//                       value={formData.reason}
//                       onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
//                       className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors resize-none"
//                       placeholder="Tell us about your mental strength, previous challenges, or why you're ready for this..."
//                     />
//                   </div>

//                   {/* Submit */}
//                   <button
//                     type="submit"
//                     className="w-full py-3 bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-semibold text-sm rounded-lg transition-all flex items-center justify-center gap-2"
//                   >
//                     <Send className="w-4 h-4" />
//                     Apply for the Challenge
//                   </button>
//                 </form>
//               </div>

//               {/* Disclaimer */}
//               <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed">
//                 By applying, you agree to our privacy policy and terms of participation.
//                 <br />Selected applicants will undergo a full screening process.
//               </p>
//             </>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

type FormData = {
  // Personal info
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
  // Read-only challenge info
  // Registration $110, Insurance $110, Total Prize from tier
  // Why
  reason: string;
  // Signatures
  participantSignature: string;
  participantSignatureDate: string;
};

const inputClass =
  "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors";

const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>
        {label}{" "}
        {required && <span className="text-orange-500">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function ApplicationSection() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    address: "",
    gender: "",
    age: "",
    monthlyIncome: "",
    maritalStatus: "",
    contactNumber: "",
    email: "",
    hearingStatus: "",
    housingSituation: "",
    preferredPayment: "",
    location: "",
    startDate: "",
    reason: "",
    participantSignature: "",
    participantSignatureDate: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Application submitted:", formData);
    setSubmitted(true);
  };

  return (
    <section id="apply" className="py-20 bg-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 rounded-sm mb-4">
              <span className="text-xs font-semibold text-orange-600 tracking-wide uppercase">
                Apply Now
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
              Ready to Challenge Yourself?
            </h2>
            <p className="text-gray-500">
              Limited spots available per challenge cycle. Apply early for consideration.
            </p>
          </div>

          {/* Success State */}
          {submitted ? (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-10 text-center">
              <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Application Received!</h3>
              <p className="text-sm text-gray-600">
                We'll review your application and contact you within 48 hours.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-8">

                  {/* ── Section 1: Participant Information ── */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-5 pb-2 border-b border-gray-200">
                      Participant Information
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-5">

                      <Field label="Full Name" required>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={set("fullName")}
                          className={inputClass}
                          placeholder="John Doe"
                        />
                      </Field>

                      <Field label="Age" required>
                        <input
                          type="number"
                          required
                          min={21}
                          value={formData.age}
                          onChange={set("age")}
                          className={inputClass}
                          placeholder="e.g. 28"
                        />
                      </Field>

                      <Field label="Gender" required>
                        <select
                          required
                          value={formData.gender}
                          onChange={set("gender")}
                          className={inputClass}
                        >
                          <option value="" disabled>Select gender</option>
                          <option>Male</option>
                          <option>Female</option>
                          <option>Non-binary</option>
                          <option>Prefer not to say</option>
                        </select>
                      </Field>

                      <Field label="Marital Status" required>
                        <select
                          required
                          value={formData.maritalStatus}
                          onChange={set("maritalStatus")}
                          className={inputClass}
                        >
                          <option value="" disabled>Select status</option>
                          <option>Single</option>
                          <option>Married</option>
                          <option>Divorced</option>
                          <option>Widowed</option>
                          <option>Prefer not to say</option>
                        </select>
                      </Field>

                      <Field label="Contact Number" required>
                        <input
                          type="tel"
                          required
                          value={formData.contactNumber}
                          onChange={set("contactNumber")}
                          className={inputClass}
                          placeholder="+1 234 567 8900"
                        />
                      </Field>

                      <Field label="Email Address" required>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={set("email")}
                          className={inputClass}
                          placeholder="john@example.com"
                        />
                      </Field>

                      <Field label="Monthly Income" required>
                        <input
                          type="text"
                          required
                          value={formData.monthlyIncome}
                          onChange={set("monthlyIncome")}
                          className={inputClass}
                          placeholder="e.g. $3,500"
                        />
                      </Field>

                      <Field label="Preferred Payment Method" required>
                        <select
                          required
                          value={formData.preferredPayment}
                          onChange={set("preferredPayment")}
                          className={inputClass}
                        >
                          <option value="" disabled>Select method</option>
                          <option>Bank Transfer</option>
                          <option>PayPal</option>
                          <option>Cheque</option>
                          <option>Cryptocurrency</option>
                          <option>Other</option>
                        </select>
                      </Field>

                      <Field label="Hearing Status" required>
                        <select
                          required
                          value={formData.hearingStatus}
                          onChange={set("hearingStatus")}
                          className={inputClass}
                        >
                          <option value="" disabled>Select status</option>
                          <option>Normal hearing</option>
                          <option>Mild hearing loss</option>
                          <option>Moderate hearing loss</option>
                          <option>Deaf</option>
                        </select>
                      </Field>

                      <Field label="Housing Situation" required>
                        <select
                          required
                          value={formData.housingSituation}
                          onChange={set("housingSituation")}
                          className={inputClass}
                        >
                          <option value="" disabled>Select situation</option>
                          <option>Own home</option>
                          <option>Renting</option>
                          <option>Living with family</option>
                          <option>Other</option>
                        </select>
                      </Field>

                      <Field label="Address" required>
                        <input
                          type="text"
                          required
                          value={formData.address}
                          onChange={set("address")}
                          className={inputClass}
                          placeholder="123 Main St, City, Country"
                        />
                      </Field>

                      <Field label="Location (City / Country)" required>
                        <input
                          type="text"
                          required
                          value={formData.location}
                          onChange={set("location")}
                          className={inputClass}
                          placeholder="e.g. Lagos, Nigeria"
                        />
                      </Field>

                      <Field label="Preferred Start Date" required>
                        <input
                          type="date"
                          required
                          value={formData.startDate}
                          onChange={set("startDate")}
                          className={inputClass}
                        />
                      </Field>

                    </div>
                  </div>

                  {/* ── Section 2: Why should we pick you ── */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-5 pb-2 border-b border-gray-200">
                      Your Application
                    </h3>
                    <Field label="Why should we pick you?" required>
                      <textarea
                        required
                        rows={4}
                        value={formData.reason}
                        onChange={set("reason")}
                        className={`${inputClass} resize-none`}
                        placeholder="Tell us about your mental strength, previous challenges, or why you're ready for this..."
                      />
                    </Field>
                  </div>

                  {/* ── Section 3: Fees & Prize ── */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-5 pb-2 border-b border-gray-200">
                      Fees & Prize Summary
                    </h3>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                        <p className="text-xs text-gray-500 mb-1">Registration Fee</p>
                        <p className="text-lg font-bold text-gray-900">$110</p>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                        <p className="text-xs text-gray-500 mb-1">Insurance Fee</p>
                        <p className="text-lg font-bold text-gray-900">$110</p>
                      </div>
                      <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-3">
                        <p className="text-xs text-orange-600 mb-1">Total Prize (up to)</p>
                        <p className="text-lg font-bold text-orange-500">$60,000</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                      Once you complete the challenge, you will be eligible to claim your rewards
                      based on the duration tier achieved.
                    </p>
                  </div>

                  {/* ── Section 4: Signatures ── */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-5 pb-2 border-b border-gray-200">
                      Signatures
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-5">

                      {/* Participant signature */}
                      <Field label="Participant Signature" required>
                        <input
                          type="text"
                          required
                          value={formData.participantSignature}
                          onChange={set("participantSignature")}
                          className={`${inputClass} italic`}
                          placeholder="Type your full name as signature"
                        />
                      </Field>

                      <Field label="Date" required>
                        <input
                          type="date"
                          required
                          value={formData.participantSignatureDate}
                          onChange={set("participantSignatureDate")}
                          className={inputClass}
                        />
                      </Field>

                      {/* CEO signature — read-only, filled after approval */}
                      <div>
                        <label className={labelClass}>C.E.O Signature</label>
                        <div className="w-full px-4 py-2.5 bg-gray-100 border border-dashed border-gray-300 rounded-lg text-sm text-gray-400 italic">
                          To be signed upon approval
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}>Date</label>
                        <div className="w-full px-4 py-2.5 bg-gray-100 border border-dashed border-gray-300 rounded-lg text-sm text-gray-400 italic">
                          To be filled upon approval
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-semibold text-sm rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Submit Application
                  </button>

                </form>
              </div>

              {/* Disclaimer */}
              <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed">
                By applying, you agree to our privacy policy and terms of participation.
                <br />Selected applicants will undergo a full medical and psychological screening process.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}