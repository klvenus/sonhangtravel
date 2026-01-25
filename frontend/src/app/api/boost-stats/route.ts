import { NextResponse } from 'next/server'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN

// This API randomly increments counts for tours to make stats look organic
export async function POST() {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (STRAPI_API_TOKEN) {
      headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`
    }

    // Fetch all tours
    const toursRes = await fetch(`${STRAPI_URL}/api/tours?fields[0]=reviewCount&fields[1]=bookingCount`, {
      headers,
      cache: 'no-store',
    })

    if (!toursRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch tours' }, { status: 500 })
    }

    const toursData = await toursRes.json()
    const tours = toursData.data || []

    if (tours.length === 0) {
      return NextResponse.json({ message: 'No tours found' })
    }

    // Randomly select 1-2 tours to update
    const numToUpdate = Math.random() > 0.5 ? 2 : 1
    const shuffled = tours.sort(() => 0.5 - Math.random())
    const selectedTours = shuffled.slice(0, numToUpdate)

    const updates = []

    for (const tour of selectedTours) {
      // Random increments: review +1-3, booking +1-5
      const reviewIncrement = Math.floor(Math.random() * 3) + 1
      const bookingIncrement = Math.floor(Math.random() * 5) + 1

      const updateRes = await fetch(`${STRAPI_URL}/api/tours/${tour.documentId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          data: {
            reviewCount: (tour.reviewCount || 0) + reviewIncrement,
            bookingCount: (tour.bookingCount || 0) + bookingIncrement,
          }
        }),
      })

      if (updateRes.ok) {
        updates.push({
          id: tour.id,
          reviewIncrement,
          bookingIncrement,
        })
      }
    }

    return NextResponse.json({ 
      success: true, 
      updated: updates.length,
      details: updates 
    })

  } catch (error) {
    console.error('Boost stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
