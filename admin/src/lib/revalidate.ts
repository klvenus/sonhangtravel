// Auto-revalidate Vercel ISR after data changes
export async function revalidateProduction(
  extraPaths: string[] = [],
  options: { basePaths?: string[] } = {}
) {
  const siteUrl = process.env.VERCEL_SITE_URL || 'https://sonhangtravel.com';
  const secret = process.env.REVALIDATE_SECRET;
  const basePaths = options.basePaths ?? ['/', '/tours'];
  const paths = Array.from(new Set([...basePaths, ...extraPaths]));

  if (!secret) {
    console.warn('[revalidate] Skipped: missing REVALIDATE_SECRET');
    return { ok: false, status: 0, error: 'Missing REVALIDATE_SECRET', paths };
  }

  try {
    const response = await fetch(`${siteUrl}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-token': secret,
      },
      body: JSON.stringify({ paths }),
    });

    const body = await response.text().catch(() => '');

    if (!response.ok) {
      console.error(`[revalidate] Failed ${response.status}: ${body}`);
      return { ok: false, status: response.status, error: body, paths };
    }

    console.log(`[revalidate] Triggered ${paths.length} paths:`, paths.join(', '));
    return { ok: true, status: response.status, body, paths };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[revalidate] Request failed:', message);
    return { ok: false, status: 0, error: message, paths };
  }
}
