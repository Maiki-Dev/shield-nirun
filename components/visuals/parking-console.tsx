/* eslint-disable @next/next/no-img-element */
import { CircleCheck, ScanLine, ShieldCheck } from "lucide-react";
import { tr, type Lang } from "@/lib/i18n";

/** Positions (in % of the 1219×763 frame) of the car and its (masked) plate in the real camera shot. */
const CAR = { left: "30.5%", top: "20.5%", width: "47%", height: "57%" };
const PLATE = { left: "55.4%", top: "57.8%", width: "15.6%", height: "11.4%" };

const status = (t: ReturnType<typeof tr>) => [
  { text: t("Дугаар таньж байна…", "Reading plate…"), icon: ScanLine, cls: "text-brand-light" },
  { text: t("Нэвтрэх эрхтэй · Оршин суугч", "Access granted · Resident"), icon: ShieldCheck, cls: "text-emerald-300" },
  { text: t("Хаалт нээгдлээ", "Barrier opened"), icon: CircleCheck, cls: "text-emerald-300" },
];

/** Plates keep the Mongolian plate format (masked). */
const log = (t: ReturnType<typeof tr>) => [
  { plate: "•••• УБ•", who: t("Оршин суугч", "Resident"), status: t("Нэвтэрсэн", "Entered"), tone: "text-emerald-400" },
  { plate: "•••• УН•", who: t("Зочин · QPay", "Visitor · QPay"), status: t("Төлсөн", "Paid"), tone: "text-brand-light" },
  { plate: "•••• УБ•", who: t("Гэрээт", "Contract"), status: t("Нэвтэрсэн", "Entered"), tone: "text-emerald-400" },
];

function Corners({ className = "", size = "h-4 w-4" }: { className?: string; size?: string }) {
  return (
    <>
      {["left-0 top-0 border-l-2 border-t-2", "right-0 top-0 border-r-2 border-t-2", "bottom-0 left-0 border-b-2 border-l-2", "bottom-0 right-0 border-b-2 border-r-2"].map((c) => (
        <span key={c} className={`absolute ${size} ${c} ${className}`} />
      ))}
    </>
  );
}

/**
 * ANPR console built on a real Shield Nirun camera frame (plates masked) with a live-looking HUD:
 * slow camera push-in, vehicle + plate detection boxes, scan line, cycling decision status, rolling log.
 * CSS only; every moving layer is transform/opacity.
 */
export function ParkingConsole({ lang }: { lang: Lang }) {
  const t = tr(lang);
  const STATUS = status(t);
  const LOG = log(t);
  return (
    <div className="relative overflow-hidden rounded-[22px] bg-[#05101C] text-slate-200 ring-1 ring-white/5">
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3 font-mono text-label-sm">
        <span className="flex items-center gap-2 text-slate-300">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" /> CAM-01 · {t("ОРОХ ГАРЦ", "ENTRY GATE")}
        </span>
        <span className="text-slate-500">AI ANPR · LIVE</span>
      </div>

      <div className="relative aspect-[1219/763] overflow-hidden">
        {/* camera push-in: image + detection boxes move together so the boxes stay on the car */}
        <div className="sn-kenburns absolute inset-0 will-change-transform">
          <img
            src="/images/site/LPR-camera.webp"
            alt={t("Shield Nirun ANPR камерын бодит бичлэг — улсын дугаарыг нуусан", "Real Shield Nirun ANPR camera footage — licence plate masked")}
            loading="lazy" decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05101C]/70 via-transparent to-[#05101C]/20" />

          {/* vehicle box */}
          <div className="absolute" style={CAR}>
            <Corners className="border-white/80" size="h-5 w-5" />
            <span className="absolute -top-6 left-0 rounded bg-white/90 px-1.5 py-0.5 font-mono text-[10px] font-bold text-navy">{t("АВТОМАШИН", "VEHICLE")}</span>
          </div>

          {/* plate box locks on in sync with the 7.5s status cycle */}
          <div className="sn-lock absolute" style={{ ...PLATE, animationDuration: "7.5s" }}>
            <span className="absolute inset-0 rounded-sm bg-brand/15 ring-1 ring-brand-light/60" />
            <Corners className="border-brand-light" size="h-3 w-3" />
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-brand px-1.5 py-0.5 font-mono text-[10px] font-bold text-navy">
              {t("ДУГААР", "PLATE")}
            </span>
          </div>
        </div>

        <div className="sn-scan pointer-events-none absolute left-0 right-0 h-1/4 bg-gradient-to-b from-transparent via-brand/15 to-transparent" />

      </div>

      {/* decision status (3 states cycling) */}
        <div className="flex items-center justify-between gap-3 border-t border-white/5 bg-white/[0.02] px-4 py-3">
          <div className="relative h-5 flex-1">
            {STATUS.map((s, i) => (
              <span
                key={s.text}
                className={`sn-cycle absolute inset-0 flex items-center gap-2 text-body-sm font-semibold ${s.cls}`}
                style={{ animationDelay: `${i * 2.5}s` }}
              >
                <s.icon className="h-4 w-4 shrink-0" /> {s.text}
              </span>
            ))}
          </div>
          <span className="shrink-0 font-mono text-[11px] text-slate-500">{t("Гарц А · 08:42", "Gate A · 08:42")}</span>
        </div>

      <div className="border-t border-white/5 px-4 py-3">
        <div className="mb-2 flex items-center justify-between font-mono text-label-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <ScanLine className="h-3.5 w-3.5 text-brand-light" /> {t("Сүүлийн бүртгэл", "Recent entries")}
          </span>
          <span>{t("Бодит бичлэг · дугаарыг нуусан", "Real footage · plates masked")}</span>
        </div>
        <div className="h-9 overflow-hidden">
          <ul className="sn-log">
            {LOG.map((r, i) => (
              <li key={i} className="flex h-9 items-center justify-between gap-3 text-body-sm">
                <span className="rounded bg-white/90 px-1.5 py-0.5 font-mono text-[11px] font-bold text-navy">{r.plate}</span>
                <span className="flex-1 truncate text-slate-400">{r.who}</span>
                <span className={`font-semibold ${r.tone}`}>{r.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
