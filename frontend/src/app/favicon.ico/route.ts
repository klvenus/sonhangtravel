import { NextRequest, NextResponse } from 'next/server';
import { getSiteSettings, getImageUrl } from '@/lib/strapi';

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
    
    // Fallback to default favicon
    return NextResponse.redirect('/favicon-fallback.png', { status: 307 });
  } catch (error) {
    console.error('Error fetching favicon:', error);
    return new NextResponse('Favicon not found', { status: 404 });
  }
}
