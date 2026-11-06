"use server";

import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/admin/auth";
import { PRIVATE_DIR } from "@/lib/files";

export async function updateApplication(id: string, form: FormData) {
  await requireUser();
  const status = z.enum(["NEW", "REVIEWING", "INTERVIEW", "HIRED", "REJECTED"]).parse(form.get("status"));
  const staffNote = z.string().trim().max(4000).parse(form.get("staffNote") ?? "") || null;
  await db.jobApplication.update({ where: { id }, data: { status, staffNote } });
  revalidatePath("/admin", "layout");
}

/** Admins only: removes the application and its CV file (personal data). */
export async function deleteApplication(id: string) {
  await requireUser("ADMIN");
  const a = await db.jobApplication.delete({ where: { id } });
  if (a.cvFile) await fs.rm(path.join(PRIVATE_DIR, path.basename(a.cvFile)), { force: true });
  revalidatePath("/admin", "layout");
  redirect("/admin/careers");
}
