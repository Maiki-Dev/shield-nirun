import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "../globals.css";

const manrope = Manrope({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600", "700", "800"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Удирдлага · Shield Nirun", template: "%s · Shield Nirun удирдлага" },
  icons: {
    icon: { url: "/icon.png", type: "image/png", sizes: "512x512" },
    apple: { url: "/apple-icon.png", type: "image/png", sizes: "180x180" },
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#0E161F" };

/** Admin has its own <html>: Mongolian UI, dark Framer theme (admin-theme tokens in globals.css). */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" className={`${manrope.variable} admin-theme`}>
      <body className="bg-bg text-ink antialiased">{children}</body>
    </html>
  );
}
