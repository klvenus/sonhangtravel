import Link from 'next/link'
import Image from 'next/image'

interface FooterProps {
  logoUrl?: string
  siteName?: string
  phoneNumber?: string
  zaloNumber?: string
  email?: string
  address?: string
  facebookUrl?: string
  categories?: Array<{
    id: number
    name: string
    slug: string
  }>
  topTours?: Array<{
    id: string
    title: string
    slug: string
  }>
}

function normalizeDigits(value?: string) {
  return (value || '').replace(/\D/g, '')
}

function MapPinIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 21s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.8" strokeWidth={1.8} />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.8 4.8h3.3l1.65 4.1-2.1 1.9a16.4 16.4 0 006.5 6.5l1.9-2.1 4.1 1.65v3.3A2.2 2.2 0 0118 22C9.16 22 2 14.84 2 6a2.2 2.2 0 012.8-1.2Z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16v12H4z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m4 8 8 6 8-6" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" strokeWidth={1.8} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12h18M12 3c2.4 2.5 3.6 5.5 3.6 9S14.4 18.5 12 21c-2.4-2.5-3.6-5.5-3.6-9S9.6 5.5 12 3Z" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5h10v10M19 5 5 19" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M13.5 22v-8h2.7l.5-3.2h-3.2V8.7c0-.9.3-1.5 1.6-1.5H17V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4.1v2.3H8V14h2.8v8h2.7Z" />
    </svg>
  )
}

function ZaloIcon() {
  return <span className="text-xs font-black tracking-[0.2em]">Z</span>
}

export default function Footer({
  logoUrl,
  siteName = 'Sơn Hằng Travel',
  phoneNumber = '0338239888',
  zaloNumber,
  email = 'Lienhe@sonhangtravel.com',
  address = 'Khu 5 - Phường Móng Cái - Quảng Ninh',
  facebookUrl,
  categories = [],
  topTours = [],
}: FooterProps) {
  const featuredCategories = categories.slice(0, 6)
  const featuredTours = topTours.slice(0, 4)
  const normalizedPhone = normalizeDigits(phoneNumber)
  const normalizedZalo = normalizeDigits(zaloNumber) || normalizedPhone
  const zaloHref = normalizedZalo ? `https://zalo.me/${normalizedZalo}` : undefined
  const facebookHref = facebookUrl || 'https://facebook.com/sonhangtravel'
  const hotlineDisplay = phoneNumber || '0338 239 888'
  const supportLabel = email || 'Lienhe@sonhangtravel.com'
  const siteUrl = 'https://sonhangtravel.com'
  const navigationLinks = [
    { href: '/tours', label: 'Tất cả tour' },
    { href: '/so-do-tour', label: 'Sơ đồ tour' },
    { href: '/tintuc', label: 'Tin tức' },
    { href: '/ve-chung-toi', label: 'Về chúng tôi' },
    { href: '/lien-he', label: 'Liên hệ' },
  ]

  return (
    <footer id="site-footer" className="border-t border-emerald-900/60 bg-[radial-gradient(circle_at_top_left,_rgba(110,231,183,0.16),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(52,211,153,0.14),_transparent_28%),linear-gradient(180deg,_#064e3b,_#065f46_45%,_#064e3b)] text-white">
      <div className="hidden border-b border-white/10 md:block">
        <div className="container-custom py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-100/70">Hỗ trợ đặt tour nhanh</p>
              <h3 className="mt-2 text-lg font-bold tracking-tight text-white md:text-2xl">Tư vấn lịch khởi hành, báo giá và chốt tour ngay trong ngày</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-50/78">
                Đội ngũ {siteName} hỗ trợ xuyên suốt từ chọn tuyến, chuẩn bị giấy tờ đến giữ chỗ nhanh cho khách đi Đông Hưng, Nam Ninh, Hà Khẩu và các tuyến dài ngày.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <a
                href={`tel:${normalizedPhone}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-emerald-900 shadow-[0_14px_32px_rgba(4,120,87,0.18)] transition hover:bg-emerald-50"
              >
                <PhoneIcon />
                Gọi {hotlineDisplay}
              </a>
              {zaloHref && (
                <a
                  href={zaloHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/16"
                >
                  <ZaloIcon />
                  Nhắn Zalo
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-10 md:py-12">
        <div className="md:hidden">
          <div className="rounded-[30px] border border-white/10 bg-white/5 p-5 shadow-[0_18px_45px_rgba(2,44,34,0.2)] backdrop-blur-sm">
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={siteName}
                  width={52}
                  height={52}
                  className="h-[52px] w-[52px] rounded-2xl bg-white/12 p-1.5 object-contain ring-1 ring-white/10"
                  unoptimized
                />
              ) : (
                <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-white/12 text-base font-bold text-white ring-1 ring-white/10">
                  SH
                </div>
              )}

              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-100/70">Thương hiệu</p>
                <h3 className="mt-1 text-[15px] font-bold leading-6 text-white">CÔNG TY TNHH SƠN HẰNG TRAVEL</h3>
                <p className="text-xs text-emerald-50/65">SON HANG TRAVEL COMPANY LIMITED</p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-emerald-50/82">
              Chuyên tour Trung Quốc khởi hành từ Móng Cái, hỗ trợ giữ chỗ nhanh, lịch rõ ràng và tư vấn trực tiếp khi khách cần chốt tour.
            </p>

            <div className="mt-4 space-y-2 text-sm text-emerald-50/82">
              <div className="flex items-start gap-2.5">
                <MapPinIcon />
                <span>{address}</span>
              </div>
              <a href={`mailto:${supportLabel}`} className="flex items-start gap-2.5 transition hover:text-white">
                <MailIcon />
                <span>{supportLabel}</span>
              </a>
              <a href={siteUrl} className="flex items-start gap-2.5 transition hover:text-white">
                <GlobeIcon />
                <span>sonhangtravel.com</span>
              </a>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <a
                href={`tel:${normalizedPhone}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50"
              >
                <PhoneIcon />
                Gọi {hotlineDisplay}
              </a>
              {zaloHref && (
                <a
                  href={zaloHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/16"
                >
                  <ZaloIcon />
                  Nhắn Zalo
                </a>
              )}
            </div>

            <div className="mt-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-100/70">Điều hướng nhanh</p>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {navigationLinks.map((link, index) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-medium text-emerald-50/88 transition hover:bg-white/10 hover:text-white ${
                      navigationLinks.length % 2 !== 0 && index === navigationLinks.length - 1 ? 'col-span-2' : ''
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-4">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-medium text-emerald-50/85">MST: 5702215220</span>
                <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-medium text-emerald-50/85">Hỗ trợ 24/7</span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={facebookHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/10 text-white transition hover:bg-white/16"
                  title="Facebook"
                >
                  <FacebookIcon />
                </a>
                {zaloHref && (
                  <a
                    href={zaloHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/10 text-white transition hover:bg-white/16"
                    title="Zalo"
                  >
                    <ZaloIcon />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="hidden gap-8 md:grid lg:grid-cols-[1.35fr_0.9fr_1fr_1.05fr]">
          <div>
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={siteName}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-2xl bg-white/12 p-1.5 object-contain ring-1 ring-white/10"
                  unoptimized
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/12 text-lg font-bold text-white ring-1 ring-white/10">
                  SH
                </div>
              )}

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-100/70">Thương hiệu</p>
                <h3 className="mt-1 text-base font-bold leading-snug tracking-tight text-white sm:text-lg">CÔNG TY TNHH SƠN HẰNG TRAVEL</h3>
                <p className="mt-1 text-xs text-emerald-50/65">SON HANG TRAVEL COMPANY LIMITED</p>
              </div>
            </div>

            <div className="mt-5 max-w-xl space-y-3 text-sm leading-6 text-emerald-50/82">
              <p>
                Chuyên tour Trung Quốc khởi hành từ Móng Cái, tập trung tuyến ngắn ngày dễ đi và các hành trình dài ngày có lịch rõ ràng, hỗ trợ nhanh.
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2.5">
                  <MapPinIcon />
                  <span>{address}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <GlobeIcon />
                  <a href={siteUrl} className="transition hover:text-white">
                    sonhangtravel.com
                  </a>
                </div>
                <div className="flex items-start gap-2.5">
                  <MailIcon />
                  <a href={`mailto:${supportLabel}`} className="transition hover:text-white">
                    {supportLabel}
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-medium text-emerald-50/85">MST: 5702215220</span>
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-medium text-emerald-50/85">Hỗ trợ 24/7</span>
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-medium text-emerald-50/85">Khởi hành từ Móng Cái</span>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-100/70">Điều hướng</p>
            <ul className="mt-4 space-y-3 text-sm text-emerald-50/82">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-flex items-center gap-2 transition hover:text-white">
                    <ArrowIcon />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-100/70">Điểm đến nổi bật</p>
            <p className="mt-3 text-sm leading-6 text-emerald-50/70">
              Nhóm tuyến đang được khách hỏi nhiều và cũng là landing page chính của site.
            </p>
            <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {featuredCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/tours/${category.slug}`}
                  className="group flex items-center justify-between border-b border-white/10 pb-2 text-sm font-medium text-emerald-50/88 transition hover:border-white/20 hover:text-white"
                >
                  <span>Tour {category.name}</span>
                  <span aria-hidden className="text-emerald-100/45 transition group-hover:translate-x-0.5 group-hover:text-emerald-50">
                    →
                  </span>
                </Link>
              ))}
            </div>

            {featuredTours.length > 0 && (
              <>
                <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-100/70">Tour bán chạy</p>
                <ul className="mt-4 space-y-2.5 text-sm text-emerald-50/82">
                  {featuredTours.map((tour) => (
                    <li key={tour.id}>
                      <Link href={`/tour/${tour.slug}`} className="inline-flex items-start gap-2 transition hover:text-white">
                        <ArrowIcon />
                        <span>{tour.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-100/70">Liên hệ nhanh</p>
            <div className="mt-4 space-y-4">
              <div className="border-b border-white/10 pb-4">
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/60">Hotline</p>
                <a href={`tel:${normalizedPhone}`} className="mt-2 inline-flex items-center gap-2 text-2xl font-bold tracking-tight text-white transition hover:text-emerald-100">
                  <PhoneIcon />
                  {hotlineDisplay}
                </a>
              </div>

              <div className="space-y-3 text-sm text-emerald-50/82">
                <a href={`mailto:${supportLabel}`} className="inline-flex items-center gap-2 transition hover:text-white">
                  <MailIcon />
                  {supportLabel}
                </a>
                <a href={siteUrl} className="inline-flex items-center gap-2 transition hover:text-white">
                  <GlobeIcon />
                  sonhangtravel.com
                </a>
              </div>

              <div className="pt-2">
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/60">Kết nối</p>
                <div className="mt-3 flex items-center gap-3">
                  <a
                    href={facebookHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/10 text-white transition hover:bg-white/16"
                    title="Facebook"
                  >
                    <FacebookIcon />
                  </a>
                  {zaloHref && (
                    <a
                      href={zaloHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/10 text-white transition hover:bg-white/16"
                      title="Zalo"
                    >
                      <ZaloIcon />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-custom flex flex-col gap-2 py-4 pb-24 text-xs text-emerald-50/58 md:flex-row md:items-center md:justify-between md:pb-4">
          <p>&copy; 2026 CÔNG TY TNHH SƠN HẰNG TRAVEL. Tất cả quyền được bảo lưu.</p>
          <div className="flex flex-wrap items-center gap-3">
            <span>MST: 5702215220</span>
            <span className="hidden h-1 w-1 rounded-full bg-emerald-100/30 md:inline-block" />
            <span>Khởi hành từ Móng Cái, Quảng Ninh</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
