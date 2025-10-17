/**
 * API Key Helper Functions
 * Internal utilities for API key management
 */

import { db } from '@/lib/db';
import { decryptSecret } from '@/lib/encryption';

/**
 * Get decrypted API key for a user (internal use only)
 */
export async function getDecryptedApiKey(userId: string): Promise<string | null> {
  try {
    const settings = await db.userSettings.findUnique({
      where: { userId },
      select: {
        encryptedGeminiApiKey: true,
        geminiApiKeyIv: true,
      },
    });

    if (!settings) {
      return null;
    }

    return decryptSecret({
      encrypted: settings.encryptedGeminiApiKey,
      iv: settings.geminiApiKeyIv,
    });
  } catch (error) {
    console.error('Error decrypting API key:', error);
    return null;
  }
}
