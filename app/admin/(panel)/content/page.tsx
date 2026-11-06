import Link from "next/link";
import { ArrowDown, ArrowUp, EyeOff, Plus, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader, Panel, btnDanger, btnGhost } from "@/components/admin/ui";
import { ItemForm, type Field } from "@/components/admin/item-form";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { SERVICE_ICONS } from "@/lib/admin/icons";
import { deleteItem, moveItem, type Kind } from "./actions";

export const metadata = { title: "Контент" };

const TABS: { key: Kind; label: string; hint: string }[] = [
  { key: "leader", label: "Удирдлага", hint: "Нүүр болон “Бидний тухай” хуудасны удирдлагын хэсэг. Дарааллаар нь харагдана." },
  { key: "service", label: "Үйлчилгээ", hint: "“Бүтээгдэхүүн, үйлчилгээ” хуудасны “Үйлчилгээнүүд” хэсэг." },
  { key: "faq", label: "Түгээмэл асуулт", hint: "“Бүтээгдэхүүн” хуудасны асуулт, хариулт. “Shield+” гэж тэмдэглэсэн нь нээлт хүртэл нуугдана." },
];

async function imageChoices() {
  const media = await db.media.findMany({ where: { mime: { startsWith: "image/" } }, orderBy: { createdAt: "desc" }, select: { storedName: true } });
  return [...media.map((m) => `/media/${m.storedName}`), "/images/chairman.webp", "/images/ceo.webp"];
}

export default async function ContentPage({ searchParams }: { searchParams: { tab?: string } }) {
  const tab = TABS.find((t) => t.key === searchParams.tab) ?? TABS[0];
  let rows: ({ id: string; visible: boolean } & Record<string, string | boolean | number | Date | null>)[] = [];
  let fields: Field[] = [];
  /** Per-row extra fields (leaders: who they report to, excluding themselves). */
  let extra: (id: string | null) => Field[] = () => [];
  let title = (r: Record<string, unknown>) => String(r.id);

  if (tab.key === "leader") {
    rows = await db.leader.findMany({ orderBy: { sortOrder: "asc" } });
    fields = [
      { name: "nameMn", label: "Нэр (монгол)", type: "text", max: 80 },
      { name: "nameEn", label: "Name (English)", type: "text", max: 80 },
      { name: "roleMn", label: "Албан тушаал (монгол)", type: "text", max: 80 },
      { name: "roleEn", label: "Role (English)", type: "text", max: 80 },
      { name: "photo", label: "Зураг (“Файл & зураг” хэсэгт оруулсан зургаас сонгоно)", type: "image", choices: await imageChoices() },
      { name: "photoPosition", label: "Зургийн төвлөрөл (жишээ: center 30%)", type: "text", max: 40 },
      { name: "visible", label: "Сайт дээр харуулах", type: "checkbox" },
    ];
    title = (r) => `${r.nameMn} — ${r.roleMn}`;
    const people = rows.map((r) => ({ id: r.id, label: `${r.nameMn} — ${r.roleMn}` }));
    extra = (id) => [
      {
        name: "parentId",
        label: "Хэнд харьяалагдах (байгууллагын бүтэц)",
        type: "select",
        options: [{ value: "", label: "— Хамгийн дээд (тэргүүн) —" }, ...people.filter((p) => p.id !== id).map((p) => ({ value: p.id, label: p.label }))],
      },
    ];
  } else if (tab.key === "service") {
    rows = await db.service.findMany({ orderBy: { sortOrder: "asc" } });
    fields = [
      { name: "titleMn", label: "Гарчиг (монгол)", type: "text", max: 80 },
      { name: "titleEn", label: "Title (English)", type: "text", max: 80 },
      { name: "textMn", label: "Тайлбар (монгол)", type: "textarea", max: 400 },
      { name: "textEn", label: "Description (English)", type: "textarea", max: 400 },
      { name: "icon", label: "Дүрс", type: "select", options: Object.entries(SERVICE_ICONS).map(([value, v]) => ({ value, label: v.label })) },
      { name: "visible", label: "Сайт дээр харуулах", type: "checkbox" },
    ];
    title = (r) => String(r.titleMn);
  } else {
    rows = await db.faq.findMany({ orderBy: { sortOrder: "asc" } });
    fields = [
      { name: "questionMn", label: "Асуулт (монгол)", type: "textarea", max: 300 },
      { name: "questionEn", label: "Question (English)", type: "textarea", max: 300 },
      { name: "answerMn", label: "Хариулт (монгол)", type: "textarea", max: 2000 },
      { name: "answerEn", label: "Answer (English)", type: "textarea", max: 2000 },
      { name: "shieldPlus", label: "Shield+ бүтээгдэхүүний тухай (нээлт хүртэл нуух)", type: "checkbox" },
      { name: "visible", label: "Сайт дээр харуулах", type: "checkbox" },
    ];
    title = (r) => String(r.questionMn);
  }

  const values = (r: Record<string, unknown>, more: Field[] = []) =>
    Object.fromEntries([...fields, ...more].map((f) => [f.name, typeof r[f.name] === "boolean" ? (r[f.name] as boolean) : String(r[f.name] ?? "")]));
  const empty = Object.fromEntries(fields.map((f) => [f.name, f.type === "checkbox" ? f.name === "visible" : f.type === "select" ? (f.options[0]?.value ?? "") : f.name === "photoPosition" ? "center 30%" : ""]));

  return (
    <>
      <PageHeader title="Контент" description="Сайтын агуулгыг монгол, англи хоёр хэлээр засна. Хадгалмагц сайт шууд шинэчлэгдэнэ." />
      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Link key={t.key} href={`?tab=${t.key}`} className={`rounded-full px-4 py-2 text-label-md font-bold ${t.key === tab.key ? "bg-accent text-navy" : "bg-card text-ink2 hover:bg-soft"}`}>
            {t.label}
          </Link>
        ))}
      </div>
      <p className="mb-5 text-body-sm text-muted">{tab.hint}</p>

      <div className="flex flex-col gap-4">
        {rows.map((r, i) => (
          <Panel
            key={r.id}
            title={title(r)}
            actions={
              <div className="flex items-center gap-1.5">
                {!r.visible && <span className="mr-1 inline-flex items-center gap-1 rounded-full bg-slate-500/10 px-2.5 py-0.5 text-label-sm font-bold text-slate-600"><EyeOff className="h-3.5 w-3.5" /> Нуусан</span>}
                <form action={moveItem.bind(null, tab.key, r.id, -1)}><button disabled={i === 0} aria-label="Дээш" className={`${btnGhost} !px-2.5 !py-2`}><ArrowUp className="h-4 w-4" /></button></form>
                <form action={moveItem.bind(null, tab.key, r.id, 1)}><button disabled={i === rows.length - 1} aria-label="Доош" className={`${btnGhost} !px-2.5 !py-2`}><ArrowDown className="h-4 w-4" /></button></form>
                <ConfirmButton action={deleteItem.bind(null, tab.key, r.id)} message="Энэ мөрийг устгах уу?" className={`${btnDanger} !px-2.5 !py-2`}><Trash2 className="h-4 w-4" /></ConfirmButton>
              </div>
            }
          >
            <ItemForm kind={tab.key} id={r.id} fields={[...fields, ...extra(r.id)]} values={values(r, extra(r.id))} />
          </Panel>
        ))}

        <Panel title="Шинээр нэмэх" actions={<Plus className="h-5 w-5 text-accent" />} className="outline-dashed outline-1 outline-line">
          <ItemForm kind={tab.key} id={null} fields={[...fields, ...extra(null)]} values={{ ...empty, ...(tab.key === "leader" ? { parentId: "" } : {}) }} />
        </Panel>
      </div>
    </>
  );
}
