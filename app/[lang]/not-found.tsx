"use client";

import { PillButton } from "@/components/ui/pill-button";
import { useLang } from "@/components/lang-provider";

export default function NotFound() {
  const { t, href } = useLang();
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-start justify-center gap-6 py-24">
      <span className="eyebrow">404</span>
      <h1 className="text-[clamp(2.2rem,5vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
        {t("Хуудас олдсонгүй.", "Page not found.")}
      </h1>
      <p className="max-w-xl text-body-lg text-muted">
        {t("Таны хайсан хуудас байхгүй эсвэл зөөгдсөн байна.", "The page you are looking for doesn't exist or has moved.")}
      </p>
      <PillButton href={href("/")}>{t("Нүүр хуудас руу буцах", "Back to home")}</PillButton>
    </section>
  );
}
