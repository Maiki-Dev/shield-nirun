import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/sections";
import { alternates, tr, type Lang } from "@/lib/i18n";

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const t = tr(params.lang);
  return {
    title: t("Холбоо барих", "Contact"),
    description: t(
      "Shield Nirun — Royal Tower дахь төв оффис, утас, и-мэйл, төслийн зөвлөгөө ба үнийн санал авах хүсэлт.",
      "Shield Nirun — head office at Royal Tower, phone, email, and requests for project advice and quotes.",
    ),
    alternates: alternates(params.lang, "/contact"),
  };
}

export default function Page({ params }: { params: { lang: Lang } }) {
  return <ContactPage lang={params.lang} />;
}
