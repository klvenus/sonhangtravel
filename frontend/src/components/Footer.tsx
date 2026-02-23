import Link from 'next/link'
import Image from 'next/image'

interface FooterProps {
  logoUrl?: string
}

export default function Footer({ logoUrl }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-gray-300 pb-20 md:pb-0">
      {/* Mobile Footer */}
      <div className="md:hidden">
        <div className="px-4 py-6 space-y-4">
          {/* Company Name + Logo */}
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <Image src={logoUrl} alt="Son Hang Travel" width={48} height={48} className="w-12 h-12 object-contain rounded-xl" />
            ) : (
              <div className="w-12 h-12 bg-[#00CBA9] rounded-xl flex items-center justify-center text-white font-bold shrink-0">
                SH
              </div>
            )}
            <div>
              <h3 className="font-bold text-white text-sm leading-tight">CÔNG TY TNHH SƠN HẰNG TRAVEL</h3>
              <p className="text-gray-500 text-[11px]">SON HANG TRAVEL COMPANY LIMITED</p>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-2 text-[13px] text-gray-400">
            <p>MST: <span className="text-gray-200 font-medium">5702215220</span></p>
            <p>📍 Khu 5 - Phường Móng Cái - Quảng Ninh</p>
            <p>📍 VP: 01 Xuân Diệu - Trần Phú - Móng Cái - Quảng Ninh</p>
            <p className="text-gray-500 text-xs pl-5">(cách cửa khẩu Quốc Tế Móng Cái 100m)</p>
          </div>

          {/* Hotline */}
          <a
            href="tel:0986409633"
            className="flex items-center justify-center gap-2 bg-[#00CBA9] text-white py-3 rounded-xl font-bold text-base w-full"
          >
            HOTLINE 24/7: 0986 409 633
          </a>

          {/* Consultants */}
          <div className="grid grid-cols-2 gap-2">
            <a href="https://zalo.me/0338239888" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 bg-gray-800 text-gray-200 py-2.5 rounded-xl text-sm">
              0338 239 888
            </a>
            <a href="https://zalo.me/0388091993" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 bg-gray-800 text-gray-200 py-2.5 rounded-xl text-sm">
              0388 091 993
            </a>
          </div>

          {/* Social + Email */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-2">
              <a href="https://zalo.me/561113801789156735" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors text-xs font-bold">
                Z
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
            <a href="mailto:Lienhe@sonhangtravel.com" className="text-xs text-gray-500 hover:text-[#00CBA9]">
              Lienhe@sonhangtravel.com
            </a>
          </div>

          {/* Copyright */}
          <p className="text-center text-gray-600 text-[11px] pt-1">
            &copy; 2026 Sơn Hằng Travel. All rights reserved.
          </p>
        </div>
      </div>

      {/* Desktop Footer */}
      <div className="hidden md:block">
        <div className="container-custom py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3 mb-5">
                {logoUrl ? (
                  <Image src={logoUrl} alt="Son Hang Travel" width={56} height={56} className="w-14 h-14 object-contain rounded-xl" />
                ) : (
                  <div className="w-14 h-14 bg-[#00CBA9] rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0">
                    SH
                  </div>
                )}
                <div>
                  <h3 className="text-white font-bold">CÔNG TY TNHH SƠN HẰNG TRAVEL</h3>
                  <p className="text-gray-500 text-xs">SON HANG TRAVEL COMPANY LIMITED</p>
                </div>
              </div>

              <ul className="space-y-2.5 text-sm">
                <li className="flex items-start gap-2.5">
                  <span className="shrink-0 text-[#00CBA9]">MST:</span>
                  <span className="text-white font-medium">5702215220</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-[#00CBA9] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span>Khu 5 - Phường Móng Cái - Quảng Ninh</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-[#00CBA9] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span>VP Đại Diện: 01 Xuân Diệu - Trần Phú - Móng Cái - Quảng Ninh <span className="text-gray-500">(cách cửa khẩu Quốc Tế Móng Cái 100m)</span></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-[#00CBA9] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <a href="mailto:Lienhe@sonhangtravel.com" className="hover:text-[#00CBA9] transition-colors">Lienhe@sonhangtravel.com</a>
                </li>
                <li className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-[#00CBA9] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                  <a href="https://sonhangtravel.com" className="hover:text-[#00CBA9] transition-colors">sonhangtravel.com</a>
                </li>
              </ul>
            </div>

            {/* Hotline & Consultants */}
            <div className="lg:col-span-3">
              <h4 className="text-white font-semibold mb-4">Liên Hệ</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <p className="text-gray-500 text-xs mb-1">HOTLINE 24/7</p>
                  <a href="tel:0986409633" className="text-[#00CBA9] font-bold text-lg hover:text-[#00E6C0] transition-colors">
                    0986 409 633
                  </a>
                </li>
                <li className="pt-2">
                  <p className="text-gray-500 text-xs mb-2">CHUYÊN VIÊN TƯ VẤN (HOTLINE/ZALO)</p>
                  <div className="space-y-2">
                    <a href="https://zalo.me/0338239888" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#00CBA9] transition-colors">
                      <span className="font-medium text-white">0338 239 888</span>
                    </a>
                    <a href="https://zalo.me/0388091993" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#00CBA9] transition-colors">
                      <span className="font-medium text-white">0388 091 993</span>
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Links & Social */}
            <div className="lg:col-span-4">
              <h4 className="text-white font-semibold mb-4">Tour Du Lịch</h4>
              <ul className="space-y-2 text-sm mb-6">
                <li>
                  <Link href="/tours" className="hover:text-[#00CBA9] transition-colors">Tất cả tour</Link>
                </li>
              </ul>

              <h4 className="text-white font-semibold mb-4">Kết Nối</h4>
              <div className="flex gap-3">
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors" title="Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="https://zalo.me/561113801789156735" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors" title="Zalo OA">
                  <span className="text-sm font-bold">Z</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800">
          <div className="container-custom py-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-gray-500">
              <p>&copy; 2026 CÔNG TY TNHH SƠN HẰNG TRAVEL. Tất cả quyền được bảo lưu.</p>
              <p>MST: 5702215220</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
