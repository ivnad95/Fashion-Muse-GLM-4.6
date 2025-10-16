import { z } from 'zod';

/**
 * Validation schema for generation requests
 */
export const GenerationRequestSchema = z.object({
  image: z.string().min(1, 'Image data is required'),
  numberOfImages: z.number().int().min(1).max(8, 'Number of images must be between 1 and 8'),
  aspectRatio: z.enum(['portrait', 'square', 'landscape']).optional(),
  apiKey: z.string().optional(),
  useUserAccount: z.boolean().default(false),
  userId: z.string().min(1, 'User ID is required'),
});

export type GenerationRequestInput = z.infer<typeof GenerationRequestSchema>;

/**
 * Validation schema for generation query parameters
 */
export const GenerationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled']).optional(),
  favorite: z.coerce.boolean().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type GenerationQueryInput = z.infer<typeof GenerationQuerySchema>;

/**
 * Validation schema for favorite toggle
 */
export const FavoriteToggleSchema = z.object({
  isFavorite: z.boolean(),
});

export type FavoriteToggleInput = z.infer<typeof FavoriteToggleSchema>;
