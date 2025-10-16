import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

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
 * GET /api/generations/[id]
 * Get a single generation by ID
 */
export async function GET(
  request: NextRequest,
  context: RouteContextParams<{ id: string }>
) {
  try {
    const params = await context.params;
    const rawId = normalizeParam(params.id);

    if (!rawId) {
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

    const generation = await db.generation.findFirst({
      where: {
        id: rawId,
        userId: user.id,
      },
    });

    if (!generation) {
      return NextResponse.json(
        { success: false, error: 'Generation not found' },
        { status: 404 }
      );
    }

    // Parse result URLs
    const rawResultUrls = (
      generation as { resultUrls?: string | null }
    ).resultUrls;

    const parsedGeneration = {
      ...generation,
      resultUrls: JSON.parse(rawResultUrls ?? '[]') as string[],
    };

    return NextResponse.json({
      success: true,
      generation: parsedGeneration,
    });
  } catch (error) {
    console.error('Error fetching generation:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/generations/[id]
 * Delete a generation
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContextParams<{ id: string }>
) {
  try {
    const params = await context.params;
    const rawId = normalizeParam(params.id);

    if (!rawId) {
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

    // Check if generation exists and belongs to user
    const generation = await db.generation.findFirst({
      where: {
        id: rawId,
        userId: user.id,
      },
    });

    if (!generation) {
      return NextResponse.json(
        { success: false, error: 'Generation not found' },
        { status: 404 }
      );
    }

    // Delete the generation
    await db.generation.delete({
      where: { id: rawId },
    });

    return NextResponse.json({
      success: true,
      message: 'Generation deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting generation:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
