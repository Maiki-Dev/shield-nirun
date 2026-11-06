"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { ArrowDown, ArrowUp, Check, Plus, Trash2, X } from "lucide-react";
import { QUESTION_TYPES, type Question, type QuestionType } from "@/lib/surveys";
import { saveSurvey, type SurveyState } from "./actions";

const newId = () => `q${Math.random().toString(36).slice(2, 9)}`;

function Save() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-label-lg font-bold text-navy hover:brightness-110 disabled:opacity-60">{pending ? "Хадгалж байна…" : "Хадгалах"}</button>;
}

export type SurveyValues = { titleMn: string; titleEn: string; descriptionMn: string; descriptionEn: string; slug: string; active: boolean; questions: Question[] };

export function SurveyBuilder({ id, values }: { id: string | null; values: SurveyValues }) {
  const [state, action] = useFormState<SurveyState, FormData>(saveSurvey.bind(null, id), undefined);
  const [qs, setQs] = useState<Question[]>(values.questions);
  const upd = (i: number, patch: Partial<Question>) => setQs(qs.map((q, k) => (k === i ? { ...q, ...patch } : q)));
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= qs.length) return;
    const c = [...qs];
    [c[i], c[j]] = [c[j], c[i]];
    setQs(c);
  };
  const add = (type: QuestionType) =>
    setQs([...qs, { id: newId(), type, labelMn: "", labelEn: "", required: false, options: type === "single" || type === "multi" ? [{ mn: "", en: "" }, { mn: "", en: "" }] : [] }]);

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="questions" value={JSON.stringify(qs)} />
      <div className="grid grid-cols-1 gap-4 rounded-[22px] bg-card p-5 md:grid-cols-2 sm:p-6">
        <div><label className="label" htmlFor="titleMn">Гарчиг (монгол)</label><input id="titleMn" name="titleMn" defaultValue={values.titleMn} required className="input !h-11" /></div>
        <div><label className="label" htmlFor="titleEn">Title (English, сонголттой)</label><input id="titleEn" name="titleEn" defaultValue={values.titleEn} className="input !h-11" /></div>
        <div><label className="label" htmlFor="descriptionMn">Тайлбар (монгол)</label><textarea id="descriptionMn" name="descriptionMn" defaultValue={values.descriptionMn} rows={2} className="input h-auto py-2.5" /></div>
        <div><label className="label" htmlFor="descriptionEn">Description (English)</label><textarea id="descriptionEn" name="descriptionEn" defaultValue={values.descriptionEn} rows={2} className="input h-auto py-2.5" /></div>
        <div><label className="label" htmlFor="slug">Холбоос</label><input id="slug" name="slug" defaultValue={values.slug} placeholder="гарчгаас автоматаар" className="input !h-11 font-mono text-body-sm" /></div>
        <label className="flex items-center gap-2.5 self-end pb-3 text-body-sm font-semibold text-ink2"><input name="active" type="checkbox" defaultChecked={values.active} className="h-4 w-4 accent-brand" /> Идэвхтэй (хариулт хүлээн авна)</label>
      </div>

      {qs.map((q, i) => (
        <div key={q.id} className="flex flex-col gap-3 rounded-[22px] bg-card p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-label-sm font-bold uppercase tracking-wider text-accent">{i + 1} · {QUESTION_TYPES[q.type]}</span>
            <div className="flex items-center gap-1.5">
              <label className="mr-2 flex items-center gap-2 text-label-md text-ink2"><input type="checkbox" checked={q.required} onChange={(e) => upd(i, { required: e.target.checked })} className="h-4 w-4 accent-brand" /> Заавал</label>
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Дээш" className="grid h-8 w-8 place-items-center rounded-full bg-soft disabled:opacity-40"><ArrowUp className="h-4 w-4" /></button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === qs.length - 1} aria-label="Доош" className="grid h-8 w-8 place-items-center rounded-full bg-soft disabled:opacity-40"><ArrowDown className="h-4 w-4" /></button>
              <button type="button" onClick={() => setQs(qs.filter((_, k) => k !== i))} aria-label="Устгах" className="grid h-8 w-8 place-items-center rounded-full bg-red-500/10 text-red-300"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <input value={q.labelMn} onChange={(e) => upd(i, { labelMn: e.target.value })} placeholder="Асуулт (монгол)" aria-label="Асуулт (монгол)" className="input !h-11" />
            <input value={q.labelEn} onChange={(e) => upd(i, { labelEn: e.target.value })} placeholder="Question (English)" aria-label="Question (English)" className="input !h-11" />
          </div>
          {(q.type === "single" || q.type === "multi") && (
            <div className="flex flex-col gap-2">
              {q.options.map((o, k) => (
                <div key={k} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                  <input value={o.mn} onChange={(e) => upd(i, { options: q.options.map((x, j) => (j === k ? { ...x, mn: e.target.value } : x)) })} placeholder={`Сонголт ${k + 1}`} className="input !h-10" />
                  <input value={o.en} onChange={(e) => upd(i, { options: q.options.map((x, j) => (j === k ? { ...x, en: e.target.value } : x)) })} placeholder={`Option ${k + 1}`} className="input !h-10" />
                  <button type="button" onClick={() => upd(i, { options: q.options.filter((_, j) => j !== k) })} aria-label="Сонголт устгах" className="grid h-10 w-10 place-items-center rounded-xl bg-soft"><X className="h-4 w-4" /></button>
                </div>
              ))}
              <button type="button" onClick={() => upd(i, { options: [...q.options, { mn: "", en: "" }] })} className="self-start text-label-md font-bold text-accent hover:underline">+ Сонголт нэмэх</button>
            </div>
          )}
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-2 rounded-[22px] bg-card p-4 outline-dashed outline-1 outline-line">
        <span className="mr-2 inline-flex items-center gap-1.5 text-label-md font-bold text-ink"><Plus className="h-4 w-4 text-accent" /> Асуулт нэмэх:</span>
        {(Object.keys(QUESTION_TYPES) as QuestionType[]).map((k) => (
          <button key={k} type="button" onClick={() => add(k)} className="rounded-full bg-soft px-3.5 py-1.5 text-label-md font-semibold text-ink hover:bg-soft2">{QUESTION_TYPES[k]}</button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Save />
        {state?.ok && <span className="inline-flex items-center gap-1 text-label-md font-bold text-emerald-300"><Check className="h-4 w-4" /> Хадгалагдлаа</span>}
        {state?.error && <span role="alert" className="text-label-md font-bold text-red-300">{state.error}</span>}
      </div>
    </form>
  );
}
