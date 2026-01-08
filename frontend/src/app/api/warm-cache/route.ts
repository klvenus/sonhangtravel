import { NextResponse } from 'next/server'

// This endpoint can be called by a cron job to keep popular pages warm
// Vercel Cron: Add to vercel.json or use external service like cron-job.org

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sonhangtravel.vercel.app'
  
  try {
    // Fetch main pages to warm up cache
    const pagesToWarm = [
      '/',
      '/tours',
    ]
    
    // Also fetch all tour detail pages
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://sonhangtravel.onrender.com'
    const toursResponse = await fetch(`${strapiUrl}/api/tours?fields[0]=slug&pagination[pageSize]=100`, {
      next: { revalidate: 0 } // Don't cache this fetch
    })
    
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
