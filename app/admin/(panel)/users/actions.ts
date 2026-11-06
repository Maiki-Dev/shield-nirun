"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser, revokeSessions } from "@/lib/admin/auth";

type State = { ok?: string; error?: string } | undefined;
const password = z.string().min(10, "Нууц үг дор хаяж 10 тэмдэгт").max(200);

export async function createUser(_prev: State, form: FormData): Promise<State> {
  await requireUser("ADMIN");
  const parsed = z
    .object({ name: z.string().trim().min(2).max(80), email: z.string().trim().toLowerCase().email("И-мэйл буруу"), role: z.enum(["ADMIN", "EDITOR"]), password })
    .safeParse(Object.fromEntries(form.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  if (await db.user.findUnique({ where: { email: parsed.data.email } })) return { error: "Энэ и-мэйлтэй хэрэглэгч бүртгэлтэй байна." };
  const { password: pw, ...rest } = parsed.data;
  await db.user.create({ data: { ...rest, passwordHash: await bcrypt.hash(pw, 12) } });
  revalidatePath("/admin/users");
  return { ok: `${rest.name} нэмэгдлээ` };
}

/** Keeps at least one active admin, and stops admins from locking themselves out. */
async function guard(targetId: string, next: { role?: "ADMIN" | "EDITOR"; active?: boolean }) {
  const me = await requireUser("ADMIN");
  if (targetId === me.id && (next.role === "EDITOR" || next.active === false)) return "Өөрийнхөө эрхийг бууруулах эсвэл идэвхгүй болгох боломжгүй.";
  const target = await db.user.findUniqueOrThrow({ where: { id: targetId } });
  const losesAdmin = target.role === "ADMIN" && target.active && (next.role === "EDITOR" || next.active === false);
  if (losesAdmin && (await db.user.count({ where: { role: "ADMIN", active: true } })) <= 1) return "Дор хаяж нэг идэвхтэй админ байх ёстой.";
  return null;
}

export async function updateUser(id: string, _prev: State, form: FormData): Promise<State> {
  const role = z.enum(["ADMIN", "EDITOR"]).parse(form.get("role"));
  const active = form.get("active") === "on";
  const err = await guard(id, { role, active });
  if (err) return { error: err };
  await db.user.update({ where: { id }, data: { role, active } });
  if (!active) await revokeSessions(id);
  revalidatePath("/admin/users");
  return { ok: "Хадгалагдлаа" };
}

export async function resetPassword(id: string, _prev: State, form: FormData): Promise<State> {
  await requireUser("ADMIN");
  const parsed = password.safeParse(form.get("password"));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  await db.user.update({ where: { id }, data: { passwordHash: await bcrypt.hash(parsed.data, 12) } });
  await revokeSessions(id);
  return { ok: "Нууц үг солигдлоо, бүх төхөөрөмжөөс гаргалаа" };
}
