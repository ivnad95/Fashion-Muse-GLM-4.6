import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

/**
 * GET /api/history
 * Fetches the user's image generation history.
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
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch all generations for the user, ordered by creation date
    const history = await db.generation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        imageUrls: true,
        prompt: true,
        style: true,
        aspectRatio: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      history,
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/history
 * Deletes a specific generation record.
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const generationId = searchParams.get('id');

    if (!generationId) {
      return NextResponse.json(
        { success: false, error: 'Generation ID is required' },
        { status: 400 }
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

    // Find the generation to ensure it belongs to the user before deleting
    const generation = await db.generation.findUnique({
      where: { id: generationId },
    });

    if (!generation || generation.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Generation not found or unauthorized' },
        { status: 404 }
      );
    }

    // Delete the generation record
    await db.generation.delete({
      where: { id: generationId },
    });

    return NextResponse.json({
      success: true,
      message: 'Generation record deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting history item:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

