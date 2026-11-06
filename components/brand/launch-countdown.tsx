"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/components/lang-provider";
import { SHIELD_PLUS } from "@/lib/content/site";

const LAUNCH = new Date(SHIELD_PLUS.launch).getTime();

/** Days / hours / minutes / seconds until launch; after launch shows "Launched". Rendered client-side only, so static pages never show a stale count. */
export function LaunchCountdown() {
  const { t } = useLang();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (now !== null && now >= LAUNCH) {
    return <p className="text-headline-sm font-bold text-white">{t("Нээлтээ хийлээ", "Now launched")}</p>;
  }

  const left = now === null ? null : Math.max(0, LAUNCH - now);
  const parts = [
    { v: left === null ? null : Math.floor(left / 86_400_000), l: t("өдөр", "days") },
    { v: left === null ? null : Math.floor(left / 3_600_000) % 24, l: t("цаг", "hrs") },
    { v: left === null ? null : Math.floor(left / 60_000) % 60, l: t("мин", "min") },
    { v: left === null ? null : Math.floor(left / 1000) % 60, l: t("сек", "sec") },
  ];

  return (
    <div role="timer" aria-label={t("Нээлт хүртэл үлдсэн хугацаа", "Time left until launch")} className="grid grid-cols-4 gap-2">
      {parts.map((p) => (
        <div key={p.l} className="flex flex-col items-center rounded-2xl bg-white/[0.12] px-2 py-3 ring-1 ring-white/20 backdrop-blur-sm">
          <span className="font-mono text-[clamp(1.4rem,3vw,1.9rem)] font-bold tabular-nums leading-none text-white">
            {p.v === null ? "--" : String(p.v).padStart(2, "0")}
          </span>
          <span className="mt-1.5 text-label-sm font-semibold uppercase tracking-wider text-white/75">{p.l}</span>
        </div>
      ))}
    </div>
  );
}
