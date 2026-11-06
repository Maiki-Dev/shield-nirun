import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, ExternalLink, Star, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/admin/auth";
import { Empty, PageHeader, Panel, btnDanger, btnGhost, fmtDate } from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { CopyButton } from "@/components/admin/copy-button";
import { parseQuestions, type Question } from "@/lib/surveys";
import { SurveyBuilder } from "../survey-builder";
import { deleteSurvey } from "../actions";

export const metadata = { title: "Санал асуулга" };

type Answers = Record<string, string | string[] | number>;

function Summary({ q, answers }: { q: Question; answers: Answers[] }) {
  const vals = answers.map((a) => a[q.id]).filter((v) => v !== undefined);
  if (q.type === "rating") {
    const nums = vals.map(Number);
    const avg = nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
    return <p className="flex items-center gap-2 text-body-md text-ink"><Star className="h-5 w-5 fill-amber-400 text-amber-400" /> <b className="text-[1.4rem]">{avg.toFixed(1)}</b> / 5 · {nums.length} хариулт</p>;
  }
  if (q.type === "single" || q.type === "multi") {
    const counts = q.options.map((o) => ({ label: o.mn, n: vals.filter((v) => (Array.isArray(v) ? v.includes(o.mn) : v === o.mn)).length }));
    const total = vals.length || 1;
    return (
      <div className="flex flex-col gap-2">
        {counts.map((c) => (
          <div key={c.label}>
            <div className="mb-1 flex justify-between text-body-sm"><span className="text-ink">{c.label}</span><span className="text-muted">{c.n} · {Math.round((c.n / total) * 100)}%</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-soft"><div className="h-full rounded-full bg-accent" style={{ width: `${(c.n / total) * 100}%` }} /></div>
          </div>
        ))}
      </div>
    );
  }
  const texts = vals.map(String).slice(0, 8);
  return texts.length ? <ul className="flex flex-col gap-2">{texts.map((t, i) => <li key={i} className="rounded-xl bg-soft px-4 py-2.5 text-body-sm text-ink2">{t}</li>)}</ul> : <p className="text-body-sm text-muted">Хариулт алга.</p>;
}

export default async function SurveyAdmin({ params, searchParams }: { params: { id: string }; searchParams: { tab?: string } }) {
  const user = await requireUser();
  const isNew = params.id === "new";
  const survey = isNew ? null : await db.survey.findUnique({ where: { id: params.id }, include: { responses: { orderBy: { createdAt: "desc" }, take: 2000 } } });
  if (!isNew && !survey) notFound();
  const questions = survey ? parseQuestions(survey.questions) : [];
  const tab = !isNew && searchParams.tab === "results" ? "results" : "edit";

  return (
    <>
      <Link href="/admin/surveys" className="mb-4 inline-flex items-center gap-1.5 text-label-md font-semibold text-muted hover:text-ink"><ArrowLeft className="h-4 w-4" /> Санал асуулга</Link>
      <PageHeader
        title={survey?.titleMn ?? "Шинэ санал асуулга"}
        actions={
          survey && (
            <>
              <CopyButton text={`/survey/${survey.slug}`} />
              {survey.active && <a href={`/survey/${survey.slug}`} target="_blank" rel="noopener" className={btnGhost}><ExternalLink className="h-4 w-4" /> Нээх</a>}
              {user.role === "ADMIN" && <ConfirmButton action={deleteSurvey.bind(null, survey.id)} message="Асуулга болон бүх хариултыг устгах уу?" className={btnDanger}><Trash2 className="h-4 w-4" /></ConfirmButton>}
            </>
          )
        }
      />
      {survey && (
        <div className="mb-5 flex gap-2">
          {[["edit", "Асуултууд"], ["results", `Хариултууд (${survey.responses.length})`]].map(([k, l]) => (
            <Link key={k} href={`?tab=${k}`} className={`rounded-full px-4 py-2 text-label-md font-bold ${tab === k ? "bg-accent text-navy" : "bg-card text-ink2 hover:bg-soft"}`}>{l}</Link>
          ))}
        </div>
      )}
      {tab === "edit" ? (
        <SurveyBuilder
          id={survey?.id ?? null}
          values={{ titleMn: survey?.titleMn ?? "", titleEn: survey?.titleEn ?? "", descriptionMn: survey?.descriptionMn ?? "", descriptionEn: survey?.descriptionEn ?? "", slug: survey?.slug ?? "", active: survey?.active ?? false, questions }}
        />
      ) : survey!.responses.length === 0 ? (
        <Empty>Одоогоор хариулт ирээгүй.</Empty>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end"><a href={`/admin/surveys/${survey!.id}/export`} className={btnGhost}><Download className="h-4 w-4" /> CSV татах</a></div>
          {questions.map((q, i) => (
            <Panel key={q.id} title={`${i + 1}. ${q.labelMn}`}>
              <Summary q={q} answers={survey!.responses.map((r) => r.answers as Answers)} />
            </Panel>
          ))}
          <p className="text-label-sm text-muted">Сүүлийн хариулт: {fmtDate(survey!.responses[0].createdAt)}</p>
        </div>
      )}
    </>
  );
}
