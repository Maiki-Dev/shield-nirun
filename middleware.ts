import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "sn_admin";

/**
 * - /admin/**: no locale; signed-out visitors go to /admin/login (the session itself is verified on the server).
 * - /api/**, /media/**: passed through.
 * - Site pages: Mongolian at unprefixed URLs (rewritten to /mn/...), English at /en/...; typed /mn/... redirects.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    if (pathname === "/admin/login" || req.cookies.has(SESSION_COOKIE)) return res;
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  if (pathname.startsWith("/api/") || pathname.startsWith("/media/")) return NextResponse.next();

  if (pathname === "/en" || pathname.startsWith("/en/")) return NextResponse.next();

  const url = req.nextUrl.clone();
  if (pathname === "/mn" || pathname.startsWith("/mn/")) {
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }
  url.pathname = `/mn${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next internals, static files (anything with an extension) and public folders.
  matcher: ["/((?!_next|files|images|.*\\..*).*)"],
};
