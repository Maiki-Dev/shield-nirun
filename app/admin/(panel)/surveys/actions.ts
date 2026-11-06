"use server";

import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/admin/auth";
import { questionsSchema } from "@/lib/surveys";
import { slugify } from "@/lib/news";

export type SurveyState = { ok?: boolean; error?: string } | undefined;

const schema = z.object({
  titleMn: z.string().trim().min(3, "Гарчиг оруулна уу").max(200),
  titleEn: z.string().trim().max(200).optional().transform((v) => v || null),
  descriptionMn: z.string().trim().max(1000).optional().transform((v) => v || null),
  descriptionEn: z.string().trim().max(1000).optional().transform((v) => v || null),
  slug: z.string().trim().max(80).optional(),
  active: z.preprocess((v) => v === "on", z.boolean()),
});

function refresh(id?: string) {
  revalidateTag("surveys");
  revalidatePath("/admin/surveys");
  if (id) revalidatePath(`/admin/surveys/${id}`);
}

export async function saveSurvey(id: string | null, _prev: SurveyState, form: FormData): Promise<SurveyState> {
  await requireUser();
  const parsed = schema.safeParse({ ...Object.fromEntries(form.entries()), active: form.get("active") ? "on" : "" });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  let questions;
  try {
    const q = questionsSchema.safeParse(JSON.parse(String(form.get("questions") ?? "[]")));
    if (!q.success) return { error: q.error.issues[0]?.message ?? "Асуултууд буруу" };
    questions = q.data;
  } catch {
    return { error: "Асуултууд буруу" };
  }
  const { slug: slugIn, ...data } = parsed.data;
  let slug = slugify(slugIn || data.titleMn);
  for (let n = 2; ; n++) {
    const hit = await db.survey.findUnique({ where: { slug }, select: { id: true } });
    if (!hit || hit.id === id) break;
    slug = `${slugify(slugIn || data.titleMn)}-${n}`;
  }
  const row = id
    ? await db.survey.update({ where: { id }, data: { ...data, slug, questions } })
    : await db.survey.create({ data: { ...data, slug, questions } });
  refresh(row.id);
  if (!id) redirect(`/admin/surveys/${row.id}`);
  return { ok: true };
}

export async function deleteSurvey(id: string) {
  await requireUser("ADMIN");
  await db.survey.delete({ where: { id } });
  refresh();
  redirect("/admin/surveys");
}
