import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Sơn Hằng Travel - Tour Du Lịch Trung Quốc Uy Tín",
  description: "Chuyên tổ chức tour du lịch Trung Quốc: Đông Hưng, Nam Ninh, Thượng Hải, Quảng Châu, Bắc Kinh. Giá tốt, dịch vụ chất lượng, hỗ trợ 24/7.",
  keywords: "tour trung quoc, du lich trung quoc, tour dong hung, tour nam ninh, tour thuong hai, tour quang chau, tour bac kinh",
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

  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header logoUrl={logoUrl} siteName={siteName} phoneNumber={phoneNumber} zaloNumber={zaloNumber} />
        <div className="pb-16 md:pb-0">
          {children}
        </div>
        <Footer phoneNumber={phoneNumber} zaloNumber={zaloNumber} email={email} />
        <BottomNav />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
