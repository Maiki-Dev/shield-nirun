/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowRight, Check, MoveUpRight } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";
import { productsContent } from "@/lib/content/products";
import { alternates, localize, tr, type Lang } from "@/lib/i18n";

type Props = { params: { lang: Lang } };

export function generateMetadata({ params }: Props): Metadata {
  const t = tr(params.lang);
  return {
    title: t("Shield+ — Нэгдсэн ухаалаг шийдлүүд", "Shield+ — Connected smart solutions"),
    description: t(
      "Ухаалаг зогсоол, СӨХ-ийн нэгдсэн систем, хиймэл оюун ухаанд суурилсан хамгаалалтын шийдлүүд — бүгд нэг брэндийн дор.",
      "Smart parking, unified HOA management and AI-powered security solutions, brought together under one brand.",
    ),
    alternates: alternates(params.lang, "/products/shield-plus"),
  };
}

export default function ShieldPlusPage({ params }: Props) {
  const { lang } = params;
  const t = tr(lang);
  const { PARKING, HOA } = productsContent(lang);
  const highlights = [
    t("Холбогдсон технологи", "Connected technology"),
    t("Нэгдсэн удирдлага", "Unified management"),
    t("Тасралтгүй дэмжлэг", "Ongoing support"),
  ];

  return (
    <main className="overflow-hidden bg-[#070F19] text-white">
      <section className="relative isolate min-h-[720px] overflow-hidden sm:min-h-[780px]">
        <img
          src="/images/site/about-hero.webp"
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#070F19_0%,rgba(7,15,25,0.94)_34%,rgba(7,15,25,0.48)_75%,rgba(7,15,25,0.5)_100%),linear-gradient(0deg,#070F19_0%,transparent_55%)]" />
        <div aria-hidden className="pointer-events-none absolute -right-16 top-24 -z-10 select-none font-sans text-[min(75vw,64rem)] font-extrabold leading-[0.7] tracking-[-0.1em] text-white/[0.035]">+</div>
        <div className="container-x relative flex min-h-[720px] flex-col justify-center pb-40 pt-36 sm:min-h-[780px] sm:pb-48">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-label-sm font-bold uppercase tracking-[0.2em] text-brand-light backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-light shadow-[0_0_14px_#00C2FF]" />
              {t("Нэг экосистем · Нэг зорилго", "ONE ECOSYSTEM · ONE PURPOSE")}
            </span>
            <h1 className="mt-8 text-[clamp(4rem,13vw,10rem)] font-extrabold leading-[0.76] tracking-[-0.09em]" aria-label="Shield Plus">
              SHIELD<span className="text-[#E5243B]">+</span>
            </h1>
            <p className="mt-8 max-w-2xl text-[clamp(1.5rem,3.8vw,2.7rem)] font-medium leading-[1.14] tracking-[-0.035em] text-white/90">
              {t("Технологи, хамгаалалт, өдөр тутмын амьдрал — нэг цогц шийдэл.", "Technology, security and everyday life — working as one.")}
            </p>
            <p className="mt-5 max-w-xl text-body-lg text-slate-300">
              {t(
                "Орон сууц, байгууллага, олон нийтийн орчныг илүү ухаалаг, илүү холбогдсон болгох Shield Nirun-ий нэгдсэн шийдлүүд.",
                "A connected suite of Shield Nirun solutions to make residential communities, businesses and shared spaces work smarter.",
              )}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#film" className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-label-lg font-bold text-navy transition-colors hover:bg-brand-light">
                {t("Танилцуулга үзэх", "Watch the introduction")} <ArrowDown aria-hidden="true" className="h-4 w-4" />
              </a>
              <PillButton href={localize(lang, "/contact")}>{t("Шийдлээ ярилцах", "Talk about your project")}</PillButton>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-8">
            <div className="container-x flex flex-wrap gap-x-8 gap-y-3 border-t border-white/15 pt-5 text-label-sm font-semibold text-slate-300">
              {highlights.map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <Check aria-hidden="true" className="h-4 w-4 text-brand-light" /> {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="film" className="relative z-10 -mt-20 scroll-mt-24 pb-24 sm:-mt-28 sm:pb-32">
        <div className="container-x">
          <div className="grid overflow-hidden rounded-[30px] border border-white/10 bg-[#0C1724] shadow-[0_36px_100px_-40px_rgba(0,0,0,0.8)] lg:grid-cols-[0.72fr_1.28fr]">
            <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-12">
              <div>
                <span className="text-label-sm font-bold uppercase tracking-[0.2em] text-brand-light">{t("Брэндийн кино", "BRAND FILM")}</span>
                <h2 className="mt-5 text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[1.03] tracking-[-0.04em]">
                  {t("Илүү ухаалаг орчныг хамтдаа бүтээе.", "Let’s build a smarter place to live.")}
                </h2>
                <p className="mt-5 text-body-md leading-relaxed text-slate-400">
                  {t(
                    "Shield+ бол тус тусдаа ажилладаг төхөөрөмжүүд биш. Хүмүүс, технологи, үйлчилгээг нэг зорилгын төлөө холбох арга юм.",
                    "Shield+ is more than a collection of separate products. It brings people, technology and services together around one shared goal.",
                  )}
                </p>
              </div>
              <span className="mt-8 font-mono text-label-sm tracking-[0.18em] text-white/40">SHIELD NIRUN · ULAANBAATAR</span>
            </div>
            <div className="relative aspect-video bg-black lg:aspect-auto lg:min-h-[460px]">
              <iframe
                src="https://www.youtube-nocookie.com/embed/EAttSKH382I?rel=0"
                title={t("Shield+ брэндийн танилцуулга видео", "Shield+ brand introduction video")}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F1F4F9] py-24 text-ink sm:py-32">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <span className="text-label-sm font-bold uppercase tracking-[0.2em] text-accent">{t("Нэг нэрийн дор", "ALL UNDER ONE NAME")}</span>
              <h2 className="mt-4 max-w-xl text-[clamp(2.4rem,6vw,5rem)] font-semibold leading-[0.98] tracking-[-0.06em]">
                {t("Бүгд илүү сайн ажиллана.", "Everything works better together.")}
              </h2>
            </div>
            <p className="max-w-2xl pb-1 text-body-lg text-muted">
              {t(
                "Зогсоолын хөдөлгөөнөөс эхлээд оршин суугчийн хүсэлт, төлбөр, хамгаалалтын хяналт хүртэлх үйл явцыг уялдуулж, удирдлагад нэг ойлгомжтой зураглалыг бий болгоно.",
                "Connect the everyday flow of a place—from parking and resident requests to payments and security—so teams can manage it with a clearer, more complete view.",
              )}
            </p>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-2">
            <Link href={localize(lang, "/products/smart-parking")} className="group relative min-h-[420px] overflow-hidden rounded-[30px] bg-[#0B192C]">
              <img src="/images/site/product-parking.webp" alt={t("Ухаалаг зогсоолын систем", "Smart parking system")} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07111E] via-[#07111E]/45 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
                <span className="text-label-sm font-bold uppercase tracking-[0.18em] text-brand-light">01 · {t("ХӨДӨЛГӨӨН", "MOVEMENT")}</span>
                <h3 className="mt-3 text-headline-lg font-semibold text-white">{t("Ухаалаг зогсоол", "Smart parking")}</h3>
                <p className="mt-2 max-w-lg text-body-sm text-white/75">{PARKING.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-label-lg font-bold text-white">{t("Системтэй танилцах", "Explore the system")} <MoveUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></span>
              </div>
            </Link>

            <Link href={localize(lang, "/products/smart-hoa")} className="group relative min-h-[420px] overflow-hidden rounded-[30px] bg-[#0B192C]">
              <img src="/images/site/product-hoa.webp" alt={t("СӨХ-ийн нэгдсэн систем", "Unified HOA system")} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07111E] via-[#07111E]/45 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
                <span className="text-label-sm font-bold uppercase tracking-[0.18em] text-brand-light">02 · {t("ХАМТ ОЛОН", "COMMUNITY")}</span>
                <h3 className="mt-3 text-headline-lg font-semibold text-white">{t("СӨХ-ийн нэгдсэн систем", "Unified HOA system")}</h3>
                <p className="mt-2 max-w-lg text-body-sm text-white/75">{HOA.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-label-lg font-bold text-white">{t("Системтэй танилцах", "Explore the system")} <MoveUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#070F19] py-24 sm:py-32">
        <div aria-hidden className="pointer-events-none absolute -left-40 top-0 h-[32rem] w-[32rem] rounded-full bg-brand/10 blur-[120px]" />
        <div className="container-x relative">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <span className="text-label-sm font-bold uppercase tracking-[0.2em] text-brand-light">{t("Суурь нь найдвартай", "BUILT ON A STRONG FOUNDATION")}</span>
              <h2 className="mt-4 text-[clamp(2.4rem,5vw,4.4rem)] font-semibold leading-[0.98] tracking-[-0.055em]">
                {t("Зөвхөн ухаалаг биш. Найдвартай.", "Not just smart. Dependable.")}
              </h2>
              <p className="mt-5 max-w-lg text-body-lg text-slate-400">
                {t("Хэрэгцээнд тохирсон техник хангамж, зөв суурилуулалт, бодит хүмүүсийн дэмжлэгээр шийдэл өдөр бүр найдвартай ажиллана.", "Thoughtful hardware, careful installation and support from real people help keep each solution reliable day after day.")}
              </p>
              <Link href={localize(lang, "/products#hardware")} className="mt-7 inline-flex items-center gap-2 text-label-lg font-bold text-brand-light hover:text-white">
                {t("Техник хангамж үзэх", "Explore the infrastructure")} <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { title: t("Холболт", "Connectivity"), text: t("Системүүдийг нэгтгэх дэд бүтэц.", "Infrastructure that brings systems together."), image: "/images/site/hw-server.webp" },
                { title: t("Тасралтгүй ажиллагаа", "Continuity"), text: t("Тогтвортой ажиллахад зориулсан тоног төхөөрөмж.", "Equipment chosen for dependable operation."), image: "/images/site/hw-ups.webp" },
                { title: t("Хяналт", "Protection"), text: t("Орчны аюулгүй байдлыг дэмжих шийдэл.", "Solutions that support safer shared spaces."), image: "/images/site/hw-security.webp" },
              ].map((item) => (
                <article key={item.title} className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.035]">
                  <img src={item.image} alt="" loading="lazy" className="h-44 w-full object-cover opacity-85" />
                  <div className="p-5">
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-body-sm text-slate-400">{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(120deg,#00C2FF_0%,#00A3C9_48%,#0B5F7E_100%)] px-5 py-20 text-white sm:px-8 sm:py-24">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <span className="text-label-sm font-bold uppercase tracking-[0.2em] text-white/75">{t("Дараагийн алхам", "THE NEXT STEP")}</span>
            <h2 className="mt-4 max-w-2xl text-[clamp(2.3rem,5.5vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.055em]">
              {t("Танай орчинд Shield+ ямар боломж нээх вэ?", "What could Shield+ make possible for your place?")}
            </h2>
          </div>
          <PillButton href={localize(lang, "/contact")} className="shrink-0">{t("Бидэнтэй холбогдох", "Talk to our team")}</PillButton>
        </div>
      </section>
    </main>
  );
}
