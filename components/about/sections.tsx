/* eslint-disable @next/next/no-img-element */
import { CircleCheck, Eye, Flag, ShieldCheck } from "lucide-react";
import { PortraitPreview } from "@/components/about/portrait-preview";
import { Reveal } from "@/components/ui/reveal";
import { PageHero, Sheet, SheetHeading } from "@/components/ui/page-hero";
import { PillButton } from "@/components/ui/pill-button";
import { CtaZoom } from "@/components/ui/cta-zoom";
import { getLeaderTree, type LeaderNode } from "@/lib/site-data";
import { companyStatement } from "@/lib/content/home";
import { aboutContent } from "@/lib/content/about";
import { localize, tr, type Lang } from "@/lib/i18n";

type P = { lang: Lang };

function Hero({ lang }: P) {
  const t = tr(lang);
  return (
    <PageHero
      lang={lang}
      crumb={t("Бидний тухай", "About us")}
      eyebrow={t("Shield Nirun ХХК", "Shield Nirun LLC")}
      title={
        <>
          {t("Мэргэшсэн баг,", "Expert people,")}{" "}
          <span className="text-brand-light">{t("ухаалаг технологи.", "smart technology.")}</span>
        </>
      }
      description={t(
        "Хиймэл оюун ухаан, дрон, ухаалаг камер, нэвтрэх хяналтыг мэргэшсэн хамгаалалттай хослуулдаг баг.",
        "A team that combines artificial intelligence, drones, smart cameras and access control with professional security.",
      )}
    >
      <PillButton href={localize(lang, "/contact")}>{t("Бидэнтэй холбогдох", "Contact us")}</PillButton>
    </PageHero>
  );
}

function Statement({ lang }: P) {
  const t = tr(lang);
  const { ABOUT_HERO, TECH_PILLARS } = aboutContent(lang);
  return (
    <section className="container-x grid grid-cols-1 items-center gap-12 pt-20 lg:grid-cols-12 lg:gap-16 lg:pt-24">
      <Reveal variant="left" className="lg:col-span-7">
        <span className="eyebrow">{t("Бид хэн бэ", "Who we are")}</span>
        <p className="mt-5 text-[clamp(1.6rem,3.2vw,2.5rem)] font-semibold leading-[1.2] tracking-[-0.02em] text-ink">
          {t("Манай байгууллага", "We")} <span className="text-accent">{companyStatement(lang)}</span>.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TECH_PILLARS.map((item) => (
            <div key={item.title} className="flex flex-col gap-2 rounded-2xl bg-card p-4 dark:border dark:border-line">
              <item.icon className="h-6 w-6 text-accent" />
              <span className="text-label-lg font-bold text-ink">{item.title}</span>
            </div>
          ))}
        </div>
      </Reveal>
      <Reveal variant="zoom" className="relative lg:col-span-5">
        <div className="overflow-hidden rounded-[30px]">
          <img src={ABOUT_HERO.image} alt={ABOUT_HERO.imageAlt} className="h-[380px] w-full object-cover sm:h-[480px]" />
        </div>
        <div className="sn-float absolute -bottom-6 left-6 right-6 flex items-center justify-between rounded-3xl bg-card p-5 shadow-[0_24px_50px_rgba(11,25,44,0.16)] dark:border dark:border-line">
          <div>
            <span className="block text-label-sm font-bold uppercase tracking-widest text-accent">{t("Нэгдсэн хамгаалалт", "Integrated protection")}</span>
            <span className="text-headline-sm font-bold text-ink">{t("AI · Дрон · Камер · Нэвтрэлт", "AI · Drones · Cameras · Access")}</span>
          </div>
          <ShieldCheck className="h-8 w-8 text-accent" />
        </div>
      </Reveal>
    </section>
  );
}

function Technology({ lang }: P) {
  const t = tr(lang);
  const { TECH_PILLARS } = aboutContent(lang);
  return (
    <section className="container-x pt-28">
      <SheetHeading
        eyebrow={t("Технологийн суурь", "Technology foundation")}
        title={t("Бидний ашигладаг технологи", "The technology we use")}
        description={t(
          "Эдгээрийг нэг системд нэгтгэж, хүний оролцоо багатай, найдвартай хамгаалалтын цогц шийдэл болгодог.",
          "We bring them together in one system as a complete, reliable security solution that needs minimal manual work.",
        )}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {TECH_PILLARS.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.06} className="card card-hover flex flex-col gap-4 p-7">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-accent">
              <item.icon className="h-6 w-6" />
            </span>
            <h3 className="text-[1.3rem] font-semibold tracking-tight text-ink">{item.title}</h3>
            <p className="text-body-sm text-muted">{item.text}</p>
            <ul className="mt-auto flex flex-col gap-1.5 pt-2 text-body-sm text-ink2">
              {item.points.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <CircleCheck className="h-4 w-4 shrink-0 text-accent" /> {p}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Purpose({ lang }: P) {
  const t = tr(lang);
  const { VISION, MISSION } = aboutContent(lang);
  return (
    <section className="container-x pt-24">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Reveal variant="tilt-a" className="dark relative overflow-hidden rounded-[30px] bg-[#0B1724] p-8 text-ink sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_70%_at_100%_0%,rgba(0,180,216,0.22)_0%,rgba(0,180,216,0)_70%)]" />
          <Eye className="relative h-8 w-8 text-brand-light" />
          <span className="relative mt-6 block text-label-sm font-bold uppercase tracking-widest text-brand-light">{t("Алсын хараа", "Vision")}</span>
          <h3 className="relative mt-2 text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-tight tracking-tight text-white">{VISION.title}</h3>
          <p className="relative mt-4 text-body-lg text-slate-400">{VISION.text}</p>
        </Reveal>
        <Reveal variant="tilt-b" className="card p-8 sm:p-10">
          <Flag className="h-8 w-8 text-accent" />
          <span className="mt-6 block text-label-sm font-bold uppercase tracking-widest text-accent">{t("Эрхэм зорилго", "Mission")}</span>
          <h3 className="mt-2 text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-tight tracking-tight text-ink">{MISSION.title}</h3>
          <p className="mt-4 text-body-lg text-muted">{MISSION.text}</p>
        </Reveal>
      </div>
    </section>
  );
}

function Values({ lang }: P) {
  const t = tr(lang);
  const { VALUES } = aboutContent(lang);
  return (
    <section className="container-x pt-24">
      <SheetHeading eyebrow={t("Үнэт зүйлс", "Values")} title={t("Бидний баримталдаг зарчим", "The principles we follow")} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map((v, i) => (
          <Reveal key={v.title} delay={i * 0.06} className="card card-hover flex flex-col gap-4 p-7">
            <div className="flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand/10 text-accent">
                <v.icon className="h-5 w-5" />
              </span>
              <span className="sn-grad-num text-[2.25rem] font-bold leading-none">{v.no}</span>
            </div>
            <h3 className="text-[1.2rem] font-semibold tracking-tight text-ink">{v.title}</h3>
            <p className="text-body-sm text-muted">{v.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function OrgCard({ p, lang }: { p: LeaderNode; lang: Lang }) {
  const t = tr(lang);
  return (
    <PortraitPreview
      photo={p.photo}
      position={p.photoPosition}
      name={p.name}
      role={p.role}
      closeLabel={t("Хаах", "Close")}
    />
  );
}

function OrgBranch({ nodes, lang }: { nodes: LeaderNode[]; lang: Lang }) {
  return (
    <ul>
      {nodes.map((n) => (
        <li key={n.id}>
          <OrgCard p={n} lang={lang} />
          {n.reports.length > 0 && <OrgBranch nodes={n.reports} lang={lang} />}
        </li>
      ))}
    </ul>
  );
}

function branchWidth(nodes: LeaderNode[]): number {
  return nodes.reduce((width, node) => width + Math.max(1, branchWidth(node.reports)), 0);
}

/** Leadership as an org chart: built from each person's "reports to" in the admin, so it re-lays itself out. */
async function Leadership({ lang }: P) {
  const t = tr(lang);
  const tree = await getLeaderTree(lang);
  if (!tree.length) return null;

  return (
    <section className="container-x py-12 sm:py-16">
      <SheetHeading
        eyebrow={t("Компанийн бүтэц", "Organizational Structure")}
        title={t("Манай хамт олон", "Our team")}
        description={t(
          "Shield Nirun-ийн удирдлагын баг технологи, мэргэшсэн хамгаалалтыг хослуулан найдвартай үйлчилгээ үзүүлдэг.",
          "Shield Nirun's leadership combines technology with professional security to give every client smart, reliable protection.",
        )}
      />
      <Reveal variant="zoom" className={`org-tree mx-auto ${branchWidth(tree) <= 5 ? "org-tree-balanced" : ""}`}>
        <OrgBranch nodes={tree} lang={lang} />
      </Reveal>
    </section>
  );
}

export function AboutPage({ lang }: P) {
  const t = tr(lang);
  return (
    <>
      <Hero lang={lang} />
      <Sheet>
        <Statement lang={lang} />
        <Technology lang={lang} />
        <Purpose lang={lang} />
        <Values lang={lang} />
        <Leadership lang={lang} />
        <CtaZoom
          lang={lang}
          title={
            <>
              {t("Хамтран ажиллах уу?", "Shall we work together?")} <span className="text-brand-light">{t("Бид бэлэн.", "We're ready.")}</span>
            </>
          }
          text={t(
            "AI камер, дрон хяналт, нэвтрэх хяналт болон ухаалаг зогсоолын шийдлийн талаар манай инженерийн багаас үнэгүй зөвлөгөө аваарай.",
            "Get free advice from our engineering team on AI cameras, drone surveillance, access control and smart parking.",
          )}
        />
      </Sheet>
    </>
  );
}
