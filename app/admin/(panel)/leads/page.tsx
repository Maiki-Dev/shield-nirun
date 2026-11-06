import Link from "next/link";
import type { LeadStatus } from "@prisma/client";
import { leadWhere, type LeadFilter as SP } from "@/lib/admin/leads";
import { Download, Search } from "lucide-react";
import { db } from "@/lib/db";
import { Empty, PageHeader, Panel, SOURCE_LABEL, STATUS_LABEL, StatusBadge, btnGhost, fmtDate } from "@/components/admin/ui";

export const metadata = { title: "Хүсэлтүүд" };
const PAGE = 25;

export default async function LeadsPage({ searchParams }: { searchParams: SP }) {
  const page = Math.max(1, Number(searchParams.page) || 1);
  const where = leadWhere(searchParams);
  const [leads, total, counts] = await Promise.all([
    db.lead.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE, take: PAGE, include: { assignee: { select: { name: true } } } }),
    db.lead.count({ where }),
    db.lead.groupBy({ by: ["status"], _count: true }),
  ]);
  const countOf = (s: LeadStatus) => counts.find((c) => c.status === s)?._count ?? 0;
  const qs = (patch: Partial<SP>) => {
    const p = new URLSearchParams(Object.entries({ ...searchParams, ...patch }).filter(([, v]) => v) as [string, string][]);
    if (!("page" in patch)) p.delete("page");
    return `?${p.toString()}`;
  };
  const exportHref = `/admin/leads/export${qs({})}`;

  return (
    <>
      <PageHeader
        title="Хүсэлтүүд"
        description="Сайтын “Холбоо барих” болон “Үнэгүй хэмжилт” маягтаар ирсэн хүсэлтүүд."
        actions={
          <a href={exportHref} className={btnGhost}>
            <Download className="h-4 w-4" /> CSV татах
          </a>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {[{ k: undefined, l: "Бүгд", n: countOf("NEW") + countOf("IN_PROGRESS") + countOf("DONE") }, ...(["NEW", "IN_PROGRESS", "DONE", "SPAM"] as LeadStatus[]).map((s) => ({ k: s, l: STATUS_LABEL[s], n: countOf(s) }))].map((f) => {
          const on = (searchParams.status ?? undefined) === f.k;
          return (
            <Link key={f.l} href={qs({ status: f.k })} className={`rounded-full px-4 py-2 text-label-md font-bold transition-colors ${on ? "bg-accent text-navy" : "bg-card text-ink2 hover:bg-soft"}`}>
              {f.l} <span className="opacity-60">{f.n}</span>
            </Link>
          );
        })}
      </div>

      <Panel>
        <form className="mb-5 flex flex-col gap-3 sm:flex-row" action="/admin/leads">
          {searchParams.status && <input type="hidden" name="status" value={searchParams.status} />}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input name="q" defaultValue={searchParams.q} placeholder="Нэр, утас, байгууллага, и-мэйлээр хайх" className="input !h-11 pl-9" />
          </div>
          <select name="source" defaultValue={searchParams.source ?? ""} className="input !h-11 sm:w-52">
            <option value="">Бүх маягт</option>
            <option value="CONTACT">{SOURCE_LABEL.CONTACT}</option>
            <option value="DEMO">{SOURCE_LABEL.DEMO}</option>
          </select>
          <button className="btn-primary !rounded-full !px-6 !py-2.5">Хайх</button>
        </form>

        {leads.length === 0 ? (
          <Empty>Хүсэлт олдсонгүй.</Empty>
        ) : (
          <div className="-mx-5 overflow-x-auto sm:-mx-6">
            <table className="w-full min-w-[760px] text-left text-body-sm">
              <thead className="border-b border-line text-label-sm uppercase tracking-wider text-muted">
                <tr>
                  {["Огноо", "Нэр", "Утас", "Маягт", "Сонирхол", "Хариуцагч", "Төлөв"].map((h) => (
                    <th key={h} className="px-5 py-3 font-bold first:pl-5 sm:first:pl-6">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {leads.map((l) => (
                  <tr key={l.id} className="transition-colors hover:bg-soft">
                    <td className="whitespace-nowrap px-5 py-3 text-muted sm:pl-6">{fmtDate(l.createdAt)}</td>
                    <td className="px-5 py-3">
                      <Link href={`/admin/leads/${l.id}`} className="font-semibold text-ink hover:text-accent">{l.name}</Link>
                      {l.organization && <span className="block text-label-sm text-muted">{l.organization}</span>}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3"><a href={`tel:${l.phone.replace(/\s/g, "")}`} className="hover:text-accent">{l.phone}</a></td>
                    <td className="px-5 py-3 text-muted">{SOURCE_LABEL[l.source]}</td>
                    <td className="px-5 py-3 text-muted">{l.interests.join(", ") || "—"}</td>
                    <td className="px-5 py-3 text-muted">{l.assignee?.name ?? "—"}</td>
                    <td className="px-5 py-3"><StatusBadge status={l.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {total > PAGE && (
          <div className="mt-5 flex items-center justify-between text-body-sm text-muted">
            <span>{(page - 1) * PAGE + 1}–{Math.min(page * PAGE, total)} / {total}</span>
            <div className="flex gap-2">
              {page > 1 && <Link href={qs({ page: String(page - 1) })} className={btnGhost}>Өмнөх</Link>}
              {page * PAGE < total && <Link href={qs({ page: String(page + 1) })} className={btnGhost}>Дараах</Link>}
            </div>
          </div>
        )}
      </Panel>
    </>
  );
}
