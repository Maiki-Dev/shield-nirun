import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { Empty, PageHeader, btnPrimary, fmtDate } from "@/components/admin/ui";

export const metadata = { title: "Санал асуулга" };

export default async function SurveysAdmin() {
  const surveys = await db.survey.findMany({ orderBy: { createdAt: "desc" }, include: { _count: { select: { responses: true } } } });
  return (
    <>
      <PageHeader title="Санал асуулга" description="Асуулгаа зохиож, холбоосыг нь харилцагч, оршин суугчиддаа илгээнэ." actions={<Link href="/admin/surveys/new" className={btnPrimary}><Plus className="h-4 w-4" /> Шинэ асуулга</Link>} />
      {surveys.length === 0 ? (
        <Empty>Одоогоор санал асуулга алга.</Empty>
      ) : (
        <div className="flex flex-col gap-2.5">
          {surveys.map((s) => (
            <Link key={s.id} href={`/admin/surveys/${s.id}`} className="flex flex-wrap items-center gap-x-5 gap-y-1 rounded-[18px] bg-card px-5 py-4 transition-colors hover:bg-soft">
              <span className="min-w-[200px] flex-1">
                <span className="block font-semibold text-ink">{s.titleMn}</span>
                <span className="font-mono text-label-sm text-muted">/survey/{s.slug}</span>
              </span>
              <span className="text-body-sm text-ink2">{s._count.responses} хариулт</span>
              <span className="text-label-sm text-muted">{fmtDate(s.createdAt)}</span>
              <span className={`rounded-full px-2.5 py-0.5 text-label-sm font-bold ${s.active ? "bg-emerald-400/15 text-emerald-300" : "bg-slate-400/15 text-slate-300"}`}>{s.active ? "Идэвхтэй" : "Хаалттай"}</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
