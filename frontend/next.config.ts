import type { NextConfig } from "next";

const legacyRedirects: NonNullable<NextConfig['redirects']> = async () => [
  {
    source: '/contact/:path*',
    destination: '/lien-he',
    permanent: true,
  },
  {
    source: '/sitemap_index.xml',
    destination: '/sitemap.xml',
    permanent: true,
  },
  {
    source: '/author-sitemap.xml',
    destination: '/sitemap.xml',
    permanent: true,
  },
  {
    source: '/post_tag-sitemap.xml',
    destination: '/sitemap.xml',
    permanent: true,
  },
  {
    source: '/category-sitemap.xml',
    destination: '/sitemap.xml',
    permanent: true,
  },
  {
    source: '/st_order-sitemap.xml',
    destination: '/sitemap.xml',
    permanent: true,
  },
  {
    source: '/location-sitemap.xml',
    destination: '/sitemap.xml',
    permanent: true,
  },
  {
    source: '/st_tours-sitemap.xml',
    destination: '/sitemap.xml',
    permanent: true,
  },
  {
    source: '/page-sitemap.xml',
    destination: '/sitemap.xml',
    permanent: true,
  },
  {
    source: '/post-sitemap.xml',
    destination: '/sitemap.xml',
    permanent: true,
  },
  {
    source: '/category/:slug',
    destination: '/tours?category=:slug',
    permanent: true,
  },
  {
    source: '/diadiem/:slug',
    destination: '/tours?category=:slug',
    permanent: true,
  },
  {
    source: '/tag/chua-quan-am',
    destination: '/blog/kinh-nghiem-di-dong-hung-1-ngay-tu-mong-cai',
    permanent: true,
  },
  {
    source: '/cam-nang-kham-pha-dong-hung-trung-quoc-1-ngay-an-gi-choi-gi-mua-sam-gi-cap-nhat-2025',
    destination: '/blog/kinh-nghiem-di-dong-hung-1-ngay-tu-mong-cai',
    permanent: true,
  },
  {
    source: '/chua-quan-am-dong-hung-trung-quoc',
    destination: '/blog/kinh-nghiem-di-dong-hung-1-ngay-tu-mong-cai',
    permanent: true,
  },
  {
    source: '/bai-bien-van-vi-dong-hung-trung-quoc',
    destination: '/blog/kinh-nghiem-di-dong-hung-1-ngay-tu-mong-cai',
    permanent: true,
  },
]

const nextConfig: NextConfig = {
  redirects: legacyRedirects,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '1337',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '1337',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'sonhangtravel.onrender.com',
      },
    ],
  },
  // Optimize for production
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
