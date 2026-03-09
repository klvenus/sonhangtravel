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
  const zalo = settings?.zaloNumber || phone
  const email = settings?.email || 'Lienhe@sonhangtravel.com'
  const address = settings?.address || 'Khu 5 - Phường Móng Cái - Quảng Ninh'
  const facebookUrl = settings?.facebookUrl || 'https://facebook.com/sonhangtravel'

  const phoneHref = `tel:${normalizePhone(phone)}`
  const zaloHref = `https://zalo.me/${normalizePhone(zalo)}`

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
    sameAs: [facebookUrl].filter(Boolean),
  }

  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <section className="bg-gradient-to-br from-emerald-50 via-white to-cyan-50 border-b border-emerald-100">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
              Về Sơn Hằng Travel
            </span>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Đơn vị chuyên tour Trung Quốc khởi hành từ Móng Cái
            </h1>
            <p className="mt-5 text-base leading-8 text-gray-600 md:text-lg">
              Sơn Hằng Travel tập trung vào các tuyến Đông Hưng, Nam Ninh, Hà Khẩu, Vân Nam và nhiều lịch trình Trung Quốc
              được khách lựa chọn thường xuyên. Mục tiêu là làm tour rõ ràng, dễ đi, chi phí minh bạch và hỗ trợ khách nhanh từ
              lúc tư vấn đến khi kết thúc chuyến đi.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={phoneHref}
                className="inline-flex items-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                Gọi ngay: {phone}
              </a>
              <a
                href={zaloHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50"
              >
                Nhắn Zalo
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-3 md:py-14">
        <article className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Điểm mạnh</h2>
          <p className="mt-3 leading-7 text-gray-600">
            Chuyên tuyến Trung Quốc gần biên và tuyến dài ngày, lịch trình được tối ưu cho khách đi theo nhóm, gia đình và khách
            muốn trải nghiệm thực tế nhưng vẫn gọn thời gian.
          </p>
        </article>

        <article className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Cách làm việc</h2>
          <p className="mt-3 leading-7 text-gray-600">
            Tư vấn rõ giấy tờ, báo giá minh bạch, hỗ trợ trước ngày khởi hành và cập nhật thông tin cần thiết để khách dễ chuẩn bị.
          </p>
        </article>

        <article className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Ưu tiên trải nghiệm thật</h2>
          <p className="mt-3 leading-7 text-gray-600">
            Nội dung tour, bài viết và hình ảnh đều bám sát tuyến đang bán, giúp khách xem nhanh, hiểu nhanh và chọn tour phù hợp.
          </p>
        </article>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10 md:pb-14">
        <div className="grid gap-8 rounded-[32px] bg-gray-50 p-6 md:grid-cols-[1.3fr_0.9fr] md:p-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Sơn Hằng Travel đang hỗ trợ những gì?</h2>
            <div className="mt-5 space-y-4 text-gray-600 leading-7">
              <p>
                Đội ngũ tập trung tư vấn tour Trung Quốc khởi hành từ khu vực Móng Cái, hỗ trợ khách nắm lịch trình, chuẩn bị giấy
                tờ, thời gian tập trung và các lưu ý trước chuyến đi.
              </p>
              <p>
                Ngoài các tour bán thường xuyên, website còn cập nhật bài viết kinh nghiệm, review tuyến đi, ưu đãi ngắn hạn và thông
                tin tham khảo để khách dễ ra quyết định hơn.
              </p>
              <p>
                Nếu cần tư vấn nhanh, khách có thể gọi hotline hoặc nhắn Zalo để được phản hồi trực tiếp.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/tours"
                className="inline-flex items-center rounded-full bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
              >
                Xem danh sách tour
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center rounded-full border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-100"
              >
                Xem bài viết mới
              </Link>
            </div>
          </div>

          <aside className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Thông tin liên hệ</h2>
            <dl className="mt-5 space-y-4 text-sm text-gray-600">
              <div>
                <dt className="font-semibold text-gray-900">Hotline</dt>
                <dd className="mt-1"><a href={phoneHref} className="hover:text-emerald-700">{phone}</a></dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-900">Zalo</dt>
                <dd className="mt-1"><a href={zaloHref} target="_blank" rel="noreferrer" className="hover:text-emerald-700">{zalo}</a></dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-900">Email</dt>
                <dd className="mt-1"><a href={`mailto:${email}`} className="hover:text-emerald-700">{email}</a></dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-900">Địa chỉ</dt>
                <dd className="mt-1">{address}</dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-900">Facebook</dt>
                <dd className="mt-1"><a href={facebookUrl} target="_blank" rel="noreferrer" className="hover:text-emerald-700">{facebookUrl}</a></dd>
              </div>
            </dl>

            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200">
              <iframe
                title="Bản đồ Sơn Hằng Travel"
                src="https://www.google.com/maps?q=https://maps.app.goo.gl/B8Nrdag1zKA5KnUt9&output=embed"
                className="h-72 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <a
              href="https://maps.app.goo.gl/B8Nrdag1zKA5KnUt9"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Mở Google Maps →
            </a>
          </aside>
        </div>
      </section>
    </main>
  )
}
