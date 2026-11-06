"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Paperclip, Send } from "lucide-react";
import { FormSuccess } from "@/components/ui/form-success";
import { Honeypot } from "@/components/ui/form-honeypot";
import { useLang } from "@/components/lang-provider";
import { submitApplication } from "@/app/actions/careers";

export function ApplicationForm({ positions }: { positions: { id: string; title: string }[] }) {
  const { lang, t, href } = useLang();
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const ref = useRef<HTMLFormElement>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("locale", lang);
    const res = await submitApplication(fd).catch(() => ({ ok: false as const, error: "server" as const }));
    setPending(false);
    if (res.ok) return setSent(true);
    setError(
      res.error === "file"
        ? t("CV нь PDF, DOC эсвэл DOCX, 5 MB хүртэл байх ёстой.", "Your CV must be a PDF, DOC or DOCX file up to 5 MB.")
        : res.error === "invalid"
          ? t("Нэр, утасны дугаар зэрэг мэдээллээ шалгана уу.", "Please check your name, phone number and other details.")
          : res.error === "rate"
            ? t("Хэт олон анкет илгээгдлээ. Түр хүлээгээд дахин оролдоно уу.", "Too many applications. Please try again later.")
            : t("Илгээхэд алдаа гарлаа. Дахин оролдоно уу.", "Something went wrong. Please try again."),
    );
  };

  if (sent)
    return (
      <FormSuccess
        title={t("Таны анкетыг хүлээн авлаа.", "We've received your application.")}
        text={t("Хүний нөөцийн алба анкетыг тань хянаад тантай холбогдоно. Баярлалаа!", "Our HR team will review it and contact you. Thank you!")}
        resetLabel={t("Өөр анкет илгээх", "Send another application")}
        onReset={() => { setSent(false); setFileName(""); }}
      />
    );

  return (
    <form ref={ref} onSubmit={onSubmit} className="relative grid grid-cols-1 gap-4 sm:grid-cols-2" encType="multipart/form-data">
      <Honeypot />
      <div className="sm:col-span-2">
        <label htmlFor="a-pos" className="label">{t("Сонирхож буй ажлын байр", "Position")}</label>
        <select id="a-pos" name="positionId" className="input" defaultValue={positions[0]?.id ?? ""}>
          {positions.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
          <option value="">{t("Ерөнхий анкет (тодорхой ажлын байргүй)", "General application")}</option>
        </select>
      </div>
      <div>
        <label htmlFor="a-name" className="label">{t("Овог, нэр", "Full name")} *</label>
        <input id="a-name" name="name" required minLength={2} autoComplete="name" className="input" />
      </div>
      <div>
        <label htmlFor="a-phone" className="label">{t("Утасны дугаар", "Phone number")} *</label>
        <input id="a-phone" name="phone" type="tel" required autoComplete="tel" className="input" />
      </div>
      <div>
        <label htmlFor="a-email" className="label">{t("И-мэйл", "Email")}</label>
        <input id="a-email" name="email" type="email" autoComplete="email" className="input" />
      </div>
      <div>
        <label htmlFor="a-year" className="label">{t("Төрсөн он", "Year of birth")}</label>
        <input id="a-year" name="birthYear" type="number" inputMode="numeric" min={1940} max={new Date().getFullYear() - 16} className="input" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="a-addr" className="label">{t("Оршин суугаа хаяг (дүүрэг, хороо)", "Address (district)")}</label>
        <input id="a-addr" name="address" autoComplete="street-address" maxLength={200} className="input" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="a-exp" className="label">{t("Ажлын туршлага", "Work experience")}</label>
        <textarea id="a-exp" name="experience" rows={4} maxLength={4000} placeholder={t("Хаана, ямар албан тушаалд, хэдэн жил ажилласан бэ?", "Where, in what role and for how long?")} className="input h-auto resize-y py-3" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="a-msg" className="label">{t("Нэмэлт мэдээлэл", "Anything else")}</label>
        <textarea id="a-msg" name="message" rows={3} maxLength={3000} className="input h-auto resize-y py-3" />
      </div>
      <div className="sm:col-span-2">
        <span className="label">{t("CV (PDF, DOC, DOCX · 5 MB хүртэл)", "CV (PDF, DOC, DOCX · up to 5 MB)")}</span>
        <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-line bg-sheet px-4 py-3.5 text-body-sm text-muted hover:border-brand">
          <Paperclip className="h-5 w-5 text-accent" />
          <span className="truncate">{fileName || t("Файл сонгох", "Choose a file")}</span>
          <input name="cv" type="file" accept=".pdf,.doc,.docx,application/pdf" className="sr-only" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")} />
        </label>
      </div>
      <label htmlFor="a-consent" className="flex cursor-pointer items-start gap-2.5 text-body-sm text-muted sm:col-span-2">
        <input id="a-consent" type="checkbox" required className="mt-0.5 h-4 w-4 accent-brand" />
        <span>
          {t("Миний мэдээллийг ажилд авах үйл явцад ашиглахыг зөвшөөрч байна.", "I agree that my details may be used for recruitment.")}{" "}
          <Link href={href("/contact")} className="font-semibold text-accent hover:underline">{t("Нууцлалын бодлого", "Privacy policy")}</Link>
        </span>
      </label>
      {error && <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-body-sm font-semibold text-red-600 sm:col-span-2">{error}</p>}
      <button type="submit" disabled={pending} className="btn-primary !rounded-full !py-4 disabled:opacity-60 sm:col-span-2">
        {pending ? t("Илгээж байна…", "Sending…") : t("Анкет илгээх", "Submit application")} <Send className="h-5 w-5" />
      </button>
    </form>
  );
}
