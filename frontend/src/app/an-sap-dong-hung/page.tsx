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
      'Khám phá tiệm bánh, món ăn vặt và những quán nhỏ xinh đáng ghé ở Đông Hưng trong giao diện như một quyển menu gọi món.',
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

  return /(đông hưng|dong hung|food|ăn vặt|banh|bánh|quán|tiệm|ẩm thực|ẩm-thực|city sweet|rolling)/.test(haystack)
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

function MenuListItem({ post, index }: { post: BlogPost; index: number }) {
  const image = post.thumbnail || post.gallery?.[0] || DEFAULT_COVER
  const { mood, note } = pickMeta(post)

  return (
    <article className="rounded-[28px] border border-[#d6c0a1] bg-[#fffaf1] p-4 shadow-[0_10px_24px_rgba(90,62,38,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(90,62,38,0.12)] sm:p-5">
      <div className="flex gap-4">
        <Link href={`/blog/${post.slug}`} className="relative block h-28 w-24 shrink-0 overflow-hidden rounded-[20px] border border-[#ddccb3] bg-[#efe2cb] sm:h-32 sm:w-28">
          <Image
            src={image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 96px, 112px"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-[#9a7457]">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <span>•</span>
            <span>{mood}</span>
          </div>
          <h2 className="mt-2 text-lg font-bold leading-tight text-[#4a3325] sm:text-xl">
            <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-[#8f3c34]">
              {post.title}
            </Link>
          </h2>
          <p className="mt-2 line-clamp-2 text-sm leading-7 text-[#6e5543] sm:text-[15px]">
            {post.excerpt || post.description}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#7a5a45]">
            <span className="rounded-full border border-[#dfccb0] bg-[#f9efdd] px-3 py-1 font-semibold">{note}</span>
            <span>{formatDate(post.publishedAt)}</span>
          </div>

          <div className="mt-4 border-t border-dashed border-[#dbc6a8] pt-3">
            <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#7f3f32] transition hover:text-[#5c2e25]">
              Xem món này
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
  const featured = posts[0]
  const menuItems = posts.slice(1, 7)
  const featuredImage = featured?.thumbnail || featured?.gallery?.[0] || DEFAULT_COVER

  return (
    <main className="min-h-screen bg-[#efe3d0] py-8 text-[#4a3325] sm:py-10 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[36px] border border-[#b88c68] bg-[#6b4732] p-3 shadow-[0_30px_80px_rgba(62,44,33,0.28)] sm:p-5 lg:p-6">
          <div className="rounded-[30px] border border-[#d0b08e]/60 bg-[#f7ead5] p-5 sm:p-6 lg:p-8">
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-0">
              <div className="relative rounded-[28px] border border-[#d7c3a5] bg-[linear-gradient(180deg,#fbf4e8_0%,#f2e2c8_100%)] p-5 shadow-inner sm:p-7 lg:rounded-r-[10px] lg:border-r-0">
                <div className="absolute inset-y-6 right-0 hidden w-px bg-[linear-gradient(180deg,transparent,#c8a884,transparent)] lg:block" />
                <div className="inline-flex rounded-full border border-[#ceb08a] bg-[#fff7eb] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#8d6648]">
                  Sổ menu gọi món
                </div>
                <h1 className="mt-5 text-4xl font-bold leading-tight text-[#4a3325] sm:text-5xl">
                  Ăn sập Đông Hưng
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-7 text-[#654d3d] sm:text-base sm:leading-8">
                  Một cuốn menu online dành cho những quán nhỏ xinh, tiệm bánh, món ăn vặt và các điểm dừng dễ khiến chuyến đi Đông Hưng trở nên đáng nhớ hơn.
                </p>

                <div className="mt-6 rounded-[24px] border border-[#dbc6a8] bg-[#fffaf1] p-4 sm:p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9d7255]">Gợi ý theo mood</p>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm font-semibold text-[#5f4636] sm:grid-cols-3">
                    {['Bánh ngọt', 'Ăn vặt', 'Mua quà', 'Quán nhỏ xinh', 'Ghé nhanh', 'Đi dạo ghé thử'].map((item) => (
                      <div key={item} className="rounded-2xl border border-[#e2d3bc] bg-[#f9efde] px-4 py-3 text-center shadow-sm">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 rounded-[24px] border border-[#d9c4a6] bg-[#5f3f2e] p-5 text-[#fff5ea] shadow-[0_12px_28px_rgba(62,44,33,0.18)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#f1d5a9]">Note mở đầu</p>
                  <p className="mt-3 text-sm leading-7 sm:text-base sm:leading-8">
                    Không chỉ để mua sắm, Đông Hưng còn có rất nhiều quán nhỏ, tiệm bánh và những món ăn vặt khiến hành trình trở nên mềm hơn, vui hơn và dễ nhớ hơn.
                  </p>
                </div>
              </div>

              <div className="relative rounded-[28px] border border-[#d7c3a5] bg-[linear-gradient(180deg,#fffaf1_0%,#f7ead6_100%)] p-5 shadow-inner sm:p-7 lg:rounded-l-[10px] lg:border-l-0">
                <div className="absolute inset-y-6 left-0 hidden w-px bg-[linear-gradient(180deg,transparent,#c8a884,transparent)] lg:block" />
                <div className="flex items-center justify-between gap-4 border-b border-dashed border-[#d7c3a5] pb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#9d7255]">Trang gợi ý đầu bếp</p>
                    <h2 className="mt-2 text-2xl font-bold text-[#4a3325]">Món nên mở trước</h2>
                  </div>
                  <span className="rounded-full border border-[#d7c3a5] bg-[#fbf0de] px-4 py-2 text-sm font-semibold text-[#7a5a45]">
                    Signature pick
                  </span>
                </div>

                {featured ? (
                  <div className="mt-5 grid gap-5 md:grid-cols-[0.82fr_1.18fr]">
                    <div className="relative min-h-[260px] overflow-hidden rounded-[26px] border border-[#dcc6aa] bg-[#efe2cb]">
                      <Image
                        src={featuredImage}
                        alt={featured.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 32vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#4a3325]/50 via-transparent to-transparent" />
                      <div className="absolute left-4 top-4 rounded-full border border-white/40 bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#7a5a45]">
                        Cover menu
                      </div>
                    </div>
                    <div className="flex flex-col justify-between rounded-[26px] border border-[#dcc6aa] bg-[#fffdf8] p-5 shadow-sm">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9d7255]">Món mở đầu</p>
                        <h3 className="mt-3 text-2xl font-bold leading-tight text-[#4a3325] sm:text-3xl">
                          <Link href={`/blog/${featured.slug}`} className="transition-colors hover:text-[#8f3c34]">
                            {featured.title}
                          </Link>
                        </h3>
                        <p className="mt-4 text-sm leading-7 text-[#6e5543] sm:text-base sm:leading-8">
                          {featured.excerpt || featured.description}
                        </p>
                      </div>

                      <div className="mt-6 border-t border-dashed border-[#dcc6aa] pt-4">
                        <p className="text-sm italic leading-7 text-[#6b4f3a]">
                          “Trong hành trình khám phá Đông Hưng cùng Sơn Hằng Travel, những điểm dừng nhỏ như vậy thường là phần khiến chuyến đi trở nên dễ nhớ hơn.”
                        </p>
                        <Link
                          href={`/blog/${featured.slug}`}
                          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#7f3f32] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5f2e26]"
                        >
                          Mở bài này
                          <span aria-hidden>→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[34px] border border-[#c9a37f] bg-[#f8ecd8] p-4 shadow-[0_22px_48px_rgba(90,62,38,0.14)] sm:p-6 lg:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-dashed border-[#d7c3a5] pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#9d7255]">Các món trong menu</p>
              <h2 className="mt-2 text-3xl font-bold text-[#4a3325]">Lật tiếp để chọn quán nên ghé</h2>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-[#cfb08c] bg-[#fff8ed] px-5 py-2.5 text-sm font-semibold text-[#6b4f3a] transition hover:border-[#8f3c34] hover:text-[#8f3c34]"
            >
              Xem toàn bộ blog
              <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {menuItems.length > 0 ? (
              menuItems.map((post, index) => <MenuListItem key={post.id} post={post} index={index + 1} />)
            ) : featured ? (
              <MenuListItem post={featured} index={1} />
            ) : (
              <div className="rounded-[28px] border border-[#d6c0a1] bg-[#fffaf1] p-8 text-center text-[#6e5543]">
                Chưa có món nào trong menu Đông Hưng.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
