import type { LeadSource, LeadStatus, Prisma } from "@prisma/client";
import { STATUS_LABEL } from "@/components/admin/ui";

/** Query-string filter for the requests list and its CSV export. */
export type LeadFilter = { status?: string; source?: string; q?: string; page?: string };

export function leadWhere(sp: LeadFilter): Prisma.LeadWhereInput {
  const where: Prisma.LeadWhereInput = {};
  if (sp.status && sp.status in STATUS_LABEL) where.status = sp.status as LeadStatus;
  else where.status = { not: "SPAM" };
  if (sp.source === "CONTACT" || sp.source === "DEMO") where.source = sp.source as LeadSource;
  const q = sp.q?.trim();
  if (q) where.OR = ["name", "organization", "phone", "email", "message"].map((f) => ({ [f]: { contains: q, mode: "insensitive" } }));
  return where;
}

