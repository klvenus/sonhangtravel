import { NextResponse } from 'next/server'
import { getCategories } from '@/lib/data'

export const revalidate = 3600 // Cache for 1 hour

export async function GET() {
  try {
    const categories = await getCategories()
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json([], { status: 500 })
  }
}
