import { NextRequest, NextResponse } from 'next/server';
import { getSiteSettings, getImageUrl } from '@/lib/strapi';

// Revalidate every hour (3600 seconds)
export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    const settings = await getSiteSettings();
    
    if (settings?.favicon) {
      const faviconUrl = getImageUrl(settings.favicon);
      
      // Redirect to the actual favicon URL
      return NextResponse.redirect(faviconUrl, {
        status: 307,
        headers: {
          'Cache-Control': 'public, max-age=3600, immutable',
        },
      });
    }
    
    // Fallback to default favicon with absolute URL
    const fallbackUrl = new URL('/favicon-fallback.png', request.url);
    return NextResponse.redirect(fallbackUrl, { status: 307 });
  } catch (error) {
    console.error('Error fetching favicon:', error);
    return new NextResponse('Favicon not found', { status: 404 });
  }
}
