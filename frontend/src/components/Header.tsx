'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getCategories } from '@/lib/strapi'

interface Category {
  id: number
  name?: string
  ten?: string
  slug: string
}

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Main Header - Simplified for mobile */}
      <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
        {/* Mobile Header */}
        <div className="md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-[#00CBA9] to-[#00A88A] rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                SH
              </div>
              <span className="font-bold text-gray-800">Sơn Hằng</span>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2.5 rounded-full hover:bg-gray-100 active:bg-gray-200"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <a href="tel:0123456789" className="p-2.5 rounded-full hover:bg-gray-100 active:bg-gray-200">
                <svg className="w-5 h-5 text-[#00CBA9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Mobile Search Expandable */}
          <div className={`overflow-hidden transition-all duration-300 ${isSearchOpen ? 'max-h-20 pb-3' : 'max-h-0'}`}>
            <div className="px-4">
              <div className="flex items-center bg-gray-100 rounded-full overflow-hidden">
                <svg className="w-5 h-5 text-gray-400 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Tìm tour, điểm đến..."
                  className="flex-1 bg-transparent py-3 px-3 text-sm outline-none"
                />
                <button className="bg-[#00CBA9] text-white px-4 py-3 text-sm font-medium">
                  Tìm
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block">
          {/* Top Bar */}
          <div className="bg-[#00CBA9] text-white py-2">
            <div className="container-custom flex justify-between items-center text-sm">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="font-medium">Hotline: 0123.456.789</span>
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Hỗ trợ 24/7</span>
                </span>
              </div>
              <div className="flex items-center gap-4">
                <a href="https://zalo.me/0123456789" className="hover:underline">Zalo</a>
                <a href="https://facebook.com" className="hover:underline">Facebook</a>
              </div>
            </div>
          </div>

          {/* Main Nav */}
          <div className="container-custom py-4">
            <div className="flex items-center justify-between gap-6">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 shrink-0">
                <div className="w-11 h-11 bg-gradient-to-br from-[#00CBA9] to-[#00A88A] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                  SH
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800 leading-tight">Sơn Hằng Travel</h1>
                  <p className="text-xs text-gray-500">Tour Trung Quốc Uy Tín</p>
                </div>
              </Link>

              {/* Search Bar */}
              <div className="flex-1 max-w-lg">
                <div className="flex items-center bg-gray-100 rounded-full overflow-hidden border-2 border-transparent focus-within:border-[#00CBA9] focus-within:bg-white transition-colors">
                  <svg className="w-5 h-5 text-gray-400 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Tìm tour, điểm đến..."
                    className="flex-1 bg-transparent py-3 px-3 outline-none"
                  />
                  <button className="bg-[#00CBA9] hover:bg-[#00A88A] text-white px-6 py-3 font-medium transition-colors">
                    Tìm kiếm
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex items-center gap-6">
                <Link href="/tours" className="text-gray-700 hover:text-[#00CBA9] font-medium transition-colors">
                  Tour du lịch
                </Link>
                <Link href="/blog" className="text-gray-700 hover:text-[#00CBA9] font-medium transition-colors">
                  Blog
                </Link>
                <Link href="/lien-he" className="bg-[#00CBA9] hover:bg-[#00A88A] text-white px-5 py-2.5 rounded-full font-medium transition-colors">
                  Liên hệ
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
