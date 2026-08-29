interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

/**
 * In-memory sliding window rate limiter
 * Default: Max 20 requests per minute per IP
 */
export function checkRateLimit(
  ipIdentifier: string,
  maxRequests: number = 20,
  windowMs: number = 60 * 1000
): { isAllowed: boolean; limit: number; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = memoryStore.get(ipIdentifier);

  // Periodic store cleanup of expired keys
  if (memoryStore.size > 1000) {
    for (const [key, val] of memoryStore.entries()) {
      if (val.resetTime < now) {
        memoryStore.delete(key);
      }
    }
  }

  if (!record || record.resetTime < now) {
    const resetTime = now + windowMs;
    memoryStore.set(ipIdentifier, { count: 1, resetTime });
    return { isAllowed: true, limit: maxRequests, remaining: maxRequests - 1, resetTime };
  }

  if (record.count >= maxRequests) {
    return { isAllowed: false, limit: maxRequests, remaining: 0, resetTime: record.resetTime };
  }

  record.count += 1;
  return { isAllowed: true, limit: maxRequests, remaining: maxRequests - record.count, resetTime: record.resetTime };
}
