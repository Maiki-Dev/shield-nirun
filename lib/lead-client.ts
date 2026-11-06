import { submitLead, type LeadResult } from "@/app/actions/leads";
import type { Lang } from "@/lib/i18n";

/** Builds the lead payload from a public form (renaming form-specific fields) and submits it. */
export async function sendLead(
  formEl: HTMLFormElement,
  source: "CONTACT" | "DEMO",
  lang: Lang,
  rename: Record<string, string> = {},
): Promise<LeadResult> {
  const src = new FormData(formEl);
  const out = new FormData();
  out.set("source", source);
  out.set("locale", lang);
  for (const [k, v] of src.entries()) out.append(rename[k] ?? k, v);
  try {
    return await submitLead(out);
  } catch {
    return { ok: false, error: "server" };
  }
}

export const leadErrorText = (error: "invalid" | "rate" | "server", t: <T>(mn: T, en: T) => T) =>
  error === "invalid"
    ? t("Мэдээллээ шалгаад дахин илгээнэ үү (нэр, утасны дугаар зөв эсэх).", "Please check your details (name and phone number) and try again.")
    : error === "rate"
      ? t("Хэт олон хүсэлт илгээгдлээ. Түр хүлээгээд дахин оролдоно уу.", "Too many requests. Please wait a moment and try again.")
      : t("Илгээхэд алдаа гарлаа. Дахин оролдох эсвэл утсаар холбогдоно уу.", "Something went wrong. Please try again or call us.");
