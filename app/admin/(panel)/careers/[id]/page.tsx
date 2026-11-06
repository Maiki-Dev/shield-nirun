import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, Mail, Phone, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/admin/auth";
import { PageHeader, Panel, btnDanger, btnPrimary, fmtDate, inputCls } from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { APPLICATION_STATUS } from "@/lib/careers";
import { deleteApplication, updateApplication } from "../actions";

export const metadata = { title: "Анкет" };

export default async function ApplicationPage({ params }: { params: { id: string } }) {
  const user = await requireUser();
  const a = await db.jobApplication.findUnique({ where: { id: params.id } });
  if (!a) notFound();
  const rows: [string, React.ReactNode][] = [
    ["Ажлын байр", a.positionTitle],
    ["Утас", <a key="p" href={`tel:${a.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline"><Phone className="h-4 w-4" />{a.phone}</a>],
    ["И-мэйл", a.email ? <a key="e" href={`mailto:${a.email}`} className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline"><Mail className="h-4 w-4" />{a.email}</a> : "—"],
    ["Төрсөн он", a.birthYear ?? "—"],
    ["Хаяг", a.address ?? "—"],
    ["Ирсэн", fmtDate(a.createdAt)],
  ];
  return (
    <>
      <Link href="/admin/careers" className="mb-4 inline-flex items-center gap-1.5 text-label-md font-semibold text-muted hover:text-ink"><ArrowLeft className="h-4 w-4" /> Анкетууд</Link>
      <PageHeader title={a.name} actions={<span className={`rounded-full px-3 py-1 text-label-sm font-bold ${APPLICATION_STATUS[a.status].cls}`}>{APPLICATION_STATUS[a.status].label}</span>} />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-5">
          <Panel title="Мэдээлэл">
            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              {rows.map(([k, v]) => (
                <div key={k}><dt className="text-label-sm font-bold uppercase tracking-wider text-muted">{k}</dt><dd className="mt-1 text-body-md text-ink">{v}</dd></div>
              ))}
            </dl>
            {[["Ажлын туршлага", a.experience], ["Нэмэлт мэдээлэл", a.message]].map(([k, v]) =>
              v ? (
                <div key={k} className="mt-5 border-t border-line pt-5">
                  <p className="text-label-sm font-bold uppercase tracking-wider text-muted">{k}</p>
                  <p className="mt-1 whitespace-pre-wrap text-body-md text-ink">{v}</p>
                </div>
              ) : null,
            )}
          </Panel>
          {a.cvFile && (
            <Panel title="CV">
              <a href={`/admin/careers/cv/${a.id}`} className={btnPrimary}><Download className="h-4 w-4" /> {a.cvOriginal ?? "CV татах"}</a>
            </Panel>
          )}
        </div>
        <div className="flex flex-col gap-5">
          <Panel title="Шийдвэр">
            <form action={updateApplication.bind(null, a.id)} className="flex flex-col gap-4">
              <div>
                <label className="label" htmlFor="status">Төлөв</label>
                <select id="status" name="status" defaultValue={a.status} className={inputCls}>
                  {Object.entries(APPLICATION_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="staffNote">Дотоод тэмдэглэл</label>
                <textarea id="staffNote" name="staffNote" defaultValue={a.staffNote ?? ""} rows={4} maxLength={4000} className="input h-auto resize-y py-3" />
              </div>
              <button className={btnPrimary}>Хадгалах</button>
            </form>
          </Panel>
          {user.role === "ADMIN" && (
            <Panel title="Устгах">
              <p className="mb-4 text-body-sm text-muted">Анкет болон CV файл бүрмөсөн устна (хувийн мэдээлэл).</p>
              <ConfirmButton action={deleteApplication.bind(null, a.id)} message={`${a.name}-ийн анкетыг бүрмөсөн устгах уу?`} className={btnDanger}><Trash2 className="h-4 w-4" /> Бүрмөсөн устгах</ConfirmButton>
            </Panel>
          )}
        </div>
      </div>
    </>
  );
}
