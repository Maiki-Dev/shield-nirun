/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { localize, tr, type Lang } from "@/lib/i18n";

interface PageHeroProps {
  lang: Lang;
  /** Breadcrumb label for the current page. */
  crumb: string;
  /** Optional intermediate breadcrumb (e.g. Products for a product detail page). */
  parent?: { label: string; href: string };
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}

/** Dark page hero shared by inner pages (matches the home hero; the content sheet overlaps its bottom). */
export function PageHero({ lang, crumb, parent, eyebrow, title, description, children }: PageHeroProps) {
  const t = tr(lang);
  return (
    <section className="dark relative -mt-20 overflow-hidden bg-[#070F19] pb-[calc(4rem+5rem)] pt-[calc(5rem+3rem)] text-ink lg:pb-[calc(4rem+6rem)] lg:pt-[calc(5rem+4.5rem)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_80%_100%,rgba(0,180,216,0.28)_0%,rgba(0,180,216,0)_70%)]" />
      <img
        src="/images/mark-silhouette.png"
        alt=""
        aria-hidden
        className="sn-mark pointer-events-none absolute left-[78%] top-[-10%] w-[min(620px,90vw)] max-w-none -translate-x-1/2 opacity-[0.05] will-change-transform"
      />
      <div className="container-x relative">
        <nav aria-label={t("Байршил", "Breadcrumb")} className="sn-fade mb-8 flex items-center gap-1 text-label-md text-slate-400">
          <Link href={localize(lang, "/")} className="transition-colors hover:text-white">{t("Нүүр хуудас", "Home")}</Link>
          <ChevronRight className="h-4 w-4" />
          {parent && (
            <>
              <Link href={localize(lang, parent.href)} className="transition-colors hover:text-white">{parent.label}</Link>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
          <span className="text-slate-200" aria-current="page">{crumb}</span>
        </nav>
        <span className="sn-fade inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-1.5 pr-4 text-label-md text-slate-300">
          <img src="/images/mark.png" alt="" aria-hidden className="h-6 w-6" />
          {eyebrow}
        </span>
        <h1 className="sn-fade mt-6 max-w-4xl text-[clamp(2.4rem,6vw,4.5rem)] font-semibold leading-[1.03] tracking-[-0.035em] text-white">
          {title}
        </h1>
        {description && <p className="sn-fade mt-6 max-w-2xl text-body-lg text-slate-400">{description}</p>}
        {children && <div className="sn-fade mt-9">{children}</div>}
      </div>
    </section>
  );
}

/** Light content sheet with 40px top radius that overlaps the dark hero. */
export function Sheet({ children }: { children: ReactNode }) {
  return <div className="relative z-[3] -mt-16 overflow-x-clip rounded-t-[40px] bg-sheet">{children}</div>;
}

/** Big section heading used inside sheets. */
export function SheetHeading({
  eyebrow,
  title,
  description,
  center = false,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  center?: boolean;
}) {
  return (
    <div className={`mb-10 flex flex-col gap-4 ${center ? "mx-auto max-w-3xl items-center text-center" : "md:flex-row md:items-end md:justify-between"}`}>
      <div className={center ? "" : "max-w-2xl"}>
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="mt-4 text-[clamp(2.1rem,5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.025em] text-ink">{title}</h2>
      </div>
      {description && <p className={`text-body-md text-muted ${center ? "" : "max-w-sm"}`}>{description}</p>}
    </div>
  );
}
