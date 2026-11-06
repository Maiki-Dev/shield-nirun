import type { MetadataRoute } from "next";
import { LOCALES, SITE_URL, localize } from "@/lib/i18n";

const publicPaths = [
  "/",
  "/about",
  "/products",
  "/products/smart-parking",
  "/products/smart-hoa",
  "/careers",
  "/news",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPaths.flatMap((path) => {
    const languages = {
      mn: new URL(localize("mn", path), SITE_URL).href,
      en: new URL(localize("en", path), SITE_URL).href,
    };

    return LOCALES.map((lang) => ({ url: languages[lang], alternates: { languages } }));
  });
}
