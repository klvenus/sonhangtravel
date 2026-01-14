/**
 * tour service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::tour.tour', ({ strapi }) => ({
  async create(params) {
    // Set default values for integer fields to prevent PostgreSQL parsing errors
    if (params.data) {
      params.data.rating = params.data.rating ?? 5;
      params.data.reviewCount = params.data.reviewCount ?? 0;
      params.data.bookingCount = params.data.bookingCount ?? 0;
    }

    // Call the default core service
    const result = await super.create(params);
    return result;
  },
}));
