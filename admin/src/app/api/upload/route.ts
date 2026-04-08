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

function shouldConvertToWebp(file: File) {
  const mimeType = (file.type || '').toLowerCase();
  return mimeType.startsWith('image/') && mimeType !== 'image/gif' && mimeType !== 'image/svg+xml' && mimeType !== 'image/webp';
}

async function sha1Hex(input: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(request: NextRequest) {
  try {
    const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const timestamp = Math.round(Date.now() / 1000);
    const shouldWebp = shouldConvertToWebp(file);
    const signParams = [`folder=sonhangtravel`];

    if (shouldWebp) {
      signParams.push('format=webp');
    }

    signParams.push(`timestamp=${timestamp}`);
    const signature = await sha1Hex(signParams.join('&') + apiSecret);

    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('api_key', apiKey);
    uploadData.append('timestamp', String(timestamp));
    uploadData.append('signature', signature);
    uploadData.append('folder', 'sonhangtravel');

    if (shouldWebp) {
      uploadData.append('format', 'webp');
    }

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: uploadData });
    if (!res.ok) {
      const err = await res.text();
      console.error('Cloudinary error:', err);
      return NextResponse.json({ error: 'Upload failed', detail: err }, { status: 500 });
    }

    const result = await res.json();
    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      normalizedToWebp: shouldWebp,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
