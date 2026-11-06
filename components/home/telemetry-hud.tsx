import { homeContent } from "@/lib/content/home";
import { tr, type Lang } from "@/lib/i18n";

/*
 * Illustrative control-room widget — shows system states, not performance figures.
 * Server component, zero JS: the chart is a seamless 2-period waveform drawn at 200% width and slid
 * with a GPU transform (`sn-wave`), so it never re-renders or repaints the path.
 */
const WAVE_LINE = "M0.0,38.0 L6.2,31.1 L12.5,29.9 L18.8,33.8 L25.0,39.5 L31.2,43.3 L37.5,43.0 L43.8,39.7 L50.0,35.9 L56.2,34.2 L62.5,34.7 L68.8,36.0 L75.0,35.8 L81.2,33.9 L87.5,31.9 L93.8,33.1 L100.0,39.3 L106.2,49.9 L112.5,61.3 L118.8,69.5 L125.0,71.8 L131.2,69.0 L137.5,64.2 L143.8,60.5 L150.0,59.3 L156.2,59.6 L162.5,59.0 L168.8,56.4 L175.0,52.4 L181.2,49.7 L187.5,50.3 L193.8,53.9 L200.0,58.0 L206.2,58.7 L212.5,53.9 L218.8,44.4 L225.0,33.8 L231.2,26.1 L237.5,23.4 L243.8,24.9 L250.0,28.1 L256.2,30.5 L262.5,31.7 L268.8,33.4 L275.0,37.5 L281.2,44.3 L287.5,51.8 L293.8,56.7 L300.0,56.7 L306.2,52.4 L312.5,46.9 L318.8,44.3 L325.0,46.8 L331.2,53.6 L337.5,61.4 L343.8,66.9 L350.0,68.7 L356.2,67.8 L362.5,66.5 L368.8,66.3 L375.0,66.2 L381.2,64.1 L387.5,58.0 L393.8,48.3 L400.0,38.0 L406.2,31.1 L412.5,29.9 L418.8,33.8 L425.0,39.5 L431.2,43.3 L437.5,43.0 L443.8,39.7 L450.0,35.9 L456.2,34.2 L462.5,34.7 L468.8,36.0 L475.0,35.8 L481.2,33.9 L487.5,31.9 L493.8,33.1 L500.0,39.3 L506.2,49.9 L512.5,61.3 L518.8,69.5 L525.0,71.8 L531.2,69.0 L537.5,64.2 L543.8,60.5 L550.0,59.3 L556.2,59.6 L562.5,59.0 L568.8,56.4 L575.0,52.4 L581.2,49.7 L587.5,50.3 L593.8,53.9 L600.0,58.0 L606.2,58.7 L612.5,53.9 L618.8,44.4 L625.0,33.8 L631.2,26.1 L637.5,23.4 L643.8,24.9 L650.0,28.1 L656.2,30.5 L662.5,31.7 L668.8,33.4 L675.0,37.5 L681.2,44.3 L687.5,51.8 L693.8,56.7 L700.0,56.7 L706.2,52.4 L712.5,46.9 L718.8,44.3 L725.0,46.8 L731.2,53.6 L737.5,61.4 L743.8,66.9 L750.0,68.7 L756.2,67.8 L762.5,66.5 L768.8,66.3 L775.0,66.2 L781.2,64.1 L787.5,58.0 L793.8,48.3 L800.0,38.0";
const WAVE_AREA = "M0.0,38.0 L6.2,31.1 L12.5,29.9 L18.8,33.8 L25.0,39.5 L31.2,43.3 L37.5,43.0 L43.8,39.7 L50.0,35.9 L56.2,34.2 L62.5,34.7 L68.8,36.0 L75.0,35.8 L81.2,33.9 L87.5,31.9 L93.8,33.1 L100.0,39.3 L106.2,49.9 L112.5,61.3 L118.8,69.5 L125.0,71.8 L131.2,69.0 L137.5,64.2 L143.8,60.5 L150.0,59.3 L156.2,59.6 L162.5,59.0 L168.8,56.4 L175.0,52.4 L181.2,49.7 L187.5,50.3 L193.8,53.9 L200.0,58.0 L206.2,58.7 L212.5,53.9 L218.8,44.4 L225.0,33.8 L231.2,26.1 L237.5,23.4 L243.8,24.9 L250.0,28.1 L256.2,30.5 L262.5,31.7 L268.8,33.4 L275.0,37.5 L281.2,44.3 L287.5,51.8 L293.8,56.7 L300.0,56.7 L306.2,52.4 L312.5,46.9 L318.8,44.3 L325.0,46.8 L331.2,53.6 L337.5,61.4 L343.8,66.9 L350.0,68.7 L356.2,67.8 L362.5,66.5 L368.8,66.3 L375.0,66.2 L381.2,64.1 L387.5,58.0 L393.8,48.3 L400.0,38.0 L406.2,31.1 L412.5,29.9 L418.8,33.8 L425.0,39.5 L431.2,43.3 L437.5,43.0 L443.8,39.7 L450.0,35.9 L456.2,34.2 L462.5,34.7 L468.8,36.0 L475.0,35.8 L481.2,33.9 L487.5,31.9 L493.8,33.1 L500.0,39.3 L506.2,49.9 L512.5,61.3 L518.8,69.5 L525.0,71.8 L531.2,69.0 L537.5,64.2 L543.8,60.5 L550.0,59.3 L556.2,59.6 L562.5,59.0 L568.8,56.4 L575.0,52.4 L581.2,49.7 L587.5,50.3 L593.8,53.9 L600.0,58.0 L606.2,58.7 L612.5,53.9 L618.8,44.4 L625.0,33.8 L631.2,26.1 L637.5,23.4 L643.8,24.9 L650.0,28.1 L656.2,30.5 L662.5,31.7 L668.8,33.4 L675.0,37.5 L681.2,44.3 L687.5,51.8 L693.8,56.7 L700.0,56.7 L706.2,52.4 L712.5,46.9 L718.8,44.3 L725.0,46.8 L731.2,53.6 L737.5,61.4 L743.8,66.9 L750.0,68.7 L756.2,67.8 L762.5,66.5 L768.8,66.3 L775.0,66.2 L781.2,64.1 L787.5,58.0 L793.8,48.3 L800.0,38.0 L800,100 L0,100 Z";

export function TelemetryHud({ lang, className = "" }: { lang: Lang; className?: string }) {
  const { HUD_STATUS } = homeContent(lang);
  return (
    <div className={`relative flex w-full flex-col gap-4 overflow-hidden rounded-[26px] border border-line bg-card p-4 shadow-[0_30px_60px_-20px_rgba(11,25,44,0.25)] sm:p-5 ${className}`}>
      <div className="flex items-center justify-between gap-2 rounded-xl bg-soft px-3 py-2.5">
        <span className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="sn-ping absolute inset-0 rounded-full bg-brand/60" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-brand" />
          </span>
          <span className="text-label-sm font-bold uppercase tracking-wider text-ink">Shield+ Control Hub</span>
        </span>
        <span className="font-mono text-label-sm font-bold text-accent">NODE: UBN-CORE-09</span>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-navy p-4 text-slate-200 dark:border dark:border-line dark:bg-[#0A1624]">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-label-sm font-semibold uppercase tracking-wider text-brand-light">{tr(lang)("Төхөөрөмжүүдийн мэдээллийн урсгал", "Device data stream")}</span>
          <span className="rounded bg-brand/20 px-2 py-0.5 font-mono text-label-sm font-bold text-brand-light">LIVE</span>
        </div>
        <div className="h-24 w-full overflow-hidden">
          <svg viewBox="0 0 800 100" preserveAspectRatio="none" aria-hidden="true" className="sn-wave h-full w-[200%] will-change-transform">
            <defs>
              <linearGradient id="hudFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#00B4D8" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#00B4D8" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={WAVE_AREA} fill="url(#hudFill)" />
            <path d={WAVE_LINE} fill="none" stroke="#00B4D8" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        <div className="mt-1 flex items-center justify-between font-mono text-label-sm text-slate-400">
          <span>AI · DRONE · CCTV · ACCESS</span>
          <span>SYNC: OK</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {HUD_STATUS.map((m) => (
          <div key={m.label} className="flex flex-col gap-1.5 rounded-xl bg-soft p-3">
            <span className="flex items-center gap-1.5 text-label-sm font-semibold uppercase text-muted">
              <m.icon className="h-4 w-4 shrink-0 text-accent" />
              <span className="truncate">{m.label}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-headline-sm font-bold text-ink">{m.status}</span>
            </span>
            <span className="text-body-sm text-muted">{m.caption}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
