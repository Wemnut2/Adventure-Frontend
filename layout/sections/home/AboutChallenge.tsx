"use client";

import { Brain, Clock, Target, Sparkles, Users, Award } from "lucide-react";

const miniCards = [
  {
    icon: Brain,
    title: "Mental Strength",
    sub: "Push beyond limits",
    color: "#f97316"
  },
  {
    icon: Clock,
    title: "Time Endurance",
    sub: "From 24h to 30+ days",
    color: "#fb923c"
  },
  {
    icon: Target,
    title: "Self Discovery",
    sub: "Know yourself better",
    color: "#fdba74"
  },
];

const whoFor = [
  { text: "Adventurers seeking unique challenges", icon: "🎯" },
  { text: "Individuals wanting to test their limits", icon: "💪" },
  { text: "People looking for self-discovery", icon: "🔍" },
  { text: "Those seeking a life-changing reward", icon: "🏆" },
];

const stats = [
  { value: "500+", label: "Applicants", icon: Users },
  { value: "$2M+", label: "Rewards Paid", icon: Award },
  { value: "92%", label: "Completion Rate", icon: Target },
];

export default function AboutChallenge() {
  return (
    <section id="about" className="section-spacing bg-white">
      <style>{`
        .about-container {
          opacity: 0;
          animation: fadeIn 0.8s ease forwards;
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }

        .mini-card {
          background: #fafafa;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 14px;
          padding: 20px 16px;
          text-align: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          transform: translateY(20px);
          animation: slideUp 0.5s ease forwards;
        }

        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mini-card:hover {
          background: white;
          border-color: rgba(249, 115, 22, 0.2);
          transform: translateY(-6px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.06);
        }

        .mini-card-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
          transition: all 0.3s ease;
        }

        .mini-card:hover .mini-card-icon {
          transform: scale(1.1) rotate(5deg);
        }

        .who-for-card {
          background: #fafafa;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 20px;
          padding: 32px;
          transition: all 0.3s ease;
          height: 100%;
        }

        .who-for-card:hover {
          background: white;
          border-color: rgba(249, 115, 22, 0.15);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
        }

        .who-for-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.04);
          border-radius: 12px;
          margin-bottom: 10px;
          transition: all 0.25s ease;
        }

        .who-for-item:hover {
          border-color: rgba(249, 115, 22, 0.2);
          transform: translateX(8px);
          background: #fffaf5;
        }

        .unique-badge {
          display: inline-block;
          padding: 8px 16px;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          border-radius: 30px;
          margin-top: 24px;
        }

        .stat-card {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 16px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          border-color: rgba(249, 115, 22, 0.2);
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.04);
        }

        .highlight-text {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 600;
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

        .description-text {
          font-size: 15px;
          line-height: 1.7;
          color: #666;
        }
      `}</style>

      <div className="landing-container about-container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="section-badge">
            <Sparkles size={12} className="inline mr-1" />
            About the Challenge
          </span>
          <h2 className="section-title">
            What Is The Isolated
            <span className="text-orange-500"> Challenge?</span>
          </h2>
          <p className="text-gray-500 text-lg">
            An endurance experience designed to push your mental limits
          </p>
        </div>

        {/* Two-col layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          {/* Left Column */}
          <div>
            <div className="space-y-4 mb-8">
              <p className="description-text">
                The Isolated Challenge is an endurance experience where participants
                stay alone in a controlled environment with{' '}
                <span className="highlight-text">no external communication</span>.
                Your mission is simple:{' '}
                <span className="highlight-text">last as long as you can</span>.
              </p>
              <p className="description-text">
                No phones, no internet, no human contact — just you, your thoughts,
                and the silence. It&apos;s the ultimate test of mental fortitude and
                self-discipline.
              </p>
            </div>

            {/* Mini cards */}
            <div className="grid grid-cols-3 gap-4">
              {miniCards.map((card, i) => (
                <div 
                  key={i} 
                  className="mini-card"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div 
                    className="mini-card-icon"
                    style={{ backgroundColor: `${card.color}10` }}
                  >
                    <card.icon size={22} style={{ color: card.color }} />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">
                    {card.title}
                  </h4>
                  <p className="text-xs text-gray-500">{card.sub}</p>
                </div>
              ))}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {stats.map((stat, i) => (
                <div key={i} className="stat-card">
                  <stat.icon size={18} className="text-orange-500 mx-auto mb-2" />
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Who it's for */}
          <div className="who-for-card">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Users size={20} className="text-orange-500" />
              Who Is This For?
            </h3>
            
            <div>
              {whoFor.map((item, i) => (
                <div 
                  key={i} 
                  className="who-for-item"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="unique-badge">
              <p className="text-xs text-white font-medium">
                <span className="opacity-90">✨ Unique:</span> No other challenge 
                combines complete isolation with tiered cash rewards at this scale.
              </p>
            </div>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                  <Award size={14} className="text-orange-500" />
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  <span className="font-semibold text-gray-700">Verified by experts:</span>
                  {' '}Our challenge protocol has been reviewed by psychologists and 
                  safety professionals to ensure a transformative yet secure experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}