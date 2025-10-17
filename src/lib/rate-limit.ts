/**
 * Rate limiting utilities
 * Uses in-memory storage for simplicity (upgrade to Redis for production scaling)
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store (use Redis in production for multi-instance support)
const store = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the window
   */
  maxRequests: number;
  
  /**
   * Time window in milliseconds
   */
  windowMs: number;
  
  /**
   * Custom identifier (defaults to IP address)
   */
  identifier?: string;
}

export interface RateLimitResult {
  /**
   * Whether the request is allowed
   */
  allowed: boolean;
  
  /**
   * Remaining requests in the current window
   */
  remaining: number;
  
  /**
   * Time until reset in milliseconds
   */
  resetIn: number;
  
  /**
   * Total limit
   */
  limit: number;
}

/**
 * Check rate limit for a given identifier
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(identifier);

  // Clean up expired entries periodically
  if (Math.random() < 0.01) {
    cleanupExpiredEntries();
  }

  // No existing entry or expired entry
  if (!entry || now > entry.resetAt) {
    const resetAt = now + config.windowMs;
    store.set(identifier, { count: 1, resetAt });
    
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetIn: config.windowMs,
      limit: config.maxRequests,
    };
  }

  // Increment count
  entry.count++;
  
  const allowed = entry.count <= config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - entry.count);
  const resetIn = entry.resetAt - now;

  return {
    allowed,
    remaining,
    resetIn,
    limit: config.maxRequests,
  };
}

/**
 * Clean up expired entries from the store
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}

/**
 * Reset rate limit for a specific identifier
 */
export function resetRateLimit(identifier: string): void {
  store.delete(identifier);
}

/**
 * Get client identifier from request
 */
export function getClientIdentifier(request: Request): string {
  // Try to get user ID from session
  // Fall back to IP address
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  
  return ip;
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  // Generation API: 10 requests per minute
  GENERATION: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute
  },
  
  // Image upload: 20 requests per minute
  UPLOAD: {
    maxRequests: 20,
    windowMs: 60 * 1000,
  },
  
  // API key updates: 5 requests per hour
  API_KEY: {
    maxRequests: 5,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  
  // General API: 100 requests per minute
  GENERAL: {
    maxRequests: 100,
    windowMs: 60 * 1000,
  },
} as const;
