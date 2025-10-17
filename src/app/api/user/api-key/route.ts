/**
 * Secure API Key Management
 * Stores Gemini API keys in encrypted database with HttpOnly cookies for session
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { encryptSecret, decryptSecret } from '@/lib/encryption';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';

/**
 * GET /api/user/api-key
 * Retrieve user's encrypted API key status (not the key itself)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user settings
    const settings = await db.userSettings.findUnique({
      where: { userId: session.user.id },
      select: {
        encryptedGeminiApiKey: true,
        geminiApiKeyIv: true,
      },
    });

    const hasApiKey = Boolean(settings?.encryptedGeminiApiKey);

    return NextResponse.json({
      hasApiKey,
      message: hasApiKey ? 'API key is stored securely' : 'No API key stored',
    });
  } catch (error) {
    console.error('Error retrieving API key status:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve API key status' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/api-key
 * Store user's Gemini API key securely (encrypted in database)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Rate limiting
    const identifier = `api-key-${session.user.id}`;
    const rateLimit = checkRateLimit(identifier, RATE_LIMITS.API_KEY);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          resetIn: Math.ceil(rateLimit.resetIn / 1000),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimit.limit.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': new Date(Date.now() + rateLimit.resetIn).toISOString(),
          },
        }
      );
    }

    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 400 }
      );
    }

    // Basic validation for Gemini API key format
    if (!apiKey.startsWith('AIzaSy') || apiKey.length < 39) {
      return NextResponse.json(
        { error: 'Invalid Gemini API key format' },
        { status: 400 }
      );
    }

    // Encrypt the API key
    const { encrypted, iv } = encryptSecret(apiKey);

    // Store in database
    await db.userSettings.upsert({
      where: { userId: session.user.id },
      update: {
        encryptedGeminiApiKey: encrypted,
        geminiApiKeyIv: iv,
      },
      create: {
        userId: session.user.id,
        encryptedGeminiApiKey: encrypted,
        geminiApiKeyIv: iv,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'API key stored securely',
    });
  } catch (error) {
    console.error('Error storing API key:', error);
    return NextResponse.json(
      { error: 'Failed to store API key' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/user/api-key
 * Remove stored API key
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Remove API key from database
    await db.userSettings.update({
      where: { userId: session.user.id },
      data: {
        encryptedGeminiApiKey: null,
        geminiApiKeyIv: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'API key removed successfully',
    });
  } catch (error) {
    console.error('Error removing API key:', error);
    return NextResponse.json(
      { error: 'Failed to remove API key' },
      { status: 500 }
    );
  }
}

/**
 * Helper function to get decrypted API key (for internal use)
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
