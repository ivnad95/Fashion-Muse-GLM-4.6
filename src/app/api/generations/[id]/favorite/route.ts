import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { FavoriteToggleSchema } from '@/schemas/generation.schema';

type RouteContextParams<T extends Record<string, string>> = {
  params: Promise<{ [K in keyof T]: string | string[] | undefined }>;
};

const normalizeParam = (value: string | string[] | undefined): string | null => {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
};

/**
 * POST /api/generations/[id]/favorite
 * Toggle favorite status
 */
export async function POST(
  request: NextRequest,
  context: RouteContextParams<{ id: string }>
) {
  try {
    const params = await context.params;
    const id = normalizeParam(params.id);

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Generation ID is required' },
        { status: 400 }
      );
    }
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

    // Parse request body
    const body = await request.json();
    const { isFavorite } = FavoriteToggleSchema.parse(body);

    const generation = await db.generation.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!generation) {
      return NextResponse.json(
        { success: false, error: 'Generation not found' },
        { status: 404 }
      );
    }

    await db.generation.update({
      where: { id },
      data: { isFavorite },
    });

    return NextResponse.json({
      success: true,
      isFavorite,
    });
  } catch (error: any) {
    console.error('Error toggling favorite:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid request body', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
