"use server";

import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/admin/auth";
import { NEWS_TAG, slugify } from "@/lib/news";

export type PostState = { ok?: boolean; error?: string; id?: string } | undefined;

const opt = (max: number) => z.string().trim().max(max).optional().transform((v) => v || null);
const schema = z
  .object({
    titleMn: z.string().trim().min(3, "Гарчиг (монгол) оруулна уу").max(200),
    excerptMn: z.string().trim().min(10, "Товч агуулга (монгол) дор хаяж 10 тэмдэгт").max(400),
    bodyMn: z.string().trim().min(20, "Мэдээний агуулга (монгол) хэт богино").max(50_000),
    titleEn: opt(200),
    excerptEn: opt(400),
    bodyEn: opt(50_000),
    slug: z.string().trim().max(80).optional(),
    cover: z.string().trim().regex(/^(\/(media|images)\/[\w./-]+)?$/, "Нүүр зураг буруу").optional().transform((v) => v || null),
    status: z.enum(["DRAFT", "PUBLISHED"]),
    publishedAt: z.string().optional(), // datetime-local, Ulaanbaatar time
  })
  .refine((v) => !v.titleEn || (v.excerptEn && v.bodyEn), { message: "Англи хувилбар бол гарчиг, товч агуулга, агуулга гурвууланг нь бөглөнө үү." });

function publish() {
  revalidateTag(NEWS_TAG);
  revalidatePath("/[lang]", "layout"); // news list, articles and the home-page "Latest news" block
  revalidatePath("/admin/news");
}

/** Unique slug: "foo", then "foo-2", "foo-3"… */
async function uniqueSlug(base: string, id: string | null) {
  let slug = slugify(base);
  for (let n = 2; ; n++) {
    const hit = await db.post.findUnique({ where: { slug }, select: { id: true } });
    if (!hit || hit.id === id) return slug;
    slug = `${slugify(base)}-${n}`;
  }
}

export async function savePost(id: string | null, _prev: PostState, form: FormData): Promise<PostState> {
  const user = await requireUser();
  const parsed = schema.safeParse(Object.fromEntries(form.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Буруу утга" };
  const { slug: slugIn, publishedAt: pubIn, ...data } = parsed.data;

  const existing = id ? await db.post.findUnique({ where: { id } }) : null;
  const slug = await uniqueSlug(slugIn || data.titleMn, id);
  // datetime-local has no zone: treat it as Ulaanbaatar time (+08:00)
  let publishedAt: Date | null = pubIn ? new Date(`${pubIn}:00+08:00`) : null;
  if (pubIn && Number.isNaN(publishedAt!.getTime())) return { error: "Нийтлэх огноо буруу" };
  if (data.status === "PUBLISHED" && !publishedAt) publishedAt = existing?.publishedAt ?? new Date();

  const row = existing
    ? await db.post.update({ where: { id: existing.id }, data: { ...data, slug, publishedAt } })
    : await db.post.create({ data: { ...data, slug, publishedAt, authorName: user.name } });
  publish();
  if (!existing) redirect(`/admin/news/${row.id}?created=1`);
  return { ok: true, id: row.id };
}

export async function deletePost(id: string) {
  await requireUser();
  await db.post.delete({ where: { id } });
  publish();
  redirect("/admin/news");
}
