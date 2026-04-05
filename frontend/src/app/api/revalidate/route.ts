import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

function getRevalidateSecret() {
  const secret = process.env.REVALIDATE_SECRET

  if (!secret) {
    throw new Error('REVALIDATE_SECRET is not configured')
  }

  return secret
}

function normalizePaths(paths: unknown): string[] {
  if (!Array.isArray(paths)) return []

  return Array.from(
    new Set(
      paths
        .filter((path): path is string => typeof path === 'string')
        .map((path) => path.trim())
        .filter((path) => path.startsWith('/'))
    )
  )
}

function normalizeTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return []

  return Array.from(
    new Set(
      tags
        .filter((tag): tag is string => typeof tag === 'string')
        .map((tag) => tag.trim())
        .filter(Boolean)
    )
  )
}

function revalidateMany(paths: string[]) {
  for (const path of paths) {
    if (path === '/') {
      revalidatePath('/', 'layout')
      revalidatePath('/', 'page')
      continue
    }

    revalidatePath(path, 'page')
  }
}

function revalidateTags(tags: string[]) {
  for (const tag of tags) {
    revalidateTag(tag, 'max')
  }
}

function deriveTagsFromPaths(paths: string[]): string[] {
  const tags = new Set<string>()

  for (const path of paths) {
    if (path === '/') {
      tags.add('site-settings')
      tags.add('tours')
      continue
    }

    if (path === '/tours') {
      tags.add('tours')
      tags.add('categories')
    }

    if (path.startsWith('/tour/')) {
      tags.add('tours')
      tags.add('categories')
      tags.add(`tour:${path.split('/').pop()}`)
    }

    if (path.startsWith('/tours/')) {
      tags.add('tours')
      tags.add('categories')
      tags.add(`category:${path.split('/').pop()}`)
    }

    if (path === '/blog' || path === '/uu-dai' || path === '/an-sap-dong-hung') {
      tags.add('blog')
    }

    if (path.startsWith('/blog/')) {
      tags.add('blog')
      tags.add(`blog:${path.split('/').pop()}`)
    }

    if (path === '/ve-chung-toi' || path === '/so-do-tour') {
      tags.add('site-settings')
    }
  }

  return Array.from(tags)
}

function deriveTagsFromBody(body: any, paths: string[]): string[] {
  const tags = new Set<string>([
    ...normalizeTags(body?.tags),
    ...deriveTagsFromPaths(paths),
  ])

  if (body?.model === 'tour') {
    tags.add('tours')
    tags.add('categories')
    if (body?.entry?.slug) {
      tags.add(`tour:${body.entry.slug}`)
    }
  }

  if (body?.model === 'category') {
    tags.add('categories')
    tags.add('tours')
    if (body?.entry?.slug) {
      tags.add(`category:${body.entry.slug}`)
    }
  }

  if (body?.model === 'blog' || body?.model === 'blog_post') {
    tags.add('blog')
    if (body?.entry?.slug) {
      tags.add(`blog:${body.entry.slug}`)
    }
  }

  if (body?.model === 'site_settings' || body?.model === 'settings') {
    tags.add('site-settings')
  }

  return Array.from(tags)
}

function derivePathsFromBody(body: any): string[] {
  if (body?.paths) {
    return normalizePaths(body.paths)
  }

  const paths = new Set<string>(['/', '/tours'])

  if (body?.model === 'tour' && body?.entry?.slug) {
    paths.add(`/tour/${body.entry.slug}`)
  }

  if (body?.model === 'category' && body?.entry?.slug) {
    paths.add(`/tours/${body.entry.slug}`)
  }

  if (body?.model === 'blog' || body?.model === 'blog_post') {
    paths.add('/blog')
    paths.add('/uu-dai')
    paths.add('/an-sap-dong-hung')
    if (body?.entry?.slug) {
      paths.add(`/blog/${body.entry.slug}`)
    }
  }

  if (body?.model === 'site_settings' || body?.model === 'settings') {
    paths.add('/blog')
    paths.add('/uu-dai')
    paths.add('/an-sap-dong-hung')
    paths.add('/so-do-tour')
  }

  return Array.from(paths)
}

export async function POST(request: NextRequest) {
  try {
    const revalidateSecret = getRevalidateSecret()

    // Check secret token
    const token = request.headers.get('x-revalidate-token') || 
                  request.nextUrl.searchParams.get('secret')
    
    if (token !== revalidateSecret) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    // Get the body from admin/bot/manual revalidate callers
    const body = await request.json().catch(() => ({}))
    
    console.log('Revalidate webhook received:', body)
    const paths = derivePathsFromBody(body)
    const tags = deriveTagsFromBody(body, paths)
    revalidateMany(paths)
    revalidateTags(tags)

    return NextResponse.json({ 
      revalidated: true, 
      now: Date.now(),
      paths,
      tags,
      message: 'Cache cleared successfully'
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json({ 
      message: 'Error revalidating',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Also support GET for easy testing
export async function GET(request: NextRequest) {
  const revalidateSecret = getRevalidateSecret()
  const token = request.nextUrl.searchParams.get('secret')
  
  if (token !== revalidateSecret) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }

  const path = request.nextUrl.searchParams.get('path')
  const paths = path ? normalizePaths([path]) : ['/', '/tours', '/blog']
  const tags = deriveTagsFromPaths(paths)
  revalidateMany(paths)
  revalidateTags(tags)

  return NextResponse.json({ 
    revalidated: true, 
    paths,
    tags,
    now: Date.now(),
    message: 'All caches cleared'
  })
}
