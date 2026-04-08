import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { blogPosts } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { revalidateProduction } from '@/lib/revalidate';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, Number(id))).limit(1);
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    const fields = ['title', 'slug', 'description', 'excerpt', 'content', 'category', 'keywords', 'thumbnail', 'gallery', 'sourcePostKey', 'sourcePostUrl', 'sourceFingerprint', 'published'];
    for (const field of fields) {
      if (body[field] !== undefined) updateData[field] = body[field];
    }
    if (body.publishedAt !== undefined) updateData.publishedAt = body.publishedAt ? new Date(body.publishedAt) : new Date();

    const [updated] = await db.update(blogPosts).set(updateData).where(eq(blogPosts.id, Number(id))).returning();
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await revalidateProduction(['/blog', `/blog/${updated.slug}`, '/uu-dai', '/an-sap-dong-hung']);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const [deleted] = await db.delete(blogPosts).where(eq(blogPosts.id, Number(id))).returning();
    if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await revalidateProduction(['/blog', `/blog/${deleted.slug}`, '/uu-dai', '/an-sap-dong-hung']);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
