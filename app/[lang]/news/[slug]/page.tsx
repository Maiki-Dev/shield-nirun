/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { Sheet } from "@/components/ui/page-hero";
import { ShareButtons } from "@/components/news/share-buttons";
import { Markdown, markdownToText } from "@/lib/markdown";
import { getPost, newsDate } from "@/lib/news";
import { localize, tr, type Lang } from "@/lib/i18n";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: { lang: Lang; slug: string } }): Promise<Metadata> {
  const p = await getPost(params.slug, params.lang);
  if (!p) return {};
  const description = p.excerpt || markdownToText(p.body).slice(0, 160);
  return {
    title: p.title,
    description,
    alternates: {
      canonical: localize(params.lang, `/news/${p.slug}`),
      ...(p.hasEn ? { languages: { mn: `/news/${p.slug}`, en: `/en/news/${p.slug}` } } : {}),
    },
    openGraph: { type: "article", title: p.title, description, publishedTime: p.publishedAt, ...(p.cover ? { images: [p.cover] } : {}) },
  };
}

export default async function ArticlePage({ params }: { params: { lang: Lang; slug: string } }) {
  const { lang } = params;
  const t = tr(lang);
  const p = await getPost(params.slug, lang);
  if (!p) notFound();

  return (
    <>
      <section className="dark relative -mt-20 overflow-hidden bg-[#070F19] pb-[calc(4rem+5rem)] pt-[calc(5rem+3rem)] text-ink">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_80%_100%,rgba(0,180,216,0.25)_0%,rgba(0,180,216,0)_70%)]" />
        <div className="relative mx-auto w-full max-w-3xl px-5 sm:px-8">
          <Link href={localize(lang, "/news")} className="sn-fade inline-flex items-center gap-1.5 text-label-md text-slate-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> {t("Мэдээ", "News")}
          </Link>
          <h1 className="sn-fade mt-6 text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-white">{p.title}</h1>
          <p className="sn-fade mt-5 flex items-center gap-2 text-body-md text-slate-400">
            <CalendarDays className="h-4 w-4" /> {newsDate(p.publishedAt)}
            {p.authorName && <><span className="mx-1">·</span>{p.authorName}</>}
          </p>
        </div>
      </section>
      <Sheet>
        <article className="mx-auto w-full max-w-3xl px-5 pb-24 pt-12 sm:px-8">
          {p.cover && <img src={p.cover} alt="" className="mb-10 aspect-[16/9] w-full rounded-[26px] object-cover" />}
          {p.excerpt && <p className="mb-8 text-[1.3rem] font-medium leading-relaxed text-ink">{p.excerpt}</p>}
          <Markdown source={p.body} />
          <div className="mt-12 border-t border-line pt-6">
            <ShareButtons title={p.title} />
          </div>
        </article>
      </Sheet>
    </>
  );
}
