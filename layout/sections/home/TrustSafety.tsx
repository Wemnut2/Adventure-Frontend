"use client";

import { Shield, HeartHandshake, Eye, FileCheck, CheckCircle } from "lucide-react";

const pillars = [
  {
    icon: Shield,
    title: "24/7 Supervision",
    description: "Medical team always on standby with emergency response protocols ready at all times.",
    color: "#f97316"
  },
  {
    icon: HeartHandshake,
    title: "Medical Precautions",
    description: "Rigorous pre-screening plus regular non-verbal health check-ins throughout isolation.",
    color: "#fb923c"
  },
  {
    icon: Eye,
    title: "Transparent Rules",
    description: "Every condition, rule, and expectation is fully disclosed before you sign anything.",
    color: "#fdba74"
  },
  {
    icon: FileCheck,
    title: "Insured & Bonded",
    description: "The Adventure Limited is fully insured and bonded for participant protection.",
    color: "#f97316"
  },
];

export default function TrustSafety() {
  return (
    <section className="section-spacing bg-white">
      <style>{`
        .pillar-card {
          background: #fafafa;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 20px;
          padding: 32px 24px;
          text-align: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.5s ease forwards;
          height: 100%;
        }

        .pillar-card:hover {
          background: white;
          border-color: rgba(249, 115, 22, 0.2);
          transform: translateY(-8px);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.06);
        }

        .pillar-icon {
          width: 64px;
          height: 64px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          transition: all 0.3s ease;
        }

        .pillar-card:hover .pillar-icon {
          transform: scale(1.1) rotate(5deg);
        }

        .compliance-card {
          margin-top: 48px;
          padding: 24px 32px;
          background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 16px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .compliance-card:hover {
          background: white;
          border-color: rgba(249, 115, 22, 0.15);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
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
            Trust & Safety
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium text-gray-900 mb-4 tracking-tight">
            Your Wellbeing Is
            <br />
            <span className="text-orange-500">Our Priority</span>
          </h2>
          <p className="text-gray-500 text-lg">
            We've designed every aspect with participant safety in mind
          </p>
        </div>

        {/* Pillars */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, i) => (
            <div 
              key={i} 
              className="pillar-card"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div 
                className="pillar-icon"
                style={{ backgroundColor: `${pillar.color}10` }}
              >
                <pillar.icon size={28} style={{ color: pillar.color }} />
              </div>
              <h3 className="font-semibold text-gray-900 text-base mb-3">
                {pillar.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        {/* Compliance Note */}
        <div className="compliance-card">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle size={18} className="text-green-500" />
            <span className="font-semibold text-gray-900 text-sm">
              Fully Compliant & Certified
            </span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed max-w-2xl mx-auto">
            All challenges comply with international safety standards and are overseen by{' '}
            <span className="font-semibold text-gray-700">licensed medical professionals</span>.
            Our facilities are regularly inspected and certified.
          </p>
        </div>
      </div>
    </section>
  );
}