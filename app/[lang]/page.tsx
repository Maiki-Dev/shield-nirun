import type { Metadata } from "next";
import { HomeHero, HomeSheet } from "@/components/home/sections";
import { alternates, type Lang } from "@/lib/i18n";

export const generateMetadata = ({ params }: { params: { lang: Lang } }): Metadata => ({ alternates: alternates(params.lang, "/") });

export default function HomePage({ params }: { params: { lang: Lang } }) {
  return (
    <>
      <HomeHero lang={params.lang} />
      <HomeSheet lang={params.lang} />
    </>
  );
}
