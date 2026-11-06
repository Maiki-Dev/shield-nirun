import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHero, Sheet } from "@/components/ui/page-hero";
import { PillButton } from "@/components/ui/pill-button";
import { LaunchCountdown } from "@/components/brand/launch-countdown";
import { SHIELD_PLUS } from "@/lib/content/site";
import { localize, tr, type Lang } from "@/lib/i18n";

/** True once the Shield+ launch moment has passed (server-side; pages using it revalidate every minute). */
export const isShieldPlusLive = () => Date.now() >= new Date(SHIELD_PLUS.launch).getTime();

/** Stand-in for a Shield+ product page before launch — names nothing that is being launched. */
export function ComingSoonPage({ lang }: { lang: Lang }) {
  const t = tr(lang);
  return (
    <>
      <PageHero
        lang={lang}
        crumb={t("Тун удахгүй", "Coming soon")}
        parent={{ label: t("Бүтээгдэхүүн", "Products"), href: "/products" }}
        eyebrow={t("Shield+ · Шинэ брэнд", "Shield+ · New brand")}
        title={
          <>
            SHIELD<span className="text-[#E5243B]">+</span> <span className="text-brand-light">{t("тун удахгүй.", "is coming soon.")}</span>
          </>
        }
        description={t(
          "Энэ хуудас 2026 оны 11-р сарын 11-ний 11:11 AM-д нээгдэнэ.",
          "This page opens on 11 November 2026 at 11:11 AM.",
        )}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <PillButton href={localize(lang, "/contact")}>{t("Урьдчилан мэдээлэл авах", "Get early information")}</PillButton>
          <Link
            href={localize(lang, "/products")}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-label-lg font-semibold text-white hover:border-white/40"
          >
            <ArrowLeft className="h-4 w-4" /> {t("Бүтээгдэхүүн рүү буцах", "Back to products")}
          </Link>
        </div>
      </PageHero>
      <Sheet>
        <section className="container-x pb-24 pt-16">
          <div className="mx-auto max-w-xl rounded-[30px] bg-[linear-gradient(118deg,#00C2FF_0%,#00A3C9_45%,#0B5F7E_100%)] p-7 text-white sm:p-9">
            <span className="text-label-sm font-bold uppercase tracking-[0.2em] text-white/75">{t("Нээлт хүртэл", "Time until launch")}</span>
            <div className="mt-4">
              <LaunchCountdown />
            </div>
          </div>
        </section>
      </Sheet>
    </>
  );
}
