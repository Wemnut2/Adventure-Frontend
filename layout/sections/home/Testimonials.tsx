"use client";

import Image from "next/image";
import { Star, Quote, Award } from "lucide-react";

const testimonials = [
  {
    quote: "I lasted 30 days. The first 3 were brutal, but what I learned about myself is priceless.",
    name: "Billy Pitman",
    duration: "30 Days",
    reward: "$1,000,000",
    proofImage: "/photo_2026-04-09_23-45-16.jpg",
    verified: true,
  },
  {
    quote: "This challenge rewired my brain. I stopped needing constant stimulation.",
    name: "Marcus Williams",
    duration: "60 Days",
    reward: "$3,000,000",
    proofImage: "/photo_2026-04-09_23-45-46.jpg",
    verified: true,
  },
  {
    quote: "Professional athletes train their bodies. This trains your mind.",
    name: "Donnie Leviner",
    duration: "Completed 30 Days",
    reward: "$1,000,000",
    proofImage: "/photo_2026-04-09_23-45-40.jpg",
    verified: true,
  },
];

export default function Testimonials() {
  return (
    <section className="section-spacing bg-white">
      <style>{`
        .testimonial-card {
          background: #fafafa;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 20px;
          padding: 28px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          transform: scale(0.95);
          animation: scaleIn 0.5s ease forwards;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        @keyframes scaleIn {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .testimonial-card:hover {
          background: white;
          border-color: rgba(249, 115, 22, 0.2);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
          transform: translateY(-6px);
        }

        .stars-container {
          display: flex;
          gap: 4px;
          margin-bottom: 20px;
        }

        .star-filled {
          fill: #fbbf24;
          color: #fbbf24;
        }

        .quote-text {
          font-size: 15px;
          line-height: 1.7;
          color: #444;
          font-style: italic;
          flex: 1;
          margin-bottom: 24px;
        }

        .proof-image {
          width: 100%;
          height: 180px;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 20px;
          border: 1px solid rgba(0, 0, 0, 0.08);
        }

        .profile-section {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
        }

        .avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f97316, #ea580c);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 16px;
          flex-shrink: 0;
        }

        .verified-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #10b98110;
          padding: 2px 8px;
          border-radius: 20px;
          border: 1px solid #10b98120;
          margin-top: 4px;
        }
      `}</style>

      <div className="landing-container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-orange-50 border border-orange-200 rounded-full text-xs font-semibold text-orange-600 tracking-wide uppercase mb-4">
            Participant Stories
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium text-gray-900 mb-4 tracking-tight">
            Real Experiences.
            <br />
            <span className="text-orange-500">Real Transformations.</span>
          </h2>
          <p className="text-gray-500 text-lg">
            What our past challengers have to say
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div 
              key={i} 
              className="testimonial-card"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Stars */}
              <div className="stars-container">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} size={16} className="star-filled" />
                ))}
              </div>

              {/* Quote */}
              <div className="quote-text">
                <Quote size={20} className="text-orange-300 mb-2 opacity-50" />
                {t.quote}
              </div>

              {/* Proof Image */}
              {t.proofImage && (
                <div className="proof-image">
                  <Image
                    src={t.proofImage}
                    alt={`${t.name} reward proof`}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              {/* Profile */}
              <div className="profile-section">
                <div className="avatar">
                  {t.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">
                    {t.name}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">{t.duration}</span>
                    <span className="text-xs font-semibold text-orange-600 flex items-center gap-1">
                      <Award size={12} />
                      {t.reward}
                    </span>
                  </div>
                  {t.verified && (
                    <div className="verified-badge">
                      <span className="text-xs text-green-600">✓ Verified</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-400 mt-10">
          More testimonials coming soon from upcoming challenges
        </p>
      </div>
    </section>
  );
}