/* eslint-disable @next/next/no-img-element */

import { tr, type Lang } from "@/lib/i18n";

const shots = (lang: Lang) => {
  const t = tr(lang);
  return [
    { src: "/images/systems/hoa-app-home.webp", alt: t("SHIELD+ оршин суугчийн аппын нүүр дэлгэц", "SHIELD+ resident app home screen") },
    { src: "/images/systems/hoa-app-pay.webp", alt: t("SHIELD+ оршин суугчийн аппын төлбөрийн дэлгэц", "SHIELD+ resident app payments screen") },
  ];
};

/** Two real SHIELD+ resident-app screenshots (test data, names masked) in phone frames. */
export function HoaPhone({ lang }: { lang: Lang }) {
  return (
    <figure>
      <div className="relative flex min-h-[460px] justify-center gap-4 overflow-hidden rounded-[22px] bg-[linear-gradient(135deg,#E6F7FB_0%,#EFF4FF_60%,#F8F9FF_100%)] px-6 pt-10 dark:bg-[linear-gradient(135deg,#0B1F2E_0%,#0C141E_70%)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(11,25,44,0.08)_1px,transparent_0)] [background-size:22px_22px] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)]" />
        {shots(lang).map((s, i) => (
          <div
            key={s.src}
            className={`relative h-fit w-[min(230px,62%)] overflow-hidden rounded-[2.2rem] border-[7px] border-navy bg-navy shadow-[0_40px_80px_-30px_rgba(11,25,44,0.45)] dark:border-[#1E293B] ${
              i === 1 ? "mt-14 hidden sm:block" : ""
            }`}
          >
            <img src={s.src} alt={s.alt} width={828} height={1800} loading="lazy" decoding="async" className="block h-auto w-full rounded-[1.75rem]" />
          </div>
        ))}
      </div>
      <figcaption className="mt-3 text-body-sm text-muted">{tr(lang)("Бодит апп дэлгэц · туршилтын жишээ өгөгдөл", "Real app screens · sample test data")}</figcaption>
    </figure>
  );
}
