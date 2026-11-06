import { db } from "@/lib/db";
import { currentUser } from "@/lib/admin/auth";
import { parseQuestions } from "@/lib/surveys";
import { fmtDate } from "@/components/admin/ui";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (!(await currentUser())) return new Response("Unauthorized", { status: 401 });
  const s = await db.survey.findUnique({ where: { id: params.id }, include: { responses: { orderBy: { createdAt: "asc" } } } });
  if (!s) return new Response("Not found", { status: 404 });
  const qs = parseQuestions(s.questions);
  const esc = (v: unknown) => {
    const str = String(Array.isArray(v) ? v.join("; ") : (v ?? "")).replace(/"/g, '""');
    return /^[=+\-@]/.test(str) ? `"'${str}"` : `"${str}"`;
  };
  const rows = [["Огноо", "Хэл", ...qs.map((q) => q.labelMn)], ...s.responses.map((r) => [fmtDate(r.createdAt), r.locale, ...qs.map((q) => (r.answers as Record<string, unknown>)[q.id])])];
  return new Response("﻿" + rows.map((r) => r.map(esc).join(",")).join("\r\n"), {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="survey-${s.slug}.csv"`, "Cache-Control": "no-store" },
  });
}
