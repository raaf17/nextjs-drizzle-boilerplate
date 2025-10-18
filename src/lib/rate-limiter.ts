import { RateLimiterMemory } from "rate-limiter-flexible";

const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100");
const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"); // 15 minutes

// Rate limiter untuk login attempts
export const loginLimiter = new RateLimiterMemory({
  points: 5, // 5 attempts
  duration: 900, // per 15 minutes
  blockDuration: 900, // block for 15 minutes
});

// Rate limiter untuk API requests
export const apiLimiter = new RateLimiterMemory({
  points: MAX_REQUESTS,
  duration: WINDOW_MS / 1000,
});

// Rate limiter untuk public endpoints
export const publicLimiter = new RateLimiterMemory({
  points: 20,
  duration: 60, // per minute
});

export async function checkRateLimit(
  limiter: RateLimiterMemory,
  key: string
): Promise<{ success: boolean; remainingPoints?: number; error?: string }> {
  try {
    const result = await limiter.consume(key);
    return {
      success: true,
      remainingPoints: result.remainingPoints,
    };
  } catch (error: any) {
    return {
      success: false,
      error: `Too many requests. Try again in ${Math.ceil(
        error.msBeforeNext / 1000
      )} seconds.`,
    };
  }
}