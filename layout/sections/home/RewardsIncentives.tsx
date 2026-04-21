"use client";

import { Award, Zap, TrendingUp } from "lucide-react";

const tiers = [
  {
    duration: "24 Hours",
    reward: "$1,500",
    iconColor: "#888",
    bg: "#fafafa",
    delay: 0
  },
  {
    duration: "72 Hours",
    reward: "$5,000",
    iconColor: "#fb923c",
    bg: "#fff7ed",
    delay: 0.1
  },
  {
    duration: "1 Week",
    reward: "$15,000",
    iconColor: "#f97316",
    bg: "#fff7ed",
    delay: 0.2
  },
  {
    duration: "2 Weeks",
    reward: "$50,000",
    iconColor: "#ea580c",
    bg: "#ffedd5",
    featured: true,
    delay: 0.3
  },
  {
    duration: "30+ Days",
    reward: "$100,000+",
    iconColor: "#c2410c",
    bg: "#ffedd5",
    featured: true,
    delay: 0.4
  },
];

export default function RewardsIncentives() {
  return (
    <section id="rewards" className="section-spacing bg-gradient-light">
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .tier-card {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 16px;
          padding: 24px 16px;
          text-align: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .tier-card.featured {
          border: 2px solid rgba(249, 115, 22, 0.3);
          background: linear-gradient(135deg, #ffffff 0%, #fffaf5 100%);
        }

        .tier-card.featured::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          border-radius: 16px;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }

        .tier-card.featured:hover::before {
          opacity: 0.1;
        }

        .tier-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.08);
        }

        .tier-icon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          transition: all 0.3s ease;
        }

        .tier-card:hover .tier-icon {
          transform: scale(1.05) rotate(5deg);
        }

        .bonus-card {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 16px;
          padding: 24px 32px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .bonus-card:hover {
          border-color: rgba(249, 115, 22, 0.3);
          box-shadow: 0 8px 24px rgba(249, 115, 22, 0.1);
        }

        .bonus-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #f97316, #ea580c, #f97316);
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      <div className="landing-container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-orange-50 border border-orange-200 rounded-full text-xs font-semibold text-orange-600 tracking-wide uppercase mb-4">
            Rewards & Incentives
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium text-gray-900 mb-4 tracking-tight">
            The Longer You Endure,
            <br />
            <span className="text-orange-500">The Greater Your Reward</span>
          </h2>
          <p className="text-gray-500 text-lg">
            Tiered cash rewards based on your isolation duration
          </p>
        </div>

        {/* Tiers */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {tiers.map((tier, i) => (
            <div
              key={i}
              className={`tier-card ${tier.featured ? 'featured' : ''}`}
              style={{ animationDelay: `${tier.delay}s` }}
            >
              <div 
                className="tier-icon"
                style={{ backgroundColor: tier.bg }}
              >
                <Award style={{ color: tier.iconColor }} size={24} />
              </div>
              <p className="text-xs font-semibold text-gray-600 mb-2">{tier.duration}</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">{tier.reward}</p>
              {tier.featured && (
                <span className="inline-block mt-2 px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded-full">
                  Popular
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Bonus */}
        <div className="max-w-2xl mx-auto">
          <div className="bonus-card">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Completion Bonus</p>
                  <p className="text-sm text-gray-500">Finish the full 30+ days</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-orange-500">+$100,000</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <TrendingUp size={12} />
                  on top of tier reward
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}