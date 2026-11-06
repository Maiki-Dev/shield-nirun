"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { endSession, startSession } from "@/lib/admin/auth";
import { rateLimit, resetRateLimit } from "@/lib/admin/rate-limit";
import { clientIp, userAgent } from "@/lib/admin/request";

const schema = z.object({ email: z.string().trim().toLowerCase().email(), password: z.string().min(1).max(200) });

// Compared against when the email is unknown, so response time doesn't reveal which emails exist.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);

export async function login(_prev: { error?: string } | undefined, form: FormData): Promise<{ error?: string }> {
  const parsed = schema.safeParse({ email: form.get("email"), password: form.get("password") });
  if (!parsed.success) return { error: "И-мэйл, нууц үгээ зөв оруулна уу." };

  const key = `login:${clientIp()}:${parsed.data.email}`;
  const limit = rateLimit(key, 5, 10 * 60_000);
  if (!limit.ok) return { error: `Хэт олон оролдлого. ${Math.ceil(limit.retryAfterSec / 60)} минутын дараа дахин оролдоно уу.` };

  const user = await db.user.findUnique({ where: { email: parsed.data.email } });
  const ok = await bcrypt.compare(parsed.data.password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !ok || !user.active) return { error: "И-мэйл эсвэл нууц үг буруу байна." };

  resetRateLimit(key);
  await startSession(user.id, userAgent());
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}
