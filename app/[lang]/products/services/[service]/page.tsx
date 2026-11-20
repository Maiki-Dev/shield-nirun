/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, CircleCheck } from "lucide-react";
import { PageHero, Sheet } from "@/components/ui/page-hero";
import { PillButton } from "@/components/ui/pill-button";
import { serviceDetails } from "@/lib/content/service-details";
import { alternates, localize, tr, type Lang } from "@/lib/i18n";
import { getServices } from "@/lib/site-data";

type Props = { params: { lang: Lang; service: string } };

const ACCESS_CONTROL_PHOTO = "/images/services/access-control-screening.jpg";

const SERVICE_IMAGES: Partial<Record<string, string[]>> = {
  cctv: ["/images/site/lpr-camera.webp"],
  drone: ["/images/services/drone-event-aerial.jpg"],
  shield: ["/images/services/security-event-guard.jpg", "/images/services/security-event-team.jpg"],
  network: ["/images/site/hw-server.webp"],
  wrench: ["/images/site/hw-ups.webp"],
  software: ["/images/systems/hoa-admin-dashboard.webp"],
  mine: ["/images/services/mine-shield.jpg"],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = (await getServices(params.lang)).find((item) => item.slug === params.service);
  if (!service) notFound();
  return {
    title: service.title,
    description: service.text,
    alternates: alternates(params.lang, `/products/services/${service.slug}`),
  };
}

export default async function ServicePage({ params }: Props) {
  const { lang } = params;
  const t = tr(lang);
  const service = (await getServices(lang)).find((item) => item.slug === params.service);
  if (!service) notFound();
  const details = serviceDetails(lang, service.slug);
  const [image, ...gallery] = service.key === "door"
    ? [ACCESS_CONTROL_PHOTO, ...service.images.filter((src) => src !== ACCESS_CONTROL_PHOTO)]
    : service.images.length
      ? service.images
      : SERVICE_IMAGES[service.key] ?? ["/images/site/hw-security.webp"];
  const relatedServices = (await getServices(lang)).filter((item) => item.slug !== service.slug).slice(0, 3);

  return (
    <>
      <PageHero
        lang={lang}
        crumb={service.title}
        parent={{ label: t("Үйлчилгээнүүд", "Services"), href: "/products#services" }}
        eyebrow={t("Shield Nirun-ийн үйлчилгээ", "Shield Nirun services")}
        title={service.title}
        description={service.text}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <PillButton href={localize(lang, "/contact")}>{t("Зөвлөгөө авах", "Talk to our team")}</PillButton>
          <a href="#service-scope" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-label-lg font-semibold text-white transition-colors hover:border-white/40">
            {t("Үйлчилгээний хүрээ", "Explore the service")} <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </PageHero>
      <Sheet>
        <section className="container-x pb-16 pt-8 sm:pb-20 sm:pt-12">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-14">
            <div className="py-2">
              <span className="eyebrow">{t("Таны хэрэгцээнд нийцүүлнэ", "MADE FOR YOUR NEEDS")}</span>
              <h2 className="mt-4 text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-ink">
                {t("Төлөвлөлтөөс эхлээд найдвартай хүлээлгэн өгөх хүртэл.", "A considered solution, from planning to handover.")}
              </h2>
              <p className="mt-5 max-w-xl text-body-lg text-muted">{service.text}</p>
              <div className="mt-7 flex flex-wrap gap-2">
                {[t("Танд тохирсон төлөвлөгөө", "A plan built around you"), t("Нягт нямбай гүйцэтгэл", "Careful execution"), t("Тодорхой хүлээлгэн өгөлт", "A clear handover")].map((item) => (
                  <span key={item} className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-2 text-label-md font-semibold text-ink2">
                    <Check aria-hidden="true" className="h-3.5 w-3.5 text-accent" /> {item}
                  </span>
                ))}
              </div>
            </div>
            <figure className="group relative min-h-[300px] overflow-hidden rounded-[30px] bg-navy shadow-[0_30px_70px_-24px_rgba(11,25,44,0.42)] sm:min-h-[420px]">
              <img
                src={image}
                alt={image === ACCESS_CONTROL_PHOTO
                  ? t("Металл илрүүлэгч хаалгатай нэвтрэх хяналтын цэг", "Access control checkpoint with a walk-through metal detector")
                  : t(`${service.title} үйлчилгээний зураг`, `${service.title} service illustration`)}
                fetchPriority="high"
                className={`absolute inset-0 h-full w-full object-cover${image === ACCESS_CONTROL_PHOTO ? " object-[50%_40%]" : ""}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07111E]/85 via-[#07111E]/10 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-6 sm:p-8">
                <div>
                  <span className="text-label-sm font-bold uppercase tracking-[0.18em] text-brand-light">{t("Shield Nirun · үйлчилгээ", "Shield Nirun · service")}</span>
                  <p className="mt-2 max-w-md text-headline-md font-semibold text-white">{service.title}</p>
                </div>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-label-sm font-bold text-white backdrop-blur">
                  {t("Зөвлөгөө · Гүйцэтгэл · Дэмжлэг", "Consult · Deliver · Support")}
                </span>
              </figcaption>
            </figure>
          </div>

          {gallery.length > 0 && (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {gallery.map((src, index) => (
                <img
                  key={src}
                  src={src}
                  alt={t(`${service.title} үйлчилгээний нэмэлт зураг ${index + 2}`, `${service.title} service photo ${index + 2}`)}
                  loading="lazy"
                  className="h-64 w-full rounded-2xl bg-soft object-cover sm:h-80"
                />
              ))}
            </div>
          )}

          <section id="service-scope" className="scroll-mt-28 pt-20 sm:pt-24">
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="eyebrow">{t("Юу багтах вэ", "WHAT'S INCLUDED")}</span>
                <h2 className="mt-3 text-[clamp(1.8rem,3.5vw,2.7rem)] font-semibold leading-tight tracking-tight text-ink">
                  {t("Үйлчилгээний хүрээ", "Scope of work")}
                </h2>
              </div>
              <p className="max-w-md text-body-md text-muted">
                {t("Таны объект, зорилго, ашиглалтын нөхцөлд нийцүүлэн ажлын хүрээг тодорхойлно.", "We shape the scope around your site, goals and day-to-day requirements.")}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {details.map((detail, index) => (
                <article key={detail} className="card flex min-h-52 flex-col justify-between gap-8 p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-label-md font-bold tracking-widest text-accent">{String(index + 1).padStart(2, "0")}</span>
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/10 text-accent">
                      <CircleCheck aria-hidden="true" className="h-5 w-5" />
                    </span>
                  </div>
                  <p className="text-body-md font-medium leading-relaxed text-ink2">{detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-20 overflow-hidden rounded-[30px] bg-navy p-6 text-white dark:border dark:border-line sm:mt-24 sm:p-10 lg:p-12">
            <div className="max-w-2xl">
              <span className="text-label-sm font-bold uppercase tracking-[0.18em] text-brand-light">{t("Хамтын ажиллагааны үе шат", "A CLEAR WAY FORWARD")}</span>
              <h2 className="mt-3 text-[clamp(1.8rem,3.5vw,2.7rem)] font-semibold leading-tight tracking-tight">
                {t("Эхний уулзалтаас ашиглалтад оруулах хүртэл.", "From the first conversation to delivery.")}
              </h2>
            </div>
            <ol className="mt-8 grid gap-3 md:grid-cols-3">
              {[
                [t("Хэрэгцээг ойлгох", "Understand"), t("Зорилго, нөхцөл болон одоо ашиглаж буй шийдлийг танилцана.", "We learn your goals, requirements and existing setup.")],
                [t("Төлөвлөгөө гаргах", "Plan"), t("Тохирох ажлын хүрээ, шийдэл болон дарааллыг тодорхойлно.", "We define a suitable scope, approach and sequence.")],
                [t("Гүйцэтгэж шалгах", "Deliver"), t("Ажлыг гүйцэтгэж, үр дүнг шалган, дараагийн алхмыг танилцуулна.", "We complete the work, verify the result and walk you through next steps.")],
              ].map(([title, description], index) => (
                <li key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
                  <span className="font-mono text-label-md font-bold tracking-widest text-brand-light">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-5 text-headline-sm font-semibold">{title}</h3>
                  <p className="mt-2 text-body-sm text-slate-300">{description}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-16 flex flex-col gap-5 rounded-[28px] border border-line bg-card p-6 sm:mt-20 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <span className="eyebrow">{t("Дараагийн алхам", "NEXT STEP")}</span>
              <h2 className="mt-2 text-headline-md font-semibold text-ink">{t("Төслөө хамтдаа ярилцъя.", "Let's talk about your project.")}</h2>
              <p className="mt-1 text-body-sm text-muted">{t("Танд тохирох шийдлийн талаар манай багтай холбогдоорой.", "Tell us what you need and our team will help you explore the right approach.")}</p>
            </div>
            <PillButton href={localize(lang, "/contact")}>{t("Холбоо барих", "Get in touch")}</PillButton>
          </section>

          {relatedServices.length > 0 && (
            <section className="pt-16 sm:pt-20">
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <span className="eyebrow">{t("Бусад үйлчилгээ", "MORE SERVICES")}</span>
                  <h2 className="mt-2 text-headline-md font-semibold text-ink">{t("Бусад шийдлүүдтэй танилцах", "Explore more services")}</h2>
                </div>
                <Link href={localize(lang, "/products#services")} className="hidden items-center gap-1 text-label-md font-bold text-accent hover:underline sm:inline-flex">
                  {t("Бүгдийг үзэх", "View all")} <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {relatedServices.map((item) => (
                  <Link key={item.id} href={localize(lang, `/products/services/${item.slug}`)} className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-card p-5 transition-colors hover:border-brand/40">
                    <span className="font-semibold text-ink">{item.title}</span>
                    <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-accent transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
              <Link href={localize(lang, "/products#services")} className="mt-4 inline-flex items-center gap-2 text-body-sm font-semibold text-accent hover:underline sm:hidden">
                <ArrowLeft aria-hidden="true" className="h-4 w-4" /> {t("Бүх үйлчилгээг харах", "View all services")}
              </Link>
            </section>
          )}
        </section>
      </Sheet>
    </>
  );
}
