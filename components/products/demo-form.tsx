"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { FormSuccess } from "@/components/ui/form-success";
import { Honeypot } from "@/components/ui/form-honeypot";
import { leadErrorText, sendLead } from "@/lib/lead-client";
import { useLang } from "@/components/lang-provider";
import { useLaunched } from "@/components/brand/coming-soon-gate";

/** value is stable across languages; label is shown. Shield+ products are only offered once launched. */
const CURRENT = [
  { value: "camera", mn: "Камер суурилуулалт", en: "Camera installation" },
  { value: "access", mn: "Нэвтрэх хяналт", en: "Access control" },
  { value: "drone", mn: "Дрон хяналт", en: "Drone monitoring" },
  { value: "guard", mn: "Биет хамгаалалт", en: "On-site security" },
] as const;
const SHIELD_PLUS_ITEMS = [
  { value: "parking", mn: "ANPR Зогсоол", en: "ANPR parking" },
  { value: "hoa", mn: "СӨХ апп систем", en: "HOA app system" },
] as const;

export function DemoForm() {
  const { lang, t } = useLang();
  const SERVICES = useLaunched() ? [...SHIELD_PLUS_ITEMS, ...CURRENT] : CURRENT;
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    const res = await sendLead(e.currentTarget, "DEMO", lang, { object: "organization", capacity: "scale", services: "interests", note: "message" });
    setPending(false);
    if (res.ok) setSent(true);
    else setError(leadErrorText(res.error, t));
  };

  if (sent) {
    return (
      <FormSuccess
        title={t("Баярлалаа! Таны хүсэлт бүртгэгдлээ.", "Thank you! Your request has been registered.")}
        text={t(
          "Манай инженерийн баг тантай холбогдож газар дээрх үнэгүй хэмжилт, демог товлох болно.",
          "Our engineering team will contact you to schedule a free on-site survey and demo.",
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
          <label htmlFor="d-name" className="label">{t("Таны нэр", "Your name")} *</label>
          <input id="d-name" name="name" required autoComplete="name" placeholder={t("Жишээ: Батбаяр", "e.g. Batbayar")} className="input" />
        </div>
        <div>
          <label htmlFor="d-phone" className="label">{t("Утасны дугаар", "Phone number")} *</label>
          <input id="d-phone" name="phone" type="tel" required autoComplete="tel" placeholder="9911-XXXX" className="input" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="d-object" className="label">{t("Объект / Хотхоны нэр", "Site / Complex name")} *</label>
          <input id="d-object" name="object" required placeholder={t("Жишээ: Ривер Гарден 2", "e.g. River Garden 2")} className="input" />
        </div>
        <div>
          <label htmlFor="d-capacity" className="label">{t("Зогсоолын багтаамж", "Parking capacity")}</label>
          <select id="d-capacity" name="capacity" defaultValue="50-200" className="input">
            <option value="<50">{t("50 хүртэл", "Up to 50")}</option>
            <option value="50-200">{t("50 – 200 зогсоол", "50 – 200 spaces")}</option>
            <option value="200-500">{t("200 – 500 зогсоол", "200 – 500 spaces")}</option>
            <option value="500+">{t("500+ зогсоол", "500+ spaces")}</option>
          </select>
        </div>
      </div>
      <fieldset>
        <legend className="label">{t("Сонирхож буй систем", "Systems of interest")}</legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SERVICES.map((s, i) => (
            <label key={s.value} className="flex cursor-pointer items-center gap-2.5 rounded-2xl border border-line bg-sheet p-3 transition-colors hover:border-brand/50 has-[:checked]:border-brand">
              <input type="checkbox" name="services" value={s.value} defaultChecked={i < 2} className="h-4 w-4 accent-brand" />
              <span className="text-body-sm text-ink">{s[lang]}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="d-note" className="label">{t("Нэмэлт тайлбар (заавал биш)", "Additional notes (optional)")}</label>
        <textarea id="d-note" name="note" rows={3} placeholder={t("Одоогийн хаалтны төлөв, тулгамдаж буй асуудал гэх мэт...", "Current barrier condition, problems you face, etc.")} className="input h-auto resize-none py-3" />
      </div>
      {error && (
        <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-body-sm font-semibold text-red-600">{error}</p>
      )}
      <button type="submit" disabled={pending} className="btn-primary w-full !rounded-full !py-4 disabled:opacity-60">
        {pending ? t("Илгээж байна...", "Sending...") : t("Үнэгүй хэмжилт захиалах", "Book a free site survey")}
        <Send className="h-5 w-5" />
      </button>
    </form>
  );
}
