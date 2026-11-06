"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { LeadStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/admin/auth";

const STATUSES = ["NEW", "IN_PROGRESS", "DONE", "SPAM"] as const;

export async function updateLead(id: string, form: FormData) {
  await requireUser();
  const status = z.enum(STATUSES).parse(form.get("status"));
  const assigneeRaw = String(form.get("assigneeId") ?? "");
  await db.lead.update({ where: { id }, data: { status: status as LeadStatus, assigneeId: assigneeRaw || null } });
  revalidatePath("/admin", "layout");
}

export async function addNote(id: string, form: FormData) {
  const user = await requireUser();
  const body = z.string().trim().min(1).max(4000).parse(form.get("body"));
  await db.leadNote.create({ data: { leadId: id, authorId: user.id, body } });
  revalidatePath(`/admin/leads/${id}`);
}

/** Permanent delete — admins only (editors can mark as spam instead). */
export async function deleteLead(id: string) {
  await requireUser("ADMIN");
  await db.lead.delete({ where: { id } });
  revalidatePath("/admin", "layout");
  redirect("/admin/leads");
}
