// src/libs/utils/whatsapp.ts

// ── WhatsApp ──────────────────────────────────────────────
export function openWhatsApp(message: string) {
  const phone = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP;
  if (!phone) {
    console.error("WhatsApp number not set in env");
    return;
  }
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
}

// ── Telegram ──────────────────────────────────────────────
export function openTelegram(message: string) {
  const username = process.env.NEXT_PUBLIC_SUPPORT_TELEGRAM;
  if (!username) {
    console.error("Telegram username not set in env");
    return;
  }
  const encoded = encodeURIComponent(message);
  window.open(`https://t.me/${username}?text=${encoded}`, "_blank");
}

// ── Open both at once ─────────────────────────────────────
export function openSupport(message: string) {
  openWhatsApp(message);
  openTelegram(message);
}

// ── Shared message templates ──────────────────────────────
export const whatsAppMessages = {
  payment: (email: string) =>
    `Hello, I would like to pay the registration fee and insurance fee. My email is: ${email}`,
  support:    "Hello, I need help with my account.",
  investment: "Hello, I have a question about my investment.",
  withdrawal: "Hello, I would like to inquire about my withdrawal.",
  general:    "Hello, I need assistance.",
};

// ── WhatsApp shortcuts ────────────────────────────────────
export const whatsAppSupport    = () => openWhatsApp(whatsAppMessages.support);
export const whatsAppInvestment = () => openWhatsApp(whatsAppMessages.investment);
export const whatsAppWithdrawal = () => openWhatsApp(whatsAppMessages.withdrawal);

// ── Telegram shortcuts ────────────────────────────────────
export const telegramSupport    = () => openTelegram(whatsAppMessages.support);
export const telegramInvestment = () => openTelegram(whatsAppMessages.investment);
export const telegramWithdrawal = () => openTelegram(whatsAppMessages.withdrawal);