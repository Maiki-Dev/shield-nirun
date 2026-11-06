"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Check } from "lucide-react";
import { saveItem, type FormState, type Kind } from "@/app/admin/(panel)/content/actions";

export type Field =
  | { name: string; label: string; type: "text" | "textarea"; max?: number }
  | { name: string; label: string; type: "select"; options: { value: string; label: string }[] }
  | { name: string; label: string; type: "image"; choices: string[] }
  | { name: string; label: string; type: "checkbox" };

function Save({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-label-lg font-bold text-navy hover:brightness-110 disabled:opacity-60">
      {pending ? "Хадгалж байна…" : isNew ? "Нэмэх" : "Хадгалах"}
    </button>
  );
}

/** One editable row (or the "add new" form). Mongolian and English fields sit side by side. */
export function ItemForm({ kind, id, fields, values }: { kind: Kind; id: string | null; fields: Field[]; values: Record<string, string | boolean> }) {
  const [state, action] = useFormState<FormState, FormData>(saveItem.bind(null, kind, id), undefined);
  const [saved, setSaved] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (!state?.ok) return;
    setSaved(true);
    if (!id) formRef.current?.reset();
    const tm = setTimeout(() => setSaved(false), 2500);
    return () => clearTimeout(tm);
  }, [state, id]);

  const [img, setImg] = useState(String(values.photo ?? ""));

  return (
    <form ref={formRef} action={action} className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {fields.map((f) => {
        const v = values[f.name];
        const id_ = `${kind}-${id ?? "new"}-${f.name}`;
        if (f.type === "checkbox")
          return (
            <label key={f.name} htmlFor={id_} className="flex items-center gap-2.5 text-body-sm font-semibold text-ink2">
              <input id={id_} name={f.name} type="checkbox" defaultChecked={v === true} className="h-4 w-4 accent-brand" /> {f.label}
            </label>
          );
        return (
          <div key={f.name} className={f.type === "textarea" ? "md:col-span-1" : ""}>
            <label htmlFor={id_} className="label">{f.label}</label>
            {f.type === "textarea" ? (
              <textarea id={id_} name={f.name} defaultValue={String(v ?? "")} rows={3} maxLength={f.max} required className="input h-auto resize-y py-2.5" />
            ) : f.type === "select" ? (
              <select id={id_} name={f.name} defaultValue={String(v ?? "")} className="input !h-11">
                {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ) : f.type === "image" ? (
              <div className="flex items-center gap-3">
                {img && /^\/(images|media)\//.test(img) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover ring-1 ring-line" />
                )}
                <select id={id_} name={f.name} value={img} onChange={(e) => setImg(e.target.value)} required className="input !h-11">
                  {!f.choices.includes(img) && img && <option value={img}>{img}</option>}
                  <option value="" disabled>— Зураг сонгох —</option>
                  {f.choices.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            ) : (
              <input id={id_} name={f.name} defaultValue={String(v ?? "")} maxLength={f.max} required className="input !h-11" />
            )}
          </div>
        );
      })}
      <div className="flex items-center gap-3 md:col-span-2">
        <Save isNew={!id} />
        {saved && <span className="inline-flex items-center gap-1 text-label-md font-bold text-emerald-300"><Check className="h-4 w-4" /> Хадгалагдлаа — сайт шинэчлэгдлээ</span>}
        {state?.error && <span role="alert" className="text-label-md font-bold text-red-300">{state.error}</span>}
      </div>
    </form>
  );
}
