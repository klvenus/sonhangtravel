import { revalidatePath } from 'next/cache'
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
    revalidateMany(paths)

    return NextResponse.json({ 
      revalidated: true, 
      now: Date.now(),
      paths,
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
  revalidateMany(paths)

  return NextResponse.json({ 
    revalidated: true, 
    paths,
    now: Date.now(),
    message: 'All caches cleared'
  })
}
