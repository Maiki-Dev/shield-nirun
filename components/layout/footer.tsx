import Link from "next/link";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { footerPages, footerServices, footerSolutions, type NavItem } from "@/lib/content/site";
import { getContact } from "@/lib/site-data";
import { LaunchSwitch } from "@/components/brand/coming-soon-gate";
import { localize, tr, type Lang } from "@/lib/i18n";

function LinkColumn({ title, links, lang }: { title: string; links: NavItem[]; lang: Lang }) {
  return (
    <nav aria-label={title} className="flex flex-col gap-4">
      <span className="text-label-lg font-bold text-ink">{title}</span>
      <ul className="flex flex-col gap-2.5 text-body-sm">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={localize(lang, l.href)} className="text-muted transition-colors hover:text-accent">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export async function Footer({ lang }: { lang: Lang }) {
  const t = tr(lang);
  const C = await getContact(lang);
  return (
    <footer className="dark w-full border-t border-line bg-[#070F19] text-ink">
      <div className="container-x py-14 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          <div className="flex flex-col gap-4 sm:col-span-2">
            <Logo className="h-12" href={localize(lang, "/")} />
            <p className="max-w-sm text-body-md text-muted">
              {t(
                "Манай байгууллага хиймэл оюун ухаан, дрон, ухаалаг камер, нэвтрэх хяналтын систем зэрэг технологид суурилсан холбогдсон, автоматжуулсан, найдвартай хамгаалалтын шийдэл санал болгодог.",
                "We deliver connected, automated and reliable security solutions built on artificial intelligence, drones, smart cameras and access control systems.",
              )}
            </p>
          </div>

          <LaunchSwitch
            before={<LinkColumn lang={lang} title={t("Үйлчилгээнүүд", "Services")} links={footerServices(lang)} />}
            after={<LinkColumn lang={lang} title={t("Shield+ шийдлүүд", "Shield+ solutions")} links={footerSolutions(lang)} />}
          />
          <LinkColumn lang={lang} title={t("Хуудсууд", "Pages")} links={footerPages(lang)} />

          <div className="flex flex-col gap-4">
            <span className="text-label-lg font-bold text-ink">{t("Холбоо барих", "Contact")}</span>
            <address className="flex flex-col gap-3 text-body-sm not-italic text-muted">
              <span className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <a href={C.mapUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">
                  {C.line}
                </a>
              </span>
              <a href={C.phoneHref} className="flex items-center gap-2 transition-colors hover:text-accent">
                <Phone className="h-4 w-4 shrink-0 text-accent" />
                {C.phone}
              </a>
              <a href={`mailto:${C.email}`} className="flex items-center gap-2 transition-colors hover:text-accent">
                <Mail className="h-4 w-4 shrink-0 text-accent" />
                {C.email}
              </a>
              <Link href={localize(lang, "/contact")} className="flex items-center gap-2 font-semibold text-accent hover:underline">
                <Send className="h-4 w-4 shrink-0" />
                {t("Хүсэлт илгээх", "Send a request")}
              </Link>
            </address>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 text-label-md text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Shield Nirun LLC. {t("Бүх эрх хуулиар хамгаалагдсан.", "All rights reserved.")}</p>
          <div className="flex items-center gap-6">
            <Link href={localize(lang, "/contact")} className="transition-colors hover:text-accent">
              {t("Нууцлалын бодлого", "Privacy policy")}
            </Link>
            <Link href={localize(lang, "/contact")} className="transition-colors hover:text-accent">
              {t("Үйлчилгээний нөхцөл", "Terms of service")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
