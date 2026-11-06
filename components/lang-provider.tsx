"use client";

import { createContext, useContext, type ReactNode } from "react";
import { localize, tr, type Lang } from "@/lib/i18n";

const LangContext = createContext<Lang>("mn");

export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

/** For client components: current locale, string picker and link localizer. */
export function useLang() {
  const lang = useContext(LangContext);
  return { lang, t: tr(lang), href: (path: string) => localize(lang, path) };
}
