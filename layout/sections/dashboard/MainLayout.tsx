'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MessageCircle, X, Phone, Mail } from 'lucide-react';
import { openWhatsApp, openTelegram, whatsAppMessages } from '@/libs/utils/whatsapp';
import { useAuthStore } from '@/libs/stores/auth.store';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const supportRef = useRef<HTMLDivElement>(null);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Handle click outside support panel
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (supportRef.current && !supportRef.current.contains(e.target as Node)) {
        setSupportOpen(false);
      }
    }
    if (supportOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [supportOpen]);

  // Don't render anything if not authenticated
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <Header onMenuClick={() => setIsOpen(true)} />
      <main className="mt-16 md:ml-64 p-4 md:p-8">
        {children}
      </main>

      {/* Floating Support Button */}
      <div
        ref={supportRef}
        className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
      >
        {/* Support Panel */}
        {supportOpen && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 w-72 mb-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Contact Support
            </p>

            <div className="space-y-2">
              {/* WhatsApp General */}
              <button
                onClick={() => openWhatsApp(whatsAppMessages.support)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-green-50 border border-gray-100 hover:border-green-200 transition-colors text-left"
              >
                <div className="bg-green-100 p-2 rounded-lg shrink-0">
                  <MessageCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">WhatsApp</p>
                  <p className="text-xs text-gray-400">Chat with us now</p>
                </div>
              </button>

              {/* Telegram General */}
              <button
                onClick={() => openTelegram(whatsAppMessages.support)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 border border-gray-100 hover:border-blue-200 transition-colors text-left"
              >
                <div className="bg-blue-100 p-2 rounded-lg shrink-0">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-blue-500">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 14.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.496.969z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Telegram</p>
                  <p className="text-xs text-gray-400">Message us on Telegram</p>
                </div>
              </button>

              {/* Account Help */}
              <button
                onClick={() => openWhatsApp(
                  `Hello, I need help with my account. My email is: ${user?.email || ''}`
                )}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 border border-gray-100 hover:border-orange-200 transition-colors text-left"
              >
                <div className="bg-orange-100 p-2 rounded-lg shrink-0">
                  <Phone className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Account Help</p>
                  <p className="text-xs text-gray-400">Issues with your account</p>
                </div>
              </button>

              {/* Payment Issue */}
              <button
                onClick={() => openWhatsApp(
                  `Hello, I have a payment issue. My email is: ${user?.email || ''}`
                )}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 border border-gray-100 hover:border-blue-200 transition-colors text-left"
              >
                <div className="bg-blue-100 p-2 rounded-lg shrink-0">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Payment Issue</p>
                  <p className="text-xs text-gray-400">Problems with payment</p>
                </div>
              </button>
            </div>

            <p className="text-xs text-gray-300 text-center mt-3">
              We typically reply within minutes
            </p>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setSupportOpen((prev) => !prev)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-full shadow-lg transition-all"
        >
          {supportOpen
            ? <X className="w-5 h-5" />
            : <MessageCircle className="w-5 h-5" />
          }
          {!supportOpen && (
            <span className="text-sm font-medium pr-1">Support</span>
          )}
        </button>
      </div>
    </div>
  );
}