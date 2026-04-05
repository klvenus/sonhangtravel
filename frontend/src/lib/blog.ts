import { unstable_cache } from 'next/cache'
import { desc, eq } from 'drizzle-orm'
import { db } from './db'
import { blogPosts } from './schema'

export interface BlogBlock {
  type: 'heading' | 'paragraph' | 'list'
  text?: string
  items?: string[]
  style?: 'unordered' | 'ordered'
}

export interface BlogPost {
  id: number
  slug: string
  title: string
  description: string
  excerpt: string
  content: BlogBlock[]
  publishedAt: string
  updatedAt?: string
  category: string
  keywords: string[]
  thumbnail?: string | null
  gallery?: string[]
  published: boolean
}

function mapRow(row: typeof blogPosts.$inferSelect): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    excerpt: row.excerpt,
    content: Array.isArray(row.content) ? row.content as BlogBlock[] : [],
    publishedAt: row.publishedAt ? row.publishedAt.toISOString() : new Date().toISOString(),
    updatedAt: row.updatedAt ? row.updatedAt.toISOString() : undefined,
    category: row.category,
    keywords: Array.isArray(row.keywords) ? row.keywords as string[] : [],
    thumbnail: row.thumbnail,
    gallery: Array.isArray(row.gallery) ? row.gallery as string[] : [],
    published: Boolean(row.published),
  }
}

export async function getAllBlogPosts() {
  return unstable_cache(
    async () => {
      const rows = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.published, true))
        .orderBy(desc(blogPosts.publishedAt))

      return rows.map(mapRow)
    },
    ['blog-posts'],
    {
      tags: ['blog'],
      revalidate: 3600,
    }
  )()
}

export async function getBlogPostBySlug(slug: string) {
  const normalizedSlug = slug.trim()

  return unstable_cache(
    async () => {
      const rows = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.slug, normalizedSlug))
        .limit(1)

      const row = rows[0]
      if (!row || !row.published) return undefined
      return mapRow(row)
    },
    ['blog-post-by-slug', normalizedSlug],
    {
      tags: ['blog', `blog:${normalizedSlug}`],
      revalidate: 3600,
    }
  )()
}
