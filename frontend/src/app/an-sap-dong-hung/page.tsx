import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getAllBlogPosts, type BlogPost } from '@/lib/blog'

const SITE_URL = 'https://sonhangtravel.com'
const DEFAULT_COVER =
  'https://res.cloudinary.com/dzxntgoko/image/upload/v1772812681/sonhangtravel/pe1levewzcjvobldsvzr.jpg'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Ăn sập Đông Hưng | Sơn Hằng Travel',
  description:
    'Cẩm nang quán ngon, tiệm bánh, đồ ăn vặt và những điểm dừng nhỏ đáng thử khi khám phá Đông Hưng cùng Sơn Hằng Travel.',
  alternates: {
    canonical: `${SITE_URL}/an-sap-dong-hung`,
  },
  openGraph: {
    title: 'Ăn sập Đông Hưng | Sơn Hằng Travel',
    description:
      'Khám phá tiệm bánh, món ăn vặt và những quán nhỏ xinh đáng ghé ở Đông Hưng trong một giao diện như quyển menu gọi món.',
    url: `${SITE_URL}/an-sap-dong-hung`,
    type: 'website',
    images: [
      {
        url: DEFAULT_COVER,
        width: 1200,
        height: 630,
        alt: 'Ăn sập Đông Hưng | Sơn Hằng Travel',
      },
    ],
  },
}

const moodTabs = [
  { label: 'Bánh ngọt', color: 'bg-rose-100 text-rose-800 border-rose-200' },
  { label: 'Ăn vặt', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { label: 'Mua quà', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { label: 'Quán nhỏ xinh', color: 'bg-sky-100 text-sky-800 border-sky-200' },
  { label: 'Ghé nhanh', color: 'bg-stone-100 text-stone-800 border-stone-200' },
]

const quickNotes = [
  'Ưu tiên những điểm dừng nhỏ, xinh và dễ ghé giữa hành trình dạo phố.',
  'Bài viết ngắn, dễ đọc, hợp kiểu xem nhanh rồi lưu lại để ghé thử.',
  'Giọng điệu tự nhiên, không nhồi quảng cáo thô, giữ cảm giác như một cuốn food guide.',
]

function isDongHungFoodPost(post: BlogPost) {
  const haystack = [
    post.title,
    post.description,
    post.excerpt,
    post.category,
    ...(post.keywords || []),
  ]
    .join(' ')
    .toLowerCase()

  return /(đông hưng|dong hung|food|ăn vặt|banh|bánh|quán|tiệm|ẩm thực|ẩm-thực)/.test(haystack)
}

function pickTags(post: BlogPost) {
  const haystack = [post.title, post.description, post.excerpt, ...(post.keywords || [])].join(' ').toLowerCase()
  const tags: string[] = ['Đông Hưng']

  if (/(bánh|cake|sweet|ngọt|tiệm bánh)/.test(haystack)) tags.push('Bánh ngọt')
  if (/(quà|mua về|mang về)/.test(haystack)) tags.push('Mua quà')
  if (/(ăn vặt|snack|đồ ăn)/.test(haystack)) tags.push('Ăn vặt')
  if (tags.length === 1) tags.push('Ghé thử')

  return tags.slice(0, 3)
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

function MenuCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  const tags = pickTags(post)
  const image = post.thumbnail || post.gallery?.[0] || DEFAULT_COVER

  return (
    <article
      className={`group relative overflow-hidden rounded-[28px] border border-[#d8c6ac] bg-[#fbf4e8] shadow-[0_18px_40px_rgba(62,44,33,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(62,44,33,0.18)] ${featured ? 'lg:min-h-[540px]' : ''}`}
    >
      <div className="absolute inset-x-6 top-0 h-3 rounded-b-full bg-[#d9b66b]/55 blur-[1px]" />
      <div className={`grid h-full ${featured ? 'lg:grid-cols-[1.08fr_0.92fr]' : ''}`}>
        <Link href={`/blog/${post.slug}`} className={`relative block overflow-hidden bg-[#eadcc7] ${featured ? 'min-h-[320px]' : 'aspect-[4/3]'}`}>
          <Image
            src={image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={featured ? '(max-width: 1024px) 100vw, 52vw' : '(max-width: 768px) 100vw, 33vw'}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3e2c21]/40 via-transparent to-transparent" />
          <div className="absolute left-4 top-4 inline-flex rounded-full border border-white/60 bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#6b4f3a] backdrop-blur">
            Menu chọn món
          </div>
        </Link>

        <div className="relative flex h-full flex-col justify-between p-5 sm:p-6 lg:p-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#7b634c]">
              <span className="rounded-full border border-[#d8c6ac] bg-white/70 px-3 py-1 font-semibold">{formatDate(post.publishedAt)}</span>
              {tags.map((tag) => (
                <span key={tag} className="rounded-full border border-[#e2d3bd] bg-[#fffaf2] px-3 py-1 font-medium">
                  {tag}
                </span>
              ))}
            </div>

            <h2 className={`mt-4 font-bold tracking-tight text-[#3e2c21] ${featured ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
              <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-[#8b3a3a]">
                {post.title}
              </Link>
            </h2>

            <p className={`mt-4 text-[#5e4c3f] ${featured ? 'text-base leading-8' : 'line-clamp-3 text-sm leading-7'}`}>
              {post.excerpt || post.description}
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-dashed border-[#d8c6ac] pt-4">
            <span className="text-sm font-medium text-[#7b634c]">Ghé xem gợi ý này</span>
            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#6b4f3a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#8b3a3a]"
            >
              Mở trang
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export default async function AnSapDongHungPage() {
  const allPosts = await getAllBlogPosts()
  const filteredPosts = allPosts.filter(isDongHungFoodPost)
  const posts = filteredPosts.length > 0 ? filteredPosts : allPosts.slice(0, 6)
  const [featuredPost, ...restPosts] = posts

  return (
    <main className="min-h-screen bg-[#f3eadc] text-[#3e2c21]">
      <section className="relative overflow-hidden border-b border-[#d9c4a6] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.72),_rgba(243,234,220,0.98))]">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(217,182,107,0.14),transparent_38%,rgba(107,79,58,0.08))]" />
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-16">
          <div className="relative overflow-hidden rounded-[34px] border border-[#c7ad89] bg-[#5e4333] p-7 text-[#f9f1e6] shadow-[0_28px_60px_rgba(62,44,33,0.26)] sm:p-8">
            <div className="absolute right-5 top-5 h-24 w-24 rounded-full border border-white/10 bg-white/5 blur-2xl" />
            <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#f3d9a3]">
              Menu đặc biệt
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl">Ăn sập Đông Hưng</h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#f5ead9] sm:text-base sm:leading-8">
              Cẩm nang quán ngon, tiệm bánh, đồ ăn vặt và những điểm dừng nhỏ đáng thử khi khám phá Đông Hưng. Giao diện được làm như một cuốn menu gọi món để lướt nhanh, chọn nhanh và lưu lại những chỗ đáng ghé.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {moodTabs.map((tab) => (
                <span
                  key={tab.label}
                  className={`inline-flex rounded-full border px-4 py-2 text-sm font-semibold shadow-sm ${tab.color}`}
                >
                  {tab.label}
                </span>
              ))}
            </div>

            <div className="mt-8 rounded-[26px] border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f3d9a3]">Note mở đầu</p>
              <p className="mt-3 text-base leading-8 text-[#f8f0e5]">
                Không chỉ để mua sắm, Đông Hưng còn có rất nhiều quán nhỏ xinh, tiệm bánh và những món ăn vặt khiến chuyến đi trở nên dễ nhớ hơn.
              </p>
            </div>
          </div>

          <div className="grid gap-5 self-stretch sm:grid-cols-2">
            {quickNotes.map((note, index) => (
              <div
                key={note}
                className={`rounded-[28px] border border-[#dcc9af] bg-[#fbf5eb] p-5 shadow-[0_18px_38px_rgba(62,44,33,0.10)] ${index === 0 ? 'sm:col-span-2' : ''}`}
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ead8bf] text-sm font-bold text-[#6b4f3a]">
                  0{index + 1}
                </div>
                <p className="mt-4 text-base leading-8 text-[#4c3c2f]">{note}</p>
              </div>
            ))}

            <div className="rounded-[28px] border border-[#dcc9af] bg-[linear-gradient(180deg,#fff7ea_0%,#f5ead8_100%)] p-6 shadow-[0_18px_38px_rgba(62,44,33,0.10)] sm:col-span-2">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8b3a3a]">Câu chốt brand</p>
              <blockquote className="mt-4 text-xl font-semibold leading-9 text-[#3e2c21] sm:text-2xl">
                “Trong hành trình khám phá Đông Hưng cùng Sơn Hằng Travel, những điểm dừng nhỏ như vậy thường là phần khiến chuyến đi trở nên dễ nhớ hơn.”
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8b3a3a]">Chọn món để ghé</p>
            <h2 className="mt-3 text-3xl font-bold text-[#3e2c21]">Gợi ý nổi bật trong cuốn menu Đông Hưng</h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-[#cbb28d] bg-white/80 px-5 py-2.5 text-sm font-semibold text-[#6b4f3a] transition hover:border-[#8b3a3a] hover:text-[#8b3a3a]"
          >
            Xem toàn bộ blog
            <span aria-hidden>→</span>
          </Link>
        </div>

        {featuredPost ? (
          <div className="grid gap-6">
            <MenuCard post={featuredPost} featured />
            {restPosts.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {restPosts.map((post) => (
                  <MenuCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-[28px] border border-[#dcc9af] bg-[#fbf4e8] p-8 text-center text-[#5e4c3f] shadow-[0_18px_38px_rgba(62,44,33,0.10)]">
            Chưa có bài nào trong thực đơn Đông Hưng. Khi có bài mới, trang này sẽ tự hiện theo phong cách menu gọi món.
          </div>
        )}
      </section>
    </main>
  )
}
