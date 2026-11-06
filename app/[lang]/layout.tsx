import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Manrope } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { LangProvider } from "@/components/lang-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { LOCALES, SITE_URL, alternates, isLang, tr, type Lang } from "@/lib/i18n";
import "../globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const generateStaticParams = () => LOCALES.map((lang) => ({ lang }));

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const t = tr(params.lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("Shield Nirun — Ухаалаг хамгаалалт ба цогц шийдэл", "Shield Nirun — Smart Security & best solutions"),
      template: "%s | Shield Nirun",
    },
    description: t(
      "Shield Nirun — хиймэл оюун ухаан, дрон, ухаалаг камер, нэвтрэх хяналтын систем зэрэг технологид суурилсан холбогдсон, автоматжуулсан, найдвартай хамгаалалтын шийдэл санал болгодог.",
      "Shield Nirun delivers connected, automated and reliable security solutions built on artificial intelligence, drones, smart cameras and access control systems.",
    ),
    alternates: alternates(params.lang, "/"),
    openGraph: { locale: t("mn_MN", "en_US"), siteName: "Shield Nirun" },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F9FF" },
    { media: "(prefers-color-scheme: dark)", color: "#070F19" },
  ],
};

export default function LocaleLayout({ children, params }: { children: React.ReactNode; params: { lang: string } }) {
  if (!isLang(params.lang)) notFound();
  const lang = params.lang;
  return (
    <html lang={lang} suppressHydrationWarning className={manrope.variable}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <LangProvider lang={lang}>
            <SmoothScroll />
            <Navbar />
            <main className="min-h-screen pt-20">{children}</main>
            <Footer lang={lang} />
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
