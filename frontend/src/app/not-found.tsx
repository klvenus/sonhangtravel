import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-[70vh] bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_35%),linear-gradient(to_bottom,_#f0fdf4,_#ffffff)]">
      <section className="mx-auto flex max-w-6xl flex-col items-center px-4 py-16 text-center md:py-24">
        <div className="inline-flex items-center rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm backdrop-blur">
          404 • Không tìm thấy trang
        </div>

        <div className="mt-8 max-w-3xl">
          <p className="text-7xl font-black tracking-tight text-emerald-600 md:text-9xl">404</p>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 md:text-5xl">
            Trang anh đang tìm không còn ở đây
          </h1>
          <p className="mt-5 text-base leading-8 text-gray-600 md:text-lg">
            Có thể link đã đổi, tour đã được cập nhật, hoặc anh gõ sai địa chỉ. Mình để sẵn các lối đi nhanh bên dưới để quay lại đúng chỗ cần xem.
          </p>
        </div>

        <div className="mt-10 grid w-full max-w-5xl gap-4 md:grid-cols-3">
          <QuickCard
            href="/tours"
            emoji="🗺️"
            title="Xem tất cả tour"
            desc="Danh sách tour Trung Quốc đang mở bán, có thể lọc theo điểm đến và nhu cầu."
          />
          <QuickCard
            href="/lien-he"
            emoji="📞"
            title="Liên hệ tư vấn"
            desc="Gọi hotline, nhắn Zalo, xem địa chỉ văn phòng và cách liên hệ nhanh nhất."
          />
          <QuickCard
            href="/"
            emoji="🏝️"
            title="Về trang chủ"
            desc="Quay lại trang chính để xem banner, tour nổi bật và các danh mục đang hot."
          />
        </div>

        <div className="mt-10 rounded-[28px] border border-emerald-100 bg-white p-6 shadow-sm md:p-8">
          <div className="grid gap-4 md:grid-cols-3 md:text-left">
            <InfoBox label="Hotline" value="0338 239 888" href="tel:0338239888" />
            <InfoBox label="Zalo tư vấn" value="0388 091 993" href="https://zalo.me/0388091993" />
            <InfoBox label="Fanpage" value="Sơn Hằng Travel" href="https://facebook.com/sonhangtravel" />
          </div>
        </div>
      </section>
    </main>
  )
}

function QuickCard({ href, emoji, title, desc }: { href: string; emoji: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="group rounded-[28px] border border-white bg-white/90 p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
    >
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
        {emoji}
      </div>
      <h2 className="mt-4 text-xl font-bold text-gray-900 group-hover:text-emerald-700">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-gray-600">{desc}</p>
      <div className="mt-4 text-sm font-semibold text-emerald-700">Đi tới →</div>
    </Link>
  )
}

function InfoBox({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} className="rounded-2xl bg-emerald-50 px-4 py-4 transition hover:bg-emerald-100">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">{label}</p>
      <p className="mt-2 text-base font-bold text-gray-900">{value}</p>
    </a>
  )
}
