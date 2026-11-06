/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { Empty, PageHeader, btnPrimary, fmtDate } from "@/components/admin/ui";

export const metadata = { title: "Мэдээ" };

export default async function AdminNews() {
  const posts = await db.post.findMany({ orderBy: [{ publishedAt: { sort: "desc", nulls: "first" } }, { createdAt: "desc" }] });
  const now = new Date();
  const badge = (p: (typeof posts)[number]) =>
    p.status === "DRAFT" ? ["Ноорог", "bg-slate-400/15 text-slate-300"] : p.publishedAt && p.publishedAt > now ? ["Товлосон", "bg-amber-400/15 text-amber-300"] : ["Нийтлэгдсэн", "bg-emerald-400/15 text-emerald-300"];
  return (
    <>
      <PageHeader title="Мэдээ" description="Сайтын “Мэдээ” хэсэгт гарах нийтлэлүүд. Англи хувилбартай нийтлэл англи сайтад ч гарна." actions={<Link href="/admin/news/new" className={btnPrimary}><Plus className="h-4 w-4" /> Шинэ мэдээ</Link>} />
      {posts.length === 0 ? (
        <Empty>Одоогоор мэдээ алга. “Шинэ мэдээ” товчоор эхлүүлээрэй.</Empty>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((p) => {
            const [label, cls] = badge(p);
            return (
              <Link key={p.id} href={`/admin/news/${p.id}`} className="flex items-center gap-4 rounded-[20px] bg-card p-3 pr-5 transition-colors hover:bg-soft">
                {p.cover ? <img src={p.cover} alt="" className="h-16 w-24 shrink-0 rounded-xl object-cover" /> : <span className="h-16 w-24 shrink-0 rounded-xl bg-soft" />}
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-ink">{p.titleMn}</span>
                  <span className="text-label-sm text-muted">{p.publishedAt ? fmtDate(p.publishedAt) : "Огноогүй"} · {p.titleEn ? "MN + EN" : "MN"} · {p.authorName ?? "—"}</span>
                </span>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-label-sm font-bold ${cls}`}>{label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
