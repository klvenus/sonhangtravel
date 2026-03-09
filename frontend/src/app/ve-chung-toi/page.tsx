import type { Metadata } from 'next'
import Link from 'next/link'
import { getSiteSettings } from '@/lib/strapi'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Về Chúng Tôi | Sơn Hằng Travel',
  description:
    'Tìm hiểu về Sơn Hằng Travel - đơn vị chuyên tổ chức tour Trung Quốc khởi hành từ Móng Cái với lịch trình rõ ràng, hỗ trợ nhanh và dịch vụ thực tế.',
  alternates: {
    canonical: 'https://sonhangtravel.com/ve-chung-toi',
  },
}

function normalizePhone(phone?: string) {
  if (!phone) return ''
  return phone.replace(/\s+/g, '').replace(/[^\d+]/g, '')
}

export default async function AboutPage() {
  const settings = await getSiteSettings()
  const phone = settings?.phoneNumber || '0338239888'
  const email = settings?.email || 'Lienhe@sonhangtravel.com'
  const address = settings?.address || 'Khu 5 - Phường Móng Cái - Quảng Ninh'
  const facebookUrl = settings?.facebookUrl || 'https://facebook.com/sonhangtravel'

  const phoneHref = `tel:${normalizePhone(phone)}`
  const zaloButtons = [
    { label: 'Zalo OA', href: 'https://zalo.me/561113801789156735' },
    { label: 'Zalo 1', href: 'https://zalo.me/0986409633' },
    { label: 'Zalo 2', href: 'https://zalo.me/0338239888' },
    { label: 'Zalo 3', href: 'https://zalo.me/0338091993' },
  ]

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Sơn Hằng Travel',
    url: 'https://sonhangtravel.com/ve-chung-toi',
    description:
      'Sơn Hằng Travel chuyên tour Trung Quốc khởi hành từ Móng Cái, tư vấn rõ ràng, lịch trình thực tế và hỗ trợ khách trong suốt hành trình.',
    telephone: phone,
    email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address,
      addressCountry: 'VN',
    },
    sameAs: [facebookUrl, ...zaloButtons.map((item) => item.href)].filter(Boolean),
  }

  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <section className="border-b border-emerald-100 bg-gradient-to-b from-emerald-50 via-white to-white">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="max-w-4xl">
            <span className="inline-flex rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
              Về Sơn Hằng Travel
            </span>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Đơn vị chuyên tour Trung Quốc khởi hành từ Móng Cái
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-gray-600 md:text-lg">
              Sơn Hằng Travel tập trung vào các tuyến Đông Hưng, Nam Ninh, Hà Khẩu, Vân Nam và nhiều lịch trình Trung Quốc được
              khách lựa chọn thường xuyên. Mục tiêu là làm tour rõ ràng, dễ đi, chi phí minh bạch và hỗ trợ khách nhanh từ lúc tư
              vấn đến khi kết thúc chuyến đi.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <article className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900">Điểm mạnh</h2>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  Chuyên tuyến Trung Quốc gần biên và tuyến dài ngày, lịch trình gọn, dễ đi, tối ưu cho khách lẻ, gia đình và nhóm.
                </p>
              </article>

              <article className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900">Cách làm việc</h2>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  Tư vấn rõ giấy tờ, báo giá minh bạch, hỗ trợ trước ngày khởi hành và theo sát khách trong suốt hành trình.
                </p>
              </article>

              <article className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900">Ưu tiên trải nghiệm thật</h2>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  Nội dung tour và hình ảnh bám sát tuyến đang bán để khách xem nhanh, hiểu nhanh và chốt tour dễ hơn.
                </p>
              </article>
            </div>

            <div className="rounded-[32px] bg-gray-50 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Sơn Hằng Travel đang hỗ trợ những gì?</h2>
              <div className="mt-5 space-y-4 text-gray-600 leading-7">
                <p>
                  Đội ngũ tập trung tư vấn tour Trung Quốc khởi hành từ khu vực Móng Cái, hỗ trợ khách nắm lịch trình, chuẩn bị giấy
                  tờ, thời gian tập trung và các lưu ý trước chuyến đi.
                </p>
                <p>
                  Các tuyến tour được chọn theo tiêu chí dễ bán, dễ đi và phù hợp với nhiều tệp khách: đi ngắn ngày, đi theo gia
                  đình, đi nhóm nhỏ hoặc khách muốn trải nghiệm tuyến hot.
                </p>
                <p>
                  Nếu cần tư vấn nhanh, khách có thể gọi trực tiếp hoặc nhắn một trong các Zalo bên cạnh để được phản hồi ngay.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={phoneHref}
                  className="inline-flex items-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Hotline: {phone}
                </a>
                <Link
                  href="/tours"
                  className="inline-flex items-center rounded-full border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-100"
                >
                  Xem danh sách tour
                </Link>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-sm">
              <iframe
                title="Bản đồ Sơn Hằng Travel"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3711.269687413462!2d107.9680239768471!3d21.536307670149814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314b55e5e9ff096f%3A0x86d89d00998fb9a2!2zU8ahbiBI4bqxbmcgVHJhdmVs!5e0!3m2!1svi!2s!4v1773024857386!5m2!1svi!2s"
                className="h-[320px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <div className="border-t border-gray-100 px-5 py-4">
                <a
                  href="https://maps.app.goo.gl/B8Nrdag1zKA5KnUt9"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  Mở Google Maps →
                </a>
              </div>
            </div>

            <div className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">Liên hệ nhanh</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {zaloButtons.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-2xl bg-[#0068FF] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              <div className="mt-6 space-y-4 border-t border-gray-100 pt-6 text-sm text-gray-600">
                <div>
                  <p className="font-semibold text-gray-900">Hotline</p>
                  <a href={phoneHref} className="mt-1 inline-flex hover:text-emerald-700">
                    {phone}
                  </a>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <a href={`mailto:${email}`} className="mt-1 inline-flex break-all hover:text-emerald-700">
                    {email}
                  </a>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Địa chỉ</p>
                  <p className="mt-1 leading-6">{address}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Facebook</p>
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex break-all hover:text-emerald-700"
                  >
                    {facebookUrl}
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
