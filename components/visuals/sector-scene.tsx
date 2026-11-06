export type SceneVariant = "residential" | "office" | "retail";

const C = "#00C2FF";
const LINE = "rgba(148,163,184,0.35)";

/** Small window grid; a few cells "blink" so buildings feel inhabited. */
function Windows({ x, y, cols, rows, w = 10, h = 8, gap = 6 }: { x: number; y: number; cols: number; rows: number; w?: number; h?: number; gap?: number }) {
  const cells = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const lit = (r * 7 + c * 3) % 5 === 0;
      cells.push(
        <rect
          key={`${r}-${c}`}
          x={x + c * (w + gap)}
          y={y + r * (h + gap)}
          width={w}
          height={h}
          rx={1.5}
          fill={lit ? C : "rgba(148,163,184,0.18)"}
          className={lit ? "sn-blink" : undefined}
          style={lit ? { animationDelay: `${((r + c) % 4) * 0.7}s` } : undefined}
        />,
      );
    }
  return <>{cells}</>;
}

/** Camera node with a pinging ring. */
function Cam({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={9} fill="none" stroke={C} strokeWidth={1.5} className="sn-ping [transform-box:fill-box] [transform-origin:center]" />
      <circle cx={x} cy={y} r={4} fill={C} />
    </g>
  );
}

function Drone({ path, dur = "9s" }: { path: string; dur?: string }) {
  return (
    <>
      <path d={path} fill="none" stroke={C} strokeOpacity={0.45} strokeWidth={1.2} strokeDasharray="5 7" className="sn-dash" />
      <g>
        <circle r={5} fill="#F8FAFC" />
        <circle r={10} fill="none" stroke="#F8FAFC" strokeOpacity={0.35} />
        <animateMotion dur={dur} repeatCount="indefinite" path={path} rotate="auto" />
      </g>
    </>
  );
}

/** Coded, animated sector illustration (blueprint style) — replaces stock/AI photos. */
export function SectorScene({ variant }: { variant: SceneVariant }) {
  return (
    <div className="relative h-60 overflow-hidden bg-[#08131F]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,194,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(0,194,255,0.07)_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_100%,rgba(0,180,216,0.22),transparent_70%)]" />
      <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
        <line x1="0" y1="206" x2="400" y2="206" stroke={LINE} strokeWidth={1.5} />

        {variant === "residential" && (
          <>
            <rect x="52" y="62" width="96" height="144" rx="4" fill="#0E2236" stroke={LINE} />
            <Windows x={62} y={74} cols={5} rows={8} w={10} h={9} gap={7} />
            <rect x="166" y="98" width="82" height="108" rx="4" fill="#0E2236" stroke={LINE} />
            <Windows x={176} y={110} cols={4} rows={6} w={10} h={9} gap={7} />
            {/* gate */}
            <rect x="292" y="168" width="8" height="38" rx="2" fill="#94A3B8" />
            <rect x="298" y="170" width="74" height="5" rx="2.5" fill="#F8FAFC" className="sn-gate" style={{ transformBox: "fill-box", transformOrigin: "0 50%" }} />
            <Cam x={52} y={62} />
            <Cam x={248} y={98} />
            <Cam x={296} y={164} />
            <Drone path="M 60 40 C 160 0, 300 10, 350 60 S 260 120, 160 70 S 20 70, 60 40 Z" />
          </>
        )}

        {variant === "office" && (
          <>
            <rect x="140" y="22" width="120" height="184" rx="4" fill="#0E2236" stroke={LINE} />
            <Windows x={152} y={34} cols={6} rows={10} w={10} h={8} gap={7} />
            {/* turnstiles */}
            {[96, 136, 264, 304].map((x) => (
              <g key={x}>
                <rect x={x} y="182" width="6" height="24" rx="2" fill="#94A3B8" />
                <rect x={x + 6} y="188" width="22" height="3" rx="1.5" fill={C} opacity={0.8} />
              </g>
            ))}
            {/* people passing */}
            {[0, 1.6, 3.2].map((d) => (
              <circle key={d} r={4.5} fill="#F8FAFC">
                <animateMotion dur="4.8s" begin={`${d}s`} repeatCount="indefinite" path="M -10 196 L 410 196" />
              </circle>
            ))}
            {/* face-scan frame */}
            <g className="sn-lock" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <path d="M 300 60 h -10 v 10 M 330 60 h 10 v 10 M 300 100 h -10 v -10 M 330 100 h 10 v -10" stroke={C} strokeWidth={2} fill="none" />
              <circle cx="315" cy="76" r="8" fill="none" stroke="#F8FAFC" strokeOpacity={0.7} />
              <path d="M 302 96 q 13 -12 26 0" stroke="#F8FAFC" strokeOpacity={0.7} fill="none" />
            </g>
            <Cam x={140} y={22} />
            <Cam x={260} y={22} />
          </>
        )}

        {variant === "retail" && (
          <>
            {/* parking bays */}
            {Array.from({ length: 3 }).map((_, r) =>
              Array.from({ length: 8 }).map((__, c) => {
                const x = 40 + c * 40;
                const y = 70 + r * 46;
                const taken = (r * 5 + c * 3) % 4 !== 0;
                return (
                  <g key={`${r}-${c}`}>
                    <rect x={x} y={y} width="34" height="40" rx="3" fill="none" stroke={LINE} />
                    {taken && <rect x={x + 6} y={y + 8} width="22" height="26" rx="5" fill={(r + c) % 3 ? "#1A3A5A" : "#94A3B8"} />}
                  </g>
                );
              }),
            )}
            {/* car driving to a free bay */}
            <g>
              <rect x="-11" y="-7" width="22" height="14" rx="4" fill={C} />
              <animateMotion dur="7s" repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;0.7;1" calcMode="linear" path="M 0 50 L 197 50 L 197 92" rotate="auto" />
            </g>
            <Cam x={40} y={70} />
            <Cam x={354} y={70} />
            <Drone path="M 120 40 a 90 26 0 1 0 180 0 a 90 26 0 1 0 -180 0" dur="7s" />
          </>
        )}
      </svg>
    </div>
  );
}
