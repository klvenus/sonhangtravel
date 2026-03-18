// Auto-revalidate Vercel ISR after data changes
export async function revalidateProduction(extraPaths: string[] = []) {
  const siteUrl = process.env.VERCEL_SITE_URL || 'https://sonhangtravel.com';
  const secret = process.env.REVALIDATE_SECRET;
  const paths = ['/', '/tours', ...extraPaths];

  if (!secret) {
    console.warn('[revalidate] Skipped: missing REVALIDATE_SECRET');
    return;
  }

  // Fire and forget — don't block the response
  Promise.allSettled(
    paths.map(path =>
      fetch(`${siteUrl}/api/revalidate?secret=${secret}&path=${encodeURIComponent(path)}`)
        .catch(() => {/* ignore */})
    )
  ).then(results => {
    console.log(`[revalidate] Triggered ${results.length} paths:`, paths.join(', '));
  });
}
