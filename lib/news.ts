import "server-only";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import type { Lang } from "@/lib/i18n";

export const NEWS_TAG = "news";
export const NEWS_PAGE_SIZE = 12;

export interface PostCard {
  slug: string;
  title: string;
  excerpt: string;
  cover: string | null;
  publishedAt: string; // ISO
}
export interface PostFull extends PostCard {
  body: string;
  authorName: string | null;
  hasEn: boolean;
}

const live = () => ({ status: "PUBLISHED" as const, publishedAt: { lte: new Date() } });

/** Published posts for a language (English: only posts that have an English version), newest first. */
export const listPosts = unstable_cache(
  async (lang: Lang, page: number): Promise<{ posts: PostCard[]; total: number }> => {
    const where = { ...live(), ...(lang === "en" ? { titleEn: { not: null } } : {}) };
    const [rows, total] = await Promise.all([
      db.post.findMany({ where, orderBy: { publishedAt: "desc" }, skip: (page - 1) * NEWS_PAGE_SIZE, take: NEWS_PAGE_SIZE }),
      db.post.count({ where }),
    ]);
    return {
      total,
      posts: rows.map((p) => ({
        slug: p.slug,
        title: lang === "en" ? p.titleEn! : p.titleMn,
        excerpt: lang === "en" ? (p.excerptEn ?? "") : p.excerptMn,
        cover: p.cover,
        publishedAt: p.publishedAt!.toISOString(),
      })),
    };
  },
  ["news-list-v1"],
  { tags: [NEWS_TAG], revalidate: 300 },
);

export const getPost = unstable_cache(
  async (slug: string, lang: Lang): Promise<PostFull | null> => {
    const p = await db.post.findFirst({ where: { slug, ...live() } });
    if (!p || (lang === "en" && !p.titleEn)) return null;
    const en = lang === "en";
    return {
      slug: p.slug,
      title: en ? p.titleEn! : p.titleMn,
      excerpt: en ? (p.excerptEn ?? "") : p.excerptMn,
      body: en ? (p.bodyEn ?? "") : p.bodyMn,
      cover: p.cover,
      publishedAt: p.publishedAt!.toISOString(),
      authorName: p.authorName,
      hasEn: !!p.titleEn,
    };
  },
  ["news-post-v1"],
  { tags: [NEWS_TAG], revalidate: 300 },
);

/** "2026.11.06" in Ulaanbaatar time. */
export const newsDate = (iso: string) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ulaanbaatar", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(iso)).replace(/-/g, ".");

/** Latin slug from a Mongolian/English title ("Шинэ брэнд Shield+" → "shine-brend-shield"). */
export function slugify(title: string) {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "j", з: "z", и: "i", й: "i", к: "k", л: "l", м: "m", н: "n", о: "o", ө: "u",
    п: "p", р: "r", с: "s", т: "t", у: "u", ү: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "sh", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  };
  return (
    title
      .toLowerCase()
      .split("")
      .map((c) => map[c] ?? c)
      .join("")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "medee"
  );
}
