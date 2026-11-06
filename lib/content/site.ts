import { tr, type Lang } from "@/lib/i18n";

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const navItems = (lang: Lang): NavItem[] => {
  const t = tr(lang);
  return [
    { label: t("Нүүр хуудас", "Home"), href: "/" },
    { label: t("Бүтээгдэхүүн", "Products"), href: "/products" },
    {
      label: t("Бидний тухай", "About us"),
      href: "/about",
      children: [
        { label: t("Компанийн тухай", "Company overview"), href: "/about" },
        { label: t("Ажлын байр", "Careers"), href: "/careers" },
        { label: t("Мэдээ мэдээлэл", "News & updates"), href: "/news" },
      ],
    },
    { label: t("Холбоо барих", "Contact"), href: "/contact" },
  ];
};

/**
 * Confirmed contact details (supplied by Shield Nirun, Nov 2026).
 * Location: the company's Google Maps pin → Royal Tower; district confirmed via OpenStreetMap.
 */
export const CONTACT = {
  building: "Royal Tower",
  city: "Улаанбаатар хот",
  district: "Сүхбаатар дүүрэг",
  phone: "+976 7007 7010",
  phoneHref: "tel:+97670077010",
  email: "info@shieldnirun.mn",
  lat: 47.9100735,
  lng: 106.9071964,
  mapUrl: "https://maps.app.goo.gl/F5cwavUn2TdMcNuF8",
} as const;

/** Address lines that differ per language (building name and coordinates do not). */
export const address = (lang: Lang) => {
  const t = tr(lang);
  return {
    city: t(CONTACT.city, "Ulaanbaatar"),
    district: t(CONTACT.district, "Sükhbaatar District"),
    line: t(`${CONTACT.building}, ${CONTACT.district}, ${CONTACT.city}`, `${CONTACT.building}, Sükhbaatar District, Ulaanbaatar`),
  };
};

export const footerSolutions = (lang: Lang): NavItem[] => {
  const t = tr(lang);
  return [
    { label: t("Ухаалаг зогсоолын систем", "Smart parking system"), href: "/products/smart-parking" },
    { label: t("SHIELD+ СӨХ систем", "SHIELD+ HOA system"), href: "/products/smart-hoa" },
    { label: t("AI камер & дрон", "AI cameras & drones"), href: "/#solutions" },
    { label: t("Биет харуул хамгаалалт", "On-site security guards"), href: "/#solutions" },
  ];
};

/** Shown in place of the Shield+ column until launch (doesn't reveal what Shield+ includes). */
export const footerServices = (lang: Lang): NavItem[] => {
  const t = tr(lang);
  return [
    { label: t("Камер суурилуулалт", "Camera installation"), href: "/products#services" },
    { label: t("Нэвтрэх хяналт & турникет", "Access control & turnstiles"), href: "/products#services" },
    { label: t("Дрон хяналт", "Drone monitoring"), href: "/products#services" },
    { label: t("Биет харуул хамгаалалт", "On-site security guards"), href: "/products#services" },
  ];
};

export const footerPages = (lang: Lang): NavItem[] => {
  const t = tr(lang);
  return [
    { label: t("Нүүр хуудас", "Home"), href: "/" },
    { label: t("Бүтээгдэхүүн", "Products"), href: "/products" },
    { label: t("Бидний тухай", "About us"), href: "/about" },
    { label: t("Мэдээ", "News"), href: "/news" },
    { label: t("Ажлын байр", "Careers"), href: "/careers" },
    { label: t("Холбоо барих", "Contact"), href: "/contact" },
  ];
};

/** Shield+ — Shield Nirun's new umbrella brand (launch date confirmed by Shield Nirun). Ulaanbaatar time. */
export const SHIELD_PLUS = { launch: "2026-11-11T11:11:00+08:00" } as const;
