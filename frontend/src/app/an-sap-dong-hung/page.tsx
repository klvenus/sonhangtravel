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
      'Khám phá tiệm bánh, món ăn vặt và những quán nhỏ xinh đáng ghé ở Đông Hưng trong giao diện như một quyển menu gọi món cute pink.',
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
    <article className="group rounded-[30px] border border-rose-200 bg-white p-4 shadow-[0_6px_16px_rgba(244,114,182,0.06)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(244,114,182,0.10)] sm:p-5">
      <div className="flex gap-4">
        <Link href={`/blog/${post.slug}`} className="relative block h-28 w-24 shrink-0 overflow-hidden rounded-[22px] border border-rose-200 bg-[#fff7fb] sm:h-32 sm:w-28">
          <Image
            src={image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 96px, 112px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-rose-900/15 via-transparent to-transparent" />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-[#d07a9b]">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <span>•</span>
            <span>{mood}</span>
          </div>
          <h2 className="mt-2 text-lg font-bold leading-tight text-[#5f3b4d] sm:text-xl">
            <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-[#c45b8e]">
              {post.title}
            </Link>
          </h2>
          <p className="mt-2 line-clamp-2 text-sm leading-7 text-[#7d6170] sm:text-[15px]">
            {post.excerpt || post.description}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#d07a9b]">
            <span className="rounded-full border border-rose-200 bg-[#fff7fb] px-3 py-1 font-semibold text-[#b85f84]">{note}</span>
            <span>{formatDate(post.publishedAt)}</span>
          </div>

          <div className="mt-4 border-t border-dashed border-rose-200 pt-3">
            <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#c45b8e] transition hover:text-[#a94879]">
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
    <main className="min-h-screen bg-[#fffafb] py-8 text-[#5f3b4d] sm:py-10 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[34px] border border-rose-200 bg-[linear-gradient(180deg,#ffeaf3_0%,#ffddea_100%)] p-3 shadow-[0_12px_28px_rgba(244,114,182,0.08)] sm:p-5 lg:p-6">
          <div className="relative rounded-[30px] border border-white/90 bg-white/88 p-5 sm:p-6 lg:p-8">
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-0">
              <div className="relative rounded-[28px] border border-rose-200 bg-[linear-gradient(180deg,#fffafc_0%,#ffeef5_100%)] p-5 sm:p-7 lg:rounded-r-[10px] lg:border-r-0">
                <div className="absolute inset-y-6 right-0 hidden w-px bg-[linear-gradient(180deg,transparent,rgba(244,114,182,0.35),transparent)] lg:block" />
                <div className="inline-flex rounded-full border border-rose-200 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#d86a95]">
                  Tiệm bánh note nhỏ
                </div>
                <h1 className="mt-5 text-4xl font-bold leading-tight text-[#5f3b4d] sm:text-5xl">
                  Ăn sập Đông Hưng
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-7 text-[#7d6170] sm:text-base sm:leading-8">
                  Một góc nhỏ kiểu tiệm bánh online, gom lại những quán xinh, món ngọt và các điểm dừng nhẹ nhàng dễ khiến chuyến đi Đông Hưng trở nên đáng nhớ hơn.
                </p>

                <div className="mt-6 rounded-[24px] border border-rose-200 bg-white p-4 shadow-[0_6px_16px_rgba(236,72,153,0.05)] sm:p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d07a9b]">Gợi ý theo mood</p>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm font-semibold text-rose-900 sm:grid-cols-3">
                    {[
                      { label: 'Bánh ngọt', tone: 'bg-[#fff7fb] text-[#b85f84] border-rose-200' },
                      { label: 'Ăn vặt', tone: 'bg-[#fff5fb] text-fuchsia-700 border-fuchsia-200' },
                      { label: 'Mua quà', tone: 'bg-[#fff2f8] text-pink-700 border-pink-200' },
                      { label: 'Quán nhỏ xinh', tone: 'bg-[#faf5ff] text-violet-700 border-violet-200' },
                      { label: 'Ghé nhanh', tone: 'bg-[#fff7f1] text-orange-700 border-orange-200' },
                      { label: 'Đi dạo ghé thử', tone: 'bg-[#fff9ef] text-amber-700 border-amber-200' },
                    ].map((item) => (
                      <div key={item.label} className={`rounded-2xl border px-4 py-3 text-center shadow-sm ${item.tone}`}>
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 rounded-[24px] border border-rose-200 bg-[linear-gradient(135deg,#ffb8d1_0%,#ffc6db_55%,#ffd8e8_100%)] p-5 text-[#7a415d] shadow-[0_6px_16px_rgba(244,114,182,0.08)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#8c5471]">Note mở đầu</p>
                  <p className="mt-3 text-sm leading-7 sm:text-base sm:leading-8">
                    Không chỉ để mua sắm, Đông Hưng còn có nhiều quán nhỏ và món ngọt xinh xắn khiến hành trình trở nên nhẹ nhàng và dễ thương hơn hẳn.
                  </p>
                </div>
              </div>

              <div className="relative rounded-[28px] border border-rose-200 bg-[linear-gradient(180deg,#fffafd_0%,#fff1f7_100%)] p-5 sm:p-7 lg:rounded-l-[10px] lg:border-l-0">
                <div className="absolute inset-y-6 left-0 hidden w-px bg-[linear-gradient(180deg,transparent,rgba(244,114,182,0.35),transparent)] lg:block" />
                <div className="flex items-center justify-between gap-4 border-b border-dashed border-rose-200 pb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#d07a9b]">Trang gợi ý đầu bếp</p>
                    <h2 className="mt-2 text-2xl font-bold text-[#5f3b4d]">Gợi ý nên mở trước</h2>
                  </div>
                  <span className="rounded-full border border-rose-200 bg-[#fff7fb] px-4 py-2 text-sm font-semibold text-[#b85f84] shadow-sm">
                    Signature pick
                  </span>
                </div>

                {featured ? (
                  <div className="mt-5 grid gap-5 md:grid-cols-[0.82fr_1.18fr]">
                    <div className="relative min-h-[260px] overflow-hidden rounded-[26px] border border-rose-200 bg-[#fff7fb] shadow-[0_6px_16px_rgba(244,114,182,0.06)]">
                      <Image
                        src={featuredImage}
                        alt={featured.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 32vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-rose-950/20 via-transparent to-transparent" />
                      <div className="absolute left-4 top-4 rounded-full border border-white/60 bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#d07a9b]">
                        Cover menu
                      </div>
                    </div>
                    <div className="flex flex-col justify-between rounded-[26px] border border-rose-200 bg-white p-5 shadow-[0_6px_14px_rgba(244,114,182,0.05)]">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d07a9b]">Món mở đầu</p>
                        <h3 className="mt-3 text-2xl font-bold leading-tight text-[#5f3b4d] sm:text-3xl">
                          <Link href={`/blog/${featured.slug}`} className="transition-colors hover:text-[#c45b8e]">
                            {featured.title}
                          </Link>
                        </h3>
                        <p className="mt-4 text-sm leading-7 text-[#7d6170] sm:text-base sm:leading-8">
                          {featured.excerpt || featured.description}
                        </p>
                      </div>

                      <div className="mt-6 border-t border-dashed border-rose-200 pt-4">
                        <p className="text-sm italic leading-7 text-rose-800">
                          “Trong hành trình khám phá Đông Hưng cùng Sơn Hằng Travel, những điểm dừng nhỏ như vậy thường là phần khiến chuyến đi trở nên dễ nhớ hơn.”
                        </p>
                        <Link
                          href={`/blog/${featured.slug}`}
                          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#f28bb5_0%,#e993c7_100%)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_6px_14px_rgba(233,147,199,0.10)] transition hover:translate-y-[-1px]"
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

        <section className="mt-8 rounded-[32px] border border-rose-200 bg-[linear-gradient(180deg,#fffafd_0%,#fff5f9_100%)] p-4 shadow-[0_10px_22px_rgba(244,114,182,0.08)] sm:p-6 lg:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-dashed border-rose-200 pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#d07a9b]">Các món trong menu</p>
              <h2 className="mt-2 text-3xl font-bold text-[#5f3b4d]">Những quán nhỏ nên ghé thử</h2>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#b85f84] shadow-sm transition hover:border-fuchsia-300 hover:text-[#c45b8e]"
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
              <div className="rounded-[28px] border border-rose-200 bg-white p-8 text-center text-[#b85f84] shadow-[0_14px_34px_rgba(236,72,153,0.10)]">
                Chưa có món nào trong menu Đông Hưng.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
