/**
 * Small in-memory fixed-window rate limiter (per server process). Good enough for a single VPS;
 * swap for Redis if the site ever runs on several instances.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }
  b.count += 1;
  if (buckets.size > 10_000) for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
  return { ok: b.count <= limit, retryAfterSec: Math.ceil((b.resetAt - now) / 1000) };
}

export function resetRateLimit(key: string) {
  buckets.delete(key);
}
