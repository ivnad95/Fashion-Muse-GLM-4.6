import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Prisma } from '@prisma/client';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { FavoriteToggleSchema } from '@/schemas/generation.schema';

/**
 * POST /api/generations/[id]/favorite
 * Toggle favorite status
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
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

    // Update generation
    const updatePayload: Prisma.GenerationUpdateManyMutationInput = {
      isFavorite,
    };

    const generation = await db.generation.updateMany({
      where: {
        id,
        userId: user.id,
      },
      data: updatePayload,
    });

    if (generation.count === 0) {
      return NextResponse.json(
        { success: false, error: 'Generation not found' },
        { status: 404 }
      );
    }

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
