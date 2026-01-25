import { NextRequest, NextResponse } from 'next/server'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN

export async function POST(request: NextRequest) {
  try {
    const { documentId, currentReviewCount, currentBookingCount } = await request.json()

    if (!documentId) {
      return NextResponse.json({ error: 'documentId is required' }, { status: 400 })
    }

    // Update counts in Strapi
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (STRAPI_API_TOKEN) {
      headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`
    }

    const response = await fetch(`${STRAPI_URL}/api/tours/${documentId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        data: {
          reviewCount: (currentReviewCount || 0) + 1,
          bookingCount: (currentBookingCount || 0) + 2,
        }
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Strapi update error:', errorText)
      return NextResponse.json({ error: 'Failed to update counts' }, { status: 500 })
    }

    const data = await response.json()
    return NextResponse.json({ 
      success: true, 
      reviewCount: data.data?.reviewCount,
      bookingCount: data.data?.bookingCount 
    })

  } catch (error) {
    console.error('Track view error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
