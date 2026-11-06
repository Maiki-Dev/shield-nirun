import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "../globals.css";

const manrope = Manrope({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600", "700", "800"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Удирдлага", template: "%s · Shield Nirun удирдлага" },
  robots: { index: false, follow: false },
};

/** Admin has its own <html>: Mongolian UI, dark Framer theme (admin-theme tokens in globals.css). */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" className={`${manrope.variable} admin-theme`}>
      <body className="bg-bg text-ink antialiased">{children}</body>
    </html>
  );
}
