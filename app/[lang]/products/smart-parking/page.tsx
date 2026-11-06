import type { Metadata } from "next";
import { SystemDetail } from "@/components/systems/system-detail";
import { ComingSoonPage, isShieldPlusLive } from "@/components/brand/coming-soon-page";
import { systemPage } from "@/lib/content/systems";
import { alternates, tr, type Lang } from "@/lib/i18n";

/** Re-checked every minute so the page opens by itself at the Shield+ launch (no rebuild needed). */
export const revalidate = 60;

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  if (!isShieldPlusLive()) {
    return { title: tr(params.lang)("Shield+ — тун удахгүй", "Shield+ — coming soon"), robots: { index: false } };
  }
  const { meta } = systemPage("smart-parking", params.lang);
  return { title: meta.title, description: meta.description, alternates: alternates(params.lang, "/products/smart-parking") };
}

export default function Page({ params }: { params: { lang: Lang } }) {
  if (!isShieldPlusLive()) return <ComingSoonPage lang={params.lang} />;
  return <SystemDetail slug="smart-parking" lang={params.lang} />;
}
