// components/sections/Footer.tsx
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold tracking-tight">The Adventure</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Pushing human limits through transformative challenges.
            </p>
            <div className="flex gap-3">
              <ArrowRight className="w-4 h-4 text-gray-400 hover:text-orange-500 transition-colors cursor-pointer" />
              <ArrowRight className="w-4 h-4 text-gray-400 hover:text-orange-500 transition-colors cursor-pointer" />
              <ArrowRight className="w-4 h-4 text-gray-400 hover:text-orange-500 transition-colors cursor-pointer" />
              <ArrowRight className="w-4 h-4 text-gray-400 hover:text-orange-500 transition-colors cursor-pointer" />
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#about" className="hover:text-orange-500 transition-colors">About</Link></li>
              <li><Link href="#how-it-works" className="hover:text-orange-500 transition-colors">How It Works</Link></li>
              <li><Link href="#rewards" className="hover:text-orange-500 transition-colors">Rewards</Link></li>
              <li><Link href="#faq" className="hover:text-orange-500 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Cookie Policy</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Participant Agreement</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Stay Updated</h4>
            <p className="text-sm text-gray-400 mb-3">
              Get challenge updates and early access notifications.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 text-sm bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
              />
              <button className="px-3 py-2 bg-orange-500 hover:bg-orange-600 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500">
          <p>&copy; 2024 The Adventure Limited. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}