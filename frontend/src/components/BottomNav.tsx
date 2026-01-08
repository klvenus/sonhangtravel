'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getCategories } from '@/lib/strapi'

interface Category {
  id: number
  name?: string
  ten?: string
  slug: string
  icon?: string
}

interface BottomNavProps {
  phoneNumber?: string
  zaloNumber?: string
}

export default function BottomNav({ phoneNumber = '0123456789', zaloNumber }: BottomNavProps) {
  const pathname = usePathname()
  const [showCategories, setShowCategories] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  const zaloLink = zaloNumber || phoneNumber

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories()
        setCategories(data || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  // Close modals when clicking outside or navigating
  useEffect(() => {
    setShowCategories(false)
    setShowMenu(false)
  }, [pathname])

  return (
    <>
      {/* Bottom Nav Bar - Compact Modern Style */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe">
        <div className="mx-2 mb-1.5 bg-white/95 backdrop-blur-xl rounded-full shadow-lg border border-gray-100/80">
          <div className="flex items-center justify-around h-14 px-1">
            {/* Home */}
            <Link
              href="/"
              className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all ${
                pathname === '/' ? 'text-[#00CBA9]' : 'text-gray-400'
              }`}
            >
              <svg className="w-[22px] h-[22px]" fill={pathname === '/' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={pathname === '/' ? 0 : 1.5}>
                {pathname === '/' ? (
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                )}
              </svg>
              <span className="text-[9px] font-medium">Trang chủ</span>
            </Link>

            {/* Tours/Categories */}
            <button
              onClick={() => { setShowCategories(true); setShowMenu(false); }}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all ${
                showCategories || pathname.startsWith('/tours') ? 'text-[#00CBA9]' : 'text-gray-400'
              }`}
            >
              <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
              <span className="text-[9px] font-medium">Tour</span>
            </button>

            {/* Hotline - Center CTA */}
            <a
              href={`tel:${phoneNumber}`}
              className="flex flex-col items-center justify-center flex-1 h-full -mt-4"
            >
              <div className="w-12 h-12 bg-linear-to-br from-[#00CBA9] to-[#00A88A] rounded-full flex items-center justify-center shadow-md shadow-[#00CBA9]/25">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </div>
              <span className="text-[9px] font-bold text-[#00CBA9] mt-0.5">Hotline</span>
            </a>

            {/* Zalo */}
            <a
              href={`https://zalo.me/${zaloLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 text-gray-400"
            >
              <svg className="w-[22px] h-[22px]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.49 10.272v-.45h1.347v6.322h-.77a.576.576 0 01-.577-.573v-.052a2.634 2.634 0 01-1.685.625 2.869 2.869 0 01-2.903-2.99 2.873 2.873 0 012.903-3.006 2.634 2.634 0 011.685.623zm-1.453 4.656a1.69 1.69 0 001.453-.751v-2.462a1.69 1.69 0 00-1.453-.75 1.846 1.846 0 00-1.818 1.99 1.842 1.842 0 001.818 1.973zM4 12a8 8 0 1116 0 8 8 0 01-16 0zm8-10C5.373 2 0 7.373 0 14s5.373 12 12 12 12-5.373 12-12S18.627 2 12 2z"/>
              </svg>
              <span className="text-[9px] font-medium">Zalo</span>
            </a>

            {/* Menu */}
            <button
              onClick={() => { setShowMenu(true); setShowCategories(false); }}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all ${
                showMenu ? 'text-[#00CBA9]' : 'text-gray-400'
              }`}
            >
              <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              <span className="text-[9px] font-medium">Menu</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Categories Drawer - Modern Glass Style */}
      {showCategories && (
        <>
          <div 
            className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={() => setShowCategories(false)}
          />
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl rounded-t-[28px] z-50 max-h-[75vh] overflow-y-auto pb-safe shadow-2xl animate-slide-up">
            {/* Handle bar */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-xl pt-3 pb-4 px-5 border-b border-gray-100/50">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Khám phá Tour</h3>
                  <p className="text-xs text-gray-500">Chọn loại tour bạn muốn</p>
                </div>
                <button 
                  onClick={() => setShowCategories(false)} 
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-2">
              {/* All Tours - Featured */}
              <Link
                href="/tours"
                onClick={() => setShowCategories(false)}
                className="flex items-center gap-4 p-4 bg-linear-to-r from-[#00CBA9]/10 via-[#00CBA9]/5 to-transparent rounded-2xl border border-[#00CBA9]/20"
              >
                <div className="w-12 h-12 bg-linear-to-br from-[#00CBA9] to-[#00A88A] rounded-2xl flex items-center justify-center shadow-lg shadow-[#00CBA9]/20">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.919 17.919 0 01-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Tất cả Tour</p>
                  <p className="text-xs text-gray-500">Xem toàn bộ tour du lịch</p>
                </div>
                <div className="w-8 h-8 bg-[#00CBA9]/10 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#00CBA9]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </Link>

              {/* Category Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/tours?category=${cat.slug}`}
                    onClick={() => setShowCategories(false)}
                    className="flex flex-col items-center gap-2 p-4 bg-gray-50/80 hover:bg-gray-100/80 rounded-2xl transition-all active:scale-95"
                  >
                    <span className="text-2xl">{cat.icon || '🏯'}</span>
                    <span className="text-sm font-medium text-gray-700 text-center">{cat.ten || cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Menu Drawer - Modern Glass Style */}
      {showMenu && (
        <>
          <div 
            className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={() => setShowMenu(false)}
          />
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl rounded-t-[28px] z-50 max-h-[80vh] overflow-y-auto pb-safe shadow-2xl animate-slide-up">
            {/* Handle bar */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-xl pt-3 pb-4 px-5 border-b border-gray-100/50">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Sơn Hằng Travel</h3>
                  <p className="text-xs text-gray-500">Chuyên tour Trung Quốc</p>
                </div>
                <button 
                  onClick={() => setShowMenu(false)} 
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Quick Contact Cards */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${phoneNumber}`}
                  className="flex flex-col items-center gap-2 p-4 bg-linear-to-br from-[#00CBA9] to-[#00A88A] rounded-2xl shadow-lg shadow-[#00CBA9]/20"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-white">Gọi ngay</span>
                </a>
                <a
                  href={`https://zalo.me/${zaloLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-4 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg shadow-blue-500/20"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.49 10.272v-.45h1.347v6.322h-.77a.576.576 0 01-.577-.573v-.052a2.634 2.634 0 01-1.685.625 2.869 2.869 0 01-2.903-2.99 2.873 2.873 0 012.903-3.006 2.634 2.634 0 011.685.623zm-1.453 4.656a1.69 1.69 0 001.453-.751v-2.462a1.69 1.69 0 00-1.453-.75 1.846 1.846 0 00-1.818 1.99 1.842 1.842 0 001.818 1.973zM4 12a8 8 0 1116 0 8 8 0 01-16 0zm8-10C5.373 2 0 7.373 0 14s5.373 12 12 12 12-5.373 12-12S18.627 2 12 2z"/>
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-white">Chat Zalo</span>
                </a>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">Điều hướng</p>
                
                <Link
                  href="/"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-4 p-3 hover:bg-gray-50/80 rounded-xl transition-all active:scale-[0.98]"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-700">Trang chủ</span>
                </Link>

                <Link
                  href="/tours"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-4 p-3 hover:bg-gray-50/80 rounded-xl transition-all active:scale-[0.98]"
                >
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.919 17.919 0 01-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-700">Tất cả Tour</span>
                </Link>

                <Link
                  href="/uu-dai"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-4 p-3 hover:bg-gray-50/80 rounded-xl transition-all active:scale-[0.98]"
                >
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                    </svg>
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <span className="font-medium text-gray-700">Ưu đãi Hot</span>
                    <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">HOT</span>
                  </div>
                </Link>
              </div>

              {/* Info Links */}
              <div className="space-y-1 pt-2 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2 mt-3">Thông tin</p>
                
                <Link
                  href="/ve-chung-toi"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-4 p-3 hover:bg-gray-50/80 rounded-xl transition-all active:scale-[0.98]"
                >
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-700">Về chúng tôi</span>
                </Link>

                <Link
                  href="/blog"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-4 p-3 hover:bg-gray-50/80 rounded-xl transition-all active:scale-[0.98]"
                >
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-700">Blog du lịch</span>
                </Link>

                <Link
                  href="/lien-he"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-4 p-3 hover:bg-gray-50/80 rounded-xl transition-all active:scale-[0.98]"
                >
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-700">Liên hệ</span>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
