import { NextRequest, NextResponse } from 'next/server'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN

export async function POST(request: NextRequest) {
  try {
    const { documentId, type } = await request.json()
    
    if (!documentId || !type) {
      return NextResponse.json({ error: 'Missing documentId or type' }, { status: 400 })
    }

    // First, get current tour data
    const tourRes = await fetch(`${STRAPI_URL}/api/tours/${documentId}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_API_TOKEN && { 'Authorization': `Bearer ${STRAPI_API_TOKEN}` }),
      },
      cache: 'no-store',
    })

    if (!tourRes.ok) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 })
    }

    const tourData = await tourRes.json()
    const currentReviewCount = tourData.data?.reviewCount || 0
    const currentBookingCount = tourData.data?.bookingCount || 0

    // Determine what to update
    let updateData: { reviewCount?: number; bookingCount?: number } = {}
    
    if (type === 'view') {
      updateData.reviewCount = currentReviewCount + 1
    } else if (type === 'booking') {
      updateData.bookingCount = currentBookingCount + 2
    }

    // Update the tour
    const updateRes = await fetch(`${STRAPI_URL}/api/tours/${documentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_API_TOKEN && { 'Authorization': `Bearer ${STRAPI_API_TOKEN}` }),
      },
      body: JSON.stringify({ data: updateData }),
    })

    if (!updateRes.ok) {
      const errorText = await updateRes.text()
      console.error('Failed to update tour:', errorText)
      return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
    }

    const result = await updateRes.json()
    
    return NextResponse.json({ 
      success: true, 
      reviewCount: result.data?.reviewCount,
      bookingCount: result.data?.bookingCount,
    })
  } catch (error) {
    console.error('Tour stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
