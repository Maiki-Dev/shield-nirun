import type { Metadata } from "next";
import { HomeHero, HomeSheet } from "@/components/home/sections";
import { alternates, DEFAULT_LANG, SITE_URL, type Lang } from "@/lib/i18n";

export const generateMetadata = ({ params }: { params: { lang: Lang } }): Metadata => ({ alternates: alternates(params.lang, "/") });

const siteName = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Shield Nirun",
  url: new URL("/", SITE_URL).href,
};

export default function HomePage({ params }: { params: { lang: Lang } }) {
  return (
    <>
      {params.lang === DEFAULT_LANG && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteName) }} />
      )}
      <HomeHero lang={params.lang} />
      <HomeSheet lang={params.lang} />
    </>
  );
}
