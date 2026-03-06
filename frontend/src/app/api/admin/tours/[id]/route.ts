import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { db } from '@/lib/db';
import { tours } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  try {
    const data = await db.select().from(tours).where(eq(tours.id, Number(id))).limit(1);
    if (!data[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  try {
    const [deleted] = await db.delete(tours).where(eq(tours.id, Number(id))).returning();
    if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
