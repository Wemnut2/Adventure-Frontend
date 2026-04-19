// src/app/(landing)/HeroSection.tsx
'use client';

import Link from 'next/link';
import { Clock, Award, Shield, ArrowRight } from 'lucide-react';

export default function HeroSection() {

  const stats = [
    { icon: Clock,  label: 'Duration', value: 'Up to 30+ days'          },
    { icon: Award,  label: 'Prize',    value: 'Life-changing Grand Prize' },
    { icon: Shield, label: 'Support',  value: '24/7 Medical Support'      },
  ];

  return (
    <section style={{ position:'relative', minHeight:'90vh', display:'flex', alignItems:'center', background:'#fff', overflow:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');

        .hero-root * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }

        /* Grid bg */
        .hero-grid-bg {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(to right,  rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          opacity: 0.4;
        }
        /* Radial glow */
        .hero-glow {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(circle at 20% 30%, rgba(249,115,22,0.07) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(249,115,22,0.04) 0%, transparent 50%);
        }

        /* Badge */
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 16px;
          background: rgba(249,115,22,0.08); border: 1px solid rgba(249,115,22,0.18);
          border-radius: 30px; font-size: 11px; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase; color: #f97316;
          animation: heroFadeUp .6s ease forwards;
        }
        .hero-badge-dot {
          position: relative; width: 7px; height: 7px;
        }
        .hero-badge-dot-inner {
          position: absolute; inset: 0; border-radius: 50%; background: #f97316;
        }
        .hero-badge-dot-ping {
          position: absolute; inset: 0; border-radius: 50%;
          background: rgba(249,115,22,0.4); animation: heroPing 1.4s ease infinite;
        }
        @keyframes heroPing { 75%, 100% { transform: scale(2); opacity: 0; } }

        /* Title */
        .hero-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(44px, 8vw, 78px);
          font-weight: 500; line-height: 1.08; letter-spacing: -0.025em;
          color: #1a1a1a; margin: 22px 0 18px;
          animation: heroSlideRight .8s ease forwards;
        }
        .hero-title-accent { color: #f97316; }

        /* Subtitle */
        .hero-sub {
          font-size: 17px; line-height: 1.65; color: #888;
          max-width: 580px; margin: 0 auto 32px;
          animation: heroFadeUp .8s ease .2s forwards; opacity: 0;
        }

        /* CTA buttons */
        .hero-cta-group {
          display: flex; flex-wrap: wrap; gap: 12px; justify-content: center;
          margin-bottom: 64px;
          animation: heroFadeUp .6s ease .4s forwards; opacity: 0;
        }
        .hero-btn-primary {
          padding: 13px 30px;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: #fff; border: none; border-radius: 12px;
          font-size: 13.5px; font-weight: 500; letter-spacing: 0.02em;
          text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(249,115,22,0.25);
          transition: opacity .18s, transform .18s, box-shadow .18s;
        }
        .hero-btn-primary:hover { opacity:.9; transform:translateY(-2px); box-shadow:0 8px 20px rgba(249,115,22,0.28); }

        .hero-btn-ghost {
          padding: 13px 30px;
          background: transparent; color: #1a1a1a;
          border: 1px solid rgba(0,0,0,0.12); border-radius: 12px;
          font-size: 13.5px; font-weight: 500; letter-spacing: 0.02em;
          text-decoration: none;
          transition: background .18s, border-color .18s, transform .18s;
        }
        .hero-btn-ghost:hover { background:rgba(0,0,0,0.02); border-color:rgba(0,0,0,0.22); transform:translateY(-2px); }

        /* Stat cards */
        .hero-stats {
          display: flex; flex-wrap: wrap; justify-content: center; gap: 14px;
          animation: heroFadeUp .8s ease .6s forwards; opacity: 0;
        }
        .hero-stat-card {
          display: flex; align-items: center; gap: 12px;
          background: #fff; border: 1px solid rgba(0,0,0,0.08);
          border-radius: 13px; padding: 14px 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          animation: heroFloat 6s ease-in-out infinite;
          transition: border-color .2s, box-shadow .2s, transform .2s;
        }
        .hero-stat-card:hover { border-color:rgba(249,115,22,0.25); box-shadow:0 6px 20px rgba(249,115,22,0.08); transform:translateY(-3px); }
        .hero-stat-card:nth-child(2) { animation-delay:.5s; }
        .hero-stat-card:nth-child(3) { animation-delay:1s; }
        .hero-stat-icon {
          width: 38px; height: 38px; border-radius: 10px;
          background: rgba(249,115,22,0.08);
          display: flex; align-items: center; justify-content: center; flex-shrink:0;
        }
        .hero-stat-label { font-size: 11px; color: #aaa; font-weight: 500; margin-bottom: 3px; }
        .hero-stat-value { font-size: 13px; font-weight: 600; color: #1a1a1a; }

        /* Animations */
        @keyframes heroFadeUp   { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        @keyframes heroSlideRight { from { opacity:0; transform:translateX(-20px) } to { opacity:1; transform:translateX(0) } }
        @keyframes heroFloat { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-8px) } }

        @media (max-width: 640px) {
          .hero-title { font-size: 40px; }
          .hero-sub    { font-size: 15px; }
          .hero-stat-card { padding: 12px 14px; }
        }
      `}</style>

      <div className="hero-glow" />
      <div className="hero-grid-bg" />

      <div className="hero-root" style={{ position:'relative', width:'100%', maxWidth:1200, margin:'0 auto', padding:'0 24px', textAlign:'center' }}>

        {/* Badge */}
        <div className={`hero-badge`}>
          <span className="hero-badge-dot">
            <span className="hero-badge-dot-ping" />
            <span className="hero-badge-dot-inner" />
          </span>
          Can You Handle Complete Isolation?
        </div>

        {/* Title */}
        <h1 className="hero-title">
          The Adventure<br />
          <span className="hero-title-accent">Challenge</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-sub">
          Test your endurance, patience, and mental strength in total solitude —
          and walk away with a life-changing reward.
        </p>

        {/* CTAs */}
        <div className="hero-cta-group">
          <Link href="/apply" className="hero-btn-primary">
            Apply Now <ArrowRight size={15} />
          </Link>
          <Link href="/about" className="hero-btn-ghost">
            Learn More
          </Link>
        </div>

        {/* Stats */}
        <div className="hero-stats">
          {stats.map((s, i) => (
            <div key={i} className="hero-stat-card">
              <div className="hero-stat-icon">
                <s.icon size={17} color="#f97316" />
              </div>
              <div style={{ textAlign:'left' }}>
                <p className="hero-stat-label">{s.label}</p>
                <p className="hero-stat-value">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}