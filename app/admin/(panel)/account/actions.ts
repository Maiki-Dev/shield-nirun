"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser, revokeSessions } from "@/lib/admin/auth";

export async function changeOwnPassword(_prev: { ok?: string; error?: string } | undefined, form: FormData) {
  const me = await requireUser();
  const parsed = z
    .object({ current: z.string().min(1), next: z.string().min(10, "Шинэ нууц үг дор хаяж 10 тэмдэгт").max(200), confirm: z.string() })
    .refine((v) => v.next === v.confirm, { message: "Шинэ нууц үг таарахгүй байна" })
    .safeParse(Object.fromEntries(form.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const user = await db.user.findUniqueOrThrow({ where: { id: me.id } });
  if (!(await bcrypt.compare(parsed.data.current, user.passwordHash))) return { error: "Одоогийн нууц үг буруу" };
  await db.user.update({ where: { id: me.id }, data: { passwordHash: await bcrypt.hash(parsed.data.next, 12) } });
  await revokeSessions(me.id, true);
  return { ok: "Нууц үг солигдлоо. Бусад төхөөрөмжөөс гаргалаа." };
}
