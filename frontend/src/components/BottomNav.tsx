'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getCategories, getImageUrl } from '@/lib/strapi'
import type { Category } from '@/lib/strapi'

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
      {/* Bottom Nav Bar - iOS Style */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        {/* Glass container */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.72)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderTop: '0.5px solid rgba(0, 0, 0, 0.1)'
        }}>
          <div className="flex items-center justify-around h-[50px] pb-safe">
            {/* Home */}
            <Link
              href="/"
              className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all active:opacity-50 ${
                pathname === '/' ? 'text-[#00CBA9]' : 'text-gray-400'
              }`}
            >
              <img 
                src="/icons/home.png"
                alt="Home"
                className={`w-6 h-6 ${pathname === '/' ? '' : 'opacity-60'}`}
              />
              <span className="text-[10px] font-medium">Trang chủ</span>
            </Link>

            {/* Tours */}
            <button
              onClick={() => { setShowCategories(true); setShowMenu(false); }}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all active:opacity-50 ${
                pathname.startsWith('/tours') || pathname.startsWith('/tour') ? 'text-[#00CBA9]' : 'text-gray-400'
              }`}
            >
              <img 
                src="/icons/tour.png"
                alt="Tour"
                className={`w-6 h-6 ${pathname.startsWith('/tours') || pathname.startsWith('/tour') ? '' : 'opacity-60'}`}
              />
              <span className="text-[10px] font-medium">Tour</span>
            </button>

            {/* Hotline - Center */}
            <a
              href={`tel:${phoneNumber}`}
              className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 active:opacity-50 transition-all"
            >
              <div className="w-11 h-11 -mt-5 rounded-full flex items-center justify-center" style={{
                background: 'linear-gradient(180deg, #00D4B1 0%, #00A88A 100%)',
                boxShadow: '0 4px 12px rgba(0, 168, 138, 0.4)'
              }}>
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd"/>
                </svg>
              </div>
              <span className="text-[10px] font-semibold text-[#00CBA9] -mt-0.5">Hotline</span>
            </a>

            {/* Zalo */}
            <a
              href={`https://zalo.me/${zaloLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 text-gray-400 transition-all active:opacity-50"
            >
              <img 
                src="/icons/zalo.png"
                alt="Zalo"
                className="w-6 h-6 opacity-60"
              />
              <span className="text-[10px] font-medium">Zalo</span>
            </a>

            {/* Menu */}
            <button
              onClick={() => { setShowMenu(true); setShowCategories(false); }}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all active:opacity-50 ${
                showMenu ? 'text-[#00CBA9]' : 'text-gray-400'
              }`}
            >
              <img 
                src="/icons/menu.png"
                alt="Menu"
                className={`w-6 h-6 ${showMenu ? '' : 'opacity-60'}`}
              />
              <span className="text-[10px] font-medium">Menu</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Categories Drawer - Modern Glass Style */}
      {showCategories && (
        <>
          <div 
            className="md:hidden fixed inset-0 z-50"
            style={{
              background: 'rgba(0,0,0,0.25)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
            }}
            onClick={() => setShowCategories(false)}
          />
          <div 
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 max-h-[70vh] overflow-y-auto pb-safe animate-slide-up"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.98) 100%)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              borderRadius: '24px 24px 0 0',
              boxShadow: '0 -10px 50px rgba(0,0,0,0.1)'
            }}
          >
            {/* iOS-style handle bar */}
            <div className="sticky top-0 pt-2 pb-3 px-5" style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)'
            }}>
              <div className="w-9 h-1 bg-gray-300/80 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between">
                <h3 className="text-[17px] font-semibold text-gray-900">Tour du lịch</h3>
                <button 
                  onClick={() => setShowCategories(false)} 
                  className="w-7 h-7 bg-gray-100/80 rounded-full flex items-center justify-center active:bg-gray-200"
                >
                  <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="px-4 pb-6 space-y-3">
              {/* All Tours */}
              <Link
                href="/tours"
                onClick={() => setShowCategories(false)}
                className="flex items-center gap-3 p-3 rounded-2xl active:bg-gray-100/80 transition-colors"
                style={{ background: 'rgba(0, 203, 169, 0.08)' }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center overflow-hidden" style={{
                  background: 'linear-gradient(135deg, #00CBA9 0%, #00A88A 100%)'
                }}>
                  <Image 
                    src="/icons/travel.png" 
                    alt="Travel"
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-[15px] font-semibold text-gray-900">Tất cả Tour</p>
                  <p className="text-[12px] text-gray-500">Xem toàn bộ tour</p>
                </div>
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>

              {/* Category Grid - iOS App Grid style */}
              <div className="grid grid-cols-4 gap-3">
                {categories.map((cat) => {
                  const categoryImage = cat.image ? getImageUrl(cat.image, 'thumbnail') : null;
                  
                  return (
                    <Link
                      key={cat.id}
                      href={`/tours?category=${cat.slug}`}
                      onClick={() => setShowCategories(false)}
                      className="flex flex-col items-center gap-2 py-2 rounded-xl active:bg-gray-100/60 transition-all"
                    >
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-sm border border-gray-100">
                        {categoryImage ? (
                          <Image 
                            src={categoryImage}
                            alt={cat.ten || cat.name || 'Category'}
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl">{cat.icon || '🏯'}</span>
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-gray-700 text-center leading-tight line-clamp-2 px-1">
                        {cat.ten || cat.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Menu Drawer - iOS Settings Style */}
      {showMenu && (
        <>
          <div 
            className="md:hidden fixed inset-0 z-50"
            style={{
              background: 'rgba(0,0,0,0.25)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
            }}
            onClick={() => setShowMenu(false)}
          />
          <div 
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 max-h-[75vh] overflow-y-auto pb-safe animate-slide-up"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.98) 100%)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              borderRadius: '24px 24px 0 0',
              boxShadow: '0 -10px 50px rgba(0,0,0,0.1)'
            }}
          >
            {/* iOS-style handle bar */}
            <div className="sticky top-0 pt-2 pb-3 px-5" style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)'
            }}>
              <div className="w-9 h-1 bg-gray-300/80 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between">
                <h3 className="text-[17px] font-semibold text-gray-900">Sơn Hằng Travel</h3>
                <button 
                  onClick={() => setShowMenu(false)} 
                  className="w-7 h-7 bg-gray-100/80 rounded-full flex items-center justify-center active:bg-gray-200"
                >
                  <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="px-4 pb-6">
              {/* Quick Actions - iOS style */}
              <div className="flex gap-2 mb-5">
                <a
                  href={`tel:${phoneNumber}`}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl active:opacity-80 transition-opacity"
                  style={{ background: 'linear-gradient(135deg, #00CBA9 0%, #00A88A 100%)' }}
                >
                  <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <span className="text-[13px] font-semibold text-white">Gọi ngay</span>
                </a>
                <a
                  href={`https://zalo.me/${zaloLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl active:opacity-80 transition-opacity"
                  style={{ background: 'linear-gradient(135deg, #0068FF 0%, #0052CC 100%)' }}
                >
                  <svg className="w-4.5 h-4.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.49 10.272v-.45h1.347v6.322h-.77a.576.576 0 01-.577-.573v-.052a2.634 2.634 0 01-1.685.625 2.869 2.869 0 01-2.903-2.99 2.873 2.873 0 012.903-3.006 2.634 2.634 0 011.685.623zm-1.453 4.656a1.69 1.69 0 001.453-.751v-2.462a1.69 1.69 0 00-1.453-.75 1.846 1.846 0 00-1.818 1.99 1.842 1.842 0 001.818 1.973zM4 12a8 8 0 1116 0 8 8 0 01-16 0zm8-10C5.373 2 0 7.373 0 14s5.373 12 12 12 12-5.373 12-12S18.627 2 12 2z"/>
                  </svg>
                  <span className="text-[13px] font-semibold text-white">Chat Zalo</span>
                </a>
              </div>

              {/* iOS Settings-style grouped list */}
              <div className="bg-gray-100/60 rounded-2xl overflow-hidden mb-4">
                <Link
                  href="/"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 bg-white/60 active:bg-gray-50 border-b border-gray-100/80"
                >
                  <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                    </svg>
                  </div>
                  <span className="flex-1 text-[15px] text-gray-900">Trang chủ</span>
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
                
                <Link
                  href="/tours"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 bg-white/60 active:bg-gray-50 border-b border-gray-100/80"
                >
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3" />
                    </svg>
                  </div>
                  <span className="flex-1 text-[15px] text-gray-900">Tour du lịch</span>
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
                
                <Link
                  href="/uu-dai"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 bg-white/60 active:bg-gray-50"
                >
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                    </svg>
                  </div>
                  <span className="flex-1 text-[15px] text-gray-900">Ưu đãi</span>
                  <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded mr-1">HOT</span>
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </div>

              {/* Second group */}
              <div className="bg-gray-100/60 rounded-2xl overflow-hidden">
                <Link
                  href="/ve-chung-toi"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 bg-white/60 active:bg-gray-50 border-b border-gray-100/80"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                  </div>
                  <span className="flex-1 text-[15px] text-gray-900">Về chúng tôi</span>
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
                
                <Link
                  href="/blog"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 bg-white/60 active:bg-gray-50 border-b border-gray-100/80"
                >
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M6 7.5h3v3H6v-3z" />
                    </svg>
                  </div>
                  <span className="flex-1 text-[15px] text-gray-900">Blog du lịch</span>
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
                
                <Link
                  href="/lien-he"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 bg-white/60 active:bg-gray-50"
                >
                  <div className="w-8 h-8 bg-[#00CBA9] rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <span className="flex-1 text-[15px] text-gray-900">Liên hệ</span>
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
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
            opacity: 0.5;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.35s cubic-bezier(0.32, 0.72, 0, 1);
        }
      `}</style>
    </>
  )
}
