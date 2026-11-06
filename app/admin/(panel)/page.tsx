import Link from "next/link";
import { ArrowRight, Clock3, Phone, ShieldCheck } from "lucide-react";
import { db } from "@/lib/db";
import { AreaChart } from "@/components/admin/area-chart";
import { SOURCE_LABEL, STATUS_LABEL } from "@/components/admin/ui";
import { SHIELD_PLUS } from "@/lib/content/site";
import { ago, dayChips, leadSeries, ubDay, type Range } from "@/lib/admin/stats";

export const metadata = { title: "Тойм" };

const RANGES: { key: Range; label: string }[] = [
  { key: "day", label: "Өдөр" },
  { key: "week", label: "7 хоног" },
  { key: "month", label: "Сар" },
];

const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";

const hhmm = (d: Date) => new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Ulaanbaatar", hour: "2-digit", minute: "2-digit", hour12: false }).format(d);

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[clamp(1.5rem,2.4vw,1.9rem)] font-semibold tracking-tight text-ink">{children}</h2>;
}

export default async function Overview({ searchParams }: { searchParams: { range?: string; day?: string } }) {
  const range: Range = RANGES.some((r) => r.key === searchParams.range) ? (searchParams.range as Range) : "day";
  const today = ubDay(Date.now());
  const day = /^\d{4}-\d{2}-\d{2}$/.test(searchParams.day ?? "") && searchParams.day! <= today ? searchParams.day! : today;

  const [series, active, fresh, working] = await Promise.all([
    leadSeries(range, day),
    db.lead.findMany({ where: { status: { in: ["NEW", "IN_PROGRESS"] } }, orderBy: { createdAt: "desc" }, take: 3, include: { _count: { select: { notes: true } } } }),
    db.lead.findMany({ where: { status: "NEW" }, orderBy: { createdAt: "desc" }, take: 2 }),
    db.lead.findMany({ where: { status: "IN_PROGRESS" }, orderBy: { updatedAt: "desc" }, take: 2, include: { assignee: { select: { name: true } } } }),
  ]);
  const chips = dayChips(day);
  const href = (p: { range?: Range; day?: string }) => `?range=${p.range ?? range}&day=${p.day ?? day}`;
  const launched = Date.now() >= new Date(SHIELD_PLUS.launch).getTime();
  const diff = series.total - series.prevTotal;

  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
      <div className="flex min-w-0 flex-col gap-10">
        {/* Statistics */}
        <section>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <H2>Хүсэлтийн статистик</H2>
            <div className="flex items-center gap-5 text-body-sm">
              {RANGES.map((r) => (
                <Link key={r.key} href={href({ range: r.key })} className={r.key === range ? "font-semibold text-ink" : "text-muted hover:text-ink"}>
                  {r.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="-mx-1 mb-6 flex gap-2 overflow-x-auto px-1 pb-1">
            {chips.map((c, i) => (
              <Link
                key={c.key}
                href={href({ day: c.key })}
                aria-current={c.selected ? "date" : undefined}
                className={`flex min-w-[44px] flex-1 flex-col items-center rounded-xl py-2.5 text-body-sm transition-colors ${i < chips.length - 7 ? "max-sm:hidden" : ""} ${
                  c.selected ? "bg-accent text-navy shadow-[0_8px_24px_-8px_rgba(79,195,232,0.7)]" : "bg-card text-ink hover:bg-soft"
                }`}
              >
                <span className="font-semibold">{c.num}</span>
                <span className={c.selected ? "text-navy/70" : "text-muted"}>{c.wd}</span>
              </Link>
            ))}
          </div>

          <AreaChart cur={series.cur} prev={series.prev} labels={series.labels} />
          <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-label-md text-muted">
            <span className="inline-flex items-center gap-2"><span className="h-0.5 w-5 rounded bg-accent" /> Энэ үе: <b className="text-ink">{series.total}</b></span>
            <span className="inline-flex items-center gap-2"><span className="w-5 border-t border-dashed border-ink/70" /> Өмнөх үе: <b className="text-ink">{series.prevTotal}</b></span>
            {diff !== 0 && <span className={diff > 0 ? "text-emerald-400" : "text-amber-300"}>{diff > 0 ? "+" : ""}{diff}</span>}
          </p>
        </section>

        {/* Active requests */}
        <section>
          <div className="mb-5 flex items-center justify-between gap-3">
            <H2>Идэвхтэй хүсэлтүүд</H2>
            <Link href="/admin/leads" className="inline-flex items-center gap-1 text-label-md font-semibold text-accent hover:underline">Бүгд <ArrowRight className="h-4 w-4" /></Link>
          </div>
          {active.length === 0 ? (
            <p className="rounded-[20px] bg-card px-6 py-10 text-center text-body-md text-muted">Одоогоор шийдвэрлэх хүсэлт алга.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {active.map((l) => (
                <Link key={l.id} href={`/admin/leads/${l.id}`} className="flex flex-col rounded-[22px] bg-card p-5 transition-colors hover:bg-soft">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent/20 text-label-lg font-bold text-accent">{initials(l.name)}</span>
                    <span className="min-w-0">
                      <span className="block truncate text-body-sm font-semibold text-ink">{l.name}</span>
                      <span className="font-mono text-label-md text-accent">{ago(l.createdAt)}</span>
                    </span>
                  </div>
                  <p className="mt-4 flex items-center gap-2 text-body-sm text-muted">
                    <Phone className="h-4 w-4 text-accent" /> <span className="text-ink">{l.phone}</span>
                  </p>
                  <div className="my-4 h-px bg-line" />
                  <p className="truncate text-body-sm font-semibold text-ink">{l.organization || SOURCE_LABEL[l.source]}</p>
                  <div className="mt-3 flex min-h-[26px] flex-wrap gap-1.5">
                    {(l.interests.length ? l.interests : ["—"]).map((i) => (
                      <span key={i} className="rounded-full bg-soft px-2.5 py-0.5 text-label-sm text-ink2">{i}</span>
                    ))}
                  </div>
                  <p className="mt-4 text-label-sm text-muted">
                    ID {l.id.slice(-5).toUpperCase()} <span className="mx-1.5">•</span> {STATUS_LABEL[l.status]}
                    {l._count.notes > 0 && <><span className="mx-1.5">•</span>{l._count.notes} тэмдэглэл</>}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Right column */}
      <aside className="flex flex-col gap-8">
        <section>
          <H2>Шинэ хүсэлт</H2>
          <div className="mt-4 flex flex-col gap-3">
            {fresh.length === 0 && <p className="text-body-sm text-muted">Шинэ хүсэлт алга.</p>}
            {fresh.map((l) => (
              <Link key={l.id} href={`/admin/leads/${l.id}`} className="flex items-center gap-3 rounded-[18px] bg-card p-4 transition-colors hover:bg-soft">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-soft text-accent"><ShieldCheck className="h-5 w-5" /></span>
                <span className="min-w-0">
                  <span className="block truncate text-body-sm font-semibold text-ink">{l.name}</span>
                  <span className="text-label-sm text-muted">{hhmm(l.createdAt)} · {SOURCE_LABEL[l.source]}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <H2>Хийгдэж буй</H2>
          <div className="mt-4 flex flex-col gap-3">
            {working.length === 0 && <p className="text-body-sm text-muted">Хийгдэж буй хүсэлт алга.</p>}
            {working.map((l) => (
              <Link key={l.id} href={`/admin/leads/${l.id}`} className="flex items-center gap-3 rounded-[18px] bg-card p-4 transition-colors hover:bg-soft">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-soft text-accent"><Clock3 className="h-5 w-5" /></span>
                <span className="min-w-0">
                  <span className="block truncate text-body-sm font-semibold text-ink">{l.name}</span>
                  <span className="block truncate text-label-sm text-muted">{l.assignee?.name ?? "Хуваарилаагүй"}</span>
                  <span className="font-mono text-label-sm text-accent">{ago(l.updatedAt)}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <Link href="/admin/content" className="flex flex-col items-center rounded-[22px] bg-accent px-6 py-9 text-center text-navy transition-transform hover:-translate-y-0.5">
          <ShieldCheck className="h-8 w-8" strokeWidth={1.8} />
          <span className="mt-3 text-[3.2rem] font-semibold leading-none tracking-tight">{launched ? "24/7" : "11.11"}</span>
          <span className="mt-3 text-label-md">{launched ? "Таны аюулгүй байдлын төлөө" : "Shield+ нээлт · 11:11 AM"}</span>
        </Link>
      </aside>
    </div>
  );
}
