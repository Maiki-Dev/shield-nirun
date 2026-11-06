import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader, btnDanger, btnGhost } from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { PostEditor, type PostValues } from "../post-editor";
import { deletePost } from "../actions";

export const metadata = { title: "Мэдээ засах" };

/** "YYYY-MM-DDTHH:mm" in Ulaanbaatar time for <input type="datetime-local"> */
const toLocal = (d: Date | null) => (d ? new Date(d.getTime() + 8 * 3_600_000).toISOString().slice(0, 16) : "");

export default async function EditPost({ params, searchParams }: { params: { id: string }; searchParams: { created?: string } }) {
  const isNew = params.id === "new";
  const [post, media] = await Promise.all([
    isNew ? null : db.post.findUnique({ where: { id: params.id } }),
    db.media.findMany({ where: { mime: { startsWith: "image/" } }, orderBy: { createdAt: "desc" }, select: { storedName: true } }),
  ]);
  if (!isNew && !post) notFound();
  const values: PostValues = {
    titleMn: post?.titleMn ?? "", excerptMn: post?.excerptMn ?? "", bodyMn: post?.bodyMn ?? "",
    titleEn: post?.titleEn ?? "", excerptEn: post?.excerptEn ?? "", bodyEn: post?.bodyEn ?? "",
    slug: post?.slug ?? "", cover: post?.cover ?? "", status: post?.status ?? "DRAFT", publishedAt: toLocal(post?.publishedAt ?? null),
  };
  const live = post?.status === "PUBLISHED" && post.publishedAt && post.publishedAt <= new Date();
  return (
    <>
      <Link href="/admin/news" className="mb-4 inline-flex items-center gap-1.5 text-label-md font-semibold text-muted hover:text-ink"><ArrowLeft className="h-4 w-4" /> Мэдээ</Link>
      <PageHeader
        title={isNew ? "Шинэ мэдээ" : post!.titleMn}
        actions={
          !isNew && (
            <>
              {live && <a href={`/news/${post!.slug}`} target="_blank" rel="noopener" className={btnGhost}><ExternalLink className="h-4 w-4" /> Сайт дээр харах</a>}
              <ConfirmButton action={deletePost.bind(null, post!.id)} message="Энэ мэдээг бүрмөсөн устгах уу?" className={btnDanger}><Trash2 className="h-4 w-4" /> Устгах</ConfirmButton>
            </>
          )
        }
      />
      <PostEditor id={isNew ? null : post!.id} values={values} images={media.map((m) => `/media/${m.storedName}`)} created={!!searchParams.created} />
    </>
  );
}
