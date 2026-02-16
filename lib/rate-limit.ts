import type { NextRequest } from "next/server"

// Simple in-memory rate limiter for development
// In production, use Upstash Redis rate limiter

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

const store = new Map<string, { count: number; reset: number }>()

function createRateLimiter(limit: number, windowMs: number) {
  return {
    limit,
    windowMs,
  }
}

export const chatRateLimit = createRateLimiter(20, 60 * 1000) // 20 req/min
export const apiRateLimit = createRateLimiter(60, 60 * 1000) // 60 req/min

export function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const ip = forwarded?.split(",")[0]?.trim() ?? "anonymous"
  return ip
}

export async function checkRateLimit(
  identifier: string,
  limiter: { limit: number; windowMs: number }
): Promise<RateLimitResult> {
  const now = Date.now()
  const key = `${identifier}`
  const entry = store.get(key)

  if (!entry || now > entry.reset) {
    store.set(key, { count: 1, reset: now + limiter.windowMs })
    return {
      success: true,
      limit: limiter.limit,
      remaining: limiter.limit - 1,
      reset: now + limiter.windowMs,
    }
  }

  entry.count++
  if (entry.count > limiter.limit) {
    return {
      success: false,
      limit: limiter.limit,
      remaining: 0,
      reset: entry.reset,
    }
  }

  return {
    success: true,
    limit: limiter.limit,
    remaining: limiter.limit - entry.count,
    reset: entry.reset,
  }
}

export function createRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": result.reset.toString(),
  }
}
