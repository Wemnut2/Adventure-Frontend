"use client";

import { Calendar, Activity, MapPin, ClipboardCheck, Users } from "lucide-react";

const requirements = [
  {
    icon: Calendar,
    title: "Age Requirement",
    description: "Must be 21 years or older",
    color: "#f97316"
  },
  {
    icon: Activity,
    title: "Physical & Mental Fitness",
    description: "Pass medical and psychological screening",
    color: "#fb923c"
  },
  {
    icon: MapPin,
    title: "Location",
    description: "Open to international applicants (visa assistance available)",
    color: "#fdba74"
  },
  {
    icon: ClipboardCheck,
    title: "Screening Process",
    description: "Background check + in-person interview",
    color: "#f97316"
  },
];

export default function WhoCanParticipate() {
  return (
    <section id="who-can-participate" className="section-spacing bg-gradient-light">
      <style>{`
        .requirement-card {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 16px;
          padding: 32px 24px;
          text-align: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          transform: scale(0.95);
          animation: popIn 0.5s ease forwards;
          position: relative;
          overflow: hidden;
        }

        @keyframes popIn {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .requirement-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #f97316, #ea580c);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .requirement-card:hover::before {
          transform: scaleX(1);
        }

        .requirement-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.08);
          border-color: rgba(249, 115, 22, 0.2);
        }

        .icon-wrapper {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          transition: all 0.3s ease;
        }

        .requirement-card:hover .icon-wrapper {
          transform: scale(1.1) rotate(5deg);
        }

        .note-footer {
          margin-top: 48px;
          text-align: center;
          padding: 16px 24px;
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 40px;
          display: inline-block;
          margin-left: auto;
          margin-right: auto;
          width: auto;
        }

        .container-center {
          text-align: center;
        }
      `}</style>

      <div className="landing-container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-orange-50 border border-orange-200 rounded-full text-xs font-semibold text-orange-600 tracking-wide uppercase mb-4">
            Who Can Participate
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium text-gray-900 mb-4 tracking-tight">
            Are You Eligible?
          </h2>
          <p className="text-gray-500 text-lg">
            We're looking for mentally strong individuals ready to push their limits
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {requirements.map((req, i) => (
            <div 
              key={i} 
              className="requirement-card"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div 
                className="icon-wrapper"
                style={{ backgroundColor: `${req.color}10` }}
              >
                <req.icon size={28} style={{ color: req.color }} />
              </div>
              <h3 className="font-semibold text-gray-900 text-base mb-3">
                {req.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {req.description}
              </p>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="container-center">
          <div className="note-footer">
            <p className="text-xs text-gray-400 flex items-center gap-2">
              <Users size={12} className="text-orange-500" />
              * Screening includes medical evaluation, psychological assessment, and background check
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}