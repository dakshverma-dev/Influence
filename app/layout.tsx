import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AppStateProvider } from "@/components/providers/app-state-provider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vibely",
  description: "AI-powered creator-brand matchmaking MVP",
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
      <body className="min-h-full bg-[var(--canvas)] text-[var(--ink)]">
        <AppStateProvider>{children}</AppStateProvider>
      </body>
    </html>
  );
}
