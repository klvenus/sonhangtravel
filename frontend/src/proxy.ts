import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const LEGACY_TOUR_REDIRECTS: Record<string, string> = {
  '/Tour/tour-ghep-dong-hung-2-ngay-1-dem': '/tour/dong-hung-2-ngay-1-dem',
  '/Tour/tour-dong-hung-2-ngay-1-dem': '/tour/dong-hung-2-ngay-1-dem',
  '/Tour/ha-khau-binh-bien-kien-thuy-mong-tu-3n2d': '/tour/ha-khau-binh-bien-di-lac-mong-tu-kien-thuy-3-ngay-2-dem',
  '/Tour/dong-hung-nam-ninh-thai-binh-co-tran-3-ngay-2-dem':
    '/blog/tour-nam-ninh-thai-binh-co-tran-lieu-chau-khoi-hanh-26-03-dang-duoc-khach-chot-nhanh',
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/+$/, '') || '/'
  const exactDestination = LEGACY_TOUR_REDIRECTS[pathname]

  if (exactDestination) {
    const url = request.nextUrl.clone()
    url.pathname = exactDestination
    return NextResponse.redirect(url, 308)
  }

  if (pathname.startsWith('/Tour/')) {
    const slug = pathname.slice('/Tour/'.length).trim()
    if (slug) {
      const url = request.nextUrl.clone()
      url.pathname = `/tour/${slug.toLowerCase()}`
      return NextResponse.redirect(url, 308)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/Tour/:path*'],
}
