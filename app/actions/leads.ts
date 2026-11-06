"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/admin/rate-limit";
import { clientIp, userAgent } from "@/lib/admin/request";

export type LeadResult = { ok: true } | { ok: false; error: "invalid" | "rate" | "server" };

const text = (max: number) => z.string().trim().max(max);
const optional = (max: number) => text(max).optional().transform((v) => (v ? v : undefined));

const schema = z.object({
  source: z.enum(["CONTACT", "DEMO"]),
  locale: z.enum(["mn", "en"]).default("mn"),
  name: text(120).min(2),
  organization: optional(160),
  phone: text(40).regex(/^[+\d][\d\s\-()]{5,}$/),
  email: z.string().trim().max(160).email().optional().or(z.literal("").transform(() => undefined)),
  interests: z.array(text(40)).max(10).default([]),
  scale: optional(40),
  message: optional(3000),
});

/** Saves a website form submission as a lead. A filled hidden "website" field marks a bot: we pretend success. */
export async function submitLead(form: FormData): Promise<LeadResult> {
  if (String(form.get("website") ?? "").trim()) return { ok: true };

  const ip = clientIp();
  if (!rateLimit(`lead:${ip}`, 5, 10 * 60_000).ok) return { ok: false, error: "rate" };

  const parsed = schema.safeParse({
    source: form.get("source"),
    locale: form.get("locale") ?? undefined,
    name: form.get("name"),
    organization: form.get("organization") ?? undefined,
    phone: form.get("phone"),
    email: form.get("email") ?? undefined,
    interests: form.getAll("interests").map(String),
    scale: form.get("scale") ?? undefined,
    message: form.get("message") ?? undefined,
  });
  if (!parsed.success) return { ok: false, error: "invalid" };

  try {
    await db.lead.create({ data: { ...parsed.data, ip, userAgent: userAgent() } });
  } catch (e) {
    console.error("submitLead failed", e);
    return { ok: false, error: "server" };
  }
  revalidatePath("/admin", "layout");
  return { ok: true };
}
