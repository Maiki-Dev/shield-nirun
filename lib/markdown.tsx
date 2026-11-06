/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from "react";

/**
 * Small, safe Markdown subset for news articles — renders React elements (never raw HTML), so
 * nothing an editor types can inject scripts. Supported:
 *   ## Heading / ### Subheading        - item / 1. item        > quote
 *   ![caption](/media/photo.jpg)  (own line, site images only)
 *   **bold**  *italic*  [link text](https://… or /path)        blank line = new paragraph
 */

const safeHref = (u: string) => (/^(https?:\/\/|\/(?!\/))/.test(u) ? u : null);
const safeImg = (u: string) => (/^\/(media|images)\/[\w./-]+$/.test(u) ? u : null);

function inline(text: string, key = "i"): ReactNode[] {
  const out: ReactNode[] = [];
  // order matters: links, then bold, then italic
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let n = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `${key}-${n++}`;
    if (m[1] !== undefined) {
      const href = safeHref(m[2]);
      const external = href?.startsWith("http");
      out.push(
        href ? (
          <a key={k} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="font-semibold text-accent underline underline-offset-2">
            {m[1]}
          </a>
        ) : (
          m[1]
        ),
      );
    } else if (m[3] !== undefined) out.push(<strong key={k} className="font-semibold text-ink">{m[3]}</strong>);
    else out.push(<em key={k}>{m[4]}</em>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const withBreaks = (lines: string[], key: string) =>
  lines.flatMap((l, i) => (i ? [<br key={`${key}-br${i}`} />, ...inline(l, `${key}-${i}`)] : inline(l, `${key}-${i}`)));

export function Markdown({ source }: { source: string }) {
  const blocks = source.replace(/\r\n/g, "\n").split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="flex flex-col gap-5 text-body-lg leading-relaxed text-ink2">
      {blocks.map((b, i) => {
        const k = `b${i}`;
        const lines = b.split("\n");
        const img = b.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
        if (img) {
          const src = safeImg(img[2]);
          return src ? (
            <figure key={k} className="my-2">
              <img src={src} alt={img[1]} loading="lazy" decoding="async" className="w-full rounded-[20px] object-cover" />
              {img[1] && <figcaption className="mt-2 text-body-sm text-muted">{img[1]}</figcaption>}
            </figure>
          ) : null;
        }
        if (b.startsWith("### ")) return <h3 key={k} className="mt-2 text-[1.35rem] font-semibold tracking-tight text-ink">{inline(b.slice(4), k)}</h3>;
        if (b.startsWith("## ")) return <h2 key={k} className="mt-4 text-[1.7rem] font-semibold tracking-tight text-ink">{inline(b.slice(3), k)}</h2>;
        if (lines.every((l) => /^[-*] /.test(l)))
          return <ul key={k} className="ml-5 list-disc space-y-1.5">{lines.map((l, j) => <li key={j}>{inline(l.slice(2), `${k}-${j}`)}</li>)}</ul>;
        if (lines.every((l) => /^\d+[.)] /.test(l)))
          return <ol key={k} className="ml-5 list-decimal space-y-1.5">{lines.map((l, j) => <li key={j}>{inline(l.replace(/^\d+[.)] /, ""), `${k}-${j}`)}</li>)}</ol>;
        if (lines.every((l) => l.startsWith(">")))
          return <blockquote key={k} className="border-l-4 border-brand pl-5 text-ink">{withBreaks(lines.map((l) => l.replace(/^>\s?/, "")), k)}</blockquote>;
        return <p key={k}>{withBreaks(lines, k)}</p>;
      })}
    </div>
  );
}

/** Plain-text version (for meta descriptions / reading time). */
export const markdownToText = (s: string) =>
  s.replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[#>*_-]+/g, " ").replace(/\s+/g, " ").trim();
