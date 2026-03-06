import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { db } from '@/lib/db';
import { siteSettings } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const data = await db.select().from(siteSettings).limit(1);
    return NextResponse.json(data[0] || null);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    const fields = ['siteName','logo','logoDark','favicon','bannerSlides','phoneNumber','zaloNumber','email','address','facebookUrl','youtubeUrl','tiktokUrl'];
    for (const field of fields) { if (body[field] !== undefined) updateData[field] = body[field]; }
    const existing = await db.select({ id: siteSettings.id }).from(siteSettings).limit(1);
    let result;
    if (existing[0]) {
      [result] = await db.update(siteSettings).set(updateData).where(eq(siteSettings.id, existing[0].id)).returning();
    } else {
      [result] = await db.insert(siteSettings).values(updateData).returning();
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
