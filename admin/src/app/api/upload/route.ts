import { NextRequest, NextResponse } from 'next/server';

const CLOUD_NAME = process.env.CLOUDINARY_NAME || 'dzxntgoko';
const API_KEY = process.env.CLOUDINARY_KEY || '316995586271977';
const API_SECRET = process.env.CLOUDINARY_SECRET || '9YuonKfWHcfu-OBlcUC8-nCXG3o';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = `folder=sonhangtravel&timestamp=${timestamp}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(paramsToSign + API_SECRET);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const signature = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('api_key', API_KEY);
    uploadData.append('timestamp', String(timestamp));
    uploadData.append('signature', signature);
    uploadData.append('folder', 'sonhangtravel');

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: uploadData });
    if (!res.ok) {
      const err = await res.text();
      console.error('Cloudinary error:', err);
      return NextResponse.json({ error: 'Upload failed', detail: err }, { status: 500 });
    }
    const result = await res.json();
    return NextResponse.json({ url: result.secure_url, publicId: result.public_id, width: result.width, height: result.height });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
