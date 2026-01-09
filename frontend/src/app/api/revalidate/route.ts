import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Check secret token
    const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

    if (!REVALIDATE_SECRET) {
      console.error('REVALIDATE_SECRET is not configured');
      return NextResponse.json({ message: 'Revalidation not configured' }, { status: 500 })
    }

    const token = request.headers.get('x-revalidate-token') ||
                  request.nextUrl.searchParams.get('secret')

    if (!token || token !== REVALIDATE_SECRET) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    // Get the body (Strapi webhook payload)
    const body = await request.json().catch(() => ({}))
    
    console.log('Revalidate webhook received:', body)

    // Revalidate all pages
    revalidatePath('/', 'layout')
    revalidatePath('/tours', 'page')
    
    // If specific tour/category was updated, revalidate that path too
    if (body.model === 'tour' && body.entry?.slug) {
      revalidatePath(`/tour/${body.entry.slug}`, 'page')
    }
    if (body.model === 'category' && body.entry?.slug) {
      revalidatePath(`/tours/${body.entry.slug}`, 'page')
    }

    return NextResponse.json({ 
      revalidated: true, 
      now: Date.now(),
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
  const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

  if (!REVALIDATE_SECRET) {
    console.error('REVALIDATE_SECRET is not configured');
    return NextResponse.json({ message: 'Revalidation not configured' }, { status: 500 })
  }

  const token = request.nextUrl.searchParams.get('secret')

  if (!token || token !== REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }

  revalidatePath('/', 'layout')
  revalidatePath('/tours', 'page')

  return NextResponse.json({ 
    revalidated: true, 
    now: Date.now(),
    message: 'Cache cleared successfully'
  })
}
