"use client";

import { PhoneOff, WifiOff, Ban, Heart, AlertTriangle, LogOut, Shield } from "lucide-react";

const rules = [
  { icon: PhoneOff, text: "No phones or personal devices", color: "#f97316" },
  { icon: WifiOff, text: "No internet or external communication", color: "#f97316" },
  { icon: Ban, text: "No human contact during isolation", color: "#f97316" },
  { icon: Heart, text: "Daily health check-ins (non-verbal)", color: "#10b981" },
  { icon: AlertTriangle, text: "Disqualification for rule violations", color: "#ef4444" },
  { icon: LogOut, text: "Exit anytime — no questions asked", color: "#3b82f6" },
];

const protocols = [
  {
    title: "Voluntary Exit",
    body: "Press the exit button — door unlocks immediately. No penalties, just rewards based on time completed.",
    icon: LogOut,
    color: "#3b82f6"
  },
  {
    title: "Emergency Protocol",
    body: "24/7 medical team on standby. Emergency button available at all times.",
    icon: Shield,
    color: "#10b981"
  },
  {
    title: "Disqualification",
    body: "Attempting to communicate outside, damaging equipment, or health risks will end your challenge.",
    icon: AlertTriangle,
    color: "#ef4444"
  },
];

export default function RulesConditions() {
  return (
    <section id="rules" className="section-spacing bg-white">
      <style>{`
        .rule-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          background: #fafafa;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 12px;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          transform: translateX(-20px);
          animation: slideInRule 0.5s ease forwards;
        }

        @keyframes slideInRule {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .rule-item:hover {
          background: white;
          border-color: rgba(249, 115, 22, 0.2);
          transform: translateX(8px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
        }

        .rule-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.25s ease;
        }

        .rule-item:hover .rule-icon {
          transform: scale(1.1);
        }

        .protocol-card {
          background: #fafafa;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 16px;
          padding: 28px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .protocol-card:hover {
          background: white;
          border-color: rgba(249, 115, 22, 0.15);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
        }

        .protocol-item {
          padding: 16px 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }

        .protocol-item:last-child {
          border-bottom: none;
        }

        .section-header {
          margin-bottom: 48px;
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

        @media (max-width: 768px) {
          .section-title {
            font-size: 32px;
          }
        }
      `}</style>

      <div className="landing-container">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - Rules */}
          <div>
            <div className="mb-8">
              <span className="section-badge">Rules & Conditions</span>
              <h2 className="section-title">The Rules Are Simple. And Strict.</h2>
              <p className="text-gray-500 text-base">
                To ensure fairness and safety, all participants must adhere to these rules.
              </p>
            </div>

            <div className="space-y-3">
              {rules.map((rule, i) => (
                <div 
                  key={i} 
                  className="rule-item"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="rule-icon">
                    <rule.icon size={18} style={{ color: rule.color }} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{rule.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Protocols */}
          <div className="protocol-card hover-lift">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
              <Shield size={20} className="text-orange-500" />
              Exit & Safety Protocol
            </h3>
            
            <div>
              {protocols.map((protocol, i) => (
                <div key={i} className="protocol-item">
                  <div className="flex items-start gap-3 mb-2">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${protocol.color}10` }}
                    >
                      <protocol.icon size={16} style={{ color: protocol.color }} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm mb-1">
                        {protocol.title}
                      </p>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {protocol.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-400 flex items-center gap-2">
                <AlertTriangle size={12} />
                All protocols are monitored by licensed medical professionals
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}