import type { ReactNode } from "react";
import type { LeadStatus } from "@prisma/client";

/** Shared building blocks for admin pages (server-safe). */

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-[clamp(1.6rem,2.6vw,2rem)] font-semibold tracking-tight text-ink">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-body-md text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, children, className = "", actions }: { title?: string; children: ReactNode; className?: string; actions?: ReactNode }) {
  return (
    <section className={`rounded-[22px] bg-card p-5 sm:p-6 ${className}`}>
      {(title || actions) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="text-[1.1rem] font-semibold tracking-tight text-ink">{title}</h2>}
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

export const STATUS_LABEL: Record<LeadStatus, string> = {
  NEW: "Шинэ",
  IN_PROGRESS: "Хийгдэж буй",
  DONE: "Дууссан",
  SPAM: "Спам",
};

const STATUS_CLS: Record<LeadStatus, string> = {
  NEW: "bg-accent/15 text-accent",
  IN_PROGRESS: "bg-amber-400/15 text-amber-300",
  DONE: "bg-emerald-400/15 text-emerald-300",
  SPAM: "bg-slate-400/15 text-slate-300",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-label-sm font-bold ${STATUS_CLS[status]}`}>{STATUS_LABEL[status]}</span>;
}

export const SOURCE_LABEL = { CONTACT: "Холбоо барих", DEMO: "Үнэгүй хэмжилт" } as const;

export function Empty({ children }: { children: ReactNode }) {
  return <p className="rounded-2xl bg-soft/60 px-6 py-10 text-center text-body-md text-muted">{children}</p>;
}

/** Ulaanbaatar-time date like "2026.11.06 14:05". */
export function fmtDate(d: Date) {
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ulaanbaatar", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(d);
  const g = (t: string) => p.find((x) => x.type === t)?.value;
  return `${g("year")}.${g("month")}.${g("day")} ${g("hour")}:${g("minute")}`;
}

export const inputCls = "input !h-11";
export const btn = "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-label-lg font-bold transition-colors disabled:opacity-60";
export const btnPrimary = `${btn} bg-accent text-navy hover:brightness-110`;
export const btnGhost = `${btn} bg-soft text-ink hover:bg-soft2`;
export const btnDanger = `${btn} bg-red-500/10 text-red-300 hover:bg-red-500/20`;
