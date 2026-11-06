/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowDown, ArrowRight, CircleCheck, CircleX, ClipboardCheck, Clock, Download, PhoneCall, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { PageHero, Sheet, SheetHeading } from "@/components/ui/page-hero";
import { PillButton } from "@/components/ui/pill-button";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { DemoForm } from "@/components/products/demo-form";
import { getContact, getFaqs, getServices } from "@/lib/site-data";
import { productsContent } from "@/lib/content/products";
import { localize, tr, type Lang } from "@/lib/i18n";
import { localFileExists } from "@/lib/files";
import { ParkingConsole } from "@/components/visuals/parking-console";
import { HoaPhone } from "@/components/visuals/hoa-phone";
import { BlurUntilLaunch, ComingSoonGate, LaunchSwitch } from "@/components/brand/coming-soon-gate";

type P = { lang: Lang };

function Hero({ lang }: P) {
  const t = tr(lang);
  return (
    <PageHero
      lang={lang}
      crumb={t("Бүтээгдэхүүн, үйлчилгээ", "Products & services")}
      eyebrow={t("Shield Nirun бүтээгдэхүүн, үйлчилгээ", "Shield Nirun products & services")}
      title={
        <>
          {t("Хамгаалалтын технологи,", "Security technology,")}{" "}
          <span className="text-brand-light">{t("суурилуулалт ба үйлчилгээ.", "installation and service.")}</span>
        </>
      }
      description={
        <LaunchSwitch
          before={t(
            "AI камер, дрон, нэвтрэх хяналтын систем суурилуулалт, биет хамгаалалтын үйлчилгээ. Shield+ шинэ шийдлүүд 11-р сарын 11-ний 11:11 AM-д нээгдэнэ.",
            "AI cameras, drones, access control installation and on-site security services. New Shield+ solutions open on 11 November at 11:11 AM.",
          )}
          after={t(
            "AI камер, дрон, нэвтрэх хяналтын систем суурилуулалт, биет хамгаалалтын үйлчилгээ болон Shield+ шийдлүүд.",
            "AI cameras, drones, access control installation, on-site security services and Shield+ solutions.",
          )}
        />
      }
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <PillButton href="#demo-form">{t("Үнэгүй зөвлөгөө авах", "Get free advice")}</PillButton>
        <Link
          href="#services"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-label-lg font-semibold text-white hover:border-white/40"
        >
          {t("Үйлчилгээнүүд үзэх", "View services")} <ArrowDown className="h-4 w-4" />
        </Link>
      </div>
    </PageHero>
  );
}

function Capabilities({ lang }: P) {
  const { KPIS } = productsContent(lang);
  return (
    <section aria-label={tr(lang)("Гол чадамж", "Key capabilities")} className="container-x pt-16">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {KPIS.map((k, i) => (
          <Reveal key={k.label} delay={i * 0.06} className="card card-hover flex flex-col gap-4 p-6">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-accent">
              <k.icon className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-[1.6rem] font-semibold tracking-tight text-ink">{k.value}</span>
              <span className="mt-0.5 block text-label-md font-semibold uppercase tracking-wider text-ink2">{k.label}</span>
              <span className="block text-body-sm text-muted">{k.caption}</span>
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

async function Services({ lang }: P) {
  const t = tr(lang);
  const SERVICES = await getServices(lang);
  return (
    <section id="services" className="container-x scroll-mt-24 pt-24">
      <SheetHeading
        eyebrow={t("Үйлчилгээнүүд", "Services")}
        title={t("Суурилуулалт ба хамгаалалтын үйлчилгээ", "Installation and security services")}
        description={t(
          "Судалгаанаас эхлээд суурилуулалт, засвар үйлчилгээ хүртэл нэг багаас.",
          "From the site survey to installation and maintenance, all from one team.",
        )}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((sv, i) => (
          <Reveal key={sv.title} delay={(i % 3) * 0.06} className="card card-hover flex flex-col gap-4 p-7">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-accent">
              <sv.icon className="h-6 w-6" />
            </span>
            <h3 className="text-[1.25rem] font-semibold tracking-tight text-ink">{sv.title}</h3>
            <p className="flex-1 text-body-sm text-muted">{sv.text}</p>
            <Link href="#demo-form" className="inline-flex items-center gap-1.5 text-label-lg font-bold text-accent hover:underline">
              {t("Үнийн санал авах", "Request a quote")} <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function BigIndex({ no, label }: { no: string; label: string }) {
  return (
    <div className="flex items-end gap-4">
      <span className="sn-grad-num text-[clamp(4rem,8vw,6rem)] font-bold leading-[0.85] tracking-tight">{no}</span>
      <span className="pb-2 text-label-sm font-bold uppercase tracking-widest text-accent">{label}</span>
    </div>
  );
}

function BrochureLink({ href, label, lang }: { href: string | null; label: string; lang: Lang }) {
  if (!href || !localFileExists(href)) return null;
  return (
    <a
      href={href}
      download
      className="inline-flex w-fit items-center gap-2 rounded-full border border-line px-5 py-3 text-label-lg font-semibold text-ink transition-colors hover:border-brand hover:text-accent"
    >
      <Download className="h-4 w-4" /> {tr(lang)("Танилцуулга татах (PDF)", "Download brochure (PDF, Mongolian)")}
      <span className="sr-only">— {label}</span>
    </a>
  );
}

async function Solutions({ lang }: P) {
  const t = tr(lang);
  const { PARKING, HOA, BROCHURES } = productsContent(lang);
  const { brochures } = await getContact(lang);
  return (
    <section id="solutions" className="container-x flex scroll-mt-24 flex-col gap-6 pt-24">
      <SheetHeading
        eyebrow={t("Shield+ шийдлүүд", "Shield+ solutions")}
        title={t("Хоёр тэргүүлэх систем", "Two flagship systems")}
        description={
          <BlurUntilLaunch>
            {t(
              "Тоног төхөөрөмж болон үүлэн програм хангамжийн нэгдмэл шийдлээр орон сууц, оффисыг дижиталжуулна.",
              "Hardware and cloud software working as one to digitise residential and office buildings.",
            )}
          </BlurUntilLaunch>
        }
      />

      <ComingSoonGate>
      <div className="flex flex-col gap-6">
      {/* 01 — Smart Parking */}
      <Reveal variant="zoom" id="parking" className="card grid scroll-mt-24 grid-cols-1 items-center gap-10 overflow-hidden p-6 md:p-10 lg:grid-cols-12">
        <div className="flex flex-col gap-5 lg:col-span-6">
          <BigIndex no="01" label={t("ANPR технологи", "ANPR technology")} />
          <h3 className="text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-tight tracking-tight text-ink">{t("Ухаалаг авто зогсоолын систем", "Smart parking system")}</h3>
          <p className="text-body-lg text-muted">{PARKING.description}</p>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {PARKING.features.map((f) => (
              <div key={f.title} className="flex items-start gap-3 rounded-2xl bg-sheet p-4">
                <f.icon className="h-[22px] w-[22px] shrink-0 text-accent" />
                <div>
                  <span className="text-body-md font-bold text-ink">{f.title}</span>
                  <p className="text-body-sm text-muted">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <PillButton href={localize(lang, "/products/smart-parking")} className="w-fit">{t("Дэлгэрэнгүй үзэх", "View details")}</PillButton>
            <BrochureLink lang={lang} label={BROCHURES.parking.label} href={brochures.parking} />
          </div>
        </div>
        <div className="lg:col-span-6">
          <ParkingConsole lang={lang} />
        </div>
      </Reveal>

      {/* 02 — Smart HOA */}
      <Reveal variant="zoom" id="hoa" className="card grid scroll-mt-24 grid-cols-1 items-center gap-10 overflow-hidden p-6 md:p-10 lg:grid-cols-12">
        <div className="order-2 lg:order-1 lg:col-span-6">
          <HoaPhone lang={lang} />
        </div>
        <div className="order-1 flex flex-col gap-5 lg:order-2 lg:col-span-6">
          <BigIndex no="02" label={t("СӨХ дижитал", "Digital HOA")} />
          <h3 className="text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-tight tracking-tight text-ink">{t("СӨХ-ийн нэгдсэн удирдлагын систем", "Unified HOA management system")}</h3>
          <p className="text-body-lg text-muted">{HOA.description}</p>
          <div className="flex flex-col gap-2.5">
            {HOA.features.map((f) => (
              <div key={f.title} className="flex items-start gap-3 rounded-2xl bg-sheet p-4">
                <f.icon className="mt-0.5 h-[22px] w-[22px] shrink-0 text-accent" />
                <div>
                  <span className="text-body-md font-bold text-ink">{f.title}</span>
                  <p className="mt-0.5 text-body-sm text-muted">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <PillButton href={localize(lang, "/products/smart-hoa")} className="w-fit">{t("Дэлгэрэнгүй үзэх", "View details")}</PillButton>
            <BrochureLink lang={lang} label={BROCHURES.hoa.label} href={brochures.hoa} />
          </div>
        </div>
      </Reveal>
      </div>
      </ComingSoonGate>
    </section>
  );
}

function Hardware({ lang }: P) {
  const t = tr(lang);
  const { HARDWARE } = productsContent(lang);
  return (
    <section id="hardware" className="container-x scroll-mt-24 pt-24">
      <SheetHeading
        eyebrow={t("Техник хангамж", "Hardware")}
        title={t("Тасралтгүй ажиллах дэд бүтэц", "Infrastructure that keeps running")}
        description={t("Интернэт тасрах, цахилгаан унах үед ч ажиллах баталгаат суурь.", "A dependable foundation that keeps working through internet and power outages.")}
      />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {HARDWARE.map((h, i) => (
          <Reveal key={h.title} delay={i * 0.06} className="card card-hover group flex flex-col overflow-hidden">
            <div className="relative h-56 overflow-hidden">
              <img src={h.image} alt={h.imageAlt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-card/95 px-3 py-1 text-label-sm font-bold uppercase text-accent">
                <h.icon className="h-4 w-4" /> {h.badge}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-7">
              <h3 className="text-[1.3rem] font-semibold tracking-tight text-ink">{h.title}</h3>
              <p className="flex-1 text-body-md text-muted">{h.text}</p>
              <span className="flex items-center gap-2 pt-1 text-label-md font-bold text-accent">
                <h.footIcon className="h-[18px] w-[18px]" /> {h.foot}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Process({ lang }: P) {
  const t = tr(lang);
  const { STEPS } = productsContent(lang);
  return (
    <section className="container-x pt-24">
      <Reveal
        variant="zoom"
        className="dark relative overflow-hidden rounded-[40px] bg-[#0B1724] p-[clamp(28px,5vw,64px)] text-ink"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_0%_0%,rgba(0,180,216,0.22)_0%,rgba(0,180,216,0)_70%)]" />
        <div className="relative">
          <span className="eyebrow">{t("Нэвтрүүлэх үйл явц", "Rollout process")}</span>
          <h2 className="mt-4 max-w-2xl text-[clamp(2.1rem,5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.025em] text-white">
            {t("Судалгаанаас дэмжлэг хүртэл — 4 алхам", "From survey to support — 4 steps")}
          </h2>
          <ol className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.no} className={`sn-rv ${i ? `sn-rv-${Math.min(4, i + 1)}` : ""} flex flex-col gap-3 border-t border-white/10 pt-6`}>
                <span className="sn-grad-num text-[3.5rem] font-bold leading-none tracking-tight">{s.no}</span>
                <h3 className="text-[1.2rem] font-semibold text-white">{s.title}</h3>
                <p className="text-body-sm text-slate-400">{s.text}</p>
                {s.time && (
                  <span className="mt-auto flex items-center gap-1.5 pt-2 text-label-sm font-bold uppercase text-brand-light">
                    <Clock className="h-4 w-4" /> {s.time}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </Reveal>
    </section>
  );
}

function Pricing({ lang }: P) {
  const t = tr(lang);
  const { TIERS } = productsContent(lang);
  return (
    <section id="pricing" className="container-x scroll-mt-24 pt-24">
      <SheetHeading
        center
        eyebrow={t("Багцууд", "Packages")}
        title={t("Объектын хэмжээнд тохирох багц", "A package for every site size")}
        description={t(
          "Үнийг объектын хэмжээ, гарцын тоо, тоног төхөөрөмжөөс хамааран тооцож санал болгоно.",
          "Prices are quoted based on site size, number of gates and equipment.",
        )}
      />
      <ComingSoonGate>
      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">
        {TIERS.map((tier, i) => (
          <Reveal
            key={tier.name}
            delay={i * 0.06}
            className={`card-hover relative flex flex-col justify-between rounded-[30px] p-7 sm:p-9 ${
              tier.featured ? "dark bg-[#0B1724] text-ink" : "bg-card dark:border dark:border-line"
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className={`text-label-sm font-bold uppercase tracking-widest ${tier.featured ? "text-brand-light" : "text-accent"}`}>{tier.tag}</span>
                  <h3 className={`mt-2 text-[1.6rem] font-semibold tracking-tight ${tier.featured ? "text-white" : "text-ink"}`}>{tier.name}</h3>
                </div>
                {tier.featured && (
                  <span className="shrink-0 rounded-full bg-brand px-3 py-1 text-label-sm font-bold uppercase tracking-wider text-navy">{t("Түгээмэл", "Popular")}</span>
                )}
              </div>
              <p className={`mt-3 text-body-sm ${tier.featured ? "text-slate-400" : "text-muted"}`}>{tier.audience}</p>
              <p className={`mt-6 text-[1.75rem] font-semibold tracking-tight ${tier.featured ? "text-white" : "text-ink"}`}>
                {tier.price} <span className={`text-body-sm font-normal ${tier.featured ? "text-slate-400" : "text-muted"}`}>{tier.period}</span>
              </p>
              <ul className={`mt-6 flex flex-col gap-3 border-t pt-6 text-body-sm ${tier.featured ? "border-white/10" : "border-line"}`}>
                {tier.includes.map((x) => (
                  <li key={x} className={`flex items-start gap-2.5 ${tier.featured ? "text-slate-200" : "text-ink"}`}>
                    <CircleCheck className={`mt-0.5 h-5 w-5 shrink-0 ${tier.featured ? "text-brand-light" : "text-brand"}`} /> {x}
                  </li>
                ))}
                {tier.excludes?.map((x) => (
                  <li key={x} className="flex items-start gap-2.5 text-muted/80">
                    <CircleX className="mt-0.5 h-5 w-5 shrink-0" /> {x}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="#demo-form"
              className={`mt-9 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-label-lg font-bold transition-colors ${
                tier.featured ? "bg-brand text-navy hover:bg-brand-light" : "border border-line text-ink hover:border-ink/40"
              }`}
            >
              {tier.cta} <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        ))}
      </div>
      </ComingSoonGate>
    </section>
  );
}

async function Faq({ lang }: P) {
  const t = tr(lang);
  const FAQS = await getFaqs(lang);
  return (
    <section className="mx-auto max-w-[900px] px-5 pt-24 sm:px-8">
      <SheetHeading center eyebrow={t("Түгээмэл асуултууд", "FAQ")} title={t("Таны асуултад хариулъя", "Your questions, answered")} />
      <LaunchSwitch before={<FaqAccordion items={FAQS.filter((f) => !f.shieldPlus)} />} after={<FaqAccordion items={FAQS} />} />
    </section>
  );
}

async function Demo({ lang }: P) {
  const t = tr(lang);
  const C = await getContact(lang);
  return (
    <section id="demo-form" className="container-x scroll-mt-24 pb-24 pt-24">
      <Reveal variant="zoom" className="card grid grid-cols-1 overflow-hidden rounded-[40px] lg:grid-cols-12">
        <div className="dark relative flex flex-col justify-between overflow-hidden bg-[#0B1724] p-8 text-ink md:p-12 lg:col-span-5">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_0%_100%,rgba(0,180,216,0.25)_0%,rgba(0,180,216,0)_70%)]" />
          <div className="relative">
            <span className="mb-4 inline-flex items-center gap-2 text-label-sm font-bold uppercase tracking-widest text-brand-light">
              <ClipboardCheck className="h-5 w-5" /> {t("Зөвлөгөө & үнэлгээ", "Advice & assessment")}
            </span>
            <h2 className="text-[clamp(1.9rem,3.4vw,2.75rem)] font-semibold leading-tight tracking-tight text-white">
              {t("Инженерийн үнэгүй хэмжилт захиалах", "Book a free engineering survey")}
            </h2>
            <p className="mt-4 text-body-md text-slate-400">
              {t(
                "Манай инженерүүд объект дээр тань очиж орц, гарцын хэмжилт хийж, демо системийг бодитоор танилцуулна.",
                "Our engineers visit your site, measure the entrances and gates, and show you a live demo of the system.",
              )}
            </p>
            <ul className="mt-8 flex flex-col gap-4 text-body-sm">
              {[
                { icon: ShieldCheck, t: t("Газар дээрх үнэгүй судалгаа", "Free on-site survey"), d: t("Нэмэлт далд хураамжгүй", "No hidden fees") },
                { icon: Clock, t: t("Шуурхай хариу", "Quick response"), d: t("Төсөв, техникийн саналыг илгээнэ", "We send a budget and technical proposal") },
              ].map((x) => (
                <li key={x.t} className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/15 text-brand-light">
                    <x.icon className="h-[18px] w-[18px]" />
                  </span>
                  <span>
                    <span className="block font-semibold text-white">{x.t}</span>
                    <span className="text-slate-400">{x.d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <a href={C.phoneHref} className="relative mt-10 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-colors hover:border-white/30">
            <PhoneCall className="h-6 w-6 text-brand-light" />
            <span>
              <span className="block text-label-sm font-semibold uppercase tracking-widest text-slate-400">{t("Холбогдох утас", "Phone")}</span>
              <span className="text-headline-sm font-bold text-white">{C.phone}</span>
            </span>
          </a>
        </div>
        <div className="flex flex-col justify-center p-8 md:p-12 lg:col-span-7">
          <DemoForm />
        </div>
      </Reveal>
    </section>
  );
}

export function ProductsPage({ lang }: P) {
  return (
    <>
      <Hero lang={lang} />
      <Sheet>
        <Capabilities lang={lang} />
        <Services lang={lang} />
        <Solutions lang={lang} />
        <Hardware lang={lang} />
        <Process lang={lang} />
        <Pricing lang={lang} />
        <Faq lang={lang} />
        <Demo lang={lang} />
      </Sheet>
    </>
  );
}
