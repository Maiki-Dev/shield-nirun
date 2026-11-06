import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

/** Primary CTA: cyan pill with a navy arrow disc (same as the home hero). */
export function PillButton({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-3 rounded-full bg-brand py-1.5 pl-6 pr-1.5 text-label-lg font-bold text-navy transition-colors hover:bg-brand-light ${className}`}
    >
      {children}
      <span className="grid h-10 w-10 place-items-center rounded-full bg-navy text-white">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </Link>
  );
}
