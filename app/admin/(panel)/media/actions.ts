"use server";

import fs from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/admin/auth";
import { UPLOAD_DIR } from "@/lib/files";
import { publishSite } from "@/lib/admin/publish";

const MAX = 15 * 1024 * 1024;

/** Identify the type from the file's first bytes (never trust the browser's MIME or the extension). SVG is refused: it can carry scripts. */
function sniff(b: Buffer): { mime: string; ext: string } | null {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { mime: "image/jpeg", ext: "jpg" };
  if (b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { mime: "image/png", ext: "png" };
  if (b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP") return { mime: "image/webp", ext: "webp" };
  if (b.subarray(0, 5).toString("ascii") === "%PDF-") return { mime: "application/pdf", ext: "pdf" };
  return null;
}

export async function uploadMedia(_prev: { ok?: number; error?: string } | undefined, form: FormData) {
  const user = await requireUser();
  const files = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (!files.length) return { error: "Файл сонгоно уу." };
  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  let ok = 0;
  for (const f of files) {
    if (f.size > MAX) return { error: `“${f.name}” 15 MB-аас том байна.`, ok };
    const buf = Buffer.from(await f.arrayBuffer());
    const type = sniff(buf);
    if (!type) return { error: `“${f.name}”: зөвхөн JPG, PNG, WebP зураг эсвэл PDF оруулна.`, ok };
    const storedName = `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}.${type.ext}`;
    await fs.writeFile(path.join(UPLOAD_DIR, storedName), buf, { flag: "wx" });
    await db.media.create({ data: { storedName, original: f.name.slice(0, 200), mime: type.mime, size: f.size, uploadedBy: user.name } });
    ok++;
  }
  revalidatePath("/admin/media");
  return { ok };
}

/** Deletes the file and its record. Refuses while the file is still used on the site. */
export async function deleteMedia(id: string): Promise<void> {
  await requireUser();
  const m = await db.media.findUnique({ where: { id } });
  if (!m) return;
  const url = `/media/${m.storedName}`;
  const [inSettings, inLeaders] = await Promise.all([
    db.siteSettings.count({ where: { OR: [{ brochureParking: url }, { brochureHoa: url }] } }),
    db.leader.count({ where: { photo: url } }),
  ]);
  if (inSettings || inLeaders) redirect("/admin/media?inuse=1");
  await db.media.delete({ where: { id } });
  await fs.rm(path.join(UPLOAD_DIR, m.storedName), { force: true });
  publishSite();
  revalidatePath("/admin/media");
}
