import { ImageResponse } from 'next/og'
import { getSiteSettings, getImageUrl } from '@/lib/strapi'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Icon generation
export default async function Icon() {
  const settings = await getSiteSettings()
  
  if (settings?.favicon) {
    const faviconUrl = getImageUrl(settings.favicon)
    
    // Fetch the favicon image
    const response = await fetch(faviconUrl)
    const arrayBuffer = await response.arrayBuffer()
    
    return new Response(arrayBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  }

  // Fallback: Generate a simple icon with initials
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: '#00CBA9',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
        }}
      >
        SH
      </div>
    ),
    {
      ...size,
    }
  )
}
