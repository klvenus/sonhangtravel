import { NextResponse } from 'next/server'

/**
 * Keep-Alive Endpoint
 *
 * Purpose: Ping backend to prevent cold starts on Render free tier
 *
 * Usage:
 * 1. Setup external cron (cron-job.org) to call this endpoint every 5-10 minutes
 * 2. Or use Vercel Cron if you upgrade plan (Hobby only allows 1 cron)
 *
 * Example cron-job.org setup:
 * - URL: https://sonhangtravel.vercel.app/api/keep-alive
 * - Schedule: */5 * * * * (every 5 minutes)
 * - HTTP Method: GET
 */

export const maxDuration = 30 // 30 seconds max execution time

export async function GET() {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://sonhangtravel.onrender.com'

  try {
    const start = Date.now()

    // Lightweight health check - just ping to keep alive
    const response = await fetch(`${strapiUrl}/_health`, {
      method: 'HEAD',
      signal: AbortSignal.timeout(10000), // 10s timeout
    })

    const duration = Date.now() - start
    const isAlive = response.ok

    console.log(`Backend keep-alive: ${isAlive ? '✅ alive' : '❌ down'} (${duration}ms)`)

    return NextResponse.json({
      success: true,
      backend: {
        alive: isAlive,
        responseTime: duration,
        url: strapiUrl,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Keep-alive ping failed:', error)

    // Still return success to avoid cron job errors
    // Backend might be waking up
    return NextResponse.json({
      success: true,
      backend: {
        alive: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        url: strapiUrl,
      },
      timestamp: new Date().toISOString(),
    })
  }
}
