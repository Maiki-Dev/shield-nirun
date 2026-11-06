import "server-only";
import { cache } from "react";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Role, User } from "@prisma/client";
import { db } from "@/lib/db";

export const SESSION_COOKIE = "sn_admin";
const SESSION_DAYS = 7;

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

/** Creates a session row and sets the httpOnly cookie. */
export async function startSession(userId: string, userAgent: string | null) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  await db.session.create({ data: { tokenHash: hashToken(token), userId, expiresAt, userAgent } });
  await db.user.update({ where: { id: userId }, data: { lastLoginAt: new Date() } });
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function endSession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) await db.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  cookies().delete(SESSION_COOKIE);
}

export type SessionUser = Pick<User, "id" | "email" | "name" | "role">;

/** Current signed-in, active user (memoised per request), or null. */
export const currentUser = cache(async (): Promise<SessionUser | null> => {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await db.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: { select: { id: true, email: true, name: true, role: true, active: true } } },
  });
  if (!session || session.expiresAt < new Date() || !session.user.active) return null;
  const { active: _active, ...user } = session.user;
  return user;
});

/** For pages and server actions: redirects to login if signed out; ADMIN-only areas also check the role. */
export async function requireUser(role?: Role): Promise<SessionUser> {
  const user = await currentUser();
  if (!user) redirect("/admin/login");
  if (role === "ADMIN" && user.role !== "ADMIN") redirect("/admin");
  return user;
}

/** Deletes every session of a user (used on deactivation and password change). */
export const revokeSessions = (userId: string, exceptCurrent = false) =>
  db.session.deleteMany({
    where: {
      userId,
      ...(exceptCurrent && cookies().get(SESSION_COOKIE)
        ? { NOT: { tokenHash: hashToken(cookies().get(SESSION_COOKIE)!.value) } }
        : {}),
    },
  });
