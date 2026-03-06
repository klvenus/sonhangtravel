// Revalidate Vercel ISR cache after data changes
export async function revalidateProduction(extraPaths: string[] = []) {
  const siteUrl = process.env.VERCEL_SITE_URL || 'https://sonhangtravel.vercel.app';
  const secret = process.env.REVALIDATE_SECRET || 'sonhang-revalidate-2026';
  const paths = ['/', '/tours', ...extraPaths];

  try {
    const results = await Promise.allSettled(
      paths.map(path =>
        fetch(`${siteUrl}/api/revalidate?secret=${secret}&path=${encodeURIComponent(path)}`)
          .catch(() => {/* ignore */})
      )
    );
    console.log(`[revalidate] Triggered ${results.length} paths:`, paths.join(', '));
  } catch {
    console.log('[revalidate] Failed silently');
  }
}
