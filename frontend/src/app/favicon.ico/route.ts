import { NextRequest, NextResponse } from 'next/server';
import { getSiteSettings, getImageUrl } from '@/lib/strapi';

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    const settings = await getSiteSettings();
    
    if (settings?.favicon) {
      const faviconUrl = getImageUrl(settings.favicon);
      if (faviconUrl && faviconUrl !== '/images/placeholder-tour.jpg') {
        return NextResponse.redirect(faviconUrl, {
          status: 307,
          headers: { 'Cache-Control': 'public, max-age=3600, immutable' },
        });
      }
    }
    
    return new NextResponse('Favicon not found', { status: 404 });
  } catch (error) {
    console.error('Error fetching favicon:', error);
    return new NextResponse('Favicon not found', { status: 404 });
  }
}
