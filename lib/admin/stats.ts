import "server-only";
import { db } from "@/lib/db";

/** Ulaanbaatar is UTC+8 all year (no DST), so plain offset math is exact. */
const UB = 8 * 3_600_000;
const DAY = 86_400_000;

export type Range = "day" | "week" | "month";
export const WEEKDAY = ["Ня", "Да", "Мя", "Лх", "Пү", "Ба", "Бя"]; // Sun..Sat

/** "YYYY-MM-DD" of a moment in Ulaanbaatar time. */
export const ubDay = (t: number) => new Date(t + UB).toISOString().slice(0, 10);
/** UTC timestamp of 00:00 Ulaanbaatar on a "YYYY-MM-DD" day. */
export const ubMidnight = (day: string) => Date.parse(`${day}T00:00:00Z`) - UB;

export function dayChips(selected: string, count = 13) {
  const today = ubMidnight(ubDay(Date.now()));
  return Array.from({ length: count }, (_, i) => {
    const t = today - (count - 1 - i) * DAY;
    const key = ubDay(t);
    const d = new Date(t + UB);
    return { key, num: String(d.getUTCDate()).padStart(2, "0"), wd: WEEKDAY[d.getUTCDay()], selected: key === selected, isToday: i === count - 1 };
  });
}

/** Lead counts for the chosen period plus the previous period of the same length (spam excluded). */
export async function leadSeries(range: Range, day: string) {
  const end = ubMidnight(day) + DAY; // end of the selected day
  const n = range === "day" ? 24 : range === "week" ? 7 : 30;
  const step = range === "day" ? 3_600_000 : DAY;
  const start = end - n * step;
  const prevStart = start - n * step;

  const rows = await db.lead.findMany({
    where: { createdAt: { gte: new Date(prevStart), lt: new Date(end) }, status: { not: "SPAM" } },
    select: { createdAt: true },
  });
  const cur = Array<number>(n).fill(0);
  const prev = Array<number>(n).fill(0);
  for (const { createdAt } of rows) {
    const t = createdAt.getTime();
    if (t >= start) cur[Math.floor((t - start) / step)]++;
    else prev[Math.floor((t - prevStart) / step)]++;
  }
  const labels = Array.from({ length: n }, (_, i) => {
    if (range === "day") return i % 2 === 0 ? `${String(i).padStart(2, "0")}:00` : "";
    const d = new Date(start + i * step + UB);
    const lbl = `${d.getUTCMonth() + 1}/${d.getUTCDate()}`;
    return range === "week" || i % 5 === 0 ? lbl : "";
  });
  return { cur, prev, labels, total: cur.reduce((a, b) => a + b, 0), prevTotal: prev.reduce((a, b) => a + b, 0) };
}

/** "2ө 3ц" / "3ц 12м" / "12м" since a moment. */
export function ago(d: Date) {
  const m = Math.max(0, Math.floor((Date.now() - d.getTime()) / 60_000));
  const days = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60), min = m % 60;
  if (days) return `${days}ө ${h}ц`;
  if (h) return `${h}ц ${min}м`;
  return `${min}м`;
}
