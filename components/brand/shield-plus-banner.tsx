import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, Phone } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { LaunchCountdown } from "@/components/brand/launch-countdown";
import { LaunchSwitch } from "@/components/brand/coming-soon-gate";
import { localize, tr, type Lang } from "@/lib/i18n";

/**
 * Shield+ launch banner — a self-contained, ad-style block in the brand cyan so it reads as an
 * announcement and stays visually separate from the solution list that follows it.
 */
export function ShieldPlusBanner({ lang }: { lang: Lang }) {
  const t = tr(lang);
  return (
    <section aria-labelledby="shield-plus-title" className="container-x pt-20">
      <Reveal
        variant="zoom"
        className="relative overflow-hidden rounded-[36px] bg-[linear-gradient(118deg,#00C2FF_0%,#00A3C9_45%,#0B5F7E_100%)] p-[clamp(28px,5vw,60px)] text-white shadow-[0_40px_80px_-40px_rgba(0,150,183,0.65)]"
      >
        {/* oversized "+" marks — the brand's own shape, not decoration for its own sake */}
        <span aria-hidden className="pointer-events-none absolute -right-10 -top-24 select-none text-[22rem] font-extrabold leading-none text-white/[0.08]">+</span>
        <span aria-hidden className="pointer-events-none absolute -bottom-28 right-[38%] select-none text-[14rem] font-extrabold leading-none text-white/[0.06]">+</span>

        <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-label-md font-bold uppercase tracking-wider ring-1 ring-white/25">
              {t("Шинэ брэнд", "New brand")}
            </span>
            <p
              id="shield-plus-title"
              className="mt-6 text-[clamp(3.25rem,9vw,6rem)] font-extrabold leading-[0.9] tracking-[-0.045em]"
              aria-label="Shield+"
            >
              SHIELD<span className="text-[#E5243B]">+</span>
            </p>
            <h2 className="mt-5 max-w-xl text-[clamp(1.5rem,3vw,2.2rem)] font-semibold leading-tight tracking-tight">
              {t("Нэг брэнд — цогц шийдэл.", "One brand. Complete solutions.")}
            </h2>
            {/* Until launch, a teaser only: what Shield+ includes stays under wraps */}
            <p className="mt-3 max-w-xl text-body-lg text-white/85">
              <LaunchSwitch
                before={t(
                  "Shield Nirun-ий шинэ брэнд. Юу багтсаныг 11-р сарын 11-ний 11:11 AM-д танилцуулна.",
                  "Shield Nirun's new brand. Everything it includes will be revealed on 11 November at 11:11 AM.",
                )}
                after={t(
                  "Ухаалаг зогсоол, СӨХ-ийн систем, AI камер & дрон, биет хамгаалалт — Shield Nirun-ий бүх шийдэл нэг нэрийн дор.",
                  "Smart parking, the HOA system, AI cameras & drones and on-site security: every Shield Nirun solution under one name.",
                )}
              />
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#solutions"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-label-lg font-bold text-navy transition-colors hover:bg-navy hover:text-white"
              >
                {t("Шийдлүүдийг үзэх", "See the solutions")} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={localize(lang, "/contact")}
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-label-lg font-semibold text-white ring-1 ring-white/40 transition-colors hover:bg-white/10"
              >
                <Phone className="h-4 w-4" /> {t("Холбогдох", "Contact us")}
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] bg-navy/25 p-6 ring-1 ring-white/15 backdrop-blur-sm sm:p-8">
            <span className="text-label-sm font-bold uppercase tracking-[0.2em] text-white/75">{t("Албан ёсны нээлт", "Official launch")}</span>
            <p className="mt-2 text-[clamp(4rem,10vw,6.5rem)] font-extrabold leading-none tracking-[-0.05em]">11.11</p>
            <p className="mt-3 flex flex-wrap items-center gap-2 text-label-lg font-bold">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 ring-1 ring-white/20">
                <CalendarDays className="h-4 w-4" /> 2026
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 font-mono ring-1 ring-white/20">
                <Clock className="h-4 w-4" /> 11:11 AM
              </span>
            </p>
            <div className="mt-6">
              <LaunchCountdown />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
