import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PathForge — AI Onboarding Engine",
  description: "AI-powered personalized learning pathway generator",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}