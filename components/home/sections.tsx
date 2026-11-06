/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, BrainCircuit, CircleCheck, Flag, Phone, ScanFace, TriangleAlert,
} from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { LeadershipPortraits } from "@/components/home/leadership-portraits";
import { TelemetryHud } from "@/components/home/telemetry-hud";
import { SolutionsStepper } from "@/components/home/solutions-stepper";
import { ShieldPlusBanner } from "@/components/brand/shield-plus-banner";
import { BlurUntilLaunch, ComingSoonGate } from "@/components/brand/coming-soon-gate";
import { CtaZoom } from "@/components/ui/cta-zoom";
import { SectorScene } from "@/components/visuals/sector-scene";
import { getContact, getLeaders } from "@/lib/site-data";
import { listPosts, newsDate } from "@/lib/news";
import { companyStatement, homeContent } from "@/lib/content/home";
import { localize, tr, type Lang } from "@/lib/i18n";

const H2 = "text-[clamp(2.1rem,5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.025em] text-ink";

/* ------------------------------------------------------------------ Hero (always dark) */

export async function HomeHero({ lang }: { lang: Lang }) {
  const t = tr(lang);
  const C = await getContact(lang);
  return (
    <section className="dark relative -mt-20 overflow-hidden bg-[#070F19] pb-[calc(4rem+7rem)] pt-[calc(5rem+4.5rem)] text-ink lg:pb-[calc(4rem+9rem)] lg:pt-[calc(5rem+6rem)]">
      {/* brand glow + breathing shield watermark */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_100%,rgba(0,180,216,0.30)_0%,rgba(0,180,216,0)_70%)]" />
      <img
        src="/images/mark-silhouette.png"
        alt=""
        aria-hidden
        className="sn-mark pointer-events-none absolute left-1/2 top-[8%] w-[min(900px,140vw)] max-w-none -translate-x-1/2 opacity-[0.05] will-change-transform"
      />

      <div className="container-x relative flex flex-col items-center text-center">
        <span className="sn-fade inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-1.5 pr-4 text-label-md text-slate-300">
          <img src="/images/mark.png" alt="" aria-hidden className="h-6 w-6" />
          {t("Shield Nirun · Хамгаалалтын технологи", "Shield Nirun · Security technology")}
        </span>

        <h1 className="sn-fade mt-7 max-w-5xl text-[clamp(2.6rem,7.2vw,5.4rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-white">
          {t("Технологид суурилсан", "Technology-driven,")}{" "}
          <span className="text-brand-light">{t("найдвартай хамгаалалт.", "reliable protection.")}</span>
        </h1>
        <p className="sn-fade mt-6 max-w-2xl text-body-lg text-slate-400">
          {t(
            `Shield Nirun нь ${companyStatement(lang)}.`,
            "Shield Nirun delivers connected, automated and reliable security solutions built on artificial intelligence, drones, smart cameras and access control systems.",
          )}
        </p>

        <div className="sn-fade mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href={localize(lang, "/contact")}
            className="inline-flex items-center gap-3 rounded-full bg-brand py-1.5 pl-6 pr-1.5 text-label-lg font-bold text-navy transition-colors hover:bg-brand-light"
          >
            {t("Зөвлөгөө авах", "Get advice")}
            <span className="grid h-10 w-10 place-items-center rounded-full bg-navy text-white">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
          <a
            href={C.phoneHref}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-label-lg font-semibold text-white transition-colors hover:border-white/40"
          >
            <Phone className="h-4 w-4" /> {C.phone}
          </a>
        </div>

        <div className="sn-float mt-10 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-left">
          <span className="relative grid h-8 w-8 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
            <span className="sn-ping absolute inset-0 rounded-full bg-emerald-400/30" />
            <CircleCheck className="relative h-5 w-5" />
          </span>
          <span>
            <span className="block text-label-lg font-semibold text-white">{t("Шийлд Нирун", "Shield Nirun")}</span>
            <span className="text-label-md text-slate-400">{t("Таны аюулгүй байдал — Бидний ирээдүй", " · Your safety, Our future")}</span>
          </span>
        </div>

      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Intro + tilted cards */

function HomeIntro({ lang }: { lang: Lang }) {
  const t = tr(lang);
  return (
    <section className="container-x grid grid-cols-1 items-center gap-16 pb-20 pt-24 lg:grid-cols-[1fr_1.05fr] lg:gap-20 lg:pb-24 lg:pt-32">
      <Reveal variant="left">
        <span className="eyebrow">Shield Nirun</span>
        <h2 className={`${H2} mt-4`}>{t("Хамгаалалт технологиос эхэлдэг.", "Security starts with technology.")}</h2>
        <p className="mt-6 max-w-xl text-body-lg text-ink2">
          {t(
            "Камер, дрон, нэвтрэх хяналт, зогсоолын систем нэг сүлжээнд холбогдож, аюулыг эрт илрүүлнэ. Мэргэшсэн хамгаалалтын алба болон технологийг хослуулсан цогц шийдэл.",
            "Cameras, drones, access control and parking connect into one network to spot threats early: a complete solution that combines professional security staff with technology.",
          )}
        </p>
        <Link href="#solutions" className="mt-8 inline-flex items-center gap-2 text-label-lg font-bold text-accent hover:underline">
          {t("Shield+ шийдлүүдийг үзэх", "Explore Shield+ solutions")} <ArrowRight className="h-4 w-4" />
        </Link>
      </Reveal>

      <div className="relative mx-auto w-full max-w-[520px] lg:mr-0">
        <Reveal>
          <TelemetryHud lang={lang} />
        </Reveal>

        <Reveal
          variant="tilt-a"
          className="mt-5 rounded-3xl bg-card p-5 shadow-[0_24px_50px_rgba(11,25,44,0.16)] sm:absolute sm:-bottom-14 sm:-left-14 sm:mt-0 sm:w-[260px] dark:border dark:border-line"
        >
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-bold uppercase tracking-widest text-muted">{t("AI камер · CAM-04", "AI camera · CAM-04")}</span>
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-label-sm font-bold text-amber-600 dark:text-amber-400">02:14</span>
          </div>
          <div className="mt-4 flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <TriangleAlert className="h-5 w-5" />
            </span>
            <div>
              <p className="text-body-md font-bold text-ink">{t("Хэвийн бус хөдөлгөөн", "Unusual movement")}</p>
              <p className="text-body-sm text-muted">{t("Хойд периметр · Дрон руу илгээв", "North perimeter · Sent to drone")}</p>
            </div>
          </div>
        </Reveal>

        <Reveal
          variant="tilt-b"
          className="mt-4 rounded-3xl bg-navy p-5 text-white shadow-[0_24px_50px_rgba(11,25,44,0.22)] sm:absolute sm:-right-10 sm:-top-12 sm:mt-0 sm:w-[250px] dark:border dark:border-line dark:bg-card"
        >
          <span className="text-label-sm font-bold uppercase tracking-widest text-slate-400">{t("Нэвтрэх хяналт · Б-орц", "Access control · Entrance B")}</span>
          <div className="mt-4 flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand/20 text-brand-light">
              <ScanFace className="h-5 w-5" />
            </span>
            <div>
              <p className="text-body-md font-bold">{t("Царай танигдлаа", "Face recognised")}</p>
              <p className="text-body-sm text-slate-400">{t("Хаалга нээгдлээ", "Door opened")}</p>
            </div>
          </div>
        </Reveal>
        <p className="mt-4 text-right text-label-sm text-muted sm:mt-6">{t("Системийн жишээ дэлгэц", "Sample system screen")}</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Tech cards */

function HomeTech({ lang }: { lang: Lang }) {
  const { TECH } = homeContent(lang);
  return (
    <section aria-label={tr(lang)("Технологийн суурь", "Technology foundation")} className="container-x pb-14">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TECH.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.06} className="sn-lift flex flex-col gap-4 rounded-[22px] bg-card p-6 dark:border dark:border-line">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-accent">
              <item.icon className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-[1.35rem] font-semibold tracking-tight text-ink">{item.title}</span>
              <span className="mt-1 block text-body-sm text-muted">{item.text}</span>
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Marquee */

const MARQUEE = {
  mn: ["AI камер", "Дрон эргүүл", "Нэвтрэх хяналт", "ANPR зогсоол", "Царай таних", "СӨХ систем", "Турникет", "Төвлөрсөн хяналт"],
  en: ["AI cameras", "Drone patrol", "Access control", "ANPR parking", "Face recognition", "HOA system", "Turnstiles", "Central monitoring"],
};

function HomeMarquee({ lang }: { lang: Lang }) {
  const row = (
    <div className="flex shrink-0 items-center gap-10 pr-10">
      {MARQUEE[lang].map((w) => (
        <span key={w} className="flex items-center gap-10 whitespace-nowrap text-[clamp(1.5rem,3vw,2.25rem)] font-semibold tracking-tight text-ink/80">
          {w}
          <img src="/images/mark.png" alt="" aria-hidden className="h-7 w-7 opacity-80" />
        </span>
      ))}
    </div>
  );
  return (
    <div aria-hidden className="sn-marquee sn-marquee-mask overflow-hidden border-y border-line py-7">
      <div className="sn-marquee-track flex w-max">
        {row}
        {row}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Shield+ solutions */

function HomeSolutions({ lang }: { lang: Lang }) {
  const t = tr(lang);
  return (
    <section id="solutions" className="mx-auto max-w-[1100px] scroll-mt-24 px-5 pb-24 pt-20 sm:px-8">
      <Reveal className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="eyebrow">{t("Shield+ шийдлүүд", "Shield+ solutions")}</span>
          <h2 className={`${H2} mt-4`}>{t("4 тулгуурт шийдэл", "Four pillars, one solution")}</h2>
        </div>
        <p className="max-w-sm text-body-md text-muted">
          <BlurUntilLaunch>
            {t(
              "Нэг цонхоор — зогсоол, СӨХ, камер & дрон, хамгаалалт. Дугаар дээр дарж дэлгэрэнгүйг үзнэ үү.",
              "One window for parking, HOA, cameras & drones, and security. Click a number to see details.",
            )}
          </BlurUntilLaunch>
        </p>
      </Reveal>
      <ComingSoonGate>
        <SolutionsStepper />
      </ComingSoonGate>
    </section>
  );
}

/* ------------------------------------------------------------------ Executive */

async function HomeExecutive({ lang }: { lang: Lang }) {
  const t = tr(lang);
  const leaders = await getLeaders(lang); // org-chart order: top first
  const { EXEC } = homeContent(lang);
  return (
    <section className="container-x pb-24">
      <Reveal variant="zoom" className="grid grid-cols-1 items-center gap-12 rounded-[30px] bg-card p-6 sm:p-8 lg:grid-cols-12 lg:p-12 dark:border dark:border-line">
        {leaders.length > 0 && (
          <div className="min-w-0 lg:col-span-6">
            <LeadershipPortraits people={leaders} lang={lang} />
          </div>
        )}

        <div className={`flex flex-col gap-5 ${leaders.length > 0 ? "lg:col-span-6" : "lg:col-span-12"}`}>
          <span className="eyebrow">{t("Бидний зорилго", "Our purpose")}</span>
          <h2 className="text-[clamp(1.75rem,3.4vw,2.6rem)] font-semibold leading-tight tracking-tight text-ink">
            {t("Аюулгүй орчин ба ухаалаг дэд бүтэц —", "Safe environments and smart infrastructure —")}{" "}
            <span className="text-accent">{t("Ирээдүйн хотын стандарт", "the standard for the city of tomorrow")}</span>
          </h2>
          <p className="text-body-md text-ink2 sm:text-body-lg">{EXEC.message}</p>
          <div className="grid grid-cols-1 gap-4 pt-1 sm:grid-cols-2">
            {[
              { icon: BrainCircuit, title: t("Алсын Хараа", "Vision"), text: EXEC.vision },
              { icon: Flag, title: t("Эрхэм Зорилго", "Mission"), text: EXEC.mission },
            ].map((c) => (
              <div key={c.title} className="flex flex-col gap-1.5 rounded-xl bg-soft p-4">
                <span className="flex items-center gap-2 text-label-lg font-bold text-accent">
                  <c.icon className="h-5 w-5" />
                  {c.title}
                </span>
                <p className="text-body-sm text-muted">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ Sectors */

function HomeSectors({ lang }: { lang: Lang }) {
  const t = tr(lang);
  const { SECTORS } = homeContent(lang);
  return (
    <section id="sectors" className="container-x pb-24">
      <Reveal className="mb-10 max-w-2xl">
        <span className="eyebrow">{t("Хэрэглээний салбарууд", "Industries")}</span>
        <h2 className={`${H2} mt-4`}>{t("Хаана ашиглагдах вэ?", "Where is it used?")}</h2>
      </Reveal>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {SECTORS.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.06} className="sn-lift group flex flex-col overflow-hidden rounded-[26px] bg-card dark:border dark:border-line">
            <div className="relative">
              <SectorScene variant={p.scene} />
              <span className="absolute left-4 top-4 rounded-full bg-white/10 px-3 py-1 text-label-sm font-bold uppercase text-white ring-1 ring-white/15">
                {p.tag}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-7">
              <h3 className="text-[1.35rem] font-semibold tracking-tight text-ink">{p.title}</h3>
              <p className="text-body-md text-muted">{p.description}</p>
              <ul className="mt-auto flex flex-wrap gap-2 pt-3">
                {p.uses.map((u) => (
                  <li key={u} className="rounded-full bg-brand/10 px-3 py-1 text-label-md font-semibold text-accent">{u}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Why */

function HomeWhy({ lang }: { lang: Lang }) {
  const t = tr(lang);
  const { WHY } = homeContent(lang);
  return (
    <section className="container-x pb-24">
      <Reveal className="mx-auto mb-12 max-w-3xl text-center">
        <span className="eyebrow">{t("Бидний давуу тал", "Our strengths")}</span>
        <h2 className={`${H2} mt-4`}>{t("Яагаад Shield Nirun?", "Why Shield Nirun?")}</h2>
      </Reveal>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {WHY.map((item, i) => (
          <Reveal key={item.title} delay={(i % 3) * 0.06} className="sn-lift flex flex-col gap-3 rounded-[22px] bg-card p-7 dark:border dark:border-line">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-accent">
              <item.icon className="h-6 w-6" />
            </span>
            <h3 className="text-[1.25rem] font-semibold tracking-tight text-ink">{item.title}</h3>
            <p className="text-body-sm text-muted">{item.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Latest news (links to /news) */

async function HomeNews({ lang }: { lang: Lang }) {
  const t = tr(lang);
  // News must never take the home page down (e.g. database briefly unreachable): just skip the block.
  const posts = await listPosts(lang, 1).then((r) => r.posts).catch((e) => {
    console.error("HomeNews: could not load posts", e);
    return [];
  });
  const latest = posts.slice(0, 3);
  if (!latest.length) return null; // nothing published yet → no empty section
  const href = (p: string) => localize(lang, p);
  return (
    <section className="container-x pb-24">
      <Reveal className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="eyebrow">{t("Мэдээ мэдээлэл", "News")}</span>
          <h2 className={`${H2} mt-4`}>{t("Сүүлийн үеийн мэдээ", "Latest news")}</h2>
        </div>
        <Link href={href("/news")} className="group inline-flex items-center gap-2 self-start rounded-full border border-line bg-card px-5 py-3 text-label-lg font-bold text-ink transition-colors hover:border-brand hover:text-accent md:self-auto">
          {t("Бүх мэдээ", "All news")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </Reveal>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {latest.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.06}>
            <Link href={href(`/news/${p.slug}`)} className="group sn-lift flex h-full flex-col overflow-hidden rounded-[26px] bg-card dark:border dark:border-line">
              <div className="relative aspect-[16/10] overflow-hidden bg-[linear-gradient(135deg,#0B1724,#0B5F7E)]">
                {p.cover && (
                  <img src={p.cover} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2.5 p-6">
                <span className="text-label-sm font-bold uppercase tracking-widest text-accent">{newsDate(p.publishedAt)}</span>
                <h3 className="text-[1.2rem] font-semibold leading-snug tracking-tight text-ink group-hover:text-accent">{p.title}</h3>
                <p className="line-clamp-2 text-body-sm text-muted">{p.excerpt}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Sheet (overlaps the hero) */

export function HomeSheet({ lang }: { lang: Lang }) {
  return (
    <div className="relative z-[3] -mt-16 overflow-x-clip rounded-t-[40px] bg-sheet">
      <HomeIntro lang={lang} />
      <HomeTech lang={lang} />
      <HomeMarquee lang={lang} />
      <ShieldPlusBanner lang={lang} />
      <HomeSolutions lang={lang} />
      <HomeExecutive lang={lang} />
      <HomeSectors lang={lang} />
      <HomeWhy lang={lang} />
      <HomeNews lang={lang} />
      <CtaZoom lang={lang} />
    </div>
  );
}
