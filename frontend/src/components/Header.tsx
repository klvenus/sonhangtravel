'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCategories } from '@/lib/strapi'

interface Category {
  id: number
  name?: string
  ten?: string
  slug: string
}

interface HeaderProps {
  logoUrl?: string
  siteName?: string
  phoneNumber?: string
  zaloNumber?: string
}

export default function Header({ logoUrl, siteName = 'Sơn Hằng Travel', phoneNumber = '0123456789', zaloNumber }: HeaderProps) {
  const router = useRouter()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showCategoryMenu, setShowCategoryMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState('')

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/tours?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false) // Close mobile search after submit
      setSearchQuery('') // Clear search input
    }
  }

  return (
    <>
      {/* Main Header - Simplified for mobile */}
      <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
        {/* Mobile Header */}
        <div className="md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              {logoUrl ? (
                <Image src={logoUrl} alt={siteName} width={36} height={36} className="w-9 h-9 rounded-xl object-contain" />
              ) : (
                <div className="w-9 h-9 bg-linear-to-br from-[#00CBA9] to-[#00A88A] rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                  SH
                </div>
              )}
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
              <a href={`tel:${phoneNumber}`} className="p-2.5 rounded-full hover:bg-gray-100 active:bg-gray-200">
                <svg className="w-5 h-5 text-[#00CBA9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
              <button
                onClick={() => setShowMobileMenu(true)}
                className="p-2.5 rounded-full hover:bg-gray-100 active:bg-gray-200"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Search Expandable */}
          <div className={`overflow-hidden transition-all duration-300 ${isSearchOpen ? 'max-h-20 pb-3' : 'max-h-0'}`}>
            <div className="px-4">
              <form onSubmit={handleSearch} className="flex items-center bg-gray-100 rounded-full overflow-hidden">
                <svg className="w-5 h-5 text-gray-400 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm tour, điểm đến..."
                  className="flex-1 bg-transparent py-3 px-3 text-base outline-none"
                />
                <button type="submit" className="bg-[#00CBA9] text-white px-4 py-3 text-sm font-medium active:scale-95 transition-transform">
                  Tìm
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block">
          {/* Top Bar */}
          <div className="bg-[#00CBA9] text-white py-2">
            <div className="container-custom flex justify-between items-center text-sm">
              <div className="flex items-center gap-4">
                <a href={`tel:${phoneNumber}`} className="flex items-center gap-1 hover:underline">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="font-medium">Hotline: {phoneNumber}</span>
                </a>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Hỗ trợ 24/7</span>
                </span>
              </div>
              <div className="flex items-center gap-4">
                <a href={`https://zalo.me/${zaloNumber || phoneNumber}`} className="hover:underline">Zalo</a>
                <a href="https://facebook.com" className="hover:underline">Facebook</a>
              </div>
            </div>
          </div>

          {/* Main Nav */}
          <div className="container-custom py-4">
            <div className="flex items-center justify-between gap-6">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 shrink-0">
                {logoUrl ? (
                  <Image src={logoUrl} alt={siteName} width={44} height={44} className="w-11 h-11 rounded-xl object-contain" />
                ) : (
                  <div className="w-11 h-11 bg-linear-to-br from-[#00CBA9] to-[#00A88A] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                    SH
                  </div>
                )}
                <div>
                  <h1 className="text-xl font-bold text-gray-800 leading-tight">{siteName}</h1>
                  <p className="text-xs text-gray-500">Tour Trung Quốc Uy Tín</p>
                </div>
              </Link>

              {/* Search Bar */}
              <div className="flex-1 max-w-lg">
                <form onSubmit={handleSearch} className="flex items-center bg-gray-100 rounded-full overflow-hidden border-2 border-transparent focus-within:border-[#00CBA9] focus-within:bg-white transition-colors">
                  <svg className="w-5 h-5 text-gray-400 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm tour, điểm đến..."
                    className="flex-1 bg-transparent py-3 px-3 outline-none"
                  />
                  <button type="submit" className="bg-[#00CBA9] hover:bg-[#00A88A] text-white px-6 py-3 font-medium transition-colors">
                    Tìm kiếm
                  </button>
                </form>
              </div>

              {/* Navigation */}
              <nav className="flex items-center gap-6">
                {/* Tour Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                    onMouseEnter={() => setShowCategoryMenu(true)}
                    className="flex items-center gap-1 text-gray-700 hover:text-[#00CBA9] font-medium transition-colors"
                  >
                    Tour du lịch
                    <svg className={`w-4 h-4 transition-transform ${showCategoryMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Category Dropdown */}
                  {showCategoryMenu && (
                    <div 
                      className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                      onMouseLeave={() => setShowCategoryMenu(false)}
                    >
                      <Link 
                        href="/tours" 
                        onClick={() => setShowCategoryMenu(false)}
                        className="block px-4 py-2.5 text-gray-700 hover:bg-[#00CBA9]/10 hover:text-[#00CBA9] font-medium transition-colors"
                      >
                        Tất cả Tour
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      {categories.map((cat) => (
                        <Link 
                          key={cat.id}
                          href={`/tours?category=${cat.slug}`}
                          onClick={() => setShowCategoryMenu(false)}
                          className="block px-4 py-2.5 text-gray-600 hover:bg-[#00CBA9]/10 hover:text-[#00CBA9] transition-colors"
                        >
                          {cat.ten || cat.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                
                <Link href="/uu-dai" className="text-gray-700 hover:text-[#00CBA9] font-medium transition-colors">
                  Ưu đãi
                </Link>
                <Link href="/blog" className="text-gray-700 hover:text-[#00CBA9] font-medium transition-colors">
                  Blog
                </Link>
                <Link href="/ve-chung-toi" className="text-gray-700 hover:text-[#00CBA9] font-medium transition-colors">
                  Về chúng tôi
                </Link>
                <Link href="/lien-he" className="bg-[#00CBA9] hover:bg-[#00A88A] text-white px-5 py-2.5 rounded-full font-medium transition-colors">
                  Liên hệ
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer - Slide from LEFT */}
      {showMobileMenu && (
        <>
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-[60]"
            onClick={() => setShowMobileMenu(false)}
          />
          <div className="md:hidden fixed top-0 left-0 bottom-0 w-[300px] bg-white z-[60] shadow-2xl flex flex-col animate-slide-in-left overflow-hidden">
            {/* Header with Logo */}
            <div className="bg-linear-to-r from-[#00CBA9] to-[#00A88A] p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {logoUrl ? (
                    <Image src={logoUrl} alt={siteName} width={40} height={40} className="w-10 h-10 rounded-xl object-contain bg-white p-1" />
                  ) : (
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#00CBA9] font-bold shadow">
                      SH
                    </div>
                  )}
                  <div className="text-white">
                    <p className="font-bold">{siteName}</p>
                    <p className="text-xs text-white/80">Tour Trung Quốc Uy Tín</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowMobileMenu(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Quick Contact Buttons */}
              <div className="flex gap-2">
                <a
                  href={`tel:${phoneNumber}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-white text-[#00CBA9] py-2.5 rounded-xl font-medium text-sm"
                >
                  Gọi ngay
                </a>
                <a
                  href={`https://zalo.me/${zaloLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-white/20 text-white py-2.5 rounded-xl font-medium text-sm border border-white/30"
                >
                  Chat Zalo
                </a>
              </div>
            </div>

            {/* Menu Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              {/* Main Navigation */}
              <div className="py-2">
                <Link
                  href="/"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center justify-between px-5 py-3.5 text-gray-800 hover:bg-gray-50 font-medium"
                >
                  Trang chủ
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Tour Categories Section */}
              <div className="border-t border-gray-100">
                <div className="px-5 py-3 bg-gray-50">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Danh mục Tour</span>
                </div>
                <Link
                  href="/tours"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center justify-between px-5 py-3.5 text-[#00CBA9] hover:bg-gray-50 font-semibold"
                >
                  Tất cả Tour
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/tours?category=${cat.slug}`}
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center justify-between px-5 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#00CBA9] transition-colors"
                  >
                    {cat.ten || cat.name}
                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>

              {/* Other Links */}
              <div className="border-t border-gray-100">
                <div className="px-5 py-3 bg-gray-50">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Khám phá</span>
                </div>
                <Link
                  href="/uu-dai"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center justify-between px-5 py-3.5 text-gray-800 hover:bg-gray-50 font-medium"
                >
                  <span className="flex items-center gap-2">
                    Ưu đãi hot
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">HOT</span>
                  </span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/blog"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center justify-between px-5 py-3.5 text-gray-800 hover:bg-gray-50 font-medium"
                >
                  Blog du lịch
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* About & Contact */}
              <div className="border-t border-gray-100">
                <div className="px-5 py-3 bg-gray-50">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Thông tin</span>
                </div>
                <Link
                  href="/ve-chung-toi"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center justify-between px-5 py-3.5 text-gray-800 hover:bg-gray-50 font-medium"
                >
                  Về chúng tôi
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/lien-he"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center justify-between px-5 py-3.5 text-gray-800 hover:bg-gray-50 font-medium"
                >
                  Liên hệ
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Footer - Hotline */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <p className="text-xs text-gray-500 mb-1">Hỗ trợ 24/7</p>
              <a href={`tel:${phoneNumber}`} className="text-xl font-bold text-[#00CBA9]">
                {phoneNumber}
              </a>
              <p className="text-xs text-gray-400 mt-2">© 2026 {siteName}</p>
            </div>
          </div>
        </>
      )}

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes slide-in-left {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
