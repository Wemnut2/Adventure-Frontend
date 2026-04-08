// components/layout/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, TrendingUp, LogIn, UserPlus } from "lucide-react";

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
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-white"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-orange-500" />
            <span className="font-bold text-lg tracking-tight">
              The Adventure
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors">
              Log In
            </button>
            <button className="px-5 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-sm">
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b shadow-lg">
            <div className="flex flex-col p-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-gray-700 hover:text-orange-500 py-2 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <hr className="my-2" />
              <button className="w-full py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors">
                Log In
              </button>
              <button className="w-full py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors">
                Sign Up
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}