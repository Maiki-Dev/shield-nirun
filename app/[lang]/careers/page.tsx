import type { Metadata } from "next";
import { BriefcaseBusiness, CircleCheck } from "lucide-react";
import { PageHero, Sheet, SheetHeading } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { ApplicationForm } from "@/components/careers/application-form";
import { positionsFor } from "@/lib/careers";
import { alternates, tr, type Lang } from "@/lib/i18n";

// Query the cached job listings at request time so builds can run before PostgreSQL is available.
export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const t = tr(params.lang);
  return {
    title: t("Ажлын байр", "Careers"),
    description: t("Shield Nirun-д нээлттэй ажлын байр, анкет бөглөх.", "Open positions at Shield Nirun and how to apply."),
    alternates: alternates(params.lang, "/careers"),
  };
}

export default async function CareersPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params;
  const t = tr(lang);
  const positions = await positionsFor(lang);
  return (
    <>
      <PageHero
        lang={lang}
        crumb={t("Ажлын байр", "Careers")}
        eyebrow={t("Бидэнтэй нэгдээрэй", "Join us")}
        title={<>{t("Хамгаалалтын технологийн", "Build the future of")} <span className="text-brand-light">{t("багт нэгдээрэй.", "security with us.")}</span></>}
        description={t("Нээлттэй ажлын байраа сонгоод анкетаа онлайнаар бөглөнө үү.", "Pick an open position and apply online.")}
      />
      <Sheet>
        <section className="container-x grid grid-cols-1 gap-10 pb-24 pt-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SheetHeading eyebrow={t("Нээлттэй ажлын байр", "Open positions")} title={t("Ажлын байр", "Positions")} />
            {positions.length === 0 ? (
              <p className="card p-6 text-body-md text-muted">{t("Одоогоор зарласан ажлын байр алга. Ерөнхий анкет илгээж болно.", "No open positions right now — you can still send a general application.")}</p>
            ) : (
              <div className="flex flex-col gap-3">
                {positions.map((p, i) => (
                  <Reveal key={p.id} delay={i * 0.05} className="card p-6">
                    <h3 className="flex items-center gap-2.5 text-[1.2rem] font-semibold tracking-tight text-ink">
                      <BriefcaseBusiness className="h-5 w-5 text-accent" /> {p.title}
                    </h3>
                    <ul className="mt-3 flex flex-col gap-1.5 text-body-sm text-muted">
                      {p.description.split("\n").filter(Boolean).map((l, k) => (
                        <li key={k} className="flex items-start gap-2"><CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {l.replace(/^[-•]\s*/, "")}</li>
                      ))}
                    </ul>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
          <Reveal variant="zoom" className="card rounded-[30px] p-7 sm:p-10 lg:col-span-7">
            <span className="eyebrow">{t("Анкет", "Application")}</span>
            <h2 className="mb-8 mt-3 text-[clamp(1.8rem,3.2vw,2.4rem)] font-semibold leading-tight tracking-tight text-ink">{t("Анкет бөглөх", "Apply now")}</h2>
            <ApplicationForm positions={positions.map(({ id, title }) => ({ id, title }))} />
          </Reveal>
        </section>
      </Sheet>
    </>
  );
}
