"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Briefcase, Building, ChevronDown, Mail, Phone, ShieldCheck, User } from "lucide-react";
import { FormSuccess } from "@/components/ui/form-success";
import { Honeypot } from "@/components/ui/form-honeypot";
import { leadErrorText, sendLead } from "@/lib/lead-client";
import { useLang } from "@/components/lang-provider";
import type { Lang } from "@/lib/i18n";

interface SolutionOption {
  value: string;
  title: string;
  text: string;
}

const SOLUTIONS: Record<Lang, SolutionOption[]> = {
  mn: [
    { value: "parking", title: "Ухаалаг зогсоол (Smart Parking ANPR)", text: "Улсын дугаар таних, автомат хаалт" },
    { value: "hoa", title: "СӨХ-ийн нэгдсэн цахим систем", text: "Төлбөр тооцоо, оршин суугчийн апп" },
    { value: "security", title: "Хамгаалалт, AI камер & дрон", text: "Царай таних хандалт, видео, дрон хяналт" },
    { value: "enterprise", title: "Байгууллагын цогц шийдэл (Shield+)", text: "Хороолол, худалдааны төвийн дэд бүтэц" },
  ],
  en: [
    { value: "parking", title: "Smart parking (ANPR)", text: "Licence-plate recognition, automatic barriers" },
    { value: "hoa", title: "Unified HOA system", text: "Billing and the resident app" },
    { value: "security", title: "Security, AI cameras & drones", text: "Face-recognition access, video, drone monitoring" },
    { value: "enterprise", title: "Complete enterprise solution (Shield+)", text: "Infrastructure for districts and shopping centres" },
  ],
};

function IconInput({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="relative flex items-center">
      <span className="pointer-events-none absolute left-3 text-muted">{icon}</span>
      {children}
    </div>
  );
}

export function ContactForm() {
  const { lang, t, href } = useLang();
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    const res = await sendLead(e.currentTarget, "CONTACT", lang, { solution: "interests", note: "message", consent: "_consent" });
    setPending(false);
    if (res.ok) setSent(true);
    else setError(leadErrorText(res.error, t));
  };

  if (sent) {
    return (
      <FormSuccess
        title={t("Таны хүсэлтийг амжилттай хүлээн авлаа.", "We have received your request.")}
        text={t(
          "Манай төслийн инженер тантай холбогдож техникийн шийдэл, төсвийн тооцооллыг танилцуулна.",
          "One of our project engineers will contact you to walk through the technical solution and budget estimate.",
        )}
        resetLabel={t("Дахин хүсэлт илгээх", "Send another request")}
        onReset={() => setSent(false)}
      />
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative flex flex-col gap-4">
      <Honeypot />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="label">{t("Овог, нэр", "Full name")} <span className="text-red-500">*</span></label>
          <IconInput icon={<User className="h-5 w-5" />}>
            <input id="c-name" name="name" required autoComplete="name" placeholder={t("Батболдын Тэмүүлэн", "Temuulen Batbold")} className="input pl-10" />
          </IconInput>
        </div>
        <div>
          <label htmlFor="c-org" className="label">{t("Албан тушаал / Байгууллагын нэр", "Position / Organisation")} <span className="text-red-500">*</span></label>
          <IconInput icon={<Briefcase className="h-5 w-5" />}>
            <input id="c-org" name="organization" required autoComplete="organization" placeholder={t("Мандала хотхон СӨХ / MCS Pro", "Mandala residence HOA / MCS Pro")} className="input pl-10" />
          </IconInput>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="c-phone" className="label">{t("Утасны дугаар", "Phone number")} <span className="text-red-500">*</span></label>
          <IconInput icon={<Phone className="h-5 w-5" />}>
            <input id="c-phone" name="phone" type="tel" required autoComplete="tel" placeholder="+976 9911 2233" className="input pl-10" />
          </IconInput>
        </div>
        <div>
          <label htmlFor="c-email" className="label">{t("И-мэйл хаяг", "Email address")} <span className="text-red-500">*</span></label>
          <IconInput icon={<Mail className="h-5 w-5" />}>
            <input id="c-email" name="email" type="email" required autoComplete="email" placeholder="temuulen@company.mn" className="input pl-10" />
          </IconInput>
        </div>
      </div>

      <fieldset className="pt-1">
        <legend className="label">{t("Сонирхож буй технологийн шийдэл", "Solution of interest")} <span className="text-red-500">*</span></legend>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {SOLUTIONS[lang].map((s, i) => (
            <label
              key={s.value}
              className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-sheet p-4 transition-all hover:border-brand/50 has-[:checked]:border-brand has-[:checked]:bg-brand/5"
            >
              <input type="radio" name="solution" value={s.value} defaultChecked={i === 0} required className="mt-1 h-4 w-4 accent-brand" />
              <span className="flex flex-col">
                <span className="text-body-md font-bold text-ink">{s.title}</span>
                <span className="text-body-sm text-muted">{s.text}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="c-scale" className="label">{t("Объектын хэмжээ / Зогсоолын багтаамж", "Site size / Parking capacity")}</label>
        <IconInput icon={<Building className="h-5 w-5" />}>
          <select id="c-scale" name="scale" defaultValue="200-500" className="input appearance-none pl-10 pr-9">
            <option value="50-200">{t("50 – 200 айл / зогсоол", "50 – 200 households / spaces")}</option>
            <option value="200-500">{t("200 – 500 айл / зогсоол", "200 – 500 households / spaces")}</option>
            <option value="500+">{t("500+ айл / зогсоол", "500+ households / spaces")}</option>
          </select>
          <ChevronDown aria-hidden className="pointer-events-none absolute right-3 h-5 w-5 text-muted" />
        </IconInput>
      </div>

      <div className="pt-2">
        <label htmlFor="c-note" className="label">{t("Нэмэлт тайлбар, шаардлага", "Additional notes and requirements")}</label>
        <textarea
          id="c-note"
          name="note"
          rows={4}
          placeholder={t(
            "Төслийн одоогийн дэд бүтэц, тулгамдаж буй асуудал болон нэвтрүүлэх хугацааны хүлээлтээ бичнэ үү...",
            "Describe your current infrastructure, the problems you face and your expected rollout timeline...",
          )}
          className="input h-auto resize-none py-3"
        />
      </div>

      <label htmlFor="c-consent" className="flex cursor-pointer items-start gap-2.5 pt-1 text-body-sm text-muted">
        <input id="c-consent" name="consent" type="checkbox" required className="mt-0.5 h-4 w-4 accent-brand" />
        <span>
          {t("Би", "I have read the")}{" "}
          <Link href={href("/contact")} className="font-semibold text-accent hover:underline">
            {t("Нууцлалын бодлого", "Privacy policy")}
          </Link>{" "}
          {t(
            "болон мэдээлэл боловсруулах нөхцөлтэй танилцаж, хүсэлтийн хүрээнд холбогдохыг зөвшөөрч байна.",
            "and data processing terms, and agree to be contacted about this request.",
          )}
        </span>
      </label>

      {error && (
        <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-body-sm font-semibold text-red-600">{error}</p>
      )}
      <div className="pt-2">
        <button type="submit" disabled={pending} className="btn-primary w-full !rounded-full !py-4 disabled:opacity-60">
          {pending ? t("Илгээж байна...", "Sending...") : t("Хүсэлт илгээх", "Send request")}
          <ArrowRight className="h-5 w-5" />
        </button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-label-sm text-muted">
          <ShieldCheck className="h-4 w-4 text-accent" /> {t("Мэдээлэл шифрлэгдсэн (HTTPS) холболтоор дамжина", "Sent over an encrypted (HTTPS) connection")}
        </p>
      </div>
    </form>
  );
}
