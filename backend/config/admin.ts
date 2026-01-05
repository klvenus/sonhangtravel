export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  preview: {
    enabled: true,
    config: {
      allowedOrigins: ['http://localhost:3000'],
      async handler(uid, { documentId, locale, status }) {
        // Add preview=true for draft content
        const previewParam = status === 'draft' ? '?preview=true' : '';
        
        // Tour preview
        if (uid === 'api::tour.tour') {
          // Fetch the tour to get slug
          const tour = await strapi.documents(uid).findOne({
            documentId,
            fields: ['slug'],
          });
          if (tour?.slug) {
            return `http://localhost:3000/tour/${tour.slug}${previewParam}`;
          }
        }
        // Category preview
        if (uid === 'api::category.category') {
          const category = await strapi.documents(uid).findOne({
            documentId,
            fields: ['slug'],
          });
          if (category?.slug) {
            return `http://localhost:3000/tours/${category.slug}${previewParam}`;
          }
        }
        return null;
      },
    },
  },
});
