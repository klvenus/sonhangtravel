import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getSiteSettings, getTours } from '@/lib/data'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Về Chúng Tôi | Sơn Hằng Travel - Tour Trung Quốc Uy Tín từ Móng Cái',
  description:
    'Sơn Hằng Travel - đơn vị chuyên tổ chức tour Trung Quốc khởi hành từ Móng Cái. Hơn 9.000 lượt khách tin tưởng, lịch trình rõ ràng, hỗ trợ 24/7.',
  alternates: {
    canonical: 'https://sonhangtravel.com/ve-chung-toi',
  },
}

function normalizePhone(phone?: string) {
  if (!phone) return ''
  return phone.replace(/\s+/g, '').replace(/[^\d+]/g, '')
}

export default async function AboutPage() {
  const [settings, toursData] = await Promise.all([
    getSiteSettings(),
    getTours({ pageSize: 50 }),
  ])

  const phone = settings?.phoneNumber || '0338239888'
  const email = settings?.email || 'Lienhe@sonhangtravel.com'
  const address = settings?.address || 'Khu 5 - Phường Móng Cái - Quảng Ninh'
  const facebookUrl = settings?.facebookUrl || 'https://facebook.com/sonhangtravel'
  const phoneHref = `tel:${normalizePhone(phone)}`

  // Stats from real data
  const totalTours = toursData?.data?.length || 16
  const totalBookings = toursData?.data?.reduce((sum, t) => sum + (t.bookingCount || 0), 0) || 9800
  const totalReviews = toursData?.data?.reduce((sum, t) => sum + (t.reviewCount || 0), 0) || 5400

  // Get 4 tour images for gallery
  const tourImages = (toursData?.data || [])
    .filter(t => t.thumbnail)
    .slice(0, 4)
    .map(t => ({ url: t.thumbnail || '', title: t.title }))

  const zaloButtons = [
    { label: 'Zalo OA', href: 'https://zalo.me/561113801789156735' },
    { label: 'Tư vấn 1', href: 'https://zalo.me/0986409633' },
    { label: 'Tư vấn 2', href: 'https://zalo.me/0338239888' },
    { label: 'Tư vấn 3', href: 'https://zalo.me/0338091993' },
  ]

  const strengths = [
    {
      title: 'Chuyên tuyến Trung Quốc',
      desc: 'Tập trung 100% vào tour Trung Quốc qua cửa khẩu Móng Cái — Đông Hưng, Nam Ninh, Hà Khẩu, Vân Nam và các tuyến hot nhất.',
    },
    {
      title: 'Lịch trình rõ ràng',
      desc: 'Mỗi tour đều công khai chi tiết: thời gian, điểm đến, bao gồm/không bao gồm, giá minh bạch — không phát sinh.',
    },
    {
      title: 'Hỗ trợ xuyên suốt',
      desc: 'Từ tư vấn giấy tờ, hộ chiếu, visa đến hỗ trợ trong suốt hành trình — đội ngũ luôn theo sát khách.',
    },
    {
      title: 'Phù hợp mọi đối tượng',
      desc: 'Tour ngắn ngày cho người bận, tour gia đình cho nhóm lớn, tour trải nghiệm cho giới trẻ — đều có lịch phù hợp.',
    },
    {
      title: 'Ảnh thật - Tour thật',
      desc: 'Tất cả hình ảnh và review trên website đều từ khách đã đi thật — không dùng ảnh stock hay nội dung ảo.',
    },
    {
      title: 'Giá tốt nhất khu vực',
      desc: 'Là đơn vị tại Móng Cái, không qua trung gian, giá tour luôn cạnh tranh và rõ ràng nhất thị trường.',
    },
  ]

  const timeline = [
    { year: 'Khởi đầu', title: 'Thành lập tại Móng Cái', desc: 'Bắt đầu từ đam mê du lịch và kinh nghiệm nhiều năm dẫn tour Trung Quốc qua cửa khẩu Móng Cái.' },
    { year: 'Phát triển', title: 'Mở rộng tuyến tour', desc: 'Từ tuyến Đông Hưng 1 ngày, mở rộng sang Nam Ninh, Quế Lâm, Trương Gia Giới, Phượng Hoàng Cổ Trấn.' },
    { year: 'Hiện tại', title: `${totalTours}+ tuyến tour hoạt động`, desc: 'Phục vụ hàng nghìn lượt khách mỗi năm với đánh giá cao về chất lượng dịch vụ và sự chuyên nghiệp.' },
  ]

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Sơn Hằng Travel',
    legalName: 'CÔNG TY TNHH SƠN HẰNG TRAVEL',
    taxID: '5702215220',
    url: 'https://sonhangtravel.com',
    description: 'Sơn Hằng Travel chuyên tour Trung Quốc khởi hành từ Móng Cái.',
    telephone: phone,
    email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Khu 5 - Phường Móng Cái',
      addressLocality: 'Móng Cái',
      addressRegion: 'Quảng Ninh',
      addressCountry: 'VN',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 21.536307, longitude: 107.968024 },
    sameAs: [facebookUrl, ...zaloButtons.map(z => z.href)].filter(Boolean),
  }

  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-emerald-900">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-800/60 px-4 py-2 text-sm text-emerald-200 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Đang hoạt động • Móng Cái, Quảng Ninh
              </div>
              <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white md:text-5xl lg:text-[3.25rem] lg:leading-[1.15]">
                Chuyên tour<br />
                <span className="text-emerald-300">Trung Quốc</span> khởi hành<br />
                từ Móng Cái
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-emerald-100/80 md:text-lg">
                Sơn Hằng Travel tập trung vào các tuyến Đông Hưng, Nam Ninh, Hà Khẩu, Vân Nam — lịch trình rõ ràng, 
                chi phí minh bạch, hỗ trợ khách từ lúc tư vấn đến khi kết thúc chuyến đi.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={phoneHref}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-emerald-800 shadow-lg transition hover:shadow-xl hover:scale-[1.02]">
                  Gọi ngay: {phone}
                </a>
                <Link href="/tours"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                  Xem danh sách tour →
                </Link>
              </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm border border-white/10">
                <p className="text-3xl font-extrabold text-white md:text-4xl">{totalTours}+</p>
                <p className="mt-1 text-sm text-emerald-200">Tuyến tour hoạt động</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm border border-white/10">
                <p className="text-3xl font-extrabold text-white md:text-4xl">{(totalBookings / 1000).toFixed(0)}K+</p>
                <p className="mt-1 text-sm text-emerald-200">Lượt khách đã đi</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm border border-white/10">
                <p className="text-3xl font-extrabold text-white md:text-4xl">{(totalReviews / 1000).toFixed(0)}K+</p>
                <p className="mt-1 text-sm text-emerald-200">Đánh giá từ khách</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm border border-white/10">
                <p className="text-3xl font-extrabold text-white md:text-4xl">24/7</p>
                <p className="mt-1 text-sm text-emerald-200">Hỗ trợ tư vấn</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TOUR IMAGES STRIP ===== */}
      {tourImages.length >= 4 && (
        <section className="bg-gray-50 py-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
            {tourImages.map((img, i) => (
              <div key={i} className="relative h-32 md:h-48 overflow-hidden">
                <Image src={img.url} alt={img.title} fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="(max-width:768px) 50vw, 25vw" unoptimized />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== STRENGTHS ===== */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-20">
        <div className="text-center">
          <span className="inline-flex rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            Tại sao chọn chúng tôi?
          </span>
          <h2 className="mt-4 text-2xl font-bold text-gray-900 md:text-4xl">
            6 lý do khách hàng tin tưởng Sơn Hằng Travel
          </h2>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {strengths.map((item, i) => (
            <article key={i} className="group rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-emerald-300 hover:shadow-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-700 group-hover:bg-emerald-100 transition">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ===== TIMELINE ===== */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 md:text-4xl">Hành trình phát triển</h2>
            <p className="mt-3 text-gray-600">Từ một đội nhỏ tại Móng Cái đến đơn vị tour Trung Quốc được tin cậy nhất khu vực</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {timeline.map((item, i) => (
              <div key={i} className="relative rounded-2xl bg-white p-6 border border-gray-200">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {item.year}
                </div>
                <h3 className="mt-3 text-lg font-bold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.desc}</p>
                {i < timeline.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-gray-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMPANY INFO + MAP + CONTACT ===== */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left: Company info */}
          <div className="space-y-6">
            {/* Company card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
              <div className="flex items-start gap-4">
                {settings?.logo ? (
                  <Image src={settings.logo} alt="Sơn Hằng Travel" width={64} height={64} className="w-16 h-16 rounded-xl object-contain bg-gray-50 p-1" unoptimized />
                ) : (
                  <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 font-bold text-xl shrink-0">SH</div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-gray-900">CÔNG TY TNHH SƠN HẰNG TRAVEL</h2>
                  <p className="text-sm text-gray-500">SON HANG TRAVEL COMPANY LIMITED</p>
                  <p className="mt-1 text-sm text-gray-500">MST: <strong className="text-gray-700">5702215220</strong></p>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900">Trụ sở</p>
                  <p className="text-gray-600">{address}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">VP Đại diện</p>
                  <p className="text-gray-600">01 Xuân Diệu - Trần Phú - Móng Cái - Quảng Ninh</p>
                  <p className="text-xs text-emerald-600 mt-0.5">Cách cửa khẩu Quốc Tế Móng Cái 100m</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Website</p>
                  <a href="https://sonhangtravel.com" className="text-emerald-600 hover:underline">sonhangtravel.com</a>
                </div>
              </div>
            </div>

            {/* How we work */}
            <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900">Quy trình làm việc</h2>
              <div className="mt-5 space-y-4">
                {[
                  { step: '1', title: 'Tư vấn & chọn tour', desc: 'Khách liên hệ qua Zalo/điện thoại, đội ngũ tư vấn tuyến phù hợp với nhu cầu và ngân sách.' },
                  { step: '2', title: 'Chuẩn bị giấy tờ', desc: 'Hướng dẫn chi tiết hộ chiếu, visa, giấy tờ cần thiết để qua cửa khẩu thuận lợi.' },
                  { step: '3', title: 'Khởi hành & đồng hành', desc: 'Tập trung tại Móng Cái, có HDV đi cùng, hỗ trợ khách trong suốt hành trình.' },
                  { step: '4', title: 'Hoàn thành & đánh giá', desc: 'Kết thúc tour, lắng nghe phản hồi và hỗ trợ khách đặt chuyến tiếp theo.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                      {item.step}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{item.title}</p>
                      <p className="mt-0.5 text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Map + Contact */}
          <div className="space-y-6">
            {/* Map */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <iframe
                title="Bản đồ Sơn Hằng Travel"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3711.269687413462!2d107.9680239768471!3d21.536307670149814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314b55e5e9ff096f%3A0x86d89d00998fb9a2!2zU8ahbiBI4bqxbmcgVHJhdmVs!5e0!3m2!1svi!2s!4v1773024857386!5m2!1svi!2s"
                className="h-70 md:h-80 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between">
                <p className="text-sm text-gray-500">Khu 5, Phường Móng Cái</p>
                <a href="https://maps.app.goo.gl/B8Nrdag1zKA5KnUt9" target="_blank" rel="noreferrer"
                  className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                  Mở Google Maps →
                </a>
              </div>
            </div>

            {/* Zalo contact */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">Liên hệ tư vấn</h2>
              <p className="mt-1 text-sm text-gray-500">Nhắn Zalo hoặc gọi điện để được tư vấn miễn phí</p>
              
              <div className="mt-5 grid gap-3 grid-cols-2">
                {zaloButtons.map((item) => (
                  <a key={item.label} href={item.href} target="_blank" rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#0068FF] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0055DD] hover:scale-[1.02]">
                    {item.label}
                  </a>
                ))}
              </div>

              <div className="mt-6 space-y-4 border-t border-gray-100 pt-5">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Hotline 24/7</p>
                    <a href={phoneHref} className="text-lg font-bold text-emerald-700 hover:text-emerald-800">{phone}</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</p>
                    <a href={`mailto:${email}`} className="text-sm font-medium text-gray-800 hover:text-emerald-700">{email}</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Facebook</p>
                    <a href={facebookUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-gray-800 hover:text-emerald-700">
                      facebook.com/sonhangtravel
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA BOTTOM ===== */}
      <section className="bg-emerald-900">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16 text-center">
          <h2 className="text-2xl font-bold text-white md:text-3xl">Sẵn sàng khám phá Trung Quốc?</h2>
          <p className="mt-3 text-emerald-200 max-w-2xl mx-auto">
            Liên hệ ngay để được tư vấn tuyến tour phù hợp nhất. Đội ngũ Sơn Hằng Travel luôn sẵn sàng hỗ trợ bạn.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href={phoneHref}
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-emerald-800 shadow-lg transition hover:shadow-xl hover:scale-[1.02]">
              Gọi ngay: {phone}
            </a>
            <a href="https://zalo.me/0388091993" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#0068FF] px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#0055DD] hover:scale-[1.02]">
              Nhắn Zalo tư vấn
            </a>
            <Link href="/tours"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">
              Xem tất cả tour →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
