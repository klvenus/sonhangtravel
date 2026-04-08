import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tours, categories } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { revalidateProduction } from '@/lib/revalidate';

async function getCategoryPath(categoryId?: number | null) {
  if (!categoryId) return null;
  const [category] = await db
    .select({ slug: categories.slug })
    .from(categories)
    .where(eq(categories.id, categoryId))
    .limit(1);
  return category?.slug ? `/tours/${category.slug}` : null;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const [tour] = await db.select().from(tours).where(eq(tours.id, Number(id))).limit(1);
    if (!tour) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(tour);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    const fields = ['title','slug','shortDescription','content','duration','departure','destination',
      'transportation','groupSize','thumbnail','gallery','itinerary','includes','excludes',
      'notes','policy','featured','published','departureDates'];
    for (const field of fields) { if (body[field] !== undefined) updateData[field] = body[field]; }
    if (body.price !== undefined) updateData.price = Number(body.price);
    if (body.originalPrice !== undefined) updateData.originalPrice = body.originalPrice ? Number(body.originalPrice) : null;
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId ? Number(body.categoryId) : null;
    if (body.rating !== undefined) updateData.rating = String(body.rating);
    if (body.reviewCount !== undefined) updateData.reviewCount = Number(body.reviewCount);
    if (body.bookingCount !== undefined) updateData.bookingCount = Number(body.bookingCount);

    const [updated] = await db.update(tours).set(updateData).where(eq(tours.id, Number(id))).returning();
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const categoryPath = await getCategoryPath(updated.categoryId);
    await revalidateProduction([
      `/tour/${updated.slug}`,
      '/so-do-tour',
      ...(categoryPath ? [categoryPath] : []),
    ]);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const [deleted] = await db.delete(tours).where(eq(tours.id, Number(id))).returning();
    if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const categoryPath = await getCategoryPath(deleted.categoryId);
    await revalidateProduction([
      `/tour/${deleted.slug}`,
      '/so-do-tour',
      ...(categoryPath ? [categoryPath] : []),
    ]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
