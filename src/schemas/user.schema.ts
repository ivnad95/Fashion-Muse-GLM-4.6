import { z } from 'zod';

/**
 * Validation schema for user settings
 */
export const UserSettingsSchema = z.object({
  displayName: z.string().max(100).optional(),
  aspectRatio: z.enum(['portrait', 'square', 'landscape']).default('portrait'),
  blurStrength: z.number().int().min(10).max(50).default(24),
  theme: z.enum(['light', 'dark', 'auto']).default('dark'),
  language: z.string().length(2).default('en'),
});

export type UserSettingsInput = z.infer<typeof UserSettingsSchema>;

/**
 * Validation schema for API key storage
 */
export const ApiKeySchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  provider: z.enum(['gemini', 'openai']).default('gemini'),
});

export type ApiKeyInput = z.infer<typeof ApiKeySchema>;
