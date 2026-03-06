import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { categories, tours } from '@/lib/schema';
import { eq, asc, sql } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db.select().from(categories).orderBy(asc(categories.order));
    const result = [];
    for (const cat of data) {
      const countRes = await db.select({ count: sql<number>`count(*)` }).from(tours).where(eq(tours.categoryId, cat.id));
      result.push({ ...cat, tourCount: Number(countRes[0]?.count || 0) });
    }
    return NextResponse.json(result);
  } catch (error) {
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
    if (!body.name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    if (!body.slug) body.slug = slugify(body.name);

    const [newCat] = await db.insert(categories).values({
      name: body.name, slug: body.slug, description: body.description || '',
      icon: body.icon || '🏯', image: body.image || '', order: body.order || 0,
    }).returning();
    return NextResponse.json(newCat, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
