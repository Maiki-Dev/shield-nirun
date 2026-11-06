/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowRight, Camera, CircleCheck, FileDown, Quote } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { PageHero, Sheet, SheetHeading } from "@/components/ui/page-hero";
import { PillButton } from "@/components/ui/pill-button";
import { CtaZoom } from "@/components/ui/cta-zoom";
import { ParkingConsole } from "@/components/visuals/parking-console";
import { systemPage, type Feature, type Media, type Shot, type SystemPage, type SystemSlug } from "@/lib/content/systems";
import { localize, tr, type Lang } from "@/lib/i18n";
import { localFileSize } from "@/lib/files";
import { getContact } from "@/lib/site-data";

/** Size of a site file (/files/… or uploaded /media/…), e.g. "1.4 MB" — null when missing (then no download button). */
function fileSize(href: string | null): string | null {
  const bytes = href ? localFileSize(href) : null;
  if (bytes === null) return null;
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

/* ------------------------------------------------------------------ frames */

function Img({ shot, className = "", eager = false }: { shot: Shot; className?: string; eager?: boolean }) {
  return (
    <img
      src={shot.src}
      alt={shot.alt}
      width={shot.w}
      height={shot.h}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={`block h-auto w-full ${className}`}
    />
  );
}

/** Neutral desktop-app window: real screenshot inside, no fake URL. */
function BrowserFrame({ shot, eager }: { shot: Shot; eager?: boolean }) {
  return (
    <div className="overflow-hidden rounded-[18px] bg-white shadow-[0_30px_70px_-20px_rgba(11,25,44,0.35)] ring-1 ring-black/5 dark:ring-white/10">
      <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
      </div>
      <Img shot={shot} eager={eager} />
    </div>
  );
}

function PhoneFrame({ shot, className = "" }: { shot: Shot; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-[2.4rem] border-[7px] border-[#0B192C] bg-[#0B192C] shadow-[0_30px_60px_-20px_rgba(11,25,44,0.45)] ${className}`}>
      <Img shot={shot} className="rounded-[1.9rem]" />
    </div>
  );
}

function MediaBlock({ media, lang }: { media: Media; lang: Lang }) {
  if (media.kind === "camera") return <ParkingConsole lang={lang} />;
  if (media.kind === "phones")
    return (
      <div className="relative flex justify-center gap-5 overflow-hidden rounded-[30px] bg-gradient-to-b from-brand/10 to-transparent px-6 pt-10 sm:px-10">
        {media.shots.map((s, i) => (
          <PhoneFrame key={s.src} shot={s} className={`w-[min(260px,70%)] ${i === 1 ? "mt-12 hidden sm:block" : ""}`} />
        ))}
      </div>
    );
  return (
    <div className="relative">
      <BrowserFrame shot={media.shot} />
      {media.inset && (
        <div className="absolute -bottom-8 -left-4 hidden w-[46%] sm:block">
          <BrowserFrame shot={media.inset} />
        </div>
      )}
    </div>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 flex items-start gap-2 text-body-sm text-muted">
      <Camera className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {children}
    </p>
  );
}

/* ------------------------------------------------------------------ sections */

function Hero({ page, size, lang }: { page: SystemPage; size: string | null; lang: Lang }) {
  const t = tr(lang);
  return (
    <PageHero
      lang={lang}
      crumb={page.crumb}
      parent={{ label: t("Бүтээгдэхүүн", "Products"), href: "/products" }}
      eyebrow={page.eyebrow}
      title={
        <>
          {page.title} <span className="text-brand-light">{page.accent}</span>
        </>
      }
      description={page.description}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <PillButton href={localize(lang, "/contact")}>{t("Демо, үнийн санал авах", "Get a demo or quote")}</PillButton>
        {size && (
          <a
            href={page.brochure}
            download
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-label-lg font-semibold text-white transition-colors hover:border-white/40"
          >
            <FileDown className="h-4 w-4" /> {t(`Танилцуулга татах · PDF ${size}`, `Brochure · PDF ${size} (Mongolian)`)}
          </a>
        )}
      </div>
      <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-body-md text-slate-300">
        {page.highlights.map((h) => (
          <li key={h} className="flex items-center gap-2">
            <CircleCheck className="h-4 w-4 text-brand-light" /> {h}
          </li>
        ))}
      </ul>
    </PageHero>
  );
}

function Showcase({ page, lang }: { page: SystemPage; lang: Lang }) {
  return (
    <section className="container-x pt-16">
      <Reveal variant="zoom">
        <BrowserFrame shot={page.heroShot} eager />
        <Caption>{page.heroCaption}</Caption>
      </Reveal>
      <nav aria-label={tr(lang)("Хэсгүүд", "Sections")} className="mt-10 flex flex-wrap gap-2">
        {page.features.map((f) => (
          <a key={f.id} href={`#${f.id}`} className="chip transition-colors hover:text-accent">
            {f.eyebrow.split("·")[1]?.trim() ?? f.title}
          </a>
        ))}
      </nav>
    </section>
  );
}

function FeatureRow({ f, i, lang }: { f: Feature; i: number; lang: Lang }) {
  const flip = i % 2 === 1;
  return (
    <section id={f.id} className="container-x grid scroll-mt-28 grid-cols-1 items-center gap-10 pt-24 lg:grid-cols-12 lg:gap-16 lg:pt-32">
      <Reveal variant="left" className={`flex flex-col gap-5 lg:col-span-5 ${flip ? "lg:order-2" : ""}`}>
        <span className="eyebrow">{f.eyebrow}</span>
        <h2 className="text-[clamp(1.9rem,3.6vw,2.9rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-ink">{f.title}</h2>
        <p className="text-body-lg text-muted">{f.text}</p>
        <ol className="mt-2 flex flex-col divide-y divide-line border-y border-line">
          {f.points.map((p, n) => (
            <li key={p.title} className="flex gap-4 py-4">
              <span className="w-7 shrink-0 font-mono text-label-md font-bold text-accent">{String(n + 1).padStart(2, "0")}</span>
              <div>
                <span className="text-body-md font-bold text-ink">{p.title}</span>
                <p className="mt-0.5 text-body-sm text-muted">{p.text}</p>
              </div>
            </li>
          ))}
        </ol>
        {f.note && (
          <p className="flex gap-3 rounded-2xl bg-card p-4 text-body-sm text-ink2 dark:border dark:border-line">
            <Quote className="h-4 w-4 shrink-0 text-accent" /> {f.note}
          </p>
        )}
      </Reveal>
      <Reveal variant="zoom" className={`lg:col-span-7 ${flip ? "lg:order-1" : ""}`}>
        <MediaBlock media={f.media} lang={lang} />
        <Caption>{f.caption}</Caption>
      </Reveal>
    </section>
  );
}

function Flow({ flow }: { flow: NonNullable<SystemPage["flow"]> }) {
  return (
    <section className="px-4 pt-24 sm:px-6 lg:pt-32">
      <Reveal
        variant="zoom"
        className="dark relative mx-auto max-w-[1200px] overflow-hidden rounded-[40px] bg-[#0B1724] p-[clamp(28px,5vw,64px)] text-ink"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_0%_0%,rgba(0,180,216,0.2)_0%,rgba(0,180,216,0)_70%)]" />
        <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className={flow.shots ? "lg:col-span-7" : "lg:col-span-12"}>
            <span className="text-label-sm font-bold uppercase tracking-widest text-brand-light">{flow.eyebrow}</span>
            <h2 className="mt-3 text-[clamp(1.9rem,3.6vw,2.9rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-white">{flow.title}</h2>
            {flow.text && <p className="mt-4 max-w-2xl text-body-lg text-slate-400">{flow.text}</p>}
            <ol className={`mt-9 grid grid-cols-1 gap-3 ${flow.shots ? "" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
              {flow.steps.map((s, n) => (
                <li key={s.title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand font-mono text-label-md font-bold text-navy">{n + 1}</span>
                  <div>
                    <span className="text-body-md font-bold text-white">{s.title}</span>
                    <p className="mt-1 text-body-sm text-slate-400">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            {flow.note && <p className="mt-5 text-body-sm text-slate-500">{flow.note}</p>}
          </div>
          {flow.shots && (
            <div className="flex flex-col items-center justify-center gap-4 lg:col-span-5">
              {flow.shots.map((s, n) => (
                <figure key={s.src} className="w-full max-w-[340px]">
                  <div className="overflow-hidden rounded-[20px] bg-white shadow-2xl ring-1 ring-white/10">
                    <Img shot={s} />
                  </div>
                  <figcaption className="mt-2 text-body-sm text-slate-400">
                    {n + 1}. {s.alt}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}

function Stack({ stack }: { stack: NonNullable<SystemPage["stack"]> }) {
  return (
    <section className="container-x pt-24 lg:pt-32">
      <SheetHeading eyebrow={stack.eyebrow} title={stack.title} description={stack.text} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {stack.items.map((it, i) => (
          <Reveal key={it.title} delay={i * 0.05} className="card flex flex-col gap-1 p-5">
            <span className="text-body-md font-bold text-ink">{it.title}</span>
            <span className="text-body-sm text-muted">{it.text}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Download({ page, size, lang }: { page: SystemPage; size: string | null; lang: Lang }) {
  const t = tr(lang);
  const other = systemPage(page.slug === "smart-parking" ? "smart-hoa" : "smart-parking", lang);
  return (
    <section className="container-x grid grid-cols-1 gap-5 pb-24 pt-24 md:grid-cols-2 lg:pt-32">
      {size && (
        <Reveal className="card card-hover flex flex-col justify-between gap-8 p-7 sm:p-9">
          <div>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-accent">
              <FileDown className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-[1.5rem] font-semibold tracking-tight text-ink">{t("Танилцуулгыг бүтнээр нь татах", "Download the full brochure")}</h3>
            <p className="mt-2 text-body-md text-muted">
              {t(
                "Бодит дэлгэцийн зурагтай танилцуулга. Хамт олон, удирдлагадаа хуваалцахад тохиромжтой.",
                "A brochure with real screenshots, ready to share with your team and management. Available in Mongolian.",
              )}
            </p>
          </div>
          <a href={page.brochure} download className="btn-primary w-fit">
            <FileDown className="h-4 w-4" /> {t("PDF татах", "Download PDF")} · {size}
          </a>
        </Reveal>
      )}
      <Reveal delay={0.06}>
        <Link
          href={localize(lang, `/products/${other.slug}`)}
          className="dark group relative flex h-full flex-col justify-between gap-8 overflow-hidden rounded-[26px] bg-[#0B1724] p-7 text-ink sm:p-9"
        >
          <div>
            <span className="text-label-sm font-bold uppercase tracking-widest text-brand-light">{t("Нөгөө систем", "The other system")}</span>
            <h3 className="mt-3 text-[1.5rem] font-semibold tracking-tight text-white">{other.crumb}</h3>
            <p className="mt-2 text-body-md text-slate-400">{other.description}</p>
          </div>
          <span className="inline-flex items-center gap-2 text-label-lg font-bold text-brand-light">
            {t("Дэлгэрэнгүй үзэх", "View details")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </Reveal>
    </section>
  );
}

export async function SystemDetail({ slug, lang }: { slug: SystemSlug; lang: Lang }) {
  const t = tr(lang);
  const { brochures } = await getContact(lang);
  const base = systemPage(slug, lang);
  const page = { ...base, brochure: (slug === "smart-parking" ? brochures.parking : brochures.hoa) ?? base.brochure };
  const size = fileSize(page.brochure);
  return (
    <>
      <Hero page={page} size={size} lang={lang} />
      <Sheet>
        <Showcase page={page} lang={lang} />
        {page.features.map((f, i) => (
          <FeatureRow key={f.id} f={f} i={i} lang={lang} />
        ))}
        {page.flow && <Flow flow={page.flow} />}
        {page.stack && <Stack stack={page.stack} />}
        <Download page={page} size={size} lang={lang} />
        <CtaZoom
          lang={lang}
          title={
            <>
              {t("Танай объектод", "Tailored to")} <span className="text-brand-light">{t("тохируулъя.", "your site.")}</span>
            </>
          }
          text={t(
            "Shield Nirun-ийн багтай уулзалт товлоорой. Танай нөхцөлд тохирох шийдлийг хамт тодорхойлно.",
            "Book a meeting with the Shield Nirun team and we'll define the right solution for your site together.",
          )}
        />
      </Sheet>
    </>
  );
}

