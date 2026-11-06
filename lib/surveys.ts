import { z } from "zod";

/** Survey questions are stored as JSON on Survey.questions; this is their shape and validation. */
export const QUESTION_TYPES = {
  text: "Богино хариулт",
  textarea: "Урт хариулт",
  single: "Нэг сонголт",
  multi: "Олон сонголт",
  rating: "Үнэлгээ (1–5)",
} as const;
export type QuestionType = keyof typeof QUESTION_TYPES;

export const questionSchema = z.object({
  id: z.string().regex(/^q[\w-]{1,30}$/),
  type: z.enum(["text", "textarea", "single", "multi", "rating"]),
  labelMn: z.string().trim().min(1, "Асуулт хоосон байна").max(300),
  labelEn: z.string().trim().max(300).optional().default(""),
  required: z.boolean().default(false),
  options: z.array(z.object({ mn: z.string().trim().min(1).max(150), en: z.string().trim().max(150).optional().default("") })).max(20).default([]),
});
export type Question = z.infer<typeof questionSchema>;

export const questionsSchema = z
  .array(questionSchema)
  .min(1, "Дор хаяж нэг асуулт нэмнэ үү")
  .max(40)
  .refine((qs) => qs.every((q) => !["single", "multi"].includes(q.type) || q.options.length >= 2), { message: "Сонголттой асуулт бүрт дор хаяж 2 хариулт хэрэгтэй" });

export const parseQuestions = (v: unknown): Question[] => {
  const r = z.array(questionSchema).safeParse(v);
  return r.success ? r.data : [];
};

/** Validates a visitor's answers against the survey's questions. Returns the cleaned answers or an error question id. */
export function validateAnswers(questions: Question[], form: FormData): { ok: true; answers: Record<string, string | string[] | number> } | { ok: false; questionId: string } {
  const answers: Record<string, string | string[] | number> = {};
  for (const q of questions) {
    if (q.type === "multi") {
      const valid = new Set(q.options.map((_, i) => String(i)));
      const picked = form.getAll(q.id).map(String).filter((v) => valid.has(v));
      if (q.required && !picked.length) return { ok: false, questionId: q.id };
      if (picked.length) answers[q.id] = picked.map((i) => q.options[Number(i)].mn);
    } else if (q.type === "single") {
      const v = String(form.get(q.id) ?? "");
      const opt = q.options[Number(v)];
      if (!opt || v === "") {
        if (q.required) return { ok: false, questionId: q.id };
      } else answers[q.id] = opt.mn;
    } else if (q.type === "rating") {
      const n = Number(form.get(q.id));
      if (!(n >= 1 && n <= 5 && Number.isInteger(n))) {
        if (q.required) return { ok: false, questionId: q.id };
      } else answers[q.id] = n;
    } else {
      const v = String(form.get(q.id) ?? "").trim().slice(0, q.type === "text" ? 300 : 4000);
      if (!v) {
        if (q.required) return { ok: false, questionId: q.id };
      } else answers[q.id] = v;
    }
  }
  return { ok: true, answers };
}
