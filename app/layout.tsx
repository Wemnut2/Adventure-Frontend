import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/libs/providers/QueryProvider";
import { ToastProvider } from "@/libs/src/contexts/ToastContext";
// import ConditionalAccessGate from "@/layout/ConditionalAccessGate";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});  

export const metadata: Metadata = {
  title: "Adventure Challenge - Grow Your Wealth Intelligently",
  description:
    "Adventure Challenge is a modern investment platform that empowers you to grow your wealth through smart task completion, automated investing, and real-time portfolio management.",
  keywords: [
    "investment platform",
    "wealth management",
    "portfolio",
    "investing",
    "finance",
  ],
  openGraph: {
    title: "Adventure Challenge — Grow Your Wealth Intelligently",
    description: "Smart investing and task-based earning on one platform.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <ToastProvider>
            {/* <ConditionalAccessGate>{children}</ConditionalAccessGate> */}
            {children}
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}