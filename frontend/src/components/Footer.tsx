import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pb-20 md:pb-0">
      {/* Mobile Footer */}
      <div className="md:hidden">
        <div className="px-4 py-6 space-y-5">
          {/* Company Name */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-10 h-10 bg-[#00CBA9] rounded-xl flex items-center justify-center text-white font-bold text-sm">
                SH
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">CÔNG TY TNHH SƠN HẰNG TRAVEL</h3>
              </div>
            </div>
            <p className="text-gray-500 text-xs">SON HANG TRAVEL COMPANY LIMITED</p>
          </div>

          {/* Info */}
          <div className="space-y-2.5 text-sm">
            <div className="flex items-start gap-2.5">
              <span className="text-base shrink-0">🔖</span>
              <span>MST: <span className="text-white font-medium">5702215220</span></span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-base shrink-0">📍</span>
              <span>Khu 5 - Phường Móng Cái - Quảng Ninh</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-base shrink-0">📍</span>
              <span>VP Đại Diện: 01 Xuân Diệu - Trần Phú - Móng Cái - Quảng Ninh <span className="text-gray-500 text-xs">(cách cửa khẩu Quốc Tế Móng Cái 100m)</span></span>
            </div>
          </div>

          {/* Contact buttons */}
          <div className="grid grid-cols-2 gap-2">
            <a 
              href="tel:0986409633"
              className="flex items-center justify-center gap-2 bg-[#00CBA9] text-white py-3 rounded-xl font-medium text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Hotline 24/7
            </a>
            <a 
              href="https://zalo.me/0338239888"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-medium text-sm"
            >
              💬 Chat Zalo
            </a>
          </div>
          
          {/* Consultants */}
          <div className="bg-gray-800 rounded-xl p-4 space-y-2">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Chuyên viên tư vấn</p>
            <div className="flex gap-2">
              <a href="https://zalo.me/0338239888" target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-gray-700 hover:bg-gray-600 py-2 rounded-lg text-sm transition-colors">
                📱 0338 239 888
              </a>
              <a href="https://zalo.me/0388091993" target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-gray-700 hover:bg-gray-600 py-2 rounded-lg text-sm transition-colors">
                📱 0388 091 993
              </a>
            </div>
          </div>

          <p className="text-center text-gray-600 text-xs">
            © 2026 Sơn Hằng Travel. All rights reserved.
          </p>
        </div>
      </div>

      {/* Desktop Footer */}
      <div className="hidden md:block">
        <div className="container-custom py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Company Info - wider */}
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#00CBA9] rounded-xl flex items-center justify-center text-white font-bold">
                  SH
                </div>
                <div>
                  <h3 className="text-white font-bold">CÔNG TY TNHH SƠN HẰNG TRAVEL</h3>
                  <p className="text-gray-500 text-xs">SON HANG TRAVEL COMPANY LIMITED</p>
                </div>
              </div>
              
              <ul className="space-y-3 text-sm mt-5">
                <li className="flex items-start gap-3">
                  <span className="text-base shrink-0">🔖</span>
                  <span>MST: <span className="text-white font-medium">5702215220</span></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-base shrink-0">📍</span>
                  <span>Khu 5 - Phường Móng Cái - Quảng Ninh</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-base shrink-0">📍</span>
                  <span>VP Đại Diện: 01 Xuân Diệu - Trần Phú - Móng Cái - Quảng Ninh <span className="text-gray-500">(cách cửa khẩu Quốc Tế Móng Cái 100m)</span></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-base shrink-0">📧</span>
                  <a href="mailto:Lienhe@sonhangtravel.com" className="hover:text-[#00CBA9] transition-colors">Lienhe@sonhangtravel.com</a>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-base shrink-0">🌍</span>
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
                    ☎️ 0986 409 633
                  </a>
                </li>
                <li className="pt-2">
                  <p className="text-gray-500 text-xs mb-2">CHUYÊN VIÊN TƯ VẤN (HOTLINE/ZALO)</p>
                  <div className="space-y-2">
                    <a href="https://zalo.me/0338239888" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#00CBA9] transition-colors">
                      <span>1️⃣</span>
                      <span className="font-medium text-white">0338 239 888</span>
                    </a>
                    <a href="https://zalo.me/0388091993" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#00CBA9] transition-colors">
                      <span>2️⃣</span>
                      <span className="font-medium text-white">0388 091 993</span>
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Quick Links & Social */}
            <div className="lg:col-span-4">
              <h4 className="text-white font-semibold mb-4">Tour Du Lịch</h4>
              <ul className="space-y-2 text-sm mb-6">
                <li><Link href="/tours" className="hover:text-[#00CBA9] transition-colors">Tất cả tour</Link></li>
              </ul>

              <h4 className="text-white font-semibold mb-4">Kết Nối</h4>
              <div className="flex gap-3">
                {/* Facebook Page */}
                <a 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                  title="Facebook: Sơn Hằng Travel & Tour Đông Hưng Cọc 0Đ"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                {/* Zalo OA */}
                <a 
                  href="https://zalo.me/561113801789156735" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                  title="Zalo Official Account"
                >
                  <span className="text-sm font-bold">Z</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800">
          <div className="container-custom py-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
              <p>© 2026 CÔNG TY TNHH SƠN HẰNG TRAVEL. Tất cả quyền được bảo lưu.</p>
              <p>MST: 5702215220 • GP ĐKKD tại Móng Cái, Quảng Ninh</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
