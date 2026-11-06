import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { PageHero, Sheet } from "@/components/ui/page-hero";
import { SurveyForm } from "@/components/surveys/survey-form";
import { db } from "@/lib/db";
import { parseQuestions } from "@/lib/surveys";
import { tr, type Lang } from "@/lib/i18n";

export const revalidate = 300;

const getSurvey = unstable_cache(
  async (slug: string) => db.survey.findFirst({ where: { slug, active: true } }),
  ["survey-v1"],
  { tags: ["surveys"], revalidate: 300 },
);

export async function generateMetadata({ params }: { params: { lang: Lang; slug: string } }): Promise<Metadata> {
  const s = await getSurvey(params.slug);
  if (!s) return {};
  return { title: params.lang === "en" && s.titleEn ? s.titleEn : s.titleMn, robots: { index: false } };
}

export default async function SurveyPage({ params }: { params: { lang: Lang; slug: string } }) {
  const { lang } = params;
  const t = tr(lang);
  const s = await getSurvey(params.slug);
  if (!s) notFound();
  const en = lang === "en";
  return (
    <>
      <PageHero
        lang={lang}
        crumb={t("Санал асуулга", "Survey")}
        eyebrow={t("Санал асуулга", "Survey")}
        title={en && s.titleEn ? s.titleEn : s.titleMn}
        description={(en && s.descriptionEn ? s.descriptionEn : s.descriptionMn) ?? undefined}
      />
      <Sheet>
        <section className="mx-auto w-full max-w-2xl px-5 pb-24 pt-16 sm:px-8">
          <div className="card p-6 sm:p-9">
            <SurveyForm surveyId={s.id} questions={parseQuestions(s.questions)} />
          </div>
        </section>
      </Sheet>
    </>
  );
}
