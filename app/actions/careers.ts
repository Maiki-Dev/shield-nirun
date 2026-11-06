"use server";

import fs from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { PRIVATE_DIR } from "@/lib/files";
import { rateLimit } from "@/lib/admin/rate-limit";
import { clientIp } from "@/lib/admin/request";

export type ApplyResult = { ok: true } | { ok: false; error: "invalid" | "rate" | "file" | "server" };

const MAX_CV = 5 * 1024 * 1024;

/** CV type from its first bytes: PDF, DOCX (zip) or legacy DOC (OLE). */
function cvType(b: Buffer, name: string): string | null {
  if (b.subarray(0, 5).toString("ascii") === "%PDF-") return "pdf";
  if (b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04 && /\.docx$/i.test(name)) return "docx";
  if (b.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])) && /\.doc$/i.test(name)) return "doc";
  return null;
}

const text = (max: number) => z.string().trim().max(max).optional().transform((v) => v || undefined);
const schema = z.object({
  positionId: z.string().trim().max(40).optional().transform((v) => v || undefined),
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(40).regex(/^[+\d][\d\s\-()]{5,}$/),
  email: z.string().trim().max(160).email().optional().or(z.literal("").transform(() => undefined)),
  birthYear: z.coerce.number().int().min(1940).max(new Date().getFullYear() - 16).optional().or(z.literal("").transform(() => undefined)),
  address: text(200),
  experience: text(4000),
  message: text(3000),
  locale: z.enum(["mn", "en"]).default("mn"),
});

export async function submitApplication(form: FormData): Promise<ApplyResult> {
  if (String(form.get("website") ?? "").trim()) return { ok: true }; // honeypot
  const ip = clientIp();
  if (!rateLimit(`apply:${ip}`, 3, 30 * 60_000).ok) return { ok: false, error: "rate" };

  const parsed = schema.safeParse(Object.fromEntries([...form.entries()].filter(([, v]) => typeof v === "string")));
  if (!parsed.success) return { ok: false, error: "invalid" };
  const { positionId, ...data } = parsed.data;

  const position = positionId ? await db.jobPosition.findFirst({ where: { id: positionId, open: true } }) : null;

  let cvFile: string | undefined, cvOriginal: string | undefined;
  const file = form.get("cv");
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_CV) return { ok: false, error: "file" };
    const buf = Buffer.from(await file.arrayBuffer());
    const ext = cvType(buf, file.name);
    if (!ext) return { ok: false, error: "file" };
    await fs.mkdir(PRIVATE_DIR, { recursive: true });
    cvFile = `cv-${Date.now().toString(36)}-${randomBytes(8).toString("hex")}.${ext}`;
    cvOriginal = file.name.slice(0, 200);
    await fs.writeFile(path.join(PRIVATE_DIR, cvFile), buf, { flag: "wx" });
  }

  try {
    await db.jobApplication.create({
      data: { ...data, positionId: position?.id ?? null, positionTitle: position?.titleMn ?? "Ерөнхий анкет", cvFile, cvOriginal, ip },
    });
  } catch (e) {
    console.error("submitApplication failed", e);
    return { ok: false, error: "server" };
  }
  revalidatePath("/admin", "layout");
  return { ok: true };
}
