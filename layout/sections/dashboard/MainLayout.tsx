// src/layout/sections/dashboard/MainLayout.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MessageCircle, X } from 'lucide-react';
import { openWhatsApp, openTelegram, whatsAppMessages } from '@/libs/utils/whatsapp';
import { useAuthStore } from '@/libs/stores/auth.store';
import { DASH_STYLES } from '@/app/styles/dashboardStyles';

function WaIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.33 4.94L2.05 22l5.32-1.4c1.46.8 3.11 1.22 4.81 1.22 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.91-9.91-9.91z"/>
    </svg>
  );
}

function TgIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.2c-.06-.06-.15-.04-.22-.02-.09.02-1.55.99-4.37 2.89-.41.28-.79.42-1.12.41-.37-.01-1.08-.21-1.61-.38-.65-.21-1.16-.32-1.12-.68.02-.19.28-.38.78-.58 3.04-1.32 5.07-2.19 6.09-2.62 2.9-1.21 3.5-1.42 3.89-1.42.09 0 .28.02.4.12.1.08.13.19.14.27-.01.06-.01.13-.02.2z"/>
    </svg>
  );
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  const router        = useRouter();
  const [isOpen, setIsOpen]         = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const user           = useAuthStore(s => s.user);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const supportRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (supportRef.current && !supportRef.current.contains(e.target as Node)) {
        setSupportOpen(false);
      }
    }
    if (supportOpen) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [supportOpen]);

  if (!isAuthenticated) return null;

  const contacts = [
    { label: 'WhatsApp',  sub: 'Primary',   icon: <WaIcon />, action: () => openWhatsApp(whatsAppMessages.support) },
    { label: 'WhatsApp',  sub: 'Secondary',  icon: <WaIcon />, action: () => openWhatsApp(whatsAppMessages.support, process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP_2) },
    { label: 'Telegram',  sub: 'Primary',   icon: <TgIcon />, action: () => openTelegram(whatsAppMessages.support) },
    { label: 'Telegram',  sub: 'Secondary',  icon: <TgIcon />, action: () => openTelegram(whatsAppMessages.support, process.env.NEXT_PUBLIC_SUPPORT_TELEGRAM_2) },
    { label: 'Account Help',   sub: 'Via WhatsApp', icon: <WaIcon />, action: () => openWhatsApp(`Hello, I need help with my account. Email: ${user?.email || ''}`) },
    { label: 'Payment Issue',  sub: 'Via WhatsApp', icon: <WaIcon />, action: () => openWhatsApp(`Hello, I have a payment issue. Email: ${user?.email || ''}`) },
  ];

  return (
    <div style={{ minHeight:'100vh', background:'#f5f5f5' }}>
      <style>{DASH_STYLES}</style>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <Header onMenuClick={() => setIsOpen(true)} />

      <main style={{ marginTop:58, paddingLeft: undefined }} className="md:ml-64 p-4 md:p-8">
        {children}
      </main>

      {/* FAB Support */}
      <div
        ref={supportRef}
        style={{ position:'fixed', bottom:24, right:24, zIndex:50, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:10 }}
      >
        {supportOpen && (
          <div className="ds-support-popup">
            <p className="ds-support-title">Contact Support</p>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {contacts.map((c, i) => (
                <button key={i} className="ds-contact-btn" onClick={() => { c.action(); setSupportOpen(false); }}>
                  <span className="ds-contact-icon">{c.icon}</span>
                  <span>
                    <span style={{ display:'block', fontSize:12.5, fontWeight:500 }}>{c.label}</span>
                    <span style={{ display:'block', fontSize:11, color:'#bbb', marginTop:1 }}>{c.sub}</span>
                  </span>
                  <span className="ds-contact-arrow">›</span>
                </button>
              ))}
            </div>
            <p style={{ fontSize:11, color:'#ddd', textAlign:'center', marginTop:12 }}>Choose your preferred platform</p>
          </div>
        )}

        <button className="ds-fab" onClick={() => setSupportOpen(p => !p)}>
          {supportOpen ? <X size={16} /> : <><MessageCircle size={16} /> Support</>}
        </button>
      </div>
    </div>
  );
}