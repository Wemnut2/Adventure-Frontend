// components/sections/ApplicationSection.tsx
"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function ApplicationSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Application submitted:", formData);
    alert("Application received! We'll review and contact you within 48 hours.");
  };

  return (
    <section id="apply" className="py-20 bg-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 mb-4">
              <span className="text-xs font-semibold text-orange-600 tracking-wide">
                APPLY NOW
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
              Ready to Challenge Yourself?
            </h2>
            <p className="text-gray-600">
              Limited spots available per challenge cycle. Apply early for consideration.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 p-6 md:p-8">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-gray-300 focus:border-orange-500 focus:outline-none text-sm"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-gray-300 focus:border-orange-500 focus:outline-none text-sm"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-gray-300 focus:border-orange-500 focus:outline-none text-sm"
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Why should we pick you? *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-gray-300 focus:border-orange-500 focus:outline-none text-sm resize-none"
                  placeholder="Tell us about your mental strength, previous challenges, or why you're ready for this..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Apply for the Challenge
              </button>
            </div>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            By applying, you agree to our privacy policy and terms of participation.
            Selected applicants will undergo a screening process.
          </p>
        </div>
      </div>
    </section>
  );
}