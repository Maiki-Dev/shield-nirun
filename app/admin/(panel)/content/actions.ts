"use server";

import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { CAREERS_TAG } from "@/lib/careers";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/admin/auth";
import { publishSite } from "@/lib/admin/publish";
import { SERVICE_ICONS } from "@/lib/admin/icons";

export type Kind = "leader" | "service" | "faq" | "position";

const s = (max: number) => z.string().trim().min(1, "Хоосон байж болохгүй").max(max);
const bool = z.preprocess((v) => v === "on" || v === "true", z.boolean());
// Local site paths only (/images/…, /media/…) so editors can't hot-link arbitrary hosts.
const sitePath = z.string().trim().regex(/^\/(images|media|files)\/[\w./-]+$/, "Зөвхөн сайтын зураг (/images/… эсвэл /media/…)");

const schemas = {
  leader: z.object({
    nameMn: s(80), nameEn: s(80), roleMn: s(80), roleEn: s(80), photo: sitePath,
    photoPosition: z.string().trim().max(40).default("center 30%"),
    parentId: z.string().trim().max(40).optional().transform((v) => v || null),
    visible: bool,
  }),
  service: z.object({ icon: z.string().refine((k) => k in SERVICE_ICONS), titleMn: s(80), titleEn: s(80), textMn: s(400), textEn: s(400), visible: bool }),
  faq: z.object({ questionMn: s(300), questionEn: s(300), answerMn: s(2000), answerEn: s(2000), shieldPlus: bool, visible: bool }),
  position: z.object({ titleMn: s(120), titleEn: s(120), descriptionMn: s(3000), descriptionEn: s(3000), open: bool }),
};

export type FormState = { ok?: boolean; error?: string } | undefined;

// Prisma delegates share these methods; typed loosely so one set of actions serves all three tables.
type Delegate = {
  create(args: { data: Record<string, unknown> }): Promise<unknown>;
  update(args: { where: { id: string }; data: Record<string, unknown> }): Promise<unknown>;
  delete(args: { where: { id: string } }): Promise<unknown>;
  findMany(args: { orderBy: { sortOrder: "asc" }; select: { id: true } }): Promise<{ id: string }[]>;
  aggregate(args: { _max: { sortOrder: true } }): Promise<{ _max: { sortOrder: number | null } }>;
};
const table = (k: Kind) => ({ leader: db.leader, service: db.service, faq: db.faq, position: db.jobPosition })[k] as unknown as Delegate;

function parse(kind: Kind, form: FormData) {
  const raw = Object.fromEntries(form.entries());
  for (const k of ["visible", "shieldPlus", "open"]) raw[k] = form.get(k) ? "on" : "";
  return schemas[kind].safeParse(raw);
}

/** A leader can't report to themselves or to anyone below them (that would make a loop in the org chart). */
async function checkParent(id: string | null, parentId: string | null): Promise<string | null> {
  if (!parentId) return null;
  if (parentId === id) return "Өөрт нь харьяалуулах боломжгүй.";
  const all = await db.leader.findMany({ select: { id: true, parentId: true } });
  const byId = new Map(all.map((l) => [l.id, l.parentId]));
  if (!byId.has(parentId)) return "Сонгосон удирдлага олдсонгүй.";
  for (let cur: string | null | undefined = parentId, steps = 0; cur && steps < 100; cur = byId.get(cur), steps++) {
    if (cur === id) return "Доод албан тушаалтанд харьяалуулах боломжгүй (давталт үүснэ).";
  }
  return null;
}

function done() {
  publishSite();
  revalidateTag(CAREERS_TAG);
  revalidatePath("/admin/content");
  revalidatePath("/admin/careers");
}

export async function saveItem(kind: Kind, id: string | null, _prev: FormState, form: FormData): Promise<FormState> {
  await requireUser();
  const parsed = parse(kind, form);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Буруу утга" };
  if (kind === "leader") {
    const err = await checkParent(id, (parsed.data as { parentId: string | null }).parentId);
    if (err) return { error: err };
  }
  if (id) await table(kind).update({ where: { id }, data: parsed.data });
  else {
    const max = (await table(kind).aggregate({ _max: { sortOrder: true } }))._max.sortOrder ?? -1;
    await table(kind).create({ data: { ...parsed.data, sortOrder: max + 1 } });
  }
  done();
  return { ok: true };
}

export async function deleteItem(kind: Kind, id: string) {
  await requireUser();
  await table(kind).delete({ where: { id } });
  done();
}

/** Swaps an item with its neighbour and renumbers the list 0..n. */
export async function moveItem(kind: Kind, id: string, dir: -1 | 1) {
  await requireUser();
  const rows = await table(kind).findMany({ orderBy: { sortOrder: "asc" }, select: { id: true } });
  const i = rows.findIndex((r) => r.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= rows.length) return;
  [rows[i], rows[j]] = [rows[j], rows[i]];
  await db.$transaction(rows.map((r, n) => (table(kind) as unknown as { update: typeof db.leader.update }).update({ where: { id: r.id }, data: { sortOrder: n } })));
  done();
}
