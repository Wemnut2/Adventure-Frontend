
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import AccessGate from '@/layout/AccessGate';
import { MessageCircle, X, Phone, Mail, Send } from 'lucide-react';
import {
  openWhatsApp,
  openTelegram,
  whatsAppMessages
} from '@/libs/utils/whatsapp';
import { useAuthStore } from '@/libs/stores/auth.store';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const supportRef = useRef<HTMLDivElement>(null);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Auth check
  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  // Close on outside click
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

  if (!isAuthenticated) return null;

  return (
    <AccessGate>
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <Header onMenuClick={() => setIsOpen(true)} />

      <main className="mt-16 md:ml-64 p-4 md:p-8">
        {children}
      </main>

      {/* Support */}
      <div
        ref={supportRef}
        className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
      >
        {supportOpen && (
          <div className="bg-white rounded-2xl shadow-xl border p-4 w-72 mb-1">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
              Contact Support
            </p>

            <div className="space-y-3">

              {/* WHATSAPP */}
              <div>
                <p className="text-xs text-gray-400 mb-2">WhatsApp</p>

                <button
                  onClick={() => openWhatsApp(whatsAppMessages.support)}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-green-50"
                >
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Primary</span>
                </button>

                <button
                  onClick={() =>
                    openWhatsApp(
                      whatsAppMessages.support,
                      process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP_2
                    )
                  }
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-green-50"
                >
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Secondary</span>
                </button>
              </div>

              {/* TELEGRAM */}
             {/* TELEGRAM */}
<div>
  <p className="text-xs text-gray-400 mb-2">Telegram</p>

  <button
    onClick={() => openTelegram(whatsAppMessages.support)}
    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50"
  >
    <Send className="w-4 h-4 text-blue-500" />
    <span className="text-sm">Primary</span>
  </button>

  <button
    onClick={() =>
      openTelegram(
        whatsAppMessages.support,
        process.env.NEXT_PUBLIC_SUPPORT_TELEGRAM_2
      )
    }
    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50"
  >
    <Send className="w-4 h-4 text-blue-500" />
    <span className="text-sm">Secondary</span>
  </button>
</div>

              {/* ACCOUNT HELP */}
              <button
                onClick={() =>
                  openWhatsApp(
                    `Hello, I need help with my account. My email is: ${user?.email || ''}`
                  )
                }
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 border"
              >
                <Phone className="w-4 h-4 text-orange-600" />
                <span className="text-sm">Account Help</span>
              </button>

              {/* PAYMENT */}
              <button
                onClick={() =>
                  openWhatsApp(
                    `Hello, I have a payment issue. My email is: ${user?.email || ''}`
                  )
                }
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 border"
              >
                <Mail className="w-4 h-4 text-blue-600" />
                <span className="text-sm">Payment Issue</span>
              </button>
            </div>

            <p className="text-xs text-gray-300 text-center mt-3">
              Choose your preferred contact
            </p>
          </div>
        )}

        {/* Toggle */}
        <button
          onClick={() => setSupportOpen((prev) => !prev)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-full shadow-lg"
        >
          {supportOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <>
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">Support</span>
            </>
          )}
        </button>
      </div>
    </div>
    </AccessGate>
  );
}