import React from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Dossier.nl | Voldoe aan de AI Act zonder gedoe",
  description: "Hét Nederlandse compliance-dashboard voor HR en ondernemers.",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      {/* 'font-sans' zonder extra variabelen gebruikt nu het systeem-font */}
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
