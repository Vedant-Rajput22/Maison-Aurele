/**
 * Maison Aurèle – Cache Configuration
 * 
 * Centralized caching utilities using Next.js unstable_cache
 * and Upstash Redis for edge caching.
 */

import { unstable_cache } from "next/cache";
import { Redis } from "@upstash/redis";

// Cache duration presets (in seconds)
export const CACHE_DURATIONS = {
  /** Real-time data - 1 minute */
  realtime: 60,
  /** Frequently updated - 5 minutes */
  short: 300,
  /** Standard content - 10 minutes */
  standard: 600,
  /** Rarely changing - 1 hour */
  long: 3600,
  /** Static content - 24 hours */
  static: 86400,
} as const;

// Cache tags for revalidation
export const CACHE_TAGS = {
  homepage: "homepage",
  products: "products",
  collections: "collections",
  journal: "journal",
  categories: "categories",
  search: "search",
} as const;

// Redis client for edge caching (optional - gracefully degrades)
const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

/**
 * Cache a value in Redis with expiration
 */
export async function cacheSet<T>(
  key: string,
  value: T,
  ttlSeconds: number = CACHE_DURATIONS.standard
): Promise<void> {
  if (!redis) return;
  try {
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
  } catch (error) {
    console.warn("Redis cache set failed:", error);
  }
}

/**
 * Get a cached value from Redis
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  try {
    const cached = await redis.get<string>(key);
    if (cached) {
      return typeof cached === "string" ? JSON.parse(cached) : cached as T;
    }
    return null;
  } catch (error) {
    console.warn("Redis cache get failed:", error);
    return null;
  }
}

/**
 * Delete cached values by pattern
 */
export async function cacheInvalidate(pattern: string): Promise<void> {
  if (!redis) return;
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.warn("Redis cache invalidate failed:", error);
  }
}

/**
 * Create a cached function with both Next.js cache and Redis
 */
export function createCachedFunction<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  keyParts: string[],
  options: {
    revalidate?: number;
    tags?: string[];
    useRedis?: boolean;
    redisTtl?: number;
  } = {}
) {
  const {
    revalidate = CACHE_DURATIONS.standard,
    tags = [],
    useRedis = true,
    redisTtl = revalidate,
  } = options;

  // Wrap with Next.js unstable_cache
  const nextCached = unstable_cache(fn, keyParts, { revalidate, tags });

  // If Redis is enabled, add Redis layer
  if (useRedis && redis) {
    return async (...args: T): Promise<R> => {
      const cacheKey = `ma:${keyParts.join(":")}:${JSON.stringify(args)}`;
      
      // Try Redis first
      const cached = await cacheGet<R>(cacheKey);
      if (cached !== null) {
        return cached;
      }

      // Fall back to Next.js cache (which hits DB if needed)
      const result = await nextCached(...args);
      
      // Store in Redis for edge caching
      await cacheSet(cacheKey, result, redisTtl);
      
      return result;
    };
  }

  return nextCached;
}

/**
 * Revalidate cache by tag (use in admin actions)
 */
export { revalidateTag } from "next/cache";
