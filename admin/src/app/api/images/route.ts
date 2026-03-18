import { NextRequest, NextResponse } from 'next/server';

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_NAME;
  const apiKey = process.env.CLOUDINARY_KEY;
  const apiSecret = process.env.CLOUDINARY_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Missing Cloudinary environment variables');
  }

  return { cloudName, apiKey, apiSecret };
}

export async function GET(request: NextRequest) {
  try {
    const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || 'sonhangtravel';
    const maxResults = searchParams.get('max') || '50';

    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/search`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        expression: `folder:${folder} AND resource_type:image`,
        sort_by: [{ field: 'created_at', direction: 'desc' }],
        max_results: parseInt(maxResults),
      }),
    });

    if (!res.ok) {
      // Fallback to resources API if search API fails
      const fallbackUrl = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image?type=upload&prefix=${folder}&max_results=${maxResults}`;
      const fallbackRes = await fetch(fallbackUrl, {
        headers: { 'Authorization': `Basic ${auth}` },
      });
      if (!fallbackRes.ok) {
        return NextResponse.json({ error: 'Failed to list images' }, { status: 500 });
      }
      const fallbackData = await fallbackRes.json();
      const images = (fallbackData.resources || []).map((r: Record<string, unknown>) => ({
        publicId: r.public_id,
        url: r.secure_url,
        width: r.width,
        height: r.height,
        format: r.format,
        bytes: r.bytes,
        createdAt: r.created_at,
      }));
      return NextResponse.json({ images, total: images.length });
    }

    const data = await res.json();
    const images = (data.resources || []).map((r: Record<string, unknown>) => ({
      publicId: r.public_id,
      url: r.secure_url,
      width: r.width,
      height: r.height,
      format: r.format,
      bytes: r.bytes,
      createdAt: r.created_at,
    }));

    return NextResponse.json({ images, total: data.total_count || images.length });
  } catch (error) {
    console.error('List images error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
