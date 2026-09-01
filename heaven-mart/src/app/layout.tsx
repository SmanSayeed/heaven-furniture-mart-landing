import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Heaven Furniture Mart — Designed. Crafted. Customized.",
  description:
    "Bespoke furniture and interior styling in Chattogram. Custom sofas, beds, dining and office pieces, built around your space.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      {/*
        suppressHydrationWarning is needed on <body> because browser extensions
        (Grammarly, LastPass, ColorZilla, ...) inject attributes into <body>
        before React hydrates, which React would otherwise report as a mismatch.

        Scope: this suppresses attribute/text mismatches on THIS element only,
        one level deep. It does not hide mismatches in any child component, and
        it does not repair the DOM — so never reach for it to silence a real bug
        of our own.
      */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
