import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { tours } from '@/lib/schema'
import { eq, sql } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const { documentId } = await request.json()

    if (!documentId) {
      return NextResponse.json({ error: 'documentId is required' }, { status: 400 })
    }

    const tourId = Number(documentId)
    if (isNaN(tourId)) {
      return NextResponse.json({ error: 'Invalid tour ID' }, { status: 400 })
    }

    // Increment counts directly in Neon DB
    const [updated] = await db
      .update(tours)
      .set({
        reviewCount: sql`${tours.reviewCount} + 1`,
        bookingCount: sql`${tours.bookingCount} + 2`,
      })
      .where(eq(tours.id, tourId))
      .returning({
        reviewCount: tours.reviewCount,
        bookingCount: tours.bookingCount,
      })

    if (!updated) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      reviewCount: updated.reviewCount,
      bookingCount: updated.bookingCount,
    })
  } catch (error) {
    console.error('Track view error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
