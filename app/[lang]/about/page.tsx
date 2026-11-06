import type { Metadata } from "next";
import { AboutPage } from "@/components/about/sections";
import { alternates, tr, type Lang } from "@/lib/i18n";

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const t = tr(params.lang);
  return {
    title: t("Бидний тухай", "About us"),
    description: t(
      "Shield Nirun — хиймэл оюун ухаан, дрон, ухаалаг камер, нэвтрэх хяналтын систем зэрэг технологид суурилсан холбогдсон, автоматжуулсан, найдвартай хамгаалалтын шийдэл.",
      "Shield Nirun — connected, automated and reliable security solutions built on AI, drones, smart cameras and access control.",
    ),
    alternates: alternates(params.lang, "/about"),
  };
}

export default function Page({ params }: { params: { lang: Lang } }) {
  return <AboutPage lang={params.lang} />;
}
