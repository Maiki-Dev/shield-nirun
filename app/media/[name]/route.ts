import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { db } from "@/lib/db";
import { UPLOAD_DIR } from "@/lib/files";

/** Serves admin uploads. Only files registered in the Media table are served, with a fixed, sniffed MIME type. */
export async function GET(_req: Request, { params }: { params: { name: string } }) {
  const name = path.basename(params.name);
  if (!/^[\w-]+\.(jpg|png|webp|pdf)$/.test(name)) return new Response("Not found", { status: 404 });
  const m = await db.media.findUnique({ where: { storedName: name } });
  const file = path.join(UPLOAD_DIR, name);
  if (!m || !fs.existsSync(file)) return new Response("Not found", { status: 404 });

  const stream = Readable.toWeb(fs.createReadStream(file)) as ReadableStream;
  return new Response(stream, {
    headers: {
      "Content-Type": m.mime,
      "Content-Length": String(fs.statSync(file).size),
      "Cache-Control": "public, max-age=31536000, immutable", // stored names are unique, never reused
      "X-Content-Type-Options": "nosniff",
      ...(m.mime === "application/pdf" ? { "Content-Disposition": `inline; filename="${encodeURIComponent(m.original)}"` } : {}),
    },
  });
}
