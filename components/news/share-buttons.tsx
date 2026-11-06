"use client";

import { useState } from "react";
import { Check, Facebook, Link2 } from "lucide-react";
import { useLang } from "@/components/lang-provider";

export function ShareButtons({ title }: { title: string }) {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);
  const url = typeof window === "undefined" ? "" : window.location.href;
  const cls = "inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-label-md font-semibold text-ink transition-colors hover:border-brand hover:text-accent";
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-label-sm font-bold uppercase tracking-wider text-muted">{t("Хуваалцах", "Share")}</span>
      <a
        className={cls}
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          e.currentTarget.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
        }}
      >
        <Facebook className="h-4 w-4" /> Facebook
      </a>
      <button
        type="button"
        className={cls}
        onClick={async () => {
          if (navigator.share) await navigator.share({ title, url: window.location.href }).catch(() => {});
          else {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          }
        }}
      >
        {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Link2 className="h-4 w-4" />} {copied ? t("Хуулсан", "Copied") : t("Холбоос", "Link")}
      </button>
    </div>
  );
}
