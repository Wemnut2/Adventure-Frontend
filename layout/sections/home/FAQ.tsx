"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

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
    <section id="faq" className="section-spacing bg-gradient-light">
      <style>{`
        .faq-item {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.5s ease forwards;
        }

        .faq-item:hover {
          border-color: rgba(249, 115, 22, 0.2);
        }

        .faq-item.open {
          border-color: rgba(249, 115, 22, 0.3);
          box-shadow: 0 8px 24px rgba(249, 115, 22, 0.08);
        }

        .faq-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
        }

        .faq-button:hover {
          background: #fafafa;
        }

        .faq-question {
          font-size: 15px;
          font-weight: 600;
          color: #1a1a1a;
          padding-right: 16px;
        }

        .chevron-icon {
          width: 20px;
          height: 20px;
          color: #888;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
        }

        .chevron-icon.rotated {
          transform: rotate(180deg);
          color: #f97316;
        }

        .faq-answer {
          padding: 0 24px;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .faq-answer.open {
          max-height: 300px;
        }

        .faq-answer-content {
          padding-bottom: 24px;
          font-size: 14px;
          line-height: 1.7;
          color: #666;
        }

        .help-footer {
          margin-top: 48px;
          text-align: center;
          padding: 24px;
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 16px;
        }

        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="landing-container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-orange-50 border border-orange-200 rounded-full text-xs font-semibold text-orange-600 tracking-wide uppercase mb-4">
            Frequently Asked Questions
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium text-gray-900 mb-4 tracking-tight">
            Got Questions?
            <br />
            <span className="text-orange-500">We've Got Answers.</span>
          </h2>
          <p className="text-gray-500 text-lg">
            Everything you need to know before applying
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`faq-item ${isOpen ? 'open' : ''}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="faq-button"
                >
                  <span className="faq-question">{faq.q}</span>
                  <ChevronDown className={`chevron-icon ${isOpen ? 'rotated' : ''}`} />
                </button>
                
                <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
                  <div className="faq-answer-content">
                    {faq.a}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Help Footer */}
        <div className="help-footer">
          <HelpCircle className="w-6 h-6 text-orange-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-2">
            Still have questions?
          </p>
          <p className="text-xs text-gray-400">
            Contact our support team at{' '}
            <a href="mailto:support@theadventure.com" className="text-orange-500 hover:underline">
              support@theadventure.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}