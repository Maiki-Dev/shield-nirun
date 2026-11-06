import type { ReactNode } from "react";

/**
 * Pass-through root layout: the real <html> lives in app/[lang]/layout.tsx so `lang` can differ per locale.
 * It must exist so the root not-found page has a layout (Next.js App Router requirement).
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
