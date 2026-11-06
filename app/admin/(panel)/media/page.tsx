/* eslint-disable @next/next/no-img-element */
import { FileText, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { Empty, PageHeader, Panel, btnDanger, fmtDate } from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { CopyButton } from "@/components/admin/copy-button";
import { deleteMedia } from "./actions";
import { UploadForm } from "./upload-form";

export const metadata = { title: "Файл & зураг" };

const size = (b: number) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`);

export default async function MediaPage({ searchParams }: { searchParams: { inuse?: string } }) {
  const items = await db.media.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <>
      <PageHeader title="Файл & зураг" description="Удирдлагын зураг, танилцуулга PDF зэрэг файлуудыг энд оруулаад “Контент”, “Тохиргоо” хэсэгт сонгоно." />
      {searchParams.inuse && (
        <p role="alert" className="mb-5 rounded-2xl bg-amber-500/10 px-5 py-4 text-body-sm font-semibold text-amber-200">
          Энэ файл сайт дээр ашиглагдаж байгаа тул устгаагүй. Эхлээд “Контент” эсвэл “Тохиргоо” хэсэгт өөр файлаар солиод дахин оролдоно уу.
        </p>
      )}
      <Panel title="Шинэ файл оруулах" className="mb-5">
        <UploadForm />
        <p className="mt-3 text-label-sm text-muted">JPG, PNG, WebP зураг эсвэл PDF · нэг файл 15 MB хүртэл.</p>
      </Panel>
      {items.length === 0 ? (
        <Empty>Одоогоор оруулсан файл алга.</Empty>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((m) => {
            const url = `/media/${m.storedName}`;
            return (
              <div key={m.id} className="flex min-w-0 flex-col overflow-hidden rounded-[18px] bg-card">
                {/* fixed 4:3 frame; the image is absolutely positioned so its own size can never stretch the card */}
                <a href={url} target="_blank" rel="noopener" className="relative block aspect-[4/3] overflow-hidden bg-soft">
                  {m.mime.startsWith("image/") ? (
                    <img src={url} alt={m.original} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <FileText className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-accent" />
                  )}
                </a>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <p className="truncate text-body-sm font-semibold text-ink" title={m.original}>{m.original}</p>
                  <p className="text-label-sm text-muted">{size(m.size)} · {m.uploadedBy ?? "—"} · {fmtDate(m.createdAt)}</p>
                  <div className="mt-auto flex items-center gap-2 pt-2">
                    <CopyButton text={url} />
                    <ConfirmButton action={deleteMedia.bind(null, m.id)} message={`“${m.original}” файлыг устгах уу?`} className={`${btnDanger} !px-3 !py-2`}>
                      <Trash2 className="h-4 w-4" />
                    </ConfirmButton>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
