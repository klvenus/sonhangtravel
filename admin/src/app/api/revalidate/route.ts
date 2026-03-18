import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const paths = body.paths || ['/', '/tours'];
    const siteUrl = process.env.VERCEL_SITE_URL || 'https://sonhangtravel.com';
    const secret = process.env.REVALIDATE_SECRET;

    if (!secret) {
      return NextResponse.json({ error: 'Missing REVALIDATE_SECRET' }, { status: 500 });
    }

    const results = [];
    for (const path of paths) {
      try {
        const res = await fetch(`${siteUrl}/api/revalidate?secret=${secret}&path=${encodeURIComponent(path)}`);
        const data = await res.json().catch(() => ({ status: res.status }));
        results.push({ path, ok: res.ok, data });
      } catch (err) {
        results.push({ path, ok: false, error: String(err) });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
