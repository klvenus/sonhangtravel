import type { Metadata } from 'next'
import { getSiteSettings, getTours } from '@/lib/data'

const SITE_URL = 'https://sonhangtravel.com'
const DEFAULT_OG_IMAGE = 'https://res.cloudinary.com/dzxntgoko/image/upload/v1772812681/sonhangtravel/pe1levewzcjvobldsvzr.jpg'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Liên Hệ Sơn Hằng Travel',
  description:
    'Liên hệ Sơn Hằng Travel để được tư vấn tour Trung Quốc, báo giá nhanh, hỗ trợ lịch khởi hành và thủ tục đi tour từ Móng Cái.',
  alternates: {
    canonical: `${SITE_URL}/lienhe`,
  },
  openGraph: {
    title: 'Liên Hệ | Sơn Hằng Travel',
    description: 'Gọi hotline, nhắn Zalo, xem địa chỉ và gửi yêu cầu tư vấn tour Trung Quốc nhanh cho Sơn Hằng Travel.',
    url: `${SITE_URL}/lienhe`,
    type: 'website',
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Liên hệ Sơn Hằng Travel',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Liên Hệ | Sơn Hằng Travel',
    description: 'Gọi hotline, nhắn Zalo, xem địa chỉ và gửi yêu cầu tư vấn tour Trung Quốc nhanh cho Sơn Hằng Travel.',
    images: [DEFAULT_OG_IMAGE],
  },
}

function normalizePhone(phone?: string) {
  if (!phone) return ''
  return phone.replace(/\s+/g, '').replace(/[^\d+]/g, '')
}

export default async function ContactPage() {
  const [settings, toursData] = await Promise.all([
    getSiteSettings(),
    getTours({ pageSize: 50 }),
  ])

  const phone = settings?.phoneNumber || '0338239888'
  const zaloNumber = settings?.zaloNumber || '0388091993'
  const email = settings?.email || 'Lienhe@sonhangtravel.com'
  const address = settings?.address || 'Khu 5 - Phường Móng Cái - Quảng Ninh'
  const facebookUrl = settings?.facebookUrl || 'https://facebook.com/sonhangtravel'
  const normalizedPhone = normalizePhone(phone)
  const normalizedZalo = normalizePhone(zaloNumber)
  const totalTours = toursData?.data?.length || 16
  const totalBookings = toursData?.data?.reduce((sum, tour) => sum + (tour.bookingCount || 0), 0) || 9800

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Sơn Hằng Travel',
    url: `${SITE_URL}/lienhe`,
    telephone: phone,
    email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Móng Cái',
      addressRegion: 'Quảng Ninh',
      addressCountry: 'VN',
      streetAddress: address,
    },
    sameAs: [facebookUrl, `https://zalo.me/${normalizedZalo}`].filter(Boolean),
  }

  return (
    <main className="bg-[linear-gradient(180deg,#ecfdf5_0%,#ffffff_28%,#ffffff_100%)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />

      <section className="relative overflow-hidden border-b border-emerald-100 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.2),_transparent_35%),linear-gradient(135deg,_#064e3b,_#065f46_55%,_#10b981)] text-white">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-emerald-100 backdrop-blur">
                📞 Liên hệ nhanh trong ngày
              </span>
              <h1 className="mt-5 text-3xl font-extrabold tracking-tight md:text-5xl">
                Cần tư vấn tour Trung Quốc,
                <br />
                cứ nhắn Sơn Hằng Travel
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-emerald-50/90 md:text-lg">
                Anh chỉ cần gửi điểm đến muốn đi, số người và thời gian dự kiến. Bên em sẽ chốt giúp tuyến phù hợp, báo giá nhanh và hỗ trợ luôn phần lịch trình / thủ tục nếu cần.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href={`tel:${normalizedPhone}`} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-emerald-800 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">
                  ☎️ Gọi ngay {phone}
                </a>
                <a href={`https://zalo.me/${normalizedZalo}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
                  💬 Nhắn Zalo tư vấn
                </a>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <StatCard value={`${totalTours}+`} label="Tuyến tour đang hoạt động" />
              <StatCard value={`${Math.max(9, Math.round(totalBookings / 1000))}K+`} label="Lượt khách đã phục vụ" />
              <StatCard value="24/7" label="Hỗ trợ trước - trong - sau tour" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-6 sm:grid-cols-2">
            <ContactCard title="Hotline chính" value={phone} desc="Gọi nhanh để hỏi lịch khởi hành, báo giá và tình trạng chỗ." href={`tel:${normalizedPhone}`} cta="Gọi ngay" />
            <ContactCard title="Zalo tư vấn" value={zaloNumber} desc="Phù hợp khi cần gửi ảnh CCCD/hộ chiếu hoặc hỏi chi tiết lịch trình." href={`https://zalo.me/${normalizedZalo}`} cta="Mở Zalo" external />
            <ContactCard title="Email" value={email} desc="Dùng khi cần gửi yêu cầu đoàn, hợp đồng hoặc thông tin xuất hóa đơn." href={`mailto:${email}`} cta="Gửi email" />
            <ContactCard title="Facebook" value="Sơn Hằng Travel" desc="Nhắn fanpage để xem bài mới, ảnh đoàn và các chương trình ưu đãi." href={facebookUrl} cta="Mở fanpage" external />
          </div>

          <div className="rounded-[32px] border border-emerald-100 bg-white p-6 shadow-sm md:p-8">
            <div className="inline-flex rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700">
              📍 Thông tin văn phòng
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Ghé trực tiếp hoặc liên hệ từ xa đều được</h2>
            <div className="mt-6 space-y-5 text-sm leading-7 text-gray-600">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Địa chỉ</p>
                <p className="mt-1 text-base font-semibold text-gray-900">{address}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Thời gian hỗ trợ</p>
                <p className="mt-1 text-base font-semibold text-gray-900">07:00 - 22:00 mỗi ngày</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Phù hợp khi liên hệ</p>
                <ul className="mt-2 space-y-2 text-gray-600">
                  <li>• Hỏi tour đi Đông Hưng, Nam Ninh, Hà Khẩu, Vân Nam</li>
                  <li>• Xin báo giá đoàn / gia đình / nhóm bạn</li>
                  <li>• Hỏi lịch khởi hành gần nhất</li>
                  <li>• Kiểm tra giấy tờ cần chuẩn bị trước chuyến đi</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 md:pb-20">
        <div className="rounded-[32px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-white p-6 shadow-sm md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <span className="inline-flex rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-emerald-700 shadow-sm">
                ✅ Gợi ý cách nhắn nhanh
              </span>
              <h2 className="mt-4 text-2xl font-bold text-gray-900 md:text-3xl">Nhắn theo mẫu này để bên em tư vấn nhanh hơn</h2>
              <div className="mt-5 rounded-3xl bg-gray-900 p-5 font-mono text-sm leading-7 text-emerald-300 shadow-inner">
                Em muốn đi tour Trung Quốc\n
                - Điểm đến: Đông Hưng / Nam Ninh / ...\n
                - Số người: ...\n
                - Ngày dự kiến: ...\n
                - Nhu cầu: đi nhanh / mua sắm / nghỉ dưỡng / đoàn riêng
              </div>
            </div>
            <div className="grid gap-4">
              <ActionRow title="Gọi hotline" desc="Phù hợp nếu anh cần chốt nhanh hoặc đang cần đi gấp." href={`tel:${normalizedPhone}`} cta={`Gọi ${phone}`} />
              <ActionRow title="Nhắn Zalo" desc="Dễ gửi ảnh giấy tờ, nhận lịch trình và tư vấn từng bước." href={`https://zalo.me/${normalizedZalo}`} cta="Mở Zalo" external />
              <ActionRow title="Xem tour trước" desc="Nếu muốn xem giá và lịch trình tham khảo trước khi liên hệ." href="/tours" cta="Xem danh sách tour" />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
      <p className="text-3xl font-black text-white md:text-4xl">{value}</p>
      <p className="mt-2 text-sm text-emerald-50/80">{label}</p>
    </div>
  )
}

function ContactCard({
  title,
  value,
  desc,
  href,
  cta,
  external = false,
}: {
  title: string
  value: string
  desc: string
  href: string
  cta: string
  external?: boolean
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="group rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">{title}</p>
      <h3 className="mt-3 text-2xl font-bold text-gray-900 break-words">{value}</h3>
      <p className="mt-3 text-sm leading-7 text-gray-600">{desc}</p>
      <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
        {cta}
        <span>→</span>
      </div>
    </a>
  )
}

function ActionRow({ title, desc, href, cta, external = false }: { title: string; desc: string; href: string; cta: string; external?: boolean }) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="rounded-[28px] border border-emerald-100 bg-white px-5 py-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-bold text-gray-900">{title}</p>
          <p className="mt-1 text-sm leading-7 text-gray-600">{desc}</p>
        </div>
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
          {cta}
          <span>→</span>
        </div>
      </div>
    </a>
  )
}
