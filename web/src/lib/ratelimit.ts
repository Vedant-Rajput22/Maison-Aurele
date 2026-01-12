import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Check if Upstash is configured
const isConfigured = Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

// Create Redis client (or null if not configured)
const redis = isConfigured
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
    : null;

/**
 * Rate limiter for authentication endpoints
 * 5 requests per 10 seconds per IP
 */
export const authRateLimiter = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "10 s"),
        prefix: "ratelimit:auth",
        analytics: true,
    })
    : null;

/**
 * Rate limiter for search endpoints
 * 20 requests per 10 seconds per IP
 */
export const searchRateLimiter = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(20, "10 s"),
        prefix: "ratelimit:search",
        analytics: true,
    })
    : null;

/**
 * Rate limiter for general API endpoints
 * 100 requests per minute per IP
 */
export const apiRateLimiter = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, "60 s"),
        prefix: "ratelimit:api",
        analytics: true,
    })
    : null;

/**
 * Check rate limit for a given identifier
 * Returns { success: boolean, remaining: number, reset: number }
 */
export async function checkRateLimit(
    limiter: Ratelimit | null,
    identifier: string
): Promise<{ success: boolean; remaining: number; reset: number }> {
    if (!limiter) {
        // If Upstash is not configured, allow all requests
        return { success: true, remaining: 999, reset: 0 };
    }

    const result = await limiter.limit(identifier);
    return {
        success: result.success,
        remaining: result.remaining,
        reset: result.reset,
    };
}

/**
 * Get client IP from request headers
 */
export function getClientIp(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");

    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }

    if (realIp) {
        return realIp;
    }

    return "127.0.0.1";
}

/**
 * Create rate limit exceeded response
 */
export function rateLimitResponse(reset: number): Response {
    return new Response(
        JSON.stringify({
            error: "Too many requests",
            message: "Please slow down and try again later.",
            retryAfter: Math.ceil((reset - Date.now()) / 1000),
        }),
        {
            status: 429,
            headers: {
                "Content-Type": "application/json",
                "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
                "X-RateLimit-Reset": String(reset),
            },
        }
    );
}
