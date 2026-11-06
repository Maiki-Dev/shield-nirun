/**
 * Two locales: Mongolian (default, unprefixed URLs) and English (under /en).
 * Translations live next to the Mongolian original via `t("мн", "en")`, so both stay in sync when edited.
 */
export const LOCALES = ["mn", "en"] as const;
export type Lang = (typeof LOCALES)[number];
export const DEFAULT_LANG: Lang = "mn";

export const isLang = (v: string): v is Lang => (LOCALES as readonly string[]).includes(v);

/** Picks the string for `lang`: `const t = tr(lang); t("Нүүр", "Home")`. */
export const tr =
  (lang: Lang) =>
  <T,>(mn: T, en: T): T =>
    lang === "en" ? en : mn;

/** Turns an internal path into the URL for `lang` ("/products" → "/en/products"). External links, files and images are left alone. */
export function localize(lang: Lang, href: string): string {
  if (lang === DEFAULT_LANG || !href.startsWith("/") || /^\/(files|images)\//.test(href)) return href;
  if (href === "/") return "/en";
  if (href.startsWith("/#")) return `/en${href.slice(1)}`;
  return `/en${href}`;
}

/** Splits a browser pathname into its locale and the locale-free path ("/en/about" → ["en", "/about"]). */
export function splitPath(pathname: string): [Lang, string] {
  if (pathname === "/en" || pathname.startsWith("/en/")) return ["en", pathname.slice(3) || "/"];
  return ["mn", pathname || "/"];
}

/** Absolute site origin for canonical / hreflang URLs. */
export const SITE_URL = "https://shieldnirun.mn";

/** Metadata `alternates` for a locale-free path. */
export function alternates(lang: Lang, path: string) {
  return {
    canonical: localize(lang, path),
    languages: { mn: localize("mn", path), en: localize("en", path), "x-default": localize("mn", path) },
  };
}
