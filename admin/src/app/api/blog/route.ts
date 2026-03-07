import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { blogPosts } from '@/lib/schema';
import { desc } from 'drizzle-orm';
import { revalidateProduction } from '@/lib/revalidate';

function slugify(text: string): string {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
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

    const [newPost] = await db.insert(blogPosts).values({
      title: body.title,
      slug: body.slug,
      description: body.description || '',
      excerpt: body.excerpt || '',
      content: body.content || [],
      category: body.category || 'Blog',
      keywords: body.keywords || [],
      thumbnail: body.thumbnail || null,
      published: body.published !== false,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
      updatedAt: new Date(),
    }).returning();

    revalidateProduction(['/blog', `/blog/${newPost.slug}`]);
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('POST /api/blog error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
