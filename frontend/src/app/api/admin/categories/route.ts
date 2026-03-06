import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { db } from '@/lib/db';
import { categories, tours } from '@/lib/schema';
import { eq, asc, sql } from 'drizzle-orm';

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const data = await db.select().from(categories).orderBy(asc(categories.order));
    const result = [];
    for (const cat of data) {
      const countRes = await db.select({ count: sql<number>`count(*)` }).from(tours).where(eq(tours.categoryId, cat.id));
      result.push({ ...cat, tourCount: Number(countRes[0]?.count || 0) });
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    if (!body.slug && body.name) {
      body.slug = body.name.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }
    const [newCat] = await db.insert(categories).values({
      name: body.name, slug: body.slug, description: body.description || '',
      icon: body.icon || '🏯', image: body.image || '', order: body.order || 0,
    }).returning();
    return NextResponse.json(newCat, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
