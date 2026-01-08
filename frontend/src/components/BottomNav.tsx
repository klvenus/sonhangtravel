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
      {/* Bottom Nav Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-safe">
        <div className="flex items-center justify-around h-16">
          {/* Home */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center w-full h-full gap-0.5 transition-colors ${
              pathname === '/' ? 'text-[#00CBA9]' : 'text-gray-500'
            }`}
          >
            {pathname === '/' ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            )}
            <span className="text-[10px] font-medium">Trang chủ</span>
          </Link>

          {/* Categories */}
          <button
            onClick={() => { setShowCategories(true); setShowMenu(false); }}
            className={`flex flex-col items-center justify-center w-full h-full gap-0.5 transition-colors ${
              showCategories || pathname.startsWith('/tours') ? 'text-[#00CBA9]' : 'text-gray-500'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="text-[10px] font-medium">Danh mục</span>
          </button>

          {/* Hotline - CTA */}
          <a
            href={`tel:${phoneNumber}`}
            className="flex flex-col items-center justify-center w-full h-full gap-0.5 -mt-5"
          >
            <div className="w-14 h-14 bg-linear-to-br from-[#00CBA9] to-[#00A88A] rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span className="text-[10px] font-medium text-[#00CBA9]">Hotline</span>
          </a>

          {/* Zalo */}
          <a
            href={`https://zalo.me/${zaloLink}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center w-full h-full gap-0.5 text-gray-500"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.34 5L2 22l5.14-1.34C8.47 21.51 10.18 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm4.5 14h-6c-.28 0-.5-.22-.5-.5s.22-.5.5-.5H15v-1h-3c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1h3v-1h-2.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h3c.28 0 .5.22.5.5V15c0 .55-.45 1-1 1zm-1-4h-2v1h2v-1z"/>
            </svg>
            <span className="text-[10px] font-medium">Zalo</span>
          </a>

          {/* Menu */}
          <button
            onClick={() => { setShowMenu(true); setShowCategories(false); }}
            className={`flex flex-col items-center justify-center w-full h-full gap-0.5 transition-colors ${
              showMenu ? 'text-[#00CBA9]' : 'text-gray-500'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-[10px] font-medium">Menu</span>
          </button>
        </div>
      </nav>

      {/* Categories Drawer */}
      {showCategories && (
        <>
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowCategories(false)}
          />
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[70vh] overflow-y-auto pb-safe animate-slide-up">
            <div className="sticky top-0 bg-white pt-4 pb-2 px-4 border-b">
              <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">Danh mục Tour</h3>
                <button onClick={() => setShowCategories(false)} className="p-2">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-2">
              {/* All Tours */}
              <Link
                href="/tours"
                onClick={() => setShowCategories(false)}
                className="flex items-center gap-3 p-3 bg-linear-to-r from-[#00CBA9]/10 to-transparent rounded-xl"
              >
                <div className="w-10 h-10 bg-[#00CBA9] rounded-xl flex items-center justify-center text-white text-lg">
                  🌏
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">Tất cả Tour</p>
                  <p className="text-xs text-gray-500">Xem toàn bộ tour du lịch</p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              {/* Category List */}
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/tours?category=${cat.slug}`}
                  onClick={() => setShowCategories(false)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-lg">
                    {cat.icon || '🏯'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{cat.ten || cat.name}</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Menu Drawer */}
      {showMenu && (
        <>
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowMenu(false)}
          />
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[70vh] overflow-y-auto pb-safe animate-slide-up">
            <div className="sticky top-0 bg-white pt-4 pb-2 px-4 border-b">
              <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">Menu</h3>
                <button onClick={() => setShowMenu(false)} className="p-2">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-2">
              {/* Quick Contact */}
              <div className="flex gap-2 mb-4">
                <a
                  href={`tel:${phoneNumber}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#00CBA9] text-white py-3 rounded-xl font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Gọi ngay
                </a>
                <a
                  href={`https://zalo.me/${zaloLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-xl font-medium"
                >
                  💬 Chat Zalo
                </a>
              </div>

              {/* Menu Items */}
              <Link
                href="/tours"
                onClick={() => setShowMenu(false)}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-medium text-gray-800">Tất cả Tour</span>
              </Link>

              <Link
                href="/uu-dai"
                onClick={() => setShowMenu(false)}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <span className="font-medium text-gray-800">Ưu đãi hot</span>
              </Link>

              <Link
                href="/ve-chung-toi"
                onClick={() => setShowMenu(false)}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-medium text-gray-800">Về chúng tôi</span>
              </Link>

              <Link
                href="/blog"
                onClick={() => setShowMenu(false)}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <span className="font-medium text-gray-800">Blog du lịch</span>
              </Link>

              <Link
                href="/lien-he"
                onClick={() => setShowMenu(false)}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="font-medium text-gray-800">Liên hệ</span>
              </Link>
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
