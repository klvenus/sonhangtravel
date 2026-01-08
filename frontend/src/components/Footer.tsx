import Link from 'next/link'

interface FooterProps {
  phoneNumber?: string
  zaloNumber?: string
  email?: string
}

export default function Footer({ phoneNumber = '0123456789', zaloNumber, email = 'info@sonhangtravel.com' }: FooterProps) {
  const zaloLink = zaloNumber || phoneNumber
  
  return (
    <footer className="bg-gray-900 text-gray-300 pb-20 md:pb-0">
      {/* Newsletter - Desktop only */}
      <div className="hidden md:block bg-[#00CBA9]">
        <div className="container-custom py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-white text-center md:text-left">
              <h3 className="text-xl font-bold">Đăng ký nhận ưu đãi</h3>
              <p className="text-white/80 text-sm">Nhận thông tin tour mới và khuyến mãi hấp dẫn</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Email của bạn..."
                className="flex-1 md:w-64 px-4 py-3 rounded-l-lg text-gray-800 outline-none"
              />
              <button className="bg-gray-900 text-white px-6 py-3 rounded-r-lg font-medium hover:bg-gray-800 transition-colors">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Footer - Simple */}
      <div className="md:hidden">
        <div className="bg-[#00CBA9] px-4 py-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold">
              SH
            </div>
            <div className="text-white">
              <h3 className="font-bold">Sơn Hằng Travel</h3>
              <p className="text-white/80 text-xs">Tour Trung Quốc Uy Tín</p>
            </div>
          </div>
          
          {/* Contact buttons */}
          <div className="flex gap-2 mb-4">
            <a 
              href={`tel:${phoneNumber}`}
              className="flex-1 flex items-center justify-center gap-2 bg-white text-[#00CBA9] py-3 rounded-xl font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Gọi ngay
            </a>
            <a 
              href={`https://zalo.me/${zaloLink}`}
              className="flex-1 flex items-center justify-center gap-2 bg-white/20 text-white py-3 rounded-xl font-medium"
            >
              💬 Chat Zalo
            </a>
          </div>
          
          <p className="text-center text-white/60 text-xs">
            © 2026 Sơn Hằng Travel. All rights reserved.
          </p>
        </div>
      </div>

      {/* Desktop Footer - Full */}
      <div className="hidden md:block">
        <div className="container-custom py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-[#00CBA9] rounded-xl flex items-center justify-center text-white font-bold">
                  SH
                </div>
                <span className="text-xl font-bold text-white">Sơn Hằng Travel</span>
              </div>
              <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                Chuyên tổ chức tour du lịch Trung Quốc uy tín. Đồng hành cùng hàng nghìn du khách khám phá đất nước Trung Hoa.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#00CBA9] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#00CBA9] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-14.001 0-.21-.005-.423-.015-.634.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Tour Categories */}
            <div>
              <h4 className="text-white font-semibold mb-4">Tour Du Lịch</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/tours/dong-hung" className="hover:text-[#00CBA9] transition-colors">Tour Đông Hưng</Link></li>
                <li><Link href="/tours/nam-ninh" className="hover:text-[#00CBA9] transition-colors">Tour Nam Ninh</Link></li>
                <li><Link href="/tours/thuong-hai" className="hover:text-[#00CBA9] transition-colors">Tour Thượng Hải</Link></li>
                <li><Link href="/tours/quang-chau" className="hover:text-[#00CBA9] transition-colors">Tour Quảng Châu</Link></li>
                <li><Link href="/tours/bac-kinh" className="hover:text-[#00CBA9] transition-colors">Tour Bắc Kinh</Link></li>
                <li><Link href="/tours" className="text-[#00CBA9] font-medium">Xem tất cả →</Link></li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Thông Tin</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/ve-chung-toi" className="hover:text-[#00CBA9] transition-colors">Về chúng tôi</Link></li>
                <li><Link href="/blog" className="hover:text-[#00CBA9] transition-colors">Blog du lịch</Link></li>
                <li><Link href="/dieu-khoan" className="hover:text-[#00CBA9] transition-colors">Điều khoản sử dụng</Link></li>
                <li><Link href="/chinh-sach" className="hover:text-[#00CBA9] transition-colors">Chính sách bảo mật</Link></li>
                <li><Link href="/hoan-huy" className="hover:text-[#00CBA9] transition-colors">Chính sách hoàn hủy</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Liên Hệ</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#00CBA9] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${phoneNumber}`} className="hover:text-[#00CBA9] transition-colors font-medium">{phoneNumber}</a>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#00CBA9] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${email}`} className="hover:text-[#00CBA9] transition-colors">{email}</a>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#00CBA9] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>8:00 - 22:00 (Tất cả các ngày)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800">
          <div className="container-custom py-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
              <p>© 2026 Sơn Hằng Travel. Tất cả quyền được bảo lưu.</p>
              <p>Giấy phép ĐKKD: 0123456789 • GP Lữ hành quốc tế: XXXX</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
