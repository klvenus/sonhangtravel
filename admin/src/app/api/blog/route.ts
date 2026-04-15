import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { blogPosts } from '@/lib/schema';
import { desc, eq, or, sql } from 'drizzle-orm';
import { revalidateProduction } from '@/lib/revalidate';

function slugify(text: string): string {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function normalizeText(text: string): string {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/\s+/g, ' ')
    .trim();
}

function textFingerprint(parts: Array<string | null | undefined>): string {
  const merged = normalizeText(parts.filter(Boolean).join(' | '));
  let hash = 0;
  for (let i = 0; i < merged.length; i++) {
    hash = ((hash << 5) - hash + merged.charCodeAt(i)) | 0;
  }
  return `fp_${Math.abs(hash)}`;
}

export async function GET() {
  try {
    const data = await db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt));
    return NextResponse.json(data);
  } catch (error) {
    console.error('GET /api/blog error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    if (!body.slug) body.slug = slugify(body.title);

    const sourcePostKey = String(body.sourcePostKey || '').trim() || null;
    const sourcePostUrl = String(body.sourcePostUrl || '').trim() || null;
    const sourceFingerprint = String(body.sourceFingerprint || '').trim()
      || textFingerprint([body.title, body.description, body.excerpt]);

    const normalizedTitle = normalizeText(body.title || '');
    const existing = await db.select()
      .from(blogPosts)
      .where(or(
        eq(blogPosts.slug, body.slug),
        sourcePostKey ? eq(blogPosts.sourcePostKey, sourcePostKey) : sql`false`,
        sourcePostUrl ? eq(blogPosts.sourcePostUrl, sourcePostUrl) : sql`false`,
        sourceFingerprint ? eq(blogPosts.sourceFingerprint, sourceFingerprint) : sql`false`,
        sql`lower(${blogPosts.title}) = lower(${body.title})`
      ))
      .limit(1);

    if (existing[0]) {
      return NextResponse.json({
        error: 'Duplicate blog post detected',
        duplicate: existing[0],
      }, { status: 409 });
    }

    const [newPost] = await db.insert(blogPosts).values({
      title: body.title,
      slug: body.slug,
      description: body.description || '',
      excerpt: body.excerpt || '',
      content: body.content || [],
      category: body.category || 'Blog',
      keywords: body.keywords || [],
      thumbnail: body.thumbnail || null,
      gallery: body.gallery || [],
      sourcePostKey,
      sourcePostUrl,
      sourceFingerprint,
      published: body.published !== false,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
      updatedAt: new Date(),
    }).returning();

    await revalidateProduction(['/blog', `/blog/${newPost.slug}`, '/uu-dai', '/an-sap-dong-hung'], { basePaths: [] });
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('POST /api/blog error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
