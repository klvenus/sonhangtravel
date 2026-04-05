// Auto-revalidate Vercel ISR after data changes
export async function revalidateProduction(extraPaths: string[] = []) {
  const siteUrl = process.env.VERCEL_SITE_URL || 'https://sonhangtravel.com';
  const secret = process.env.REVALIDATE_SECRET;
  const paths = Array.from(new Set(['/', '/tours', ...extraPaths]));

  if (!secret) {
    console.warn('[revalidate] Skipped: missing REVALIDATE_SECRET');
    return;
  }

  // Fire and forget — don't block the response
  fetch(`${siteUrl}/api/revalidate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-revalidate-token': secret,
    },
    body: JSON.stringify({ paths }),
  })
    .catch(() => {/* ignore */})
    .then(() => {
      console.log(`[revalidate] Triggered ${paths.length} paths:`, paths.join(', '));
    });
}
