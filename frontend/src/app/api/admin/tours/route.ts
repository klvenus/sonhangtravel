import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { db } from '@/lib/db';
import { tours, categories } from '@/lib/schema';
import { eq, desc, sql } from 'drizzle-orm';

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const data = await db
      .select({
        id: tours.id, title: tours.title, slug: tours.slug, price: tours.price,
        destination: tours.destination, duration: tours.duration, featured: tours.featured,
        published: tours.published, thumbnail: tours.thumbnail, categoryId: tours.categoryId,
        categoryName: categories.name, bookingCount: tours.bookingCount,
        reviewCount: tours.reviewCount, createdAt: tours.createdAt,
      })
      .from(tours)
      .leftJoin(categories, eq(tours.categoryId, categories.id))
      .orderBy(desc(tours.createdAt));
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    if (!body.slug && body.title) {
      body.slug = body.title.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }
    const [newTour] = await db.insert(tours).values({
      title: body.title, slug: body.slug,
      shortDescription: body.shortDescription || '',
      content: body.content || '', price: Number(body.price) || 0,
      originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
      duration: body.duration || '', departure: body.departure || 'Móng Cái',
      destination: body.destination || '', transportation: body.transportation || '',
      groupSize: body.groupSize || '', thumbnail: body.thumbnail || '',
      gallery: body.gallery || [], itinerary: body.itinerary || [],
      includes: body.includes || [], excludes: body.excludes || [],
      notes: body.notes || [], policy: body.policy || '',
      categoryId: body.categoryId ? Number(body.categoryId) : null,
      featured: body.featured || false, rating: body.rating || '5.0',
      reviewCount: body.reviewCount || 0, bookingCount: body.bookingCount || 0,
      departureDates: body.departureDates || [], published: body.published !== false,
    }).returning();
    return NextResponse.json(newTour, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
