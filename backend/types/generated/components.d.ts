import type { Schema, Struct } from '@strapi/strapi';

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: 'Th\u00F4ng tin SEO cho trang';
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    keywords: Schema.Attribute.Text;
    metaDescription: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    metaImage: Schema.Attribute.Media<'images'>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
  };
}

export interface SiteBannerSlide extends Struct.ComponentSchema {
  collectionName: 'components_site_banner_slides';
  info: {
    description: 'Slide cho banner hero section';
    displayName: 'Banner Slide';
    icon: 'picture';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    linkText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Xem chi ti\u1EBFt'>;
    linkUrl: Schema.Attribute.String;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface TourDepartureDate extends Struct.ComponentSchema {
  collectionName: 'components_tour_departure_dates';
  info: {
    description: 'L\u1ECBch kh\u1EDFi h\u00E0nh tour';
    displayName: 'Ng\u00E0y kh\u1EDFi h\u00E0nh';
    icon: 'calendar-alt';
  };
  attributes: {
    availableSlots: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<20>;
    date: Schema.Attribute.Date & Schema.Attribute.Required;
    price: Schema.Attribute.Integer;
    status: Schema.Attribute.Enumeration<['available', 'almost_full', 'full']> &
      Schema.Attribute.DefaultTo<'available'>;
  };
}

export interface TourItineraryItem extends Struct.ComponentSchema {
  collectionName: 'components_tour_itinerary_items';
  info: {
    description: 'Chi ti\u1EBFt l\u1ECBch tr\u00ECnh t\u1EEBng ng\u00E0y';
    displayName: 'L\u1ECBch tr\u00ECnh';
    icon: 'calendar';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    time: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface TourListItem extends Struct.ComponentSchema {
  collectionName: 'components_tour_list_items';
  info: {
    description: 'M\u1ED9t m\u1EE5c trong danh s\u00E1ch (bao g\u1ED3m/kh\u00F4ng bao g\u1ED3m/l\u01B0u \u00FD)';
    displayName: 'M\u1EE5c danh s\u00E1ch';
    icon: 'check';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.seo': SharedSeo;
      'site.banner-slide': SiteBannerSlide;
      'tour.departure-date': TourDepartureDate;
      'tour.itinerary-item': TourItineraryItem;
      'tour.list-item': TourListItem;
    }
  }
}
