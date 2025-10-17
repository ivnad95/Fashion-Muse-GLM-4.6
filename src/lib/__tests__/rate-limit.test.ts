import { describe, it, expect, beforeEach } from 'vitest';
import { checkRateLimit, resetRateLimit, RATE_LIMITS } from '../rate-limit';

describe('Rate Limiting', () => {
  const testId = 'test-user-123';

  beforeEach(() => {
    resetRateLimit(testId);
  });

  it('should allow requests within limit', () => {
    const result = checkRateLimit(testId, RATE_LIMITS.GENERAL);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(RATE_LIMITS.GENERAL.maxRequests - 1);
  });

  it('should block requests exceeding limit', () => {
    // Exhaust the limit
    for (let i = 0; i < RATE_LIMITS.GENERATION.maxRequests; i++) {
      checkRateLimit(testId, RATE_LIMITS.GENERATION);
    }

    // Next request should be blocked
    const result = checkRateLimit(testId, RATE_LIMITS.GENERATION);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('should reset after window expires', async () => {
    const shortWindow = { maxRequests: 2, windowMs: 100 };
    
    checkRateLimit(testId, shortWindow);
    checkRateLimit(testId, shortWindow);
    
    let result = checkRateLimit(testId, shortWindow);
    expect(result.allowed).toBe(false);

    // Wait for window to expire
    await new Promise(resolve => setTimeout(resolve, 150));

    result = checkRateLimit(testId, shortWindow);
    expect(result.allowed).toBe(true);
  });

  it('should provide reset time information', () => {
    const result = checkRateLimit(testId, RATE_LIMITS.GENERATION);
    expect(result.resetIn).toBeGreaterThan(0);
    expect(result.resetIn).toBeLessThanOrEqual(RATE_LIMITS.GENERATION.windowMs);
  });
});
