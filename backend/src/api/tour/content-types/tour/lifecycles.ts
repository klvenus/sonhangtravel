/**
 * Tour Lifecycle Hooks
 * Auto-revalidate frontend cache when tours are created/updated/deleted
 */

export default {
  async afterCreate(event) {
    await revalidateFrontend(event);
  },

  async afterUpdate(event) {
    await revalidateFrontend(event);
  },

  async afterDelete(event) {
    await revalidateFrontend(event);
  },
};

async function revalidateFrontend(event) {
  const { result } = event;

  const frontendUrl = process.env.CLIENT_URL || 'https://sonhangtravel.vercel.app';
  const revalidateSecret = process.env.REVALIDATE_SECRET;

  if (!revalidateSecret) {
    console.warn('REVALIDATE_SECRET not configured - skipping frontend revalidation');
    return;
  }

  const pathsToRevalidate = [
    '/', // Homepage
    '/tours', // Tours list page
  ];

  // Also revalidate specific tour page if we have slug
  if (result?.slug) {
    pathsToRevalidate.push(`/tour/${result.slug}`);
  }

  console.log(`Revalidating frontend paths: ${pathsToRevalidate.join(', ')}`);

  // Revalidate all paths in parallel
  const revalidatePromises = pathsToRevalidate.map(async (path) => {
    try {
      const url = `${frontendUrl}/api/revalidate?secret=${revalidateSecret}&path=${encodeURIComponent(path)}`;
      const response = await fetch(url, { method: 'GET' });

      if (response.ok) {
        console.log(`✓ Revalidated: ${path}`);
      } else {
        console.error(`✗ Failed to revalidate ${path}: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`✗ Error revalidating ${path}:`, error);
    }
  });

  await Promise.allSettled(revalidatePromises);
}
