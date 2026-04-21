"use client";

import { Brain, Zap, Trophy, Users, Sparkles } from "lucide-react";

const reasons = [
  {
    icon: Brain,
    title: "Test Your Limits",
    description: "Discover mental resilience you never knew you had",
    color: "#f97316",
    gradient: "from-orange-500 to-orange-600"
  },
  {
    icon: Zap,
    title: "Self-Discovery",
    description: "Learn who you are when all distractions are removed",
    color: "#fb923c",
    gradient: "from-orange-400 to-orange-500"
  },
  {
    icon: Trophy,
    title: "Discipline & Mental Strength",
    description: "Build unshakeable focus and emotional control",
    color: "#fdba74",
    gradient: "from-orange-300 to-orange-400"
  },
  {
    icon: Users,
    title: "Fame & Recognition",
    description: "Top performers featured in our Hall of Fame",
    color: "#f97316",
    gradient: "from-orange-500 to-orange-600"
  },
];

export default function WhyTakeChallenge() {
  return (
    <section className="section-spacing bg-gradient-light">
      <style>{`
        .reason-card {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 20px;
          padding: 32px 24px;
          text-align: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          transform: translateY(30px);
          animation: fadeUpStagger 0.6s ease forwards;
          position: relative;
          overflow: hidden;
        }

        @keyframes fadeUpStagger {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .reason-card::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #f97316, #ea580c);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .reason-card:hover::after {
          transform: scaleX(1);
        }

        .reason-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          border-color: rgba(249, 115, 22, 0.2);
        }

        .icon-circle {
          width: 72px;
          height: 72px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          transition: all 0.3s ease;
          position: relative;
        }

        .icon-circle::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 22px;
          padding: 2px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .reason-card:hover .icon-circle::before {
          opacity: 1;
        }

        .reason-card:hover .icon-circle {
          transform: scale(1.05) rotate(5deg);
        }

        .inspire-quote {
          margin-top: 64px;
          text-align: center;
          padding: 32px 48px;
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 20px;
          transition: all 0.3s ease;
        }

        .inspire-quote:hover {
          border-color: rgba(249, 115, 22, 0.2);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
        }

        .quote-text {
          font-family: 'DM Serif Display', serif;
          font-size: 24px;
          color: #1a1a1a;
          line-height: 1.4;
          max-width: 700px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .quote-text {
            font-size: 18px;
          }
          .inspire-quote {
            padding: 24px;
          }
        }
      `}</style>

      <div className="landing-container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-orange-50 border border-orange-200 rounded-full text-xs font-semibold text-orange-600 tracking-wide uppercase mb-4">
            Why Take the Challenge
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium text-gray-900 mb-4 tracking-tight">
            More Than Just a Reward
          </h2>
          <p className="text-gray-500 text-lg">
            The real prize is what you discover about yourself
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, i) => (
            <div 
              key={i} 
              className="reason-card"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div 
                className="icon-circle"
                style={{ backgroundColor: `${reason.color}10` }}
              >
                <reason.icon size={32} style={{ color: reason.color }} />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-3">
                {reason.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>

        {/* Inspirational Quote */}
        <div className="inspire-quote">
          <Sparkles className="w-6 h-6 text-orange-400 mx-auto mb-4" />
          <p className="quote-text">
            &quot;The person who leaves the room is never the same as the person who entered.&quot;
          </p>
          <p className="text-sm text-gray-400 mt-4">— Challenge Philosophy</p>
        </div>
      </div>
    </section>
  );
}