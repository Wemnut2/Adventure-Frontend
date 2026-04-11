import Link from "next/link";
import { ArrowRight, Globe, Share2, Mail, ArrowUpRight } from "lucide-react";

const quickLinks = [
  { label: "About", href: "#about" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Rewards", href: "#rewards" },
  { label: "FAQ", href: "#faq" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Cookie Policy", href: "#" },
  { label: "Participant Agreement", href: "#" },
];

const socials = [
  { icon: Globe, href: "#", label: "Website" },
  { icon: Share2, href: "#", label: "Social" },
  { icon: Mail, href: "#", label: "Email" },
  { icon: ArrowUpRight, href: "#", label: "More" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
     <div className="container-custom py-14 px-4 md:px-6 lg:px-8">\
      <div className="px-4 md:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <p className="text-lg font-bold tracking-tight mb-3">
              The <span className="text-orange-500">Adventure Challenge</span>
            </p>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Pushing human limits through transformative challenges.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }, i) => (
                <Link
                  key={i}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 bg-gray-800 hover:bg-orange-500 border border-gray-700 hover:border-orange-500 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Icon className="w-3.5 h-3.5 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-2.5">
              {legalLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold mb-2 text-white">Stay Updated</h4>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Get challenge updates and early access notifications.
            </p>
            <div className="flex rounded-lg overflow-hidden border border-gray-700 focus-within:border-orange-500 transition-colors">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2.5 text-sm bg-gray-800 text-white placeholder-gray-500 focus:outline-none"
              />
              <button className="px-3 py-2.5 bg-orange-500 hover:bg-orange-600 transition-colors flex-shrink-0">
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} The Adventure Limited. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Designed for those who dare.
          </p>
        </div>
        </div>
      </div>
    </footer>
  );
}