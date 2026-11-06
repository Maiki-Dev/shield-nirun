import { headers } from "next/headers";

/** Client IP as seen through the reverse proxy (set X-Forwarded-For / X-Real-IP in nginx). */
export function clientIp(): string {
  const h = headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

export const userAgent = (): string | null => headers().get("user-agent")?.slice(0, 300) ?? null;
