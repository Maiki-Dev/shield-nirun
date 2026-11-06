import type { Metadata } from "next";
import { ProductsPage } from "@/components/products/sections";
import { alternates, tr, type Lang } from "@/lib/i18n";

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const t = tr(params.lang);
  return {
    title: t("Бүтээгдэхүүн, үйлчилгээ", "Products & services"),
    description: t(
      "Shield+ — ухаалаг зогсоолын систем, СӨХ-ийн систем, техник хангамж, багцууд, түгээмэл асуултууд.",
      "Shield+ — smart parking system, HOA system, hardware, packages and FAQ.",
    ),
    alternates: alternates(params.lang, "/products"),
  };
}

export default function Page({ params }: { params: { lang: Lang } }) {
  return <ProductsPage lang={params.lang} />;
}
