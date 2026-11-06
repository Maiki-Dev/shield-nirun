"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Check, Eye, Pencil } from "lucide-react";
import { Markdown } from "@/lib/markdown";
import { savePost, type PostState } from "./actions";

export type PostValues = {
  titleMn: string; excerptMn: string; bodyMn: string; titleEn: string; excerptEn: string; bodyEn: string;
  slug: string; cover: string; status: "DRAFT" | "PUBLISHED"; publishedAt: string;
};

const HELP = "## Гарчиг · **тод** · *налуу* · [холбоос](https://…) · - жагсаалт · > ишлэл · ![тайлбар](/media/зураг.jpg) — хоосон мөрөөр догол мөр тусгаарлана.";

function Save() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-label-lg font-bold text-navy hover:brightness-110 disabled:opacity-60">
      {pending ? "Хадгалж байна…" : "Хадгалах"}
    </button>
  );
}

export function PostEditor({ id, values, images, created }: { id: string | null; values: PostValues; images: string[]; created?: boolean }) {
  const [state, action] = useFormState<PostState, FormData>(savePost.bind(null, id), undefined);
  const [lang, setLang] = useState<"mn" | "en">("mn");
  const [preview, setPreview] = useState(false);
  const [v, setV] = useState(values);
  const set = (k: keyof PostValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setV({ ...v, [k]: e.target.value });
  const sfx = lang === "mn" ? "Mn" : "En";
  const title = v[`title${sfx}` as keyof PostValues], excerpt = v[`excerpt${sfx}` as keyof PostValues], body = v[`body${sfx}` as keyof PostValues];

  return (
    <form action={action} className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      {/* both languages are always submitted; the tabs only switch what is visible */}
      {(["Mn", "En"] as const).flatMap((s) => (["title", "excerpt", "body"] as const).map((f) => <input key={f + s} type="hidden" name={`${f}${s}`} value={v[`${f}${s}` as keyof PostValues]} />))}

      <div className="flex min-w-0 flex-col gap-4 rounded-[22px] bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {(["mn", "en"] as const).map((l) => (
              <button key={l} type="button" onClick={() => setLang(l)} className={`rounded-full px-4 py-2 text-label-md font-bold ${lang === l ? "bg-accent text-navy" : "bg-soft text-ink2"}`}>
                {l === "mn" ? "Монгол (заавал)" : "English (сонголттой)"}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setPreview((p) => !p)} className="inline-flex items-center gap-1.5 rounded-full bg-soft px-4 py-2 text-label-md font-bold text-ink">
            {preview ? <><Pencil className="h-4 w-4" /> Засах</> : <><Eye className="h-4 w-4" /> Урьдчилан харах</>}
          </button>
        </div>

        {preview ? (
          <div className="rounded-2xl bg-white p-6 text-navy [--ink:11_25_44] [--ink2:51_65_85] [--muted:100_116_139] [--accent:0_137_166]">
            <h1 className="mb-4 text-[2rem] font-semibold leading-tight">{title || "—"}</h1>
            {excerpt && <p className="mb-6 text-[1.2rem] font-medium">{excerpt}</p>}
            <Markdown source={body || ""} />
          </div>
        ) : (
          <>
            <div>
              <label className="label" htmlFor="title">{lang === "mn" ? "Гарчиг" : "Title"}</label>
              <input id="title" value={title} onChange={set(`title${sfx}` as keyof PostValues)} maxLength={200} className="input !h-12 text-[1.05rem] font-semibold" />
            </div>
            <div>
              <label className="label" htmlFor="excerpt">{lang === "mn" ? "Товч агуулга (жагсаалт, хуваалцахад харагдана)" : "Excerpt"}</label>
              <textarea id="excerpt" value={excerpt} onChange={set(`excerpt${sfx}` as keyof PostValues)} rows={2} maxLength={400} className="input h-auto resize-y py-3" />
            </div>
            <div>
              <label className="label" htmlFor="body">{lang === "mn" ? "Агуулга" : "Body"}</label>
              <textarea id="body" value={body} onChange={set(`body${sfx}` as keyof PostValues)} rows={18} className="input h-auto resize-y py-3 font-mono text-body-sm leading-relaxed" />
              <p className="mt-2 text-label-sm text-muted">{HELP}</p>
            </div>
          </>
        )}
      </div>

      <aside className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 rounded-[22px] bg-card p-5">
          <div>
            <label className="label" htmlFor="status">Төлөв</label>
            <select id="status" name="status" value={v.status} onChange={set("status")} className="input !h-11">
              <option value="DRAFT">Ноорог (нийтлэгдээгүй)</option>
              <option value="PUBLISHED">Нийтлэх</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="publishedAt">Нийтлэх огноо (хоосон бол одоо)</label>
            <input id="publishedAt" name="publishedAt" type="datetime-local" value={v.publishedAt} onChange={set("publishedAt")} className="input !h-11" />
            <p className="mt-1 text-label-sm text-muted">Ирээдүйн огноо тавибал тэр үед автоматаар гарна.</p>
          </div>
          <div>
            <label className="label" htmlFor="slug">Холбоос (URL)</label>
            <input id="slug" name="slug" value={v.slug} onChange={set("slug")} placeholder="гарчгаас автоматаар" className="input !h-11 font-mono text-body-sm" />
          </div>
          <div>
            <label className="label" htmlFor="cover">Нүүр зураг</label>
            <select id="cover" name="cover" value={v.cover} onChange={set("cover")} className="input !h-11">
              <option value="">— Зураггүй —</option>
              {images.map((s) => <option key={s} value={s}>{s.split("/").pop()}</option>)}
            </select>
            {v.cover && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={v.cover} alt="" className="mt-3 aspect-[16/9] w-full rounded-xl object-cover" />
            )}
          </div>
          <Save />
          {(state?.ok || created) && <p className="inline-flex items-center gap-1 text-label-md font-bold text-emerald-300"><Check className="h-4 w-4" /> Хадгалагдлаа</p>}
          {state?.error && <p role="alert" className="text-label-md font-bold text-red-300">{state.error}</p>}
        </div>
      </aside>
    </form>
  );
}
