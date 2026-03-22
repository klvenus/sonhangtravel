import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getAllBlogPosts, type BlogPost } from '@/lib/blog'

const SITE_URL = 'https://sonhangtravel.com'
const DEFAULT_COVER =
  'https://res.cloudinary.com/dzxntgoko/image/upload/v1772812681/sonhangtravel/pe1levewzcjvobldsvzr.jpg'

export const revalidate = 60

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
      'Một góc nhỏ kiểu menu tiệm bánh để lưu lại những quán xinh, món ngọt và điểm dừng dễ thương ở Đông Hưng.',
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

function isDongHungFoodPost(post: BlogPost) {
  const haystack = [post.title, post.description, post.excerpt, post.category, ...(post.keywords || [])]
    .join(' ')
    .toLowerCase()

  const dongHungSignals = /(đông hưng|dong hung)/.test(haystack)
  const foodSignals = /(city sweet|rolling|tiệm bánh|bánh ngọt|đồ ngọt|ăn vặt|quán nhỏ|quán ăn|mua về làm quà|món ngọt|dessert|bakery|cake|sweet)/.test(haystack)
  const badSignals = /(đi tour|khởi hành|chốt khách|chốt sớm|lịch khởi hành|ưu đãi|flash sale|cửa khẩu|hộ chiếu|feedback đoàn)/.test(haystack)

  return dongHungSignals && foodSignals && !badSignals
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

function pickMeta(post: BlogPost) {
  const haystack = [post.title, post.description, post.excerpt, ...(post.keywords || [])].join(' ').toLowerCase()
  const mood = /(bánh|cake|sweet|ngọt)/.test(haystack)
    ? 'Bánh ngọt'
    : /(ăn vặt|snack|đồ ăn)/.test(haystack)
      ? 'Ăn vặt'
      : 'Ghé thử'
  const note = /(quà|mua về|mang về)/.test(haystack)
    ? 'Hợp mua về làm quà'
    : /(xinh|check-in|đẹp)/.test(haystack)
      ? 'Quán nhỏ xinh dễ ghé'
      : 'Điểm dừng nhẹ giữa hành trình'

  return { mood, note }
}

function MenuCard({ post }: { post: BlogPost }) {
  const image = post.thumbnail || post.gallery?.[0] || DEFAULT_COVER
  const { mood, note } = pickMeta(post)

  return (
    <article className="overflow-hidden rounded-[28px] border border-rose-100 bg-white shadow-[0_10px_24px_rgba(236,72,153,0.06)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(236,72,153,0.10)]">
      <Link href={`/blog/${post.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-rose-50">
        <Image src={image} alt={post.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
      </Link>
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-rose-500">
          <span className="rounded-full bg-rose-50 px-3 py-1 font-semibold text-rose-700">{mood}</span>
          <span>{formatDate(post.publishedAt)}</span>
        </div>
        <h2 className="mt-3 text-xl font-bold leading-tight text-[#5d3a4b]">
          <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-[#bf5b8c]">
            {post.title}
          </Link>
        </h2>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#7d6170]">{post.excerpt || post.description}</p>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-dashed border-rose-100 pt-4">
          <span className="text-xs font-medium text-[#b06a88]">{note}</span>
          <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#bf5b8c]">
            Xem bài
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </article>
  )
}

export default async function AnSapDongHungPage() {
  const allPosts = await getAllBlogPosts()
  const posts = allPosts.filter(isDongHungFoodPost).slice(0, 6)
  const hasPosts = posts.length > 0

  return (
    <main className="min-h-screen bg-[#fffafb] py-8 sm:py-10 lg:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[32px] border border-rose-100 bg-white shadow-[0_18px_50px_rgba(236,72,153,0.08)]">
          <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <span className="inline-flex rounded-full border border-rose-100 bg-rose-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d07a9b]">
                Góc tiệm bánh note nhỏ
              </span>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-[#5d3a4b] sm:text-5xl">
                Ăn sập Đông Hưng
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-[#7d6170]">
                Một góc nhỏ để gom lại những quán xinh, món ngọt và các điểm dừng nhẹ nhàng ở Đông Hưng. Không cố làm quá nhiều hiệu ứng, chỉ giữ cảm giác sạch, dễ thương và dễ nhìn như một cuốn note đi ăn.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {['Bánh ngọt', 'Ăn vặt', 'Mua quà', 'Quán nhỏ xinh', 'Ghé nhanh'].map((item) => (
                  <span key={item} className="rounded-full border border-rose-100 bg-[#fff7fb] px-4 py-2 text-sm font-semibold text-[#b86289]">
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-8 rounded-[24px] bg-[linear-gradient(135deg,#ffe7f1_0%,#fff4f8_100%)] p-5">
                <p className="text-sm leading-8 text-[#7d6170]">
                  Trong hành trình khám phá Đông Hưng cùng Sơn Hằng Travel, những điểm dừng nhỏ như tiệm bánh, món ngọt hay quán xinh thường là phần khiến chuyến đi trở nên dễ nhớ hơn.
                </p>
              </div>
            </div>

            <div className="relative min-h-[260px] bg-[linear-gradient(180deg,#ffeef6_0%,#fff8fb_100%)] p-6 sm:p-8 lg:p-10">
              <div className="absolute inset-x-10 top-10 h-28 rounded-full bg-pink-100/70 blur-3xl" />
              <div className="relative flex h-full flex-col justify-between rounded-[28px] border border-rose-100 bg-white/90 p-6 shadow-[0_12px_28px_rgba(236,72,153,0.07)]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d07a9b]">Mood của trang</p>
                  <h2 className="mt-3 text-2xl font-bold text-[#5d3a4b]">Cute, nhẹ, sạch</h2>
                  <p className="mt-4 text-sm leading-7 text-[#7d6170]">
                    Không kéo bài tour sang đây. Không nhồi banner bán hàng. Chỉ giữ đúng line quán bánh, đồ ngọt, ăn vặt và các điểm dừng nhỏ đúng chất Đông Hưng.
                  </p>
                </div>

                <div className="mt-6 grid gap-3 text-sm text-[#7d6170]">
                  <div className="rounded-2xl bg-rose-50 px-4 py-3">• Bài ngắn, ảnh đẹp, dễ bấm xem</div>
                  <div className="rounded-2xl bg-pink-50 px-4 py-3">• Tông pastel nhẹ, không quá đậm</div>
                  <div className="rounded-2xl bg-fuchsia-50 px-4 py-3">• Phù hợp làm hub cho line đồ ăn Đông Hưng</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[32px] border border-rose-100 bg-white p-6 shadow-[0_16px_40px_rgba(236,72,153,0.06)] sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-dashed border-rose-100 pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d07a9b]">Bài trong thực đơn</p>
              <h2 className="mt-2 text-3xl font-bold text-[#5d3a4b]">Những chỗ nên ghé thử</h2>
            </div>
            <Link href="/blog" className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-5 py-2.5 text-sm font-semibold text-[#b86289]">
              Xem toàn bộ blog
              <span aria-hidden>→</span>
            </Link>
          </div>

          {hasPosts ? (
            <div className="mt-6 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <MenuCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[28px] border border-dashed border-rose-200 bg-[#fff8fb] p-8 text-center">
              <p className="text-lg font-semibold text-[#5d3a4b]">Chưa có bài đúng line đồ ăn Đông Hưng</p>
              <p className="mt-3 text-sm leading-7 text-[#7d6170]">
                Khi có thêm các bài kiểu City Sweet, bánh ngọt, quán xinh và ăn vặt đúng mood Đông Hưng, phần này sẽ tự đầy lên đẹp hơn. Hiện em để sạch thay vì cố nhét bài không hợp vào đây.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
