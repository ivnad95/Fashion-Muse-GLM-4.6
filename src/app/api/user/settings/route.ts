import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { UserSettingsSchema } from '@/schemas/user.schema';

/**
 * GET /api/user/settings
 * Get user settings
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        settings: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Return settings or defaults
    const settings = user.settings || {
      displayName: user.name,
      aspectRatio: 'portrait',
      blurStrength: 24,
      theme: 'dark',
      language: 'en',
      geminiApiKey: undefined,
    };

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/user/settings
 * Update user settings
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedSettings = UserSettingsSchema.parse(body);

    const { geminiApiKey, ...rest } = validatedSettings;

    const payload = {
      ...rest,
      ...(geminiApiKey !== undefined ? { geminiApiKey } : {}),
    };

    // Upsert settings
    const settings = await db.userSettings.upsert({
      where: { userId: user.id },
      update: payload,
      create: {
        userId: user.id,
        ...payload,
      },
    });

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid settings data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
