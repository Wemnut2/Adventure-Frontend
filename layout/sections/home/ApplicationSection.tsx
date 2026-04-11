"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

export default function ApplicationSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Application submitted:", formData);
    setSubmitted(true);
  };

  return (
    <section id="apply" className="py-20 bg-white">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto">

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
              {/* Form */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full Name <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email Address <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone Number <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors"
                      placeholder="+1 234 567 8900"
                    />
                  </div>

                  {/* Reason */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Why should we pick you? <span className="text-orange-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors resize-none"
                      placeholder="Tell us about your mental strength, previous challenges, or why you're ready for this..."
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-semibold text-sm rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Apply for the Challenge
                  </button>
                </form>
              </div>

              {/* Disclaimer */}
              <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed">
                By applying, you agree to our privacy policy and terms of participation.
                <br />Selected applicants will undergo a full screening process.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}