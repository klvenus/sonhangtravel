import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getAllBlogPosts, type BlogPost } from '@/lib/blog'
import { getImageUrl } from '@/lib/data'

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
      'Một góc nhỏ kiểu note đi ăn để lưu lại những quán xinh, món ngọt và điểm dừng dễ thương ở Đông Hưng.',
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
  const image = getImageUrl(post.thumbnail || post.gallery?.[0], 'medium') || DEFAULT_COVER
  const { mood, note } = pickMeta(post)

  return (
    <article className="overflow-hidden rounded-[24px] border border-rose-100 bg-white shadow-[0_8px_20px_rgba(236,72,153,0.06)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(236,72,153,0.08)]">
      <Link href={`/blog/${post.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-rose-50">
        <Image src={image} alt={post.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
      </Link>
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-rose-500">
          <span className="rounded-full bg-rose-50 px-3 py-1 font-semibold text-rose-700">{mood}</span>
          <span>{formatDate(post.publishedAt)}</span>
        </div>
        <h2 className="mt-3 text-lg font-bold leading-tight text-[#5d3a4b] sm:text-xl">
          <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-[#bf5b8c]">
            {post.title}
          </Link>
        </h2>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#7d6170]">{post.excerpt || post.description}</p>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-dashed border-rose-100 pt-4">
          <span className="text-xs font-medium text-[#b06a88]">{note}</span>
          <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#bf5b8c]">
            Xem bài <span aria-hidden>→</span>
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
    <main className="min-h-screen bg-[#fffafb] py-5 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[28px] border border-rose-100 bg-white shadow-[0_14px_34px_rgba(236,72,153,0.06)] sm:rounded-[32px]">
          <div className="p-5 sm:p-7 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:p-10">
            <div>
              <span className="inline-flex rounded-full border border-rose-100 bg-rose-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#d07a9b] sm:px-4 sm:text-[11px]">
                Góc note đi ăn
              </span>
              <h1 className="mt-4 text-[2.15rem] font-bold leading-none tracking-tight text-[#5d3a4b] sm:mt-5 sm:text-5xl">
                Ăn sập Đông Hưng
              </h1>
              <p className="mt-4 text-[15px] leading-7 text-[#7d6170] sm:max-w-2xl sm:text-base sm:leading-8">
                Một góc nhỏ để gom lại những quán xinh, món ngọt và các điểm dừng nhẹ nhàng ở Đông Hưng. Giữ giao diện sạch, cute và dễ nhìn, nhất là trên điện thoại.
              </p>

              <div className="mt-5 flex flex-wrap gap-2.5 sm:gap-3">
                {['Bánh ngọt', 'Ăn vặt', 'Mua quà', 'Quán nhỏ xinh', 'Ghé nhanh'].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-rose-100 bg-[#fff7fb] px-3.5 py-2 text-xs font-semibold text-[#b86289] sm:px-4 sm:text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-5 rounded-[22px] bg-[linear-gradient(135deg,#ffe7f1_0%,#fff4f8_100%)] p-4 sm:mt-6 sm:p-5">
                <p className="text-sm leading-7 text-[#7d6170] sm:text-[15px] sm:leading-8">
                  Trong hành trình khám phá Đông Hưng cùng Sơn Hằng Travel, những điểm dừng nhỏ như tiệm bánh, món ngọt hay quán xinh thường là phần khiến chuyến đi trở nên dễ nhớ hơn.
                </p>
              </div>
            </div>

            <div className="mt-5 lg:mt-0">
              <div className="rounded-[24px] border border-rose-100 bg-[linear-gradient(180deg,#fff4f8_0%,#fffafd_100%)] p-4 sm:p-5 lg:h-full">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#d07a9b]">Mood của trang</p>
                <h2 className="mt-3 text-xl font-bold text-[#5d3a4b] sm:text-2xl">Cute, nhẹ, sạch</h2>
                <p className="mt-3 text-sm leading-7 text-[#7d6170] sm:text-[15px] sm:leading-8">
                  Không kéo bài tour sang đây. Không nhồi banner bán hàng. Chỉ giữ đúng line quán bánh, đồ ngọt, ăn vặt và các điểm dừng nhỏ đúng chất Đông Hưng.
                </p>

                <div className="mt-4 grid gap-2.5 sm:mt-5 sm:gap-3">
                  <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-[#7d6170]">• Bài ngắn, ảnh đẹp, dễ bấm xem</div>
                  <div className="rounded-2xl bg-pink-50 px-4 py-3 text-sm text-[#7d6170]">• Tông pastel nhẹ, không quá đậm</div>
                  <div className="rounded-2xl bg-fuchsia-50 px-4 py-3 text-sm text-[#7d6170]">• Ưu tiên đẹp trên mobile trước</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-[28px] border border-rose-100 bg-white p-5 shadow-[0_12px_30px_rgba(236,72,153,0.05)] sm:mt-8 sm:rounded-[32px] sm:p-8">
          <div className="flex flex-col gap-3 border-b border-dashed border-rose-100 pb-4 sm:flex-row sm:items-end sm:justify-between sm:pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#d07a9b]">Bài trong thực đơn</p>
              <h2 className="mt-2 text-2xl font-bold text-[#5d3a4b] sm:text-3xl">Những chỗ nên ghé thử</h2>
            </div>
            <Link
              href="/blog"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-[#b86289]"
            >
              Xem toàn bộ blog <span aria-hidden>→</span>
            </Link>
          </div>

          {hasPosts ? (
            <div className="mt-5 grid gap-4 sm:mt-6 sm:gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <MenuCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-[24px] border border-dashed border-rose-200 bg-[#fff8fb] p-6 text-center sm:mt-6 sm:p-8">
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
