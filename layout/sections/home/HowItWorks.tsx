"use client";

import { FileText, Mail, DoorOpen, Clock, LogOut, Wallet } from "lucide-react";
import { useEffect, useRef } from "react";

const steps = [
  {
    icon: FileText,
    title: "Apply & Get Selected",
    description: "Submit your application and complete the screening process.",
    step: "01",
    color: "#f97316"
  },
  {
    icon: Mail,
    title: "Receive Instructions",
    description: "Get detailed guidelines and preparation materials.",
    step: "02",
    color: "#fb923c"
  },
  {
    icon: DoorOpen,
    title: "Enter Isolation",
    description: "Step into the controlled environment space.",
    step: "03",
    color: "#fdba74"
  },
  {
    icon: Clock,
    title: "Stay As Long As Possible",
    description: "Endure solitude with no external contact.",
    step: "04",
    color: "#f97316"
  },
  {
    icon: LogOut,
    title: "Exit Anytime",
    description: "Freedom to leave whenever you choose.",
    step: "05",
    color: "#fb923c"
  },
  {
    icon: Wallet,
    title: "Earn Rewards",
    description: "Get paid based on your duration completed.",
    step: "06",
    color: "#fdba74"
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = document.querySelectorAll('.step-card');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="how-it-works" className="section-spacing bg-white">
      <style>{`
        .step-card {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          background: #fafafa;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 16px;
          padding: 28px 24px;
          overflow: hidden;
        }

        .step-card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .step-card:hover {
          background: white;
          border-color: rgba(249, 115, 22, 0.2);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
        }

        .step-card:hover .step-icon {
          transform: scale(1.1) rotate(5deg);
        }

        .step-number {
          position: absolute;
          top: 16px;
          right: 20px;
          font-size: 56px;
          font-weight: 700;
          color: rgba(0, 0, 0, 0.03);
          font-family: 'DM Serif Display', serif;
          line-height: 1;
          transition: color 0.3s ease;
        }

        .step-card:hover .step-number {
          color: rgba(249, 115, 22, 0.08);
        }

        .step-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #fff 0%, #fafafa 100%);
          border: 1px solid rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: #f97316;
          position: relative;
          z-index: 2;
        }

        .section-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 64px;
        }

        .section-badge {
          display: inline-block;
          padding: 4px 14px;
          background: rgba(249, 115, 22, 0.08);
          border: 1px solid rgba(249, 115, 22, 0.15);
          border-radius: 30px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #f97316;
          margin-bottom: 16px;
        }

        .section-title {
          font-family: 'DM Serif Display', serif;
          font-size: 42px;
          color: #1a1a1a;
          letter-spacing: -0.02em;
          margin-bottom: 12px;
        }

        .section-subtitle {
          font-size: 16px;
          color: #888;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: 32px;
          }
          .step-card {
            padding: 20px;
          }
        }

        .note-banner {
          margin-top: 48px;
          padding: 16px 24px;
          background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 12px;
          text-align: center;
        }

        .note-banner p {
          font-size: 13px;
          color: #666;
        }

        .note-banner span {
          color: #f97316;
          font-weight: 600;
        }
      `}</style>

      <div className="landing-container">
        {/* Header */}
        <div className="section-header">
          <span className="section-badge">How It Works</span>
          <h2 className="section-title">Simple 6-Step Process</h2>
          <p className="section-subtitle">
            From application to reward — here&apos;s how your journey unfolds
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div 
              key={i} 
              className="step-card hover-lift"
              style={{ transitionDelay: `${i * 0.05}s` }}
            >
              <span className="step-number">{step.step}</span>
              <div className="step-icon">
                <step.icon size={22} />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2 relative z-10">
                {step.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed relative z-10">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="note-banner">
          <p>
            <span>⚡ Flexible Exit:</span> Leave anytime. Rewards based on duration completed.
          </p>
        </div>
      </div>
    </section>
  );
}