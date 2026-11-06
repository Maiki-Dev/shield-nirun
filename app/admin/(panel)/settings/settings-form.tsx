"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Check } from "lucide-react";
import { saveSettings } from "./actions";

type Values = Record<string, string>;

function Save() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-label-lg font-bold text-navy hover:brightness-110 disabled:opacity-60">
      {pending ? "Хадгалж байна…" : "Хадгалах"}
    </button>
  );
}

function F({ name, label, values, type = "text", hint }: { name: string; label: string; values: Values; type?: string; hint?: string }) {
  return (
    <div>
      <label htmlFor={name} className="label">{label}</label>
      <input id={name} name={name} type={type} step={type === "number" ? "any" : undefined} defaultValue={values[name]} required className="input !h-11" />
      {hint && <p className="mt-1 text-label-sm text-muted">{hint}</p>}
    </div>
  );
}

export function SettingsForm({ values, pdfs }: { values: Values; pdfs: { value: string; label: string }[] }) {
  const [state, action] = useFormState(saveSettings, undefined);
  const Pdf = ({ name, label }: { name: string; label: string }) => (
    <div>
      <label htmlFor={name} className="label">{label}</label>
      <select id={name} name={name} defaultValue={values[name] ?? ""} className="input !h-11">
        <option value="">— Байхгүй (татах товч нуугдана) —</option>
        {!pdfs.some((p) => p.value === values[name]) && values[name] && <option value={values[name]}>{values[name]}</option>}
        {pdfs.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
      </select>
    </div>
  );

  return (
    <form action={action} className="flex flex-col gap-6">
      <fieldset className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <legend className="mb-3 text-[1.1rem] font-semibold text-ink">Холбоо барих</legend>
        <F name="phone" label="Утас" values={values} />
        <F name="email" label="И-мэйл" values={values} type="email" />
        <F name="building" label="Барилга" values={values} />
        <div />
        <F name="districtMn" label="Дүүрэг (монгол)" values={values} />
        <F name="districtEn" label="District (English)" values={values} />
        <F name="cityMn" label="Хот (монгол)" values={values} />
        <F name="cityEn" label="City (English)" values={values} />
        <F name="mapUrl" label="Google Maps холбоос" values={values} hint="“Google Maps дээр нээх” товч энэ холбоос руу очно." />
        <div className="grid grid-cols-2 gap-3">
          <F name="lat" label="Өргөрөг (lat)" values={values} type="number" />
          <F name="lng" label="Уртраг (lng)" values={values} type="number" />
        </div>
      </fieldset>

      <fieldset className="grid grid-cols-1 gap-4 border-t border-line pt-6 md:grid-cols-2">
        <legend className="mb-3 pt-6 text-[1.1rem] font-semibold text-ink">Танилцуулга (PDF)</legend>
        <Pdf name="brochureParking" label="Ухаалаг зогсоолын танилцуулга" />
        <Pdf name="brochureHoa" label="СӨХ-ийн системийн танилцуулга" />
        <p className="text-label-sm text-muted md:col-span-2">Шинэ PDF-ийг “Файл & зураг” хэсэгт оруулаад энд сонгоно.</p>
      </fieldset>

      <div className="flex items-center gap-3">
        <Save />
        {state?.ok && <span className="inline-flex items-center gap-1 text-label-md font-bold text-emerald-300"><Check className="h-4 w-4" /> Хадгалагдлаа — сайт шинэчлэгдлээ</span>}
        {state?.error && <span role="alert" className="text-label-md font-bold text-red-300">{state.error}</span>}
      </div>
    </form>
  );
}
