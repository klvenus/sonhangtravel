import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <div className="pb-16 md:pb-0">
          {children}
        </div>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
