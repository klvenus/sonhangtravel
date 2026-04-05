import { NextResponse } from 'next/server'
import { getCategories, getSearchTourIndex } from '@/lib/data'

// This endpoint can be called by a cron job to keep popular pages warm
// Vercel Cron: Add to vercel.json or use external service like cron-job.org

async function warmInBatches(paths: string[], baseUrl: string, batchSize = 4) {
  const results: Array<
    | { status: 'fulfilled'; value: { path: string; status: number; duration: number } }
    | { status: 'rejected'; reason: unknown }
  > = []

  for (let index = 0; index < paths.length; index += batchSize) {
    const batch = paths.slice(index, index + batchSize)
    const batchResults = await Promise.allSettled(
      batch.map(async (path) => {
        const url = `${baseUrl}${path}`
        const start = Date.now()
        const res = await fetch(url, {
          cache: 'no-store',
          headers: { 'x-warm-cache': '1' },
        })
        const duration = Date.now() - start
        return { path, status: res.status, duration }
      })
    )
    results.push(...batchResults)
  }

  return results
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sonhangtravel.com'
  
  try {
    const [categories, topTours] = await Promise.all([
      getCategories(),
      getSearchTourIndex(10),
    ])

    const priorityCategoryPages = categories
      .filter((category) => (category.tourCount || 0) > 0)
      .slice(0, 5)
      .map((category) => `/tours/${category.slug}`)

    const priorityTourPages = topTours.map((tour) => `/tour/${tour.slug}`)

    const pagesToWarm = Array.from(new Set([
      '/',
      '/tours',
      '/uu-dai',
      '/so-do-tour',
      ...priorityCategoryPages,
      ...priorityTourPages,
    ]))
    
    console.log(`Warming ${pagesToWarm.length} pages...`)
    
    const results = await warmInBatches(pagesToWarm, baseUrl)
    
    const successful = results.filter(r => r.status === 'fulfilled').length
    const failed = results.filter(r => r.status === 'rejected').length
    
    return NextResponse.json({
      message: 'Cache warming complete',
      total: pagesToWarm.length,
      successful,
      failed,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Cache warming error:', error)
    return NextResponse.json({ error: 'Failed to warm cache' }, { status: 500 })
  }
}
