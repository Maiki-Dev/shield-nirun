import "server-only";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { tr, type Lang } from "@/lib/i18n";

export const CAREERS_TAG = "careers";

export const openPositions = unstable_cache(
  async () =>
    db.jobPosition.findMany({
      where: { open: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, titleMn: true, titleEn: true, descriptionMn: true, descriptionEn: true },
    }),
  ["careers-open-v1"],
  { tags: [CAREERS_TAG], revalidate: 300 },
);

type LocalizedPosition = { id: string; title: string; description: string };

export async function positionsFor(lang: Lang): Promise<LocalizedPosition[]> {
  const t = tr(lang);
  return (await openPositions()).map((p) => ({ id: p.id, title: t(p.titleMn, p.titleEn), description: t(p.descriptionMn, p.descriptionEn) }));
}

export const APPLICATION_STATUS = {
  NEW: { label: "Шинэ", cls: "bg-accent/15 text-accent" },
  REVIEWING: { label: "Хянаж буй", cls: "bg-amber-400/15 text-amber-300" },
  INTERVIEW: { label: "Ярилцлага", cls: "bg-violet-400/15 text-violet-300" },
  HIRED: { label: "Ажилд авсан", cls: "bg-emerald-400/15 text-emerald-300" },
  REJECTED: { label: "Татгалзсан", cls: "bg-slate-400/15 text-slate-300" },
} as const;
