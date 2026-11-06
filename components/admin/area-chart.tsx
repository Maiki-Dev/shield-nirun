/**
 * Smooth area chart (server-rendered SVG, no JS): solid cyan line + gradient for the current period,
 * dashed line for the previous period — as in the Framer design. Monotone curves never overshoot below 0.
 */
function monotonePath(pts: [number, number][]) {
  if (pts.length < 2) return "";
  const n = pts.length;
  const dx = pts.slice(1).map((p, i) => p[0] - pts[i][0]);
  const m = pts.slice(1).map((p, i) => (p[1] - pts[i][1]) / dx[i]);
  const t = pts.map((_, i) => (i === 0 ? m[0] : i === n - 1 ? m[n - 2] : m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2));
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) { t[i] = 0; t[i + 1] = 0; continue; }
    const a = t[i] / m[i], b = t[i + 1] / m[i], s = a * a + b * b;
    if (s > 9) { const k = 3 / Math.sqrt(s); t[i] = k * a * m[i]; t[i + 1] = k * b * m[i]; }
  }
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ` C${pts[i][0] + h},${pts[i][1] + t[i] * h} ${pts[i + 1][0] - h},${pts[i + 1][1] - t[i + 1] * h} ${pts[i + 1][0]},${pts[i + 1][1]}`;
  }
  return d;
}

export function AreaChart({ cur, prev, labels }: { cur: number[]; prev: number[]; labels: string[] }) {
  const W = 1000, H = 240, top = 10;
  const max = Math.max(4, ...cur, ...prev);
  const step = Math.ceil(max / 4);
  const yMax = step * 4;
  const x = (i: number) => (cur.length === 1 ? W / 2 : (i / (cur.length - 1)) * W);
  const y = (v: number) => top + (1 - v / yMax) * (H - top);
  const curPts = cur.map((v, i) => [x(i), y(v)] as [number, number]);
  const prevPts = prev.map((v, i) => [x(i), y(v)] as [number, number]);
  const line = monotonePath(curPts);
  const ticks = [4, 3, 2, 1].map((k) => k * step);

  return (
    <div className="grid grid-cols-[2.25rem_1fr] gap-x-2">
      <div className="relative" style={{ height: H }}>
        {ticks.map((v) => (
          <span key={v} className="absolute right-0 -translate-y-1/2 text-label-sm text-muted" style={{ top: y(v) }}>{v}</span>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full" style={{ height: H }} role="img" aria-label="Хүсэлтийн статистик">
        <defs>
          <linearGradient id="adm-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#4FC3E8" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#4FC3E8" stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((v) => <line key={v} x1="0" x2={W} y1={y(v)} y2={y(v)} stroke="rgb(var(--line))" strokeWidth="1" vectorEffect="non-scaling-stroke" />)}
        <path d={`${line} L${W},${H} L0,${H} Z`} fill="url(#adm-area)" />
        <path d={monotonePath(prevPts)} fill="none" stroke="rgb(var(--ink) / 0.7)" strokeWidth="1.6" strokeDasharray="6 5" vectorEffect="non-scaling-stroke" />
        <path d={line} fill="none" stroke="#4FC3E8" strokeWidth="2.6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <div />
      <div className="relative mt-2 h-4 text-label-sm text-muted">
        {labels.map((l, i) =>
          l ? (
            <span
              key={i}
              // on phones only every other label fits
              className={`absolute top-0 -translate-x-1/2 whitespace-nowrap ${labels.slice(0, i).filter(Boolean).length % 2 ? "max-sm:hidden" : ""}`}
              style={{ left: `${(x(i) / W) * 100}%` }}
            >
              {l}
            </span>
          ) : null,
        )}
      </div>
    </div>
  );
}
