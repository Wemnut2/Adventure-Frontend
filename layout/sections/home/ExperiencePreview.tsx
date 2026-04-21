"use client";

import { Sunrise, BookOpen, Dumbbell, Moon, Eye, Ban, Home, Coffee } from "lucide-react";

const dailyRoutine = [
  { time: "7:00 AM", activity: "Wake Up", icon: Sunrise, color: "#f59e0b" },
  { time: "8:00 AM", activity: "Breakfast", icon: Coffee, color: "#f97316" },
  { time: "10:00 AM", activity: "Physical Exercise", icon: Dumbbell, color: "#fb923c" },
  { time: "1:00 PM", activity: "Lunch", icon: Coffee, color: "#f97316" },
  { time: "6:00 PM", activity: "Dinner", icon: Coffee, color: "#f97316" },
  { time: "10:00 PM", activity: "Lights Out", icon: Moon, color: "#6366f1" },
];

const whatToExpect = [
  {
    icon: Home,
    color: "#f97316",
    title: "The Space",
    body: "A private 200 sq ft room with bed, desk, bathroom, and basic amenities. No windows to the outside.",
  },
  {
    icon: BookOpen,
    color: "#f97316",
    title: "Allowed Activities",
    body: "Reading (provided books), journaling, meditation, exercise, sleeping, thinking.",
  },
  {
    icon: Ban,
    color: "#ef4444",
    title: "Not Allowed",
    body: "Electronics, writing instruments (except journal), external contact, music.",
  },
];

export default function ExperiencePreview() {
  return (
    <section id="experience" className="section-spacing bg-white">
      <style>{`
        .routine-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 20px;
          background: #fafafa;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 12px;
          transition: all 0.25s ease;
          opacity: 0;
          transform: translateX(-20px);
          animation: slideIn 0.5s ease forwards;
        }

        @keyframes slideIn {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .routine-item:hover {
          background: white;
          border-color: rgba(249, 115, 22, 0.2);
          transform: translateX(8px);
        }

        .expect-item {
          display: flex;
          gap: 16px;
          padding: 20px;
          background: #fafafa;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 16px;
          transition: all 0.3s ease;
        }

        .expect-item:hover {
          background: white;
          border-color: rgba(249, 115, 22, 0.15);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.04);
        }

        .quote-card {
          background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-left: 4px solid #f97316;
          border-radius: 0 16px 16px 0;
          padding: 24px;
          transition: all 0.3s ease;
        }

        .quote-card:hover {
          background: white;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
        }

        .psych-card {
          background: #fff7ed;
          border: 1px solid rgba(249, 115, 22, 0.2);
          border-radius: 16px;
          padding: 20px;
          margin-top: 24px;
        }

        .time-badge {
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          font-weight: 600;
          color: #666;
          min-width: 80px;
        }
      `}</style>

      <div className="landing-container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-orange-50 border border-orange-200 rounded-full text-xs font-semibold text-orange-600 tracking-wide uppercase mb-4">
            Experience Preview
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium text-gray-900 mb-4 tracking-tight">
            What To Expect Inside
          </h2>
          <p className="text-gray-500 text-lg">
            The isolation space is comfortable but minimal — designed to eliminate distractions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Eye size={18} className="text-orange-500" />
              The Environment
            </h3>
            
            <div className="space-y-4">
              {whatToExpect.map((item, i) => (
                <div key={i} className="expect-item">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${item.color}10` }}
                  >
                    <item.icon size={18} style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm mb-1">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quote */}
            <div className="quote-card mt-8">
              <p className="text-sm text-gray-600 italic leading-relaxed mb-3">
                &ldquo;The silence becomes a character of its own. You&apos;ll hear your thoughts like never before.&rdquo;
              </p>
              <p className="text-xs text-gray-400 flex items-center gap-2">
                <span className="w-6 h-px bg-gray-300"></span>
                Previous participant
              </p>
            </div>
          </div>

          {/* Right Column - Daily Routine */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Sample Daily Routine
            </h3>
            
            <div className="space-y-2">
              {dailyRoutine.map((item, i) => (
                <div 
                  key={i} 
                  className="routine-item"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${item.color}10` }}
                  >
                    <item.icon size={16} style={{ color: item.color }} />
                  </div>
                  <span className="time-badge">{item.time}</span>
                  <span className="text-sm text-gray-600 flex-1">{item.activity}</span>
                </div>
              ))}
            </div>

            {/* Psychological Note */}
            <div className="psych-card">
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="font-semibold text-orange-600">Psychological aspect:</span>
                {' '}Participants report heightened self-awareness, vivid daydreaming, and a 
                recalibrated sense of time. The first 48 hours are often the hardest.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}