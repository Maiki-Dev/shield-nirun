import fs from "node:fs";
import path from "node:path";

/** Directory for admin uploads (served by app/media/[name]/route.ts). Set UPLOAD_DIR in production to a persistent path. */
export const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || "./storage/uploads");

/** Private uploads (job-application CVs). Never served publicly — only via the signed-in admin download route. */
export const PRIVATE_DIR = path.resolve(process.env.PRIVATE_UPLOAD_DIR || "./storage/private");

/** Absolute path for a site file URL: "/media/x.pdf" → UPLOAD_DIR/x.pdf, "/files/y.pdf" → public/files/y.pdf. */
export function resolveSiteFile(href: string): string | null {
  if (href.startsWith("/media/")) {
    const name = path.basename(href);
    return name ? path.join(UPLOAD_DIR, name) : null;
  }
  if (href.startsWith("/")) return path.join(process.cwd(), "public", href.replace(/^\//, ""));
  return null;
}

export function localFileSize(href: string): number | null {
  const p = resolveSiteFile(href);
  try {
    return p ? fs.statSync(p).size : null;
  } catch {
    return null;
  }
}

/** True when the file behind a site URL exists — used to show download buttons only for files that are really there. */
export const localFileExists = (href: string) => localFileSize(href) !== null;
