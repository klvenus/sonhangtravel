import { NextResponse } from 'next/server'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN

// Daily limit tracking (resets at midnight)
const DAILY_LIMIT = 20
let dailyCount = 0
let lastResetDate = new Date().toDateString()

function checkAndResetDaily() {
  const today = new Date().toDateString()
  if (today !== lastResetDate) {
    dailyCount = 0
    lastResetDate = today
  }
}

// This API randomly increments counts for tours to make stats look organic
export async function POST() {
  try {
    // Check daily limit
    checkAndResetDaily()
    if (dailyCount >= DAILY_LIMIT) {
      return NextResponse.json({ message: 'Daily limit reached', limit: DAILY_LIMIT })
    }

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

    // Randomly select 1 tour to update
    const randomIndex = Math.floor(Math.random() * tours.length)
    const tour = tours[randomIndex]

    // Only increment by 1
    const updateRes = await fetch(`${STRAPI_URL}/api/tours/${tour.documentId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        data: {
          reviewCount: (tour.reviewCount || 0) + 1,
          bookingCount: (tour.bookingCount || 0) + 1,
        }
      }),
    })

    if (updateRes.ok) {
      dailyCount++
      return NextResponse.json({ 
        success: true, 
        tourId: tour.id,
        dailyCount,
        remaining: DAILY_LIMIT - dailyCount
      })
    }

    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })

  } catch (error) {
    console.error('Boost stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
