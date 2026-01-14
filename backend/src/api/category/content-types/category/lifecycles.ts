/**
 * Category Lifecycle Hooks
 * Auto-revalidate frontend cache when categories are created/updated/deleted
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
  const frontendUrl = process.env.CLIENT_URL || 'https://sonhangtravel.vercel.app';
  const revalidateSecret = process.env.REVALIDATE_SECRET;

  if (!revalidateSecret) {
    console.warn('REVALIDATE_SECRET not configured - skipping frontend revalidation');
    return;
  }

  const pathsToRevalidate = [
    '/', // Homepage (shows categories)
    '/tours', // Tours list page (filters by category)
  ];

  console.log(`Revalidating frontend paths after category change: ${pathsToRevalidate.join(', ')}`);

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
