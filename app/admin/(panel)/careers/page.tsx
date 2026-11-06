import Link from "next/link";
import type { ApplicationStatus } from "@prisma/client";
import { Paperclip } from "lucide-react";
import { db } from "@/lib/db";
import { Empty, PageHeader, Panel, fmtDate } from "@/components/admin/ui";
import { ItemForm, type Field } from "@/components/admin/item-form";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { APPLICATION_STATUS } from "@/lib/careers";
import { deleteItem, moveItem } from "../content/actions";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { btnDanger, btnGhost } from "@/components/admin/ui";

export const metadata = { title: "Ажлын анкет" };

const FIELDS: Field[] = [
  { name: "titleMn", label: "Албан тушаал (монгол)", type: "text", max: 120 },
  { name: "titleEn", label: "Position (English)", type: "text", max: 120 },
  { name: "descriptionMn", label: "Тавигдах шаардлага (мөр бүр нэг заалт)", type: "textarea", max: 3000 },
  { name: "descriptionEn", label: "Requirements (one per line)", type: "textarea", max: 3000 },
  { name: "open", label: "Нээлттэй (сайт дээр харагдана)", type: "checkbox" },
];

export default async function CareersAdmin({ searchParams }: { searchParams: { tab?: string; status?: string } }) {
  const tab = searchParams.tab === "positions" ? "positions" : "applications";
  const tabs = (
    <div className="mb-5 flex flex-wrap gap-2">
      {[["applications", "Ирсэн анкетууд"], ["positions", "Ажлын байрууд"]].map(([k, l]) => (
        <Link key={k} href={`?tab=${k}`} className={`rounded-full px-4 py-2 text-label-md font-bold ${tab === k ? "bg-accent text-navy" : "bg-card text-ink2 hover:bg-soft"}`}>{l}</Link>
      ))}
    </div>
  );

  if (tab === "positions") {
    const rows = await db.jobPosition.findMany({ orderBy: { sortOrder: "asc" } });
    return (
      <>
        <PageHeader title="Ажлын анкет" description="Сайтын “Ажлын байр” хуудсанд гарах ажлын байрууд." />
        {tabs}
        <div className="flex flex-col gap-4">
          {rows.map((r, i) => (
            <Panel
              key={r.id}
              title={r.titleMn}
              actions={
                <div className="flex items-center gap-1.5">
                  {!r.open && <span className="mr-1 rounded-full bg-slate-400/15 px-2.5 py-0.5 text-label-sm font-bold text-slate-300">Хаалттай</span>}
                  <form action={moveItem.bind(null, "position", r.id, -1)}><button disabled={i === 0} aria-label="Дээш" className={`${btnGhost} !px-2.5 !py-2`}><ArrowUp className="h-4 w-4" /></button></form>
                  <form action={moveItem.bind(null, "position", r.id, 1)}><button disabled={i === rows.length - 1} aria-label="Доош" className={`${btnGhost} !px-2.5 !py-2`}><ArrowDown className="h-4 w-4" /></button></form>
                  <ConfirmButton action={deleteItem.bind(null, "position", r.id)} message="Энэ ажлын байрыг устгах уу? (Ирсэн анкетууд хадгалагдана)" className={`${btnDanger} !px-2.5 !py-2`}><Trash2 className="h-4 w-4" /></ConfirmButton>
                </div>
              }
            >
              <ItemForm kind="position" id={r.id} fields={FIELDS} values={{ titleMn: r.titleMn, titleEn: r.titleEn, descriptionMn: r.descriptionMn, descriptionEn: r.descriptionEn, open: r.open }} />
            </Panel>
          ))}
          <Panel title="Шинэ ажлын байр" actions={<Plus className="h-5 w-5 text-accent" />} className="outline-dashed outline-1 outline-line">
            <ItemForm kind="position" id={null} fields={FIELDS} values={{ titleMn: "", titleEn: "", descriptionMn: "", descriptionEn: "", open: true }} />
          </Panel>
        </div>
      </>
    );
  }

  const status = searchParams.status && searchParams.status in APPLICATION_STATUS ? (searchParams.status as ApplicationStatus) : undefined;
  const [apps, counts] = await Promise.all([
    db.jobApplication.findMany({ where: status ? { status } : {}, orderBy: { createdAt: "desc" }, take: 200 }),
    db.jobApplication.groupBy({ by: ["status"], _count: true }),
  ]);
  const c = (s: string) => counts.find((x) => x.status === s)?._count ?? 0;

  return (
    <>
      <PageHeader title="Ажлын анкет" description="Сайтын “Ажлын байр” хуудсаар ирсэн анкетууд. CV зөвхөн нэвтэрсэн ажилтанд татагдана." />
      {tabs}
      <div className="mb-4 flex flex-wrap gap-2">
        <Link href="?tab=applications" className={`rounded-full px-3.5 py-1.5 text-label-sm font-bold ${!status ? "bg-soft2 text-ink" : "bg-card text-muted hover:bg-soft"}`}>Бүгд</Link>
        {Object.entries(APPLICATION_STATUS).map(([k, v]) => (
          <Link key={k} href={`?tab=applications&status=${k}`} className={`rounded-full px-3.5 py-1.5 text-label-sm font-bold ${status === k ? "bg-soft2 text-ink" : "bg-card text-muted hover:bg-soft"}`}>
            {v.label} <span className="opacity-60">{c(k)}</span>
          </Link>
        ))}
      </div>
      {apps.length === 0 ? (
        <Empty>Анкет алга.</Empty>
      ) : (
        <div className="flex flex-col gap-2.5">
          {apps.map((a) => (
            <Link key={a.id} href={`/admin/careers/${a.id}`} className="flex flex-wrap items-center gap-x-5 gap-y-1 rounded-[18px] bg-card px-5 py-4 transition-colors hover:bg-soft">
              <span className="min-w-[180px] flex-1">
                <span className="block font-semibold text-ink">{a.name}</span>
                <span className="text-label-sm text-muted">{a.positionTitle}</span>
              </span>
              <span className="text-body-sm text-ink2">{a.phone}</span>
              {a.cvFile && <Paperclip className="h-4 w-4 text-accent" aria-label="CV хавсаргасан" />}
              <span className="text-label-sm text-muted">{fmtDate(a.createdAt)}</span>
              <span className={`rounded-full px-2.5 py-0.5 text-label-sm font-bold ${APPLICATION_STATUS[a.status].cls}`}>{APPLICATION_STATUS[a.status].label}</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
