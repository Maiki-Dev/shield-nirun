import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/admin/auth";
import { PageHeader, Panel, SOURCE_LABEL, STATUS_LABEL, StatusBadge, btnDanger, btnPrimary, fmtDate, inputCls } from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { NoteForm } from "@/components/admin/note-form";
import { addNote, deleteLead, updateLead } from "../actions";

export const metadata = { title: "Хүсэлт" };

export default async function LeadPage({ params }: { params: { id: string } }) {
  const user = await requireUser();
  const [lead, staff] = await Promise.all([
    db.lead.findUnique({
      where: { id: params.id },
      include: { notes: { orderBy: { createdAt: "desc" }, include: { author: { select: { name: true } } } } },
    }),
    db.user.findMany({ where: { active: true }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!lead) notFound();

  const rows: [string, React.ReactNode][] = [
    ["Утас", <a key="p" href={`tel:${lead.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline"><Phone className="h-4 w-4" />{lead.phone}</a>],
    ["И-мэйл", lead.email ? <a key="e" href={`mailto:${lead.email}`} className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline"><Mail className="h-4 w-4" />{lead.email}</a> : "—"],
    ["Байгууллага / объект", lead.organization ?? "—"],
    ["Маягт", SOURCE_LABEL[lead.source]],
    ["Сонирхол", lead.interests.join(", ") || "—"],
    ["Хэмжээ", lead.scale ?? "—"],
    ["Хэл", lead.locale === "en" ? "Англи" : "Монгол"],
    ["Ирсэн", fmtDate(lead.createdAt)],
  ];

  return (
    <>
      <Link href="/admin/leads" className="mb-4 inline-flex items-center gap-1.5 text-label-md font-semibold text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Хүсэлтүүд
      </Link>
      <PageHeader title={lead.name} actions={<StatusBadge status={lead.status} />} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-5">
          <Panel title="Мэдээлэл">
            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              {rows.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-label-sm font-bold uppercase tracking-wider text-muted">{k}</dt>
                  <dd className="mt-1 text-body-md text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            {lead.message && (
              <div className="mt-5 border-t border-line pt-5">
                <p className="text-label-sm font-bold uppercase tracking-wider text-muted">Тайлбар</p>
                <p className="mt-1 whitespace-pre-wrap text-body-md text-ink">{lead.message}</p>
              </div>
            )}
          </Panel>

          <Panel title="Тэмдэглэл">
            <NoteForm action={addNote.bind(null, lead.id)} />
            <ul className="mt-5 flex flex-col gap-3">
              {lead.notes.map((n) => (
                <li key={n.id} className="rounded-2xl bg-soft p-4">
                  <p className="whitespace-pre-wrap text-body-md text-ink">{n.body}</p>
                  <p className="mt-2 text-label-sm text-muted">{n.author?.name ?? "—"} · {fmtDate(n.createdAt)}</p>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="flex flex-col gap-5">
          <Panel title="Төлөв ба хариуцагч">
            <form action={updateLead.bind(null, lead.id)} className="flex flex-col gap-4">
              <div>
                <label className="label" htmlFor="status">Төлөв</label>
                <select id="status" name="status" defaultValue={lead.status} className={inputCls}>
                  {Object.entries(STATUS_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="assigneeId">Хариуцагч</label>
                <select id="assigneeId" name="assigneeId" defaultValue={lead.assigneeId ?? ""} className={inputCls}>
                  <option value="">— Хуваарилаагүй —</option>
                  {staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <button className={btnPrimary}>Хадгалах</button>
            </form>
          </Panel>

          {user.role === "ADMIN" && (
            <Panel title="Устгах">
              <p className="mb-4 text-body-sm text-muted">Хүсэлт болон бүх тэмдэглэл бүрмөсөн устна. Спам бол “Спам” төлөвт оруулахыг зөвлөж байна.</p>
              <ConfirmButton action={deleteLead.bind(null, lead.id)} message={`“${lead.name}”-ийн хүсэлтийг бүрмөсөн устгах уу?`} className={btnDanger}>
                <Trash2 className="h-4 w-4" /> Бүрмөсөн устгах
              </ConfirmButton>
            </Panel>
          )}
        </div>
      </div>
    </>
  );
}
