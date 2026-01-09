import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { getSiteSettings, getImageUrl } from "@/lib/strapi";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SEO Metadata
export const metadata: Metadata = {
  metadataBase: new URL('https://sonhangtravel.vercel.app'),
  title: {
    default: "Sơn Hằng Travel - Tour Du Lịch Trung Quốc Giá Rẻ Uy Tín 2026",
    template: "%s | Sơn Hằng Travel"
  },
  description: "🌏 Chuyên tour du lịch Trung Quốc từ Móng Cái: Đông Hưng 1-2 ngày, Nam Ninh, Quế Lâm, Trương Gia Giới, Phượng Hoàng Cổ Trấn. ✅ Giá tốt nhất ✅ Visa nhanh ✅ Hỗ trợ 24/7",
  keywords: [
    "tour trung quốc",
    "du lịch trung quốc", 
    "tour đông hưng",
    "tour nam ninh",
    "tour quế lâm",
    "tour trương gia giới",
    "tour phượng hoàng cổ trấn",
    "tour trung quốc giá rẻ",
    "tour trung quốc từ móng cái",
    "du lịch đông hưng 1 ngày",
    "tour trung quốc 2026",
    "sơn hằng travel"
  ],
  authors: [{ name: "Sơn Hằng Travel" }],
  creator: "Sơn Hằng Travel",
  publisher: "Sơn Hằng Travel",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://sonhangtravel.vercel.app",
    siteName: "Sơn Hằng Travel",
    title: "Sơn Hằng Travel - Tour Du Lịch Trung Quốc Giá Rẻ Uy Tín",
    description: "Chuyên tour du lịch Trung Quốc từ Móng Cái: Đông Hưng, Nam Ninh, Quế Lâm, Trương Gia Giới. Giá tốt nhất, visa nhanh, hỗ trợ 24/7.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sơn Hằng Travel - Tour Trung Quốc"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Sơn Hằng Travel - Tour Du Lịch Trung Quốc",
    description: "Tour du lịch Trung Quốc giá rẻ từ Móng Cái. Đông Hưng, Nam Ninh, Quế Lâm, Trương Gia Giới.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: "https://sonhangtravel.vercel.app",
  },
  category: "travel",
};

// Viewport config
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#00CBA9',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch site settings for Header and Footer
  const siteSettings = await getSiteSettings();
  const logoUrl = siteSettings?.logo ? getImageUrl(siteSettings.logo) : undefined;
  const siteName = siteSettings?.siteName || 'Sơn Hằng Travel';
  const phoneNumber = siteSettings?.phoneNumber || '0123456789';
  const zaloNumber = siteSettings?.zaloNumber || undefined;
  const email = siteSettings?.email || 'info@sonhangtravel.com';

  // JSON-LD Structured Data for SEO
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": siteName,
    "description": "Chuyên tour du lịch Trung Quốc từ Móng Cái: Đông Hưng, Nam Ninh, Quế Lâm, Trương Gia Giới",
    "url": "https://sonhangtravel.vercel.app",
    "logo": logoUrl || "https://sonhangtravel.vercel.app/logo.png",
    "telephone": phoneNumber,
    "email": email,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Móng Cái",
      "addressRegion": "Quảng Ninh",
      "addressCountry": "VN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "21.5267",
      "longitude": "107.9650"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "07:00",
      "closes": "22:00"
    },
    "sameAs": [
      `https://zalo.me/${zaloNumber || phoneNumber}`,
      "https://facebook.com/sonhangtravel"
    ],
    "priceRange": "$$",
    "areaServed": {
      "@type": "Country",
      "name": "China"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    "url": "https://sonhangtravel.vercel.app",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://sonhangtravel.vercel.app/tours?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="vi">
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-[#00CBA9] focus:text-white focus:rounded-lg focus:shadow-lg"
        >
          Bỏ qua đến nội dung chính
        </a>
        <Header logoUrl={logoUrl} siteName={siteName} phoneNumber={phoneNumber} zaloNumber={zaloNumber} />
        <main id="main-content" className="pb-16 md:pb-0">
          {children}
        </main>
        <Footer phoneNumber={phoneNumber} zaloNumber={zaloNumber} email={email} />
        <BottomNav phoneNumber={phoneNumber} zaloNumber={zaloNumber} />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
