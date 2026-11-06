"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/admin/auth";
import { publishSite } from "@/lib/admin/publish";

const s = (max: number) => z.string().trim().min(1, "Хоосон байж болохгүй").max(max);
const pdf = z
  .string()
  .trim()
  .regex(/^(\/(files|media)\/[\w.-]+\.pdf)?$/i, "PDF файл сонгоно уу")
  .transform((v) => v || null);

const schema = z.object({
  phone: s(40).regex(/^[+\d][\d\s-]{5,}$/, "Утасны дугаар буруу"),
  email: s(120).email("И-мэйл буруу"),
  building: s(120),
  districtMn: s(120),
  districtEn: s(120),
  cityMn: s(120),
  cityEn: s(120),
  mapUrl: s(400).url("Холбоос буруу").refine((u) => u.startsWith("https://"), "https:// холбоос байх ёстой"),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  brochureParking: pdf,
  brochureHoa: pdf,
});

export async function saveSettings(_prev: { ok?: boolean; error?: string } | undefined, form: FormData) {
  await requireUser();
  const parsed = schema.safeParse(Object.fromEntries(form.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Буруу утга" };
  await db.siteSettings.update({ where: { id: "site" }, data: parsed.data });
  publishSite();
  revalidatePath("/admin/settings");
  return { ok: true };
}
