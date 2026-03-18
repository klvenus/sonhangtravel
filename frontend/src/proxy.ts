import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const LEGACY_TOUR_REDIRECTS: Record<string, string> = {
  '/Tour/tour-ghep-dong-hung-2-ngay-1-dem': '/tour/dong-hung-2-ngay-1-dem',
  '/Tour/tour-dong-hung-2-ngay-1-dem': '/tour/dong-hung-2-ngay-1-dem',
  '/Tour/tour-dong-hung-trong-ngay': '/tour/dong-hung-1-ngay',
  '/Tour/tour-dong-hung-3-ngay-2-dem': '/tour/dong-hung-nam-ninh-3-ngay-2-dem',
  '/Tour/tour-ha-khau-2-ngay-1-dem': '/tours?category=ha-khau',
  '/Tour/ha-khau-kien-thuy-mong-tu': '/tour/ha-khau-khai-vien-kien-thuy-mong-tu-3-ngay-2-dem',
  '/Tour/ha-khau-binh-bien-mong-tu-2n1d': '/tour/ha-khau-binh-bien-di-lac-mong-tu-kien-thuy-3-ngay-2-dem',
  '/Tour/ha-khau-binh-bien-kien-thuy-mong-tu-3n2d': '/tour/ha-khau-binh-bien-di-lac-mong-tu-kien-thuy-3-ngay-2-dem',
  '/Tour/dong-hung-nam-ninh-thai-binh-co-tran-3-ngay-2-dem':
    '/tour/dong-hung-nam-ninh-3-ngay-2-dem',
}

const GONE_PATHS = new Set([
  '/banh-may-souffle',
  '/con-minh-dai-ly-mua-phuong-tim-mo-mang',
  '/lau-ech-kho',
  '/ket-qua-tim-kiem',
  '/tag/banh-may',
])

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/+$/, '') || '/'

  if (pathname.startsWith('/wp-content/') || GONE_PATHS.has(pathname)) {
    return new NextResponse('Gone', {
      status: 410,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'x-robots-tag': 'noindex, nofollow',
      },
    })
  }

  const exactDestination = LEGACY_TOUR_REDIRECTS[pathname]

  if (exactDestination) {
    const url = request.nextUrl.clone()
    const [pathnamePart, searchPart] = exactDestination.split('?')
    url.pathname = pathnamePart
    url.search = searchPart ? `?${searchPart}` : ''
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
  matcher: ['/Tour/:path*', '/wp-content/:path*', '/banh-may-souffle', '/con-minh-dai-ly-mua-phuong-tim-mo-mang', '/lau-ech-kho', '/ket-qua-tim-kiem', '/tag/banh-may'],
}
