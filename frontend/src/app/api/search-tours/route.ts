import { NextResponse } from 'next/server'
import { getSearchTourIndex } from '@/lib/data'

export const revalidate = 3600

export async function GET() {
  try {
    const tours = await getSearchTourIndex(24)
    return NextResponse.json(tours)
  } catch (error) {
    console.error('Error fetching search tour index:', error)
    return NextResponse.json({ error: 'Failed to fetch search index' }, { status: 500 })
  }
}
