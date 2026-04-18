"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, TrendingUp } from "lucide-react";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Rewards", href: "#rewards" },
  { name: "Rules", href: "#rules" },
  { name: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Google Font import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');

        .navbar {
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 50;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: 'DM Sans', sans-serif;
          background: #ffffff;
        }

        .navbar.scrolled {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
        }

        .navbar-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }

        @media (min-width: 768px) {
          .navbar-container {
            padding: 0 32px;
          }
        }

        @media (min-width: 1024px) {
          .navbar-container {
            padding: 0 40px;
          }
        }

        .navbar-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
        }

        .logo-link {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }

        .logo-icon {
          width: 24px;
          height: 24px;
          color: #f97316;
        }

        .logo-text {
          font-family: 'DM Serif Display', serif;
          font-size: 18px;
          font-weight: 500;
          color: #1a1a1a;
          letter-spacing: -0.01em;
        }

        .logo-text span {
          color: #888;
        }

        .desktop-nav {
          display: none;
        }

        @media (min-width: 768px) {
          .desktop-nav {
            display: flex;
            align-items: center;
            gap: 32px;
          }
        }

        .nav-link {
          font-size: 13px;
          font-weight: 500;
          color: #6b6b6b;
          text-decoration: none;
          transition: color 0.18s ease;
          letter-spacing: 0.01em;
        }

        .nav-link:hover {
          color: #f97316;
        }

        .desktop-buttons {
          display: none;
        }

        @media (min-width: 768px) {
          .desktop-buttons {
            display: flex;
            align-items: center;
            gap: 12px;
          }
        }

        .btn-outline {
          padding: 8px 20px;
          font-size: 13px;
          font-weight: 500;
          color: #1a1a1a;
          background: transparent;
          border: 1px solid rgba(0, 0, 0, 0.14);
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.18s ease;
          letter-spacing: 0.02em;
        }

        .btn-outline:hover {
          background: rgba(0, 0, 0, 0.03);
          border-color: rgba(0, 0, 0, 0.24);
        }

        .btn-primary {
          padding: 8px 24px;
          font-size: 13px;
          font-weight: 500;
          color: #ffffff;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          border: none;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.18s ease;
          letter-spacing: 0.02em;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .btn-primary:hover {
          opacity: 0.88;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(249, 115, 22, 0.15);
        }

        .btn-primary:active {
          transform: translateY(0);
        }

        .mobile-menu-btn {
          display: flex;
          padding: 8px;
          background: none;
          border: none;
          cursor: pointer;
          color: #6b6b6b;
          transition: color 0.18s ease;
        }

        .mobile-menu-btn:hover {
          color: #1a1a1a;
        }

        @media (min-width: 768px) {
          .mobile-menu-btn {
            display: none;
          }
        }

        .mobile-menu {
          position: absolute;
          top: 64px;
          left: 0;
          width: 100%;
          background: #ffffff;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          animation: slideDown 0.2s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mobile-menu-content {
          display: flex;
          flex-direction: column;
          padding: 20px 24px;
          gap: 8px;
        }

        .mobile-nav-link {
          padding: 10px 0;
          font-size: 14px;
          font-weight: 500;
          color: #6b6b6b;
          text-decoration: none;
          transition: color 0.18s ease;
        }

        .mobile-nav-link:hover {
          color: #f97316;
        }

        .mobile-divider {
          margin: 12px 0;
          height: 1px;
          background: rgba(0, 0, 0, 0.08);
        }

        .mobile-btn-outline {
          padding: 10px 20px;
          font-size: 13px;
          font-weight: 500;
          color: #1a1a1a;
          background: transparent;
          border: 1px solid rgba(0, 0, 0, 0.14);
          border-radius: 10px;
          text-decoration: none;
          text-align: center;
          transition: all 0.18s ease;
        }

        .mobile-btn-outline:hover {
          background: rgba(0, 0, 0, 0.03);
          border-color: rgba(0, 0, 0, 0.24);
        }

        .mobile-btn-primary {
          padding: 10px 20px;
          font-size: 13px;
          font-weight: 500;
          color: #ffffff;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          border: none;
          border-radius: 10px;
          text-decoration: none;
          text-align: center;
          transition: all 0.18s ease;
        }

        .mobile-btn-primary:hover {
          opacity: 0.88;
          transform: translateY(-1px);
        }
      `}</style>

      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <div className="navbar-content">
            {/* Logo */}
            <Link href="/" className="logo-link">
              <TrendingUp className="logo-icon" />
              <span className="logo-text">
                Adventure<span>.</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="desktop-nav">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="nav-link"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Desktop Buttons */}
            <div className="desktop-buttons">
              <Link href="/login" className="btn-outline">
                Log In
              </Link>
              <Link href="/register" className="btn-primary">
                Sign Up
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="mobile-menu-btn"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="mobile-menu">
              <div className="mobile-menu-content">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="mobile-nav-link"
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="mobile-divider" />

                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="mobile-btn-outline"
                >
                  Log In
                </Link>

                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="mobile-btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}