import { Redis } from "@upstash/redis";

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error("Missing Upstash Redis credentials");
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Cache TTLs in seconds
export const CACHE_TTL = {
  SEARCH: 3600, // 1 hour
  USER_PROFILE: 3600, // 1 hour
  USER_LINKS: 3600, // 1 hour
  METADATA: 86400, // 24 hours
};

// Cache key generators
export const cacheKeys = {
  search: (query: string) => `search:${query.toLowerCase()}`,
  userProfile: (username: string) => `user:${username.toLowerCase()}`,
  userLinks: (userId: string) => `user:${userId}:links`,
  metadata: (url: string) => {
    // Create a simple hash of the URL for the key
    const hash = Buffer.from(url).toString("base64").slice(0, 32);
    return `metadata:${hash}`;
  },
};

// Cache invalidation helpers
export const invalidateUserCache = async (username: string, userId: string) => {
  await Promise.all([
    redis.del(cacheKeys.userProfile(username)),
    redis.del(cacheKeys.userLinks(userId)),
  ]);
};

export const invalidateSearchCache = async () => {
  // Delete all search cache keys
  const keys = await redis.keys("search:*");
  if (keys.length > 0) {
    await redis.del(...keys);
  }
};
