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
  geminiApiKey: z
    .union([
      z.string().min(20, 'Gemini API key looks too short').max(200, 'Gemini API key looks too long'),
      z.literal(''),
      z.undefined(),
      z.null(),
    ])
    .transform((value) => {
      if (!value) return undefined;
      return value;
    }),
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
