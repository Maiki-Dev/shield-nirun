"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/admin/rate-limit";
import { clientIp } from "@/lib/admin/request";
import { parseQuestions, validateAnswers } from "@/lib/surveys";

export type SurveyResult = { ok: true } | { ok: false; error: "closed" | "required" | "rate" | "server"; questionId?: string };

export async function submitSurvey(surveyId: string, form: FormData): Promise<SurveyResult> {
  if (String(form.get("website") ?? "").trim()) return { ok: true }; // honeypot
  const ip = clientIp();
  if (!rateLimit(`survey:${surveyId}:${ip}`, 3, 60 * 60_000).ok) return { ok: false, error: "rate" };
  const survey = await db.survey.findFirst({ where: { id: surveyId, active: true } });
  if (!survey) return { ok: false, error: "closed" };
  const r = validateAnswers(parseQuestions(survey.questions), form);
  if (!r.ok) return { ok: false, error: "required", questionId: r.questionId };
  try {
    await db.surveyResponse.create({ data: { surveyId, answers: r.answers, locale: form.get("locale") === "en" ? "en" : "mn", ip } });
  } catch (e) {
    console.error("submitSurvey failed", e);
    return { ok: false, error: "server" };
  }
  revalidatePath(`/admin/surveys/${surveyId}`);
  return { ok: true };
}
