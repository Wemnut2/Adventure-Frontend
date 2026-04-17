// src/libs/utils/whatsapp.ts

// ─── Types ─────────────────────────────────────────────────
export type SupportContact = {
  primary: string;
  secondary?: string;
};

// ─── WhatsApp ──────────────────────────────────────────────
export function openWhatsApp(message: string, phoneNumber?: string) {
  // Use provided phone number, or fall back to env variable
  const phone = phoneNumber || process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP;
  if (!phone) {
    console.error("WhatsApp number not set");
    return;
  }
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
}

// Open WhatsApp with secondary number
export function openWhatsAppSecondary(message: string) {
  const phone = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP_2;
  if (!phone) {
    console.error("Secondary WhatsApp number not set in env");
    // Fall back to primary number
    openWhatsApp(message);
    return;
  }
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
}

// ─── Telegram ──────────────────────────────────────────────
export function openTelegram(message: string, username?: string) {
  const tgUsername = username || process.env.NEXT_PUBLIC_SUPPORT_TELEGRAM;
  if (!tgUsername) {
    console.error("Telegram username not set in env");
    return;
  }
  const encoded = encodeURIComponent(message);
  window.open(`https://t.me/${tgUsername}?text=${encoded}`, "_blank");
}

// Open Telegram with secondary username
export function openTelegramSecondary(message: string) {
  const username = process.env.NEXT_PUBLIC_SUPPORT_TELEGRAM_2;
  if (!username) {
    console.error("Secondary Telegram username not set in env");
    // Fall back to primary username
    openTelegram(message);
    return;
  }
  const encoded = encodeURIComponent(message);
  window.open(`https://t.me/${username}?text=${encoded}`, "_blank");
}

// ─── Open both at once (with options) ─────────────────────
export function openSupport(message: string, options?: {
  useSecondary?: boolean;
  platform?: 'whatsapp' | 'telegram' | 'both';
}) {
  const { useSecondary = false, platform = 'both' } = options || {};
  
  if (platform === 'whatsapp' || platform === 'both') {
    if (useSecondary) {
      openWhatsAppSecondary(message);
    } else {
      openWhatsApp(message);
    }
  }
  
  if (platform === 'telegram' || platform === 'both') {
    if (useSecondary) {
      openTelegramSecondary(message);
    } else {
      openTelegram(message);
    }
  }
}

// ─── Shared message templates ──────────────────────────────
export const whatsAppMessages = {
  payment: (email: string) =>
    `Hello, I would like to pay the registration fee and insurance fee. My email is: ${email}`,
  support: "Hello, I need help with my account.",
  investment: "Hello, I have a question about my investment.",
  withdrawal: "Hello, I would like to inquire about my withdrawal.",
  general: "Hello, I need assistance.",
  updateApplication: (email: string, status: string) =>
    `Hello, I need to update my challenge application information. My email is: ${email}. Current status: ${status}.`,
};

// ─── WhatsApp shortcuts ────────────────────────────────────
export const whatsAppSupport = () => openWhatsApp(whatsAppMessages.support);
export const whatsAppInvestment = () => openWhatsApp(whatsAppMessages.investment);
export const whatsAppWithdrawal = () => openWhatsApp(whatsAppMessages.withdrawal);
export const whatsAppSupportSecondary = () => openWhatsAppSecondary(whatsAppMessages.support);

// ─── Telegram shortcuts ────────────────────────────────────
export const telegramSupport = () => openTelegram(whatsAppMessages.support);
export const telegramInvestment = () => openTelegram(whatsAppMessages.investment);
export const telegramWithdrawal = () => openTelegram(whatsAppMessages.withdrawal);
export const telegramSupportSecondary = () => openTelegramSecondary(whatsAppMessages.support);

// ─── Helper to get all available contacts ─────────────────
export function getAvailableContacts() {
  const contacts = [];
  
  if (process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP) {
    contacts.push({
      type: 'whatsapp' as const,
      label: 'WhatsApp Support',
      value: process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP,
      isPrimary: true,
    });
  }
  
  if (process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP_2) {
    contacts.push({
      type: 'whatsapp' as const,
      label: 'WhatsApp Support (Secondary)',
      value: process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP_2,
      isPrimary: false,
    });
  }
  
  if (process.env.NEXT_PUBLIC_SUPPORT_TELEGRAM) {
    contacts.push({
      type: 'telegram' as const,
      label: 'Telegram Support',
      value: process.env.NEXT_PUBLIC_SUPPORT_TELEGRAM,
      isPrimary: true,
    });
  }
  
  if (process.env.NEXT_PUBLIC_SUPPORT_TELEGRAM_2) {
    contacts.push({
      type: 'telegram' as const,
      label: 'Telegram Support (Secondary)',
      value: process.env.NEXT_PUBLIC_SUPPORT_TELEGRAM_2,
      isPrimary: false,
    });
  }
  
  return contacts;
}