import { tr, type Lang } from "@/lib/i18n";

export interface Leader {
  name?: string;
  role: string;
  photo: string;
  photoPosition?: string;
}

/** Confirmed leadership (photos supplied by Shield Nirun). Order: General Director first, then CEO. */
export const leaders = (lang: Lang): Leader[] => {
  const t = tr(lang);
  return [
    { name: t("Ч. Анар", "Ch. Anar"), role: t("Үүсгэн Байгуулагч", "Founder"), photo: "/images/chairman.webp", photoPosition: "center 25%" },
    { name: t("Л. Алтаншагай", "L. Altanshagai"), role: t("Гүйцэтгэх захирал", "CEO"), photo: "/images/ceo.webp", photoPosition: "center 30%" },
  ];
};
