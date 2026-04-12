'use client';
import { useState, useRef, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
// import AccessGate from '@/layout/AccessGate';
import { MessageCircle, X, Phone, Mail } from 'lucide-react';
import { openWhatsApp, whatsAppMessages } from '@/libs/utils/whatsapp';
import { useAuthStore } from '@/libs/stores/auth.store';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const supportRef = useRef<HTMLDivElement>(null); // ← ADD

  // Close when clicking outside
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

  return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        <Header onMenuClick={() => setIsOpen(true)} />
        <main className="mt-16 md:ml-64 p-4 md:p-8">
          {children}
        </main>

        {/* Floating Support Button */}
        <div
          ref={supportRef} // ← ADD ref here
          className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
        >
          {supportOpen && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 w-64 mb-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Contact Support
              </p>
              <div className="space-y-2">
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