"use client";

import Link from "next/link";
import { Clock, Award, Shield, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    { icon: Clock, label: "Duration", value: "Up to 30+ days" },
    { icon: Award, label: "Prize", value: "Life-changing Grand Prize" },
    { icon: Shield, label: "Support", value: "24/7 Medical Support" },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center bg-white overflow-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .hero-gradient {
          background: radial-gradient(circle at 20% 30%, rgba(249, 115, 22, 0.08) 0%, transparent 50%),
                      radial-gradient(circle at 80% 70%, rgba(249, 115, 22, 0.05) 0%, transparent 50%);
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 12px;
          padding: 16px 24px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: float 6s ease-in-out infinite;
        }

        .stat-card:nth-child(2) {
          animation-delay: 0.5s;
        }

        .stat-card:nth-child(3) {
          animation-delay: 1s;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(249, 115, 22, 0.3);
          box-shadow: 0 8px 24px rgba(249, 115, 22, 0.1);
        }

        .btn-primary {
          padding: 14px 32px;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.02em;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.2);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(249, 115, 22, 0.3);
        }

        .btn-secondary {
          padding: 14px 32px;
          background: transparent;
          color: #1a1a1a;
          border: 1px solid rgba(0, 0, 0, 0.14);
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.02em;
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-secondary:hover {
          background: rgba(0, 0, 0, 0.02);
          border-color: rgba(0, 0, 0, 0.24);
          transform: translateY(-2px);
        }

        .badge {
          display: inline-flex;
          align-items: center;
          padding: 6px 16px;
          background: rgba(249, 115, 22, 0.1);
          border: 1px solid rgba(249, 115, 22, 0.2);
          border-radius: 30px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #f97316;
          animation: slideInLeft 0.6s ease forwards;
        }

        .hero-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(48px, 8vw, 80px);
          font-weight: 500;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: #1a1a1a;
          margin: 24px 0 20px;
          animation: slideInRight 0.8s ease forwards;
        }

        .hero-title span {
          color: #f97316;
        }

        .hero-subtitle {
          font-size: 18px;
          line-height: 1.6;
          color: #666;
          max-width: 600px;
          margin-bottom: 32px;
          animation: slideInLeft 0.8s ease 0.2s forwards;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 40px;
          }
          .hero-subtitle {
            font-size: 16px;
          }
          .stat-card {
            padding: 12px 16px;
          }
        }
      `}</style>

      {/* Animated background */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="landing-container relative w-full">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Badge */}
            <div className={`badge ${mounted ? 'opacity-100' : 'opacity-0'}`}>
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
              </span>
              Can You Handle Complete Isolation?
            </div>

            {/* Title */}
            <h1 className="hero-title">
              The Adventure
              <span> Challenge</span>
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle mx-auto">
              Test your endurance, patience, and mental strength in total solitude — 
              and walk away with a life-changing reward.
            </p>

            {/* CTAs */}
            <div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
              style={{ 
                animation: 'scaleIn 0.6s ease 0.4s forwards',
                opacity: 0,
                animationFillMode: 'forwards'
              }}
            >
              <Link href="#apply" className="btn-primary">
                Apply Now
                <ArrowRight size={16} />
              </Link>
              <Link href="#about" className="btn-secondary">
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div 
              className="flex flex-wrap justify-center gap-4 md:gap-6"
              style={{ 
                animation: 'fadeUp 0.8s ease 0.6s forwards',
                opacity: 0,
                animationFillMode: 'forwards'
              }}
            >
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-gray-500 font-medium mb-0.5">{stat.label}</p>
                      <p className="text-sm font-semibold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}