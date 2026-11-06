/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import { PageHero, Sheet } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { NEWS_PAGE_SIZE, listPosts, newsDate, type PostCard } from "@/lib/news";
import { alternates, localize, tr, type Lang } from "@/lib/i18n";

export const revalidate = 300;

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const t = tr(params.lang);
  return {
    title: t("Мэдээ мэдээлэл", "News"),
    description: t("Shield Nirun-ий мэдээ, үйл ажиллагааны мэдээлэл.", "News and updates from Shield Nirun."),
    alternates: alternates(params.lang, "/news"),
  };
}

function Cover({ p, className }: { p: PostCard; className: string }) {
  return p.cover ? (
    <img src={p.cover} alt="" loading="lazy" decoding="async" className={`${className} object-cover transition-transform duration-700 group-hover:scale-[1.03]`} />
  ) : (
    <div className={`${className} grid place-items-center bg-[linear-gradient(135deg,#0B1724,#0B5F7E)]`}>
      <Newspaper className="h-10 w-10 text-white/40" />
    </div>
  );
}

export default async function NewsPage({ params, searchParams }: { params: { lang: Lang }; searchParams: { page?: string } }) {
  const { lang } = params;
  const t = tr(lang);
  const page = Math.max(1, Number(searchParams.page) || 1);
  const { posts, total } = await listPosts(lang, page);
  const [lead, ...rest] = page === 1 ? posts : [undefined, ...posts];
  const pages = Math.ceil(total / NEWS_PAGE_SIZE);
  const href = (slug: string) => localize(lang, `/news/${slug}`);

  return (
    <>
      <PageHero
        lang={lang}
        crumb={t("Мэдээ", "News")}
        eyebrow={t("Мэдээ мэдээлэл", "News & updates")}
        title={<>{t("Shield Nirun-ий", "What's new at")} <span className="text-brand-light">{t("мэдээ мэдээлэл.", "Shield Nirun.")}</span></>}
        description={t("Үйл ажиллагаа, шинэ шийдэл, хамтын ажиллагааны тухай мэдээ.", "Updates on our work, new solutions and partnerships.")}
      />
      <Sheet>
        <section className="container-x pb-24 pt-16">
          {posts.length === 0 ? (
            <p className="rounded-[26px] bg-card px-6 py-16 text-center text-body-lg text-muted">{t("Удахгүй мэдээ нийтлэгдэнэ.", "News will be published soon.")}</p>
          ) : (
            <>
              {lead && (
                <Reveal variant="zoom">
                  <Link href={href(lead.slug)} className="group card grid grid-cols-1 overflow-hidden lg:grid-cols-[1.25fr_1fr]">
                    <div className="overflow-hidden"><Cover p={lead} className="aspect-[16/9] h-full w-full lg:aspect-auto lg:min-h-[360px]" /></div>
                    <div className="flex flex-col justify-center gap-4 p-7 sm:p-10">
                      <span className="text-label-sm font-bold uppercase tracking-widest text-accent">{newsDate(lead.publishedAt)}</span>
                      <h2 className="text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-tight tracking-tight text-ink group-hover:text-accent">{lead.title}</h2>
                      <p className="text-body-lg text-muted">{lead.excerpt}</p>
                      <span className="inline-flex items-center gap-2 text-label-lg font-bold text-accent">{t("Дэлгэрэнгүй унших", "Read more")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                    </div>
                  </Link>
                </Reveal>
              )}
              {rest.length > 0 && (
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((p, i) =>
                    p ? (
                      <Reveal key={p.slug} delay={(i % 3) * 0.06}>
                        <Link href={href(p.slug)} className="group card card-hover flex h-full flex-col overflow-hidden">
                          <div className="overflow-hidden"><Cover p={p} className="aspect-[16/10] w-full" /></div>
                          <div className="flex flex-1 flex-col gap-2.5 p-6">
                            <span className="text-label-sm font-bold uppercase tracking-widest text-accent">{newsDate(p.publishedAt)}</span>
                            <h3 className="text-[1.2rem] font-semibold leading-snug tracking-tight text-ink group-hover:text-accent">{p.title}</h3>
                            <p className="line-clamp-3 text-body-sm text-muted">{p.excerpt}</p>
                          </div>
                        </Link>
                      </Reveal>
                    ) : null,
                  )}
                </div>
              )}
              {pages > 1 && (
                <nav aria-label={t("Хуудаслалт", "Pagination")} className="mt-10 flex justify-center gap-2">
                  {Array.from({ length: pages }, (_, k) => k + 1).map((n) => (
                    <Link key={n} href={`${localize(lang, "/news")}?page=${n}`} aria-current={n === page ? "page" : undefined} className={`grid h-10 w-10 place-items-center rounded-full text-label-lg font-bold ${n === page ? "bg-brand text-navy" : "bg-card text-ink hover:bg-soft"}`}>
                      {n}
                    </Link>
                  ))}
                </nav>
              )}
            </>
          )}
        </section>
      </Sheet>
    </>
  );
}
