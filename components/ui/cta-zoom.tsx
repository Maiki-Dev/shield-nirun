/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowUpRight, Phone } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { getContact } from "@/lib/site-data";
import { localize, tr, type Lang } from "@/lib/i18n";

/* ------------------------------------------------------------------ CTA (zooms in on scroll) */

export async function CtaZoom({
  lang,
  title,
  text,
}: {
  lang: Lang;
  title?: React.ReactNode;
  text?: string;
}) {
  const t = tr(lang);
  const C = await getContact(lang);
  title ??= (
    <>
      {t("Тайван ажилла.", "Work with peace of mind.")} <span className="text-brand-light">{t("Бид хамгаална.", "We've got you covered.")}</span>
    </>
  );
  text ??= t(
    "Манай инженер объектыг тань судалж, тохирох тоног төхөөрөмж болон системийн төсвийг гаргаж өгнө.",
    "Our engineers survey your site and prepare the right equipment and a system budget for it.",
  );
  return (
    <section className="px-4 pb-16 sm:px-6">
      <Reveal
        variant="zoom"
        className="dark relative mx-auto flex max-w-[1200px] flex-wrap items-center gap-10 overflow-hidden rounded-[40px] bg-[#0B1724] p-[clamp(32px,5vw,64px)] text-ink"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_100%_100%,rgba(0,180,216,0.28)_0%,rgba(0,180,216,0)_70%)]" />
        <div className="relative min-w-[280px] flex-[1_1_480px]">
          <h2 className="text-[clamp(2.4rem,6vw,4.75rem)] font-semibold leading-[1] tracking-[-0.035em] text-white">
            {title}
          </h2>
          <p className="mt-5 max-w-lg text-body-lg text-slate-400">{text}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={localize(lang, "/contact")}
              className="inline-flex items-center justify-center gap-3 rounded-full bg-brand py-1.5 pl-6 pr-1.5 text-label-lg font-bold text-navy transition-colors hover:bg-brand-light"
            >
              {t("Хүсэлт илгээх", "Send a request")}
              <span className="grid h-10 w-10 place-items-center rounded-full bg-navy text-white">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
            <a
              href={C.phoneHref}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-label-lg font-semibold text-white hover:border-white/40"
            >
              <Phone className="h-4 w-4" /> {C.phone}
            </a>
          </div>
        </div>

        {/* "camera frame" with a scanning line */}
        <div className="relative mx-auto aspect-square w-full max-w-[300px] flex-[0_1_300px]">
          <div className="absolute inset-0 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03]">
            <div className="sn-scan absolute left-0 right-0 h-1/3 bg-gradient-to-b from-transparent via-brand/25 to-transparent" />
            <img src="/images/mark.png" alt="" aria-hidden className="sn-float absolute left-1/2 top-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          {["left-0 top-0 border-l-2 border-t-2 rounded-tl-[28px]", "right-0 top-0 border-r-2 border-t-2 rounded-tr-[28px]", "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-[28px]", "bottom-0 right-0 border-b-2 border-r-2 rounded-br-[28px]"].map((c) => (
            <span key={c} aria-hidden className={`absolute h-10 w-10 border-brand-light ${c}`} />
          ))}
          <span className="absolute left-4 top-4 flex items-center gap-1.5 font-mono text-label-sm text-brand-light">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" /> REC · 24/7
          </span>
        </div>
      </Reveal>
    </section>
  );
}
