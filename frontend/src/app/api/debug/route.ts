import { NextResponse } from 'next/server'
import { getTours, getCategories } from '@/lib/strapi'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const hasDbUrl = !!process.env.DATABASE_URL
    const dbUrlPrefix = process.env.DATABASE_URL?.substring(0, 30) || 'NOT SET'
    
    let tourCount = 0
    let categoryCount = 0
    let tourError: string | null = null
    let categoryError: string | null = null

    try {
      const tours = await getTours({ pageSize: 100 })
      tourCount = tours.data.length
    } catch (e) {
      tourError = e instanceof Error ? e.message : String(e)
    }

    try {
      const cats = await getCategories()
      categoryCount = cats.length
    } catch (e) {
      categoryError = e instanceof Error ? e.message : String(e)
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      env: {
        DATABASE_URL_SET: hasDbUrl,
        DATABASE_URL_PREFIX: dbUrlPrefix,
        NODE_ENV: process.env.NODE_ENV,
        REVALIDATE_SECRET_SET: !!process.env.REVALIDATE_SECRET,
      },
      data: {
        tourCount,
        categoryCount,
        tourError,
        categoryError,
      }
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 })
  }
}
