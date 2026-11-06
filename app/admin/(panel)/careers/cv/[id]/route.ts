import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/admin/auth";
import { PRIVATE_DIR } from "@/lib/files";

const TYPES: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

/** CV download — signed-in staff only, always as an attachment (never rendered inline on our origin). */
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (!(await currentUser())) return new Response("Unauthorized", { status: 401 });
  const a = await db.jobApplication.findUnique({ where: { id: params.id }, select: { cvFile: true, cvOriginal: true } });
  if (!a?.cvFile) return new Response("Not found", { status: 404 });
  const file = path.join(PRIVATE_DIR, path.basename(a.cvFile));
  if (!fs.existsSync(file)) return new Response("Not found", { status: 404 });
  const ext = a.cvFile.split(".").pop() ?? "";
  return new Response(Readable.toWeb(fs.createReadStream(file)) as ReadableStream, {
    headers: {
      "Content-Type": TYPES[ext] ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(a.cvOriginal ?? `cv.${ext}`)}`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
    },
  });
}
