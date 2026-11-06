import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";
import { SITE_TAG } from "@/lib/site-data";

/** After any content change: drop the cached site data and regenerate the public pages (both languages). */
export function publishSite() {
  revalidateTag(SITE_TAG);
  revalidatePath("/[lang]", "layout");
}
