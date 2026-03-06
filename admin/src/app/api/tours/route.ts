import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tours, categories } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidateProduction } from '@/lib/revalidate';

export async function GET() {
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
    console.error('GET /api/tours error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

function slugify(text: string): string {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    if (!body.slug) body.slug = slugify(body.title);

    const [newTour] = await db.insert(tours).values({
      title: body.title,
      slug: body.slug,
      shortDescription: body.shortDescription || '',
      content: body.content || '',
      price: Number(body.price) || 0,
      originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
      duration: body.duration || '',
      departure: body.departure || 'Móng Cái',
      destination: body.destination || '',
      transportation: body.transportation || '',
      groupSize: body.groupSize || '',
      thumbnail: body.thumbnail || '',
      gallery: body.gallery || [],
      itinerary: body.itinerary || [],
      includes: body.includes || [],
      excludes: body.excludes || [],
      notes: body.notes || [],
      policy: body.policy || '',
      categoryId: body.categoryId ? Number(body.categoryId) : null,
      featured: body.featured || false,
      published: body.published !== false,
      rating: body.rating || '5.0',
      reviewCount: body.reviewCount || 0,
      bookingCount: body.bookingCount || 0,
      departureDates: body.departureDates || [],
    }).returning();
    // Auto-revalidate production
    revalidateProduction([`/tour/${newTour.slug}`]);
    return NextResponse.json(newTour, { status: 201 });
  } catch (error) {
    console.error('POST /api/tours error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
