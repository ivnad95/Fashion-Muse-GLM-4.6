import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { GenerationQuerySchema } from '@/schemas/generation.schema';

/**
 * GET /api/generations
 * List user's generations with pagination and filters
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Parse and validate query parameters
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const validatedQuery = GenerationQuerySchema.parse(searchParams);

    // Build where clause
    const where: any = {
      userId: user.id,
    };

    if (validatedQuery.status) {
      where.status = validatedQuery.status;
    }

    if (validatedQuery.favorite !== undefined) {
      where.isFavorite = validatedQuery.favorite;
    }

    if (validatedQuery.startDate || validatedQuery.endDate) {
      where.createdAt = {};
      if (validatedQuery.startDate) {
        where.createdAt.gte = validatedQuery.startDate;
      }
      if (validatedQuery.endDate) {
        where.createdAt.lte = validatedQuery.endDate;
      }
    }

    // Count total for pagination
    const total = await db.generation.count({ where });

    // Fetch generations
    const generationSelect = {
      id: true,
      originalUrl: true,
      imageCount: true,
      aspectRatio: true,
      resultUrls: true,
      status: true,
      isFavorite: true,
      createdAt: true,
      updatedAt: true,
    } as const;

    const generations = await db.generation.findMany({
      where,
      orderBy: {
        [validatedQuery.sortBy]: validatedQuery.sortOrder,
      },
      skip: (validatedQuery.page - 1) * validatedQuery.limit,
      take: validatedQuery.limit,
      select: generationSelect as any,
    });

    // Parse result URLs from JSON string
    const parsedGenerations = generations.map((gen) => ({
      ...gen,
      resultUrls: JSON.parse(
        ((gen as { resultUrls?: string | null }).resultUrls ?? '[]') as string
      ),
    }));

    return NextResponse.json({
      success: true,
      generations: parsedGenerations,
      pagination: {
        total,
        page: validatedQuery.page,
        limit: validatedQuery.limit,
        pages: Math.ceil(total / validatedQuery.limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching generations:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
