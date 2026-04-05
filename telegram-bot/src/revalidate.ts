// Revalidate Vercel ISR cache after data changes
export async function revalidateProduction(extraPaths: string[] = []) {
  const siteUrl = process.env.VERCEL_SITE_URL || 'https://sonhangtravel.com';
  const secret = process.env.REVALIDATE_SECRET;
  const paths = Array.from(new Set(['/', '/tours', ...extraPaths]));

  if (!secret) {
    console.log('[revalidate] Skipped: missing REVALIDATE_SECRET');
    return;
  }

  try {
    await fetch(`${siteUrl}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-token': secret,
      },
      body: JSON.stringify({ paths }),
    }).catch(() => {/* ignore */});
    console.log(`[revalidate] Triggered ${paths.length} paths:`, paths.join(', '));
  } catch {
    console.log('[revalidate] Failed silently');
  }
}
