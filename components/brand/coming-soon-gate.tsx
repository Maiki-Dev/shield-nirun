"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLang } from "@/components/lang-provider";
import { SHIELD_PLUS } from "@/lib/content/site";

const LAUNCH = new Date(SHIELD_PLUS.launch).getTime();

/**
 * Until the Shield+ launch, shows its content blurred and non-interactive behind a "Coming soon" card.
 * From launch day the gate disappears on its own (checked in the visitor's browser, so static pages don't need a rebuild).
 */
/** True from the Shield+ launch moment on (always false during server render). */
export function useLaunched() {
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(Date.now() >= LAUNCH), []);
  return open;
}

/** Renders `before` until the Shield+ launch and `after` from launch day on (e.g. a teaser that hides what is included). */
export function LaunchSwitch({ before, after }: { before: ReactNode; after: ReactNode }) {
  return <>{useLaunched() ? after : before}</>;
}

/** Blurs inline content (e.g. a section's intro text) until launch, without the "Coming soon" card. */
export function BlurUntilLaunch({ children, className = "" }: { children: ReactNode; className?: string }) {
  const open = useLaunched();
  // <span className="block">: valid inside <p> headings/descriptions
  if (open) return <span className={`block ${className}`}>{children}</span>;
  return (
    <span aria-hidden className={`pointer-events-none block select-none blur-[8px] ${className}`}>
      {children}
    </span>
  );
}

export function ComingSoonGate({ children }: { children: ReactNode }) {
  const { t, href } = useLang();
  const open = useLaunched();

  if (open) return <>{children}</>;

  return (
    <div className="relative">
      {/* `inert` via ref: React 18 has no reliable `inert` prop; this keeps the blurred list out of tab order */}
      <div aria-hidden ref={(el) => el?.setAttribute("inert", "")} className="pointer-events-none select-none opacity-60 blur-[28px] grayscale [transform:translateZ(0)]">
        {children}
      </div>
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-md rounded-[28px] border border-line bg-card/90 p-7 text-center shadow-[0_30px_60px_-20px_rgba(11,25,44,0.35)] backdrop-blur-md sm:p-9">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-accent">
            <Sparkles className="h-6 w-6" />
          </span>
          <p className="mt-4 text-label-sm font-bold uppercase tracking-[0.2em] text-accent">{t("Тун удахгүй", "Coming soon")}</p>
          <h3 className="mt-2 text-[clamp(1.5rem,3vw,2rem)] font-semibold leading-tight tracking-tight text-ink">
            SHIELD<span className="text-[#E5243B]">+</span> {t("үйлчилгээнүүд", "services")}
          </h3>
          <p className="mt-2 text-body-md text-muted">
            {t("2026 оны 11-р сарын 11-ний 11:11 AM-д нээгдэнэ.", "Opening 11 November 2026 at 11:11 AM.")}
          </p>
          <Link
            href={href("/contact")}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-label-lg font-bold text-navy transition-colors hover:bg-brand-light"
          >
            {t("Урьдчилан мэдээлэл авах", "Get early information")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
