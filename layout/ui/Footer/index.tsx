"use client";

import Link from "next/link";
import { 
  ArrowRight, 
  Globe, 
  Share2, 
  Mail, 
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Phone,
  Send
} from "lucide-react";
import { useState } from "react";

// Custom SVG icons for social media (since lucide-react doesn't include brand icons)
const FacebookIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const YoutubeIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const quickLinks = [
  { label: "About", href: "#about" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Rewards", href: "#rewards" },
  { label: "Rules", href: "#rules" },
  { label: "FAQ", href: "#faq" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Participant Agreement", href: "/agreement" },
];

const socials = [
  { icon: FacebookIcon, href: "#", label: "Facebook", color: "#1877F2" },
  { icon: TwitterIcon, href: "#", label: "Twitter", color: "#1DA1F2" },
  { icon: InstagramIcon, href: "#", label: "Instagram", color: "#E4405F" },
  { icon: YoutubeIcon, href: "#", label: "Youtube", color: "#FF0000" },
];

const contactInfo = [
  { icon: MapPin, text: "123 Adventure Way, Denver, CO 80202" },
  { icon: Phone, text: "+1 (888) 424-7333" },
  { icon: Mail, text: "hello@theadventure.com" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-white border-t border-gray-100">
      <style>{`
        .footer-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 64px 32px 32px;
        }

        @media (min-width: 1440px) {
          .footer-container {
            max-width: 1400px;
            padding: 80px 48px 32px;
          }
        }

        @media (max-width: 768px) {
          .footer-container {
            padding: 48px 20px 24px;
          }
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 48px;
          margin-bottom: 48px;
        }

        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
        }

        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }

        .footer-logo {
          font-family: 'DM Serif Display', serif;
          font-size: 24px;
          color: #1a1a1a;
          letter-spacing: -0.01em;
          margin-bottom: 16px;
          display: inline-block;
        }

        .footer-logo span {
          color: #888;
        }

        .footer-description {
          font-size: 13px;
          color: #888;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .footer-heading {
          font-size: 12px;
          font-weight: 600;
          color: #1a1a1a;
          letter-spacing: 0.05em;
          margin-bottom: 20px;
          text-transform: uppercase;
        }

        .footer-link {
          display: block;
          font-size: 13px;
          color: #888;
          text-decoration: none;
          margin-bottom: 12px;
          transition: all 0.18s ease;
        }

        .footer-link:hover {
          color: #f97316;
          transform: translateX(4px);
        }

        .social-links {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .social-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(0, 0, 0, 0.06);
        }

        .social-icon:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
        }

        .contact-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #f97316;
          transition: all 0.18s ease;
        }

        .contact-item:hover .contact-icon {
          background: #f97316;
          color: white;
          transform: scale(1.1);
        }

        .contact-text {
          font-size: 13px;
          color: #888;
          line-height: 1.5;
          flex: 1;
        }

        .newsletter-input-wrapper {
          display: flex;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.18s ease;
          background: #fafafa;
        }

        .newsletter-input-wrapper:focus-within {
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
          background: white;
        }

        .newsletter-input {
          flex: 1;
          padding: 12px 16px;
          border: none;
          background: transparent;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          color: #1a1a1a;
          outline: none;
        }

        .newsletter-input::placeholder {
          color: #aaa;
        }

        .newsletter-button {
          padding: 12px 18px;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          border: none;
          cursor: pointer;
          transition: opacity 0.18s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .newsletter-button:hover {
          opacity: 0.9;
        }

        .success-message {
          margin-top: 8px;
          font-size: 12px;
          color: #10b981;
          display: flex;
          align-items: center;
          gap: 4px;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .footer-bottom {
          padding-top: 32px;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .copyright {
          font-size: 12px;
          color: #aaa;
        }

        .footer-bottom-links {
          display: flex;
          gap: 24px;
        }

        .footer-bottom-link {
          font-size: 12px;
          color: #aaa;
          text-decoration: none;
          transition: color 0.18s ease;
        }

        .footer-bottom-link:hover {
          color: #f97316;
        }

        .tagline {
          font-size: 12px;
          color: #ccc;
          font-style: italic;
        }
      `}</style>

      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <p className="footer-logo">
                Adventure<span>.</span>
              </p>
            </Link>
            <p className="footer-description">
              Pushing the boundaries of human endurance through transformative 
              isolation challenges. Discover your true potential.
            </p>
            
            {/* Contact Info */}
            <div style={{ marginTop: '24px' }}>
              {contactInfo.map((item, i) => (
                <div key={i} className="contact-item">
                  <div className="contact-icon">
                    <item.icon size={14} />
                  </div>
                  <span className="contact-text">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="social-links">
              {socials.map((social, i) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={i}
                    href={social.href}
                    className="social-icon"
                    aria-label={social.label}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = social.color;
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.borderColor = social.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f5f5f5';
                      e.currentTarget.style.color = '#666';
                      e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.06)';
                    }}
                  >
                    <IconComponent size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">Quick Links</h4>
            {quickLinks.map((link, i) => (
              <Link key={i} href={link.href} className="footer-link">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Legal */}
          <div>
            <h4 className="footer-heading">Legal</h4>
            {legalLinks.map((link, i) => (
              <Link key={i} href={link.href} className="footer-link">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="footer-heading">Stay Updated</h4>
            <p className="footer-description" style={{ marginBottom: '16px' }}>
              Get challenge updates, participant stories, and early access notifications.
            </p>
            
            <form onSubmit={handleSubscribe}>
              <div className="newsletter-input-wrapper">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="newsletter-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="newsletter-button">
                  <Send size={14} color="white" />
                </button>
              </div>
              {subscribed && (
                <div className="success-message">
                  <span>✓</span> Thanks for subscribing!
                </div>
              )}
            </form>

            <p className="tagline" style={{ marginTop: '20px' }}>
              Designed for those who dare.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="copyright">
            &copy; {new Date().getFullYear()} The Adventure Limited. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <Link href="/accessibility" className="footer-bottom-link">Accessibility</Link>
            <Link href="/sitemap" className="footer-bottom-link">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}