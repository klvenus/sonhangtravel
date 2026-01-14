import { NextResponse } from 'next/server'

// This endpoint can be called by a cron job to keep popular pages warm
// Vercel Cron: Add to vercel.json or use external service like cron-job.org

// Helper: Wake up backend with retries
async function wakeUpBackend(strapiUrl: string, maxRetries = 3): Promise<boolean> {
  console.log('🔥 Waking up backend...')

  for (let i = 0; i < maxRetries; i++) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    try {
      const start = Date.now()
      const response = await fetch(`${strapiUrl}/_health`, {
        method: 'HEAD',
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      const duration = Date.now() - start

      if (response.ok) {
        console.log(`✅ Backend awake in ${duration}ms (attempt ${i + 1})`)
        return true
      }
    } catch (error) {
      clearTimeout(timeoutId)
      console.log(`⏳ Backend waking up... attempt ${i + 1}/${maxRetries}`)
      if (i < maxRetries - 1) {
        // Exponential backoff: 5s, 10s, 15s
        await new Promise(resolve => setTimeout(resolve, (i + 1) * 5000))
      }
    }
  }

  console.warn('⚠️ Backend may not be fully awake, proceeding anyway...')
  return false
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sonhangtravel.vercel.app'
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://sonhangtravel.onrender.com'

  try {
    // Step 1: Wake up backend FIRST (critical for Render free tier)
    await wakeUpBackend(strapiUrl)

    // Step 2: Fetch main pages to warm up cache
    const pagesToWarm = [
      '/',
      '/tours',
    ]

    // Step 3: Fetch all tour detail pages
    const toursController = new AbortController()
    const toursTimeoutId = setTimeout(() => toursController.abort(), 30000)

    const toursResponse = await fetch(`${strapiUrl}/api/tours?fields[0]=slug&pagination[pageSize]=100`, {
      next: { revalidate: 0 }, // Don't cache this fetch
      signal: toursController.signal,
    })

    clearTimeout(toursTimeoutId)

    if (toursResponse.ok) {
      const toursData = await toursResponse.json()
      const tourSlugs = toursData.data?.map((t: { slug: string }) => `/tour/${t.slug}`) || []
      pagesToWarm.push(...tourSlugs)
    }
    
    console.log(`Warming ${pagesToWarm.length} pages...`)
    
    // Fetch all pages in parallel (but limit concurrency)
    const results = await Promise.allSettled(
      pagesToWarm.map(async (path) => {
        const url = `${baseUrl}${path}`
        const start = Date.now()
        const res = await fetch(url, { 
          cache: 'no-store',
          headers: { 'x-warm-cache': '1' }
        })
        const duration = Date.now() - start
        return { path, status: res.status, duration }
      })
    )
    
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
