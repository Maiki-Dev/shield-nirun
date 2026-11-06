import { ExternalLink, Handshake, Headset, Mail, MailCheck, MapPin, Navigation, Phone, Store, Wrench } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { PageHero, Sheet, SheetHeading } from "@/components/ui/page-hero";
import { ContactForm } from "@/components/contact/contact-form";
import { getContact } from "@/lib/site-data";
import { tr, type Lang } from "@/lib/i18n";

type P = { lang: Lang };

/** Department channels: confirmed phone + inbox with a subject line. */
const channels = (lang: Lang) => {
  const t = tr(lang);
  return [
    {
      icon: Store, title: t("Борлуулалт & үнийн санал", "Sales & quotes"),
      text: t("Төсвийн санал, байгууллагын гэрээ, танилцуулга уулзалт захиалах.", "Budget proposals, corporate contracts and booking an introductory meeting."),
      subject: t("Борлуулалт", "Sales"),
    },
    {
      icon: Wrench, title: t("Техникийн дэмжлэг", "Technical support"),
      text: t("ANPR камер, дрон, хаалт, нэвтрэх хяналтын системийн асуудал.", "Issues with ANPR cameras, drones, barriers or access control systems."),
      subject: t("Техникийн дэмжлэг", "Technical support"),
    },
    {
      icon: Handshake, title: t("Түншлэл & хамтын ажиллагаа", "Partnerships"),
      text: t("Барилгын компани, СӨХ, тоног төхөөрөмж нийлүүлэгчдийн хамтын ажиллагаа.", "Cooperation with construction companies, HOAs and equipment suppliers."),
      subject: t("Түншлэл", "Partnership"),
    },
  ];
};

/** Google Maps embed (no API key) centred on the company's own map pin. */
const mapSrc = (lat: number, lng: number) => `https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s${lat},${lng}!6i17`;

const mailto = (email: string, subject: string) => `mailto:${email}?subject=${encodeURIComponent(`[Shield Nirun] ${subject}`)}`;

async function Hero({ lang }: P) {
  const t = tr(lang);
  const C = await getContact(lang);
  return (
    <PageHero
      lang={lang}
      crumb={t("Холбоо барих", "Contact")}
      eyebrow={t("Инженерийн зөвлөгөө & хамтын ажиллагаа", "Engineering advice & partnerships")}
      title={
        <>
          {t("Бидэнтэй холбогдох.", "Get in touch.")}{" "}
          <span className="text-brand-light">{t("Хамтран ажиллахад бэлэн.", "Ready to work with you.")}</span>
        </>
      }
      description={t(
        "AI камер, дрон хяналт, нэвтрэх хяналт, ухаалаг зогсоол болон СӨХ-ийн системийн төслүүдэд инженерийн судалгаа, техникийн зөвлөгөө өгнө.",
        "We provide engineering surveys and technical advice for AI camera, drone surveillance, access control, smart parking and HOA system projects.",
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <a
          href={C.phoneHref}
          className="inline-flex items-center justify-center gap-3 rounded-full bg-brand py-1.5 pl-6 pr-1.5 text-label-lg font-bold text-navy transition-colors hover:bg-brand-light"
        >
          {C.phone}
          <span className="grid h-10 w-10 place-items-center rounded-full bg-navy text-white">
            <Phone className="h-4 w-4" />
          </span>
        </a>
        <a
          href={`mailto:${C.email}`}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-label-lg font-semibold text-white hover:border-white/40"
        >
          <Mail className="h-4 w-4" /> {C.email}
        </a>
        <a
          href={C.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-label-lg font-semibold text-white hover:border-white/40"
        >
          <MapPin className="h-4 w-4" /> {C.building}
        </a>
      </div>
    </PageHero>
  );
}

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand/10 text-accent">{icon}</span>
      <div className="min-w-0">
        <span className="text-label-sm font-bold uppercase tracking-widest text-muted">{label}</span>
        {children}
      </div>
    </div>
  );
}

async function Main({ lang }: P) {
  const t = tr(lang);
  const C = await getContact(lang);
  return (
    <section className="container-x grid grid-cols-1 gap-6 pt-16 lg:grid-cols-12">
      <div className="flex flex-col gap-6 lg:col-span-5">
        <Reveal variant="left" className="card flex flex-col gap-7 p-7 sm:p-8">
          <InfoRow icon={<MapPin className="h-6 w-6" />} label={t("Төв оффис", "Head office")}>
            <p className="mt-1 text-[1.25rem] font-semibold text-ink">{C.building}</p>
            <p className="text-body-md text-muted">
              {C.district}, {C.city}
            </p>
          </InfoRow>
          <div className="h-px bg-line" />
          <InfoRow icon={<Headset className="h-6 w-6" />} label={t("Холбогдох утас", "Phone")}>
            <a href={C.phoneHref} className="mt-1 block text-[1.25rem] font-semibold text-accent hover:underline">
              {C.phone}
            </a>
            <p className="text-body-sm text-muted">{t("Зөвлөгөө, үнийн санал, хамтын ажиллагаа", "Advice, quotes and partnerships")}</p>
          </InfoRow>
          <div className="h-px bg-line" />
          <InfoRow icon={<MailCheck className="h-6 w-6" />} label={t("Цахим шуудан", "Email")}>
            <a href={`mailto:${C.email}`} className="mt-1 block truncate text-[1.25rem] font-semibold text-ink hover:text-accent">
              {C.email}
            </a>
            <p className="text-body-sm text-muted">{t("Ерөнхий хүсэлт, үнийн санал", "General enquiries and quotes")}</p>
          </InfoRow>
        </Reveal>

        <Reveal variant="left" className="card flex flex-col gap-3 p-4">
          <div className="relative h-72 w-full overflow-hidden rounded-[20px] bg-soft">
            <iframe
              title={t(`${C.building} — Shield Nirun төв оффисын байршил`, `${C.building} — Shield Nirun head office location`)}
              src={mapSrc(C.lat, C.lng)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full border-0 dark:opacity-90 dark:[filter:invert(0.9)_hue-rotate(180deg)]"
            />
            <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-card px-3 py-1 text-label-sm font-bold uppercase text-ink shadow-sm">
              {C.building}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 px-2 pb-1">
            <span className="flex items-center gap-1.5 text-body-sm text-muted">
              <Navigation className="h-4 w-4 text-accent" /> {C.district}
            </span>
            <a href={C.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-label-md font-bold text-accent hover:underline">
              {t("Google Maps дээр нээх", "Open in Google Maps")} <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </Reveal>
      </div>

      <Reveal variant="zoom" className="card rounded-[30px] p-7 sm:p-10 lg:col-span-7">
        <span className="eyebrow">{t("Хүсэлт илгээх", "Send a request")}</span>
        <h2 className="mt-3 text-[clamp(1.8rem,3.2vw,2.6rem)] font-semibold leading-tight tracking-tight text-ink">
          {t("Төслийн зөвлөгөө & үнийн санал", "Project advice & quote")}
        </h2>
        <p className="mb-8 mt-3 text-body-md text-muted">
          {t(
            "Мэдээллээ үлдээвэл манай инженер тохирох техникийн шийдэл, төсвийн тооцооллыг гаргаж өгнө.",
            "Leave your details and our engineer will prepare a suitable technical solution and budget estimate.",
          )}
        </p>
        <ContactForm />
      </Reveal>
    </section>
  );
}

async function Channels({ lang }: P) {
  const t = tr(lang);
  const C = await getContact(lang);
  return (
    <section className="container-x pb-24 pt-24">
      <SheetHeading center eyebrow={t("Чиглэлээр холбогдох", "Contact by topic")} title={t("Асуудлынхаа чиглэлийг сонгоно уу", "Choose your topic")} />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {channels(lang).map((c, i) => (
          <Reveal key={c.title} delay={i * 0.06} className="card card-hover flex flex-col justify-between p-7">
            <div>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-accent">
                <c.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-[1.3rem] font-semibold tracking-tight text-ink">{c.title}</h3>
              <p className="mt-2 text-body-sm text-muted">{c.text}</p>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-5">
              <a href={C.phoneHref} className="inline-flex items-center gap-1.5 text-label-lg font-bold text-accent hover:underline">
                <Phone className="h-[18px] w-[18px]" /> {C.phone}
              </a>
              <a href={mailto(C.email, c.subject)} className="inline-flex items-center gap-1.5 text-label-lg font-semibold text-muted hover:text-accent">
                <Mail className="h-[18px] w-[18px]" /> {t("И-мэйл", "Email")}
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function ContactPage({ lang }: P) {
  return (
    <>
      <Hero lang={lang} />
      <Sheet>
        <Main lang={lang} />
        <Channels lang={lang} />
      </Sheet>
    </>
  );
}
