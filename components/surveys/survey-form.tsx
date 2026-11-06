"use client";

import { useState, type FormEvent } from "react";
import { Send, Star } from "lucide-react";
import { FormSuccess } from "@/components/ui/form-success";
import { Honeypot } from "@/components/ui/form-honeypot";
import { useLang } from "@/components/lang-provider";
import { submitSurvey } from "@/app/actions/surveys";
import type { Question } from "@/lib/surveys";

function Rating({ name, required }: { name: string; required: boolean }) {
  const [v, setV] = useState(0);
  return (
    <div className="flex gap-2" role="radiogroup">
      {[1, 2, 3, 4, 5].map((n) => (
        <label key={n} className="cursor-pointer">
          <input type="radio" name={name} value={n} required={required} className="peer sr-only" onChange={() => setV(n)} />
          <Star className={`h-9 w-9 transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-brand ${n <= v ? "fill-amber-400 text-amber-400" : "text-line hover:text-amber-300"}`} />
          <span className="sr-only">{n}</span>
        </label>
      ))}
    </div>
  );
}

export function SurveyForm({ surveyId, questions }: { surveyId: string; questions: Question[] }) {
  const { lang, t } = useLang();
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<{ msg: string; q?: string } | null>(null);
  const label = (q: Question) => (lang === "en" && q.labelEn ? q.labelEn : q.labelMn);
  const opt = (o: Question["options"][number]) => (lang === "en" && o.en ? o.en : o.mn);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("locale", lang);
    const r = await submitSurvey(surveyId, fd).catch(() => ({ ok: false as const, error: "server" as const }));
    setPending(false);
    if (r.ok) return setSent(true);
    setError({
      q: "questionId" in r ? r.questionId : undefined,
      msg:
        r.error === "required" ? t("Заавал хариулах асуултад хариулна уу.", "Please answer the required questions.")
        : r.error === "closed" ? t("Энэ санал асуулга хаагдсан байна.", "This survey is closed.")
        : r.error === "rate" ? t("Та аль хэдийн хариулсан байна. Баярлалаа!", "You've already responded. Thank you!")
        : t("Илгээхэд алдаа гарлаа. Дахин оролдоно уу.", "Something went wrong. Please try again."),
    });
    if ("questionId" in r && r.questionId) document.getElementById(r.questionId)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  if (sent) return <FormSuccess title={t("Санал өгсөнд баярлалаа!", "Thank you for your response!")} text={t("Таны хариулт бидэнд үйлчилгээгээ сайжруулахад тусална.", "Your answers help us improve our service.")} resetLabel={t("Дахин бөглөх", "Respond again")} onReset={() => setSent(false)} />;

  return (
    <form onSubmit={onSubmit} className="relative flex flex-col gap-5">
      <Honeypot />
      {questions.map((q, i) => (
        <fieldset key={q.id} id={q.id} className={`rounded-2xl border p-5 ${error?.q === q.id ? "border-red-400" : "border-line"}`}>
          <legend className="sr-only">{label(q)}</legend>
          <p className="mb-3 font-semibold text-ink">
            {i + 1}. {label(q)} {q.required && <span className="text-red-500">*</span>}
          </p>
          {q.type === "text" && <input name={q.id} required={q.required} maxLength={300} className="input" />}
          {q.type === "textarea" && <textarea name={q.id} required={q.required} rows={4} maxLength={4000} className="input h-auto resize-y py-3" />}
          {q.type === "rating" && <Rating name={q.id} required={q.required} />}
          {(q.type === "single" || q.type === "multi") && (
            <div className="flex flex-col gap-2">
              {q.options.map((o, k) => (
                <label key={k} className="flex cursor-pointer items-center gap-3 rounded-xl bg-sheet px-4 py-3 text-body-md text-ink2 has-[:checked]:bg-brand/10 has-[:checked]:text-ink">
                  <input type={q.type === "single" ? "radio" : "checkbox"} name={q.id} value={k} required={q.type === "single" && q.required} className="h-4 w-4 accent-brand" />
                  {opt(o)}
                </label>
              ))}
            </div>
          )}
        </fieldset>
      ))}
      {error && <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-body-sm font-semibold text-red-600">{error.msg}</p>}
      <button type="submit" disabled={pending} className="btn-primary !rounded-full !py-4 disabled:opacity-60">
        {pending ? t("Илгээж байна…", "Sending…") : t("Илгээх", "Submit")} <Send className="h-5 w-5" />
      </button>
    </form>
  );
}
