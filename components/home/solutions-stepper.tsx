"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CircleCheck, Plus } from "lucide-react";
import { homeContent } from "@/lib/content/home";
import { useLang } from "@/components/lang-provider";

/**
 * Shield+ solutions as an accordion of "step" cards: the open one expands into a dark card with a
 * large gradient index; the rest collapse into rows. Keyed re-mount replays the pop/num animations.
 */
export function SolutionsStepper() {
  const { lang, t, href } = useLang();
  const { SOLUTIONS } = homeContent(lang);
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-2.5">
      {SOLUTIONS.map((s, i) => {
        const no = String(i + 1).padStart(2, "0");
        const id = `solution-panel-${s.id}`;

        if (i !== active) {
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(i)}
              aria-expanded={false}
              aria-controls={id}
              className="sn-lift group flex w-full items-center justify-between gap-4 rounded-[24px] border border-line bg-card px-5 py-5 text-left sm:px-7"
            >
              <span className="flex min-w-0 items-center gap-4 sm:gap-6">
                <span className="text-label-lg font-bold tabular-nums text-accent">{no}/</span>
                <span className="truncate text-headline-sm font-semibold text-ink sm:text-[1.35rem]">{s.title}</span>
                <span className="hidden truncate text-body-sm text-muted md:inline">{s.tag}</span>
              </span>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-ink transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                <Plus className="h-5 w-5" />
              </span>
            </button>
          );
        }

        return (
          <article
            key={`${s.id}-open`}
            id={id}
            aria-label={`${no}. ${s.title}`}
            className="sn-pop relative overflow-hidden rounded-[30px] bg-navy p-[clamp(28px,4vw,44px)] text-white dark:border dark:border-line dark:bg-card"
          >
            <s.icon aria-hidden className="pointer-events-none absolute -right-6 -top-6 h-48 w-48 text-white/[0.04]" />
            <div className="relative flex flex-wrap items-end gap-x-12 gap-y-8">
              <div className="min-w-[240px] flex-1">
                <span className="sn-num sn-grad-num block text-[clamp(4.5rem,10vw,7.5rem)] font-bold leading-[0.9] tracking-tight">
                  {no}
                </span>
                <h3 className="mt-5 text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-tight tracking-tight">{s.title}</h3>
                <p className="mt-1 text-label-md uppercase tracking-widest text-brand-light">{s.tag}</p>
              </div>
              <div className="min-w-[260px] flex-1">
                <p className="text-body-lg text-slate-300">{s.description}</p>
                <ul className="mt-5 flex flex-col gap-2.5">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-body-md text-slate-200">
                      <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-light" /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={href(s.href)}
                  className="mt-7 inline-flex items-center gap-3 rounded-full bg-white py-1.5 pl-5 pr-1.5 text-label-lg font-bold text-navy transition-colors hover:bg-brand-light"
                >
                  {t("Дэлгэрэнгүй үзэх", "View details")}
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-navy text-white">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
