"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Can I quit anytime?",
    a: "Yes. You can exit the isolation room at any time by pressing the exit button. Your reward will be calculated based on the duration you completed.",
  },
  {
    q: "Is it safe?",
    a: "Safety is our top priority. The room is monitored 24/7 by medical professionals. Emergency protocols are in place, and participants undergo thorough medical screening before acceptance.",
  },
  {
    q: "What happens if I fail?",
    a: "There's no failing — only exiting. You'll receive rewards based on how long you stayed. The only disqualification is for rule violations or medical emergencies.",
  },
  {
    q: "How are winners paid?",
    a: "All rewards are paid via bank transfer within 7 business days after challenge completion. Partial rewards are paid proportionally.",
  },
  {
    q: "Is the room monitored?",
    a: "Yes, for safety purposes only. Video monitoring is in place with privacy safeguards. No audio recording. Medical staff can see but not hear participants.",
  },
  {
    q: "What can I bring inside?",
    a: "Only approved items: prescribed medications, basic clothing. No phones, books, writing materials, or electronics are allowed inside.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="container-custom">

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 rounded-sm mb-4">
            <span className="text-xs font-semibold text-orange-600 tracking-wide uppercase">
              Frequently Asked Questions
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Got Questions? We've Got Answers.
          </h2>
          <p className="text-gray-500 text-lg">
            Everything you need to know before applying
          </p>
        </div>

        {/* Accordion */}
        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`border rounded-xl overflow-hidden transition-colors ${
                  isOpen
                    ? "border-orange-300 bg-white"
                    : "border-gray-200 bg-white hover:border-orange-200"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex justify-between items-center px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-gray-900 pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 flex-shrink-0 text-gray-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-orange-500" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5">
                    <div className="h-px bg-gray-100 mb-4" />
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}