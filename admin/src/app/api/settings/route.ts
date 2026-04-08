import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { siteSettings } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { revalidateProduction } from '@/lib/revalidate';

export async function GET() {
  try {
    const [data] = await db.select().from(siteSettings).limit(1);
    return NextResponse.json(data || null);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    const fields = ['siteName','logo','logoDark','favicon','bannerSlides','phoneNumber','zaloNumber','email','address','facebookUrl','youtubeUrl','tiktokUrl'];
    for (const f of fields) { if (body[f] !== undefined) updateData[f] = body[f]; }

    const existing = await db.select({ id: siteSettings.id }).from(siteSettings).limit(1);
    let result;
    if (existing[0]) {
      [result] = await db.update(siteSettings).set(updateData).where(eq(siteSettings.id, existing[0].id)).returning();
    } else {
      [result] = await db.insert(siteSettings).values(updateData).returning();
    }

    await revalidateProduction(['/ve-chung-toi', '/so-do-tour', '/blog', '/uu-dai', '/an-sap-dong-hung']);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
