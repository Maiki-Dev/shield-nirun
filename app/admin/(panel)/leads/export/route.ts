import { db } from "@/lib/db";
import { currentUser } from "@/lib/admin/auth";
import { leadWhere } from "@/lib/admin/leads";
import { SOURCE_LABEL, STATUS_LABEL, fmtDate } from "@/components/admin/ui";

/** CSV export of the current filter (UTF-8 with BOM so Excel shows Cyrillic correctly). */
export async function GET(req: Request) {
  if (!(await currentUser())) return new Response("Unauthorized", { status: 401 });
  const sp = Object.fromEntries(new URL(req.url).searchParams);
  const leads = await db.lead.findMany({ where: leadWhere(sp), orderBy: { createdAt: "desc" }, take: 10_000 });
  const esc = (v: unknown) => {
    const s = String(v ?? "").replace(/"/g, '""');
    return /^[=+\-@]/.test(s) ? `"'${s}"` : `"${s}"`; // block spreadsheet formula injection
  };
  const rows = [
    ["Огноо", "Төлөв", "Маягт", "Нэр", "Байгууллага", "Утас", "И-мэйл", "Сонирхол", "Хэмжээ", "Тайлбар", "Хэл"],
    ...leads.map((l) => [fmtDate(l.createdAt), STATUS_LABEL[l.status], SOURCE_LABEL[l.source], l.name, l.organization, l.phone, l.email, l.interests.join(", "), l.scale, l.message, l.locale]),
  ];
  const csv = "﻿" + rows.map((r) => r.map(esc).join(",")).join("\r\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="shieldnirun-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
