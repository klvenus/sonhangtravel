import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getAllBlogPosts, type BlogPost } from '@/lib/blog'

const SITE_URL = 'https://sonhangtravel.com'
const DEFAULT_OG_IMAGE =
  'https://res.cloudinary.com/dzxntgoko/image/upload/v1772812681/sonhangtravel/pe1levewzcjvobldsvzr.jpg'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Blog Du Lịch Trung Quốc',
  description:
    'Chia sẻ kinh nghiệm đi Đông Hưng, Hà Khẩu, Nam Ninh, Vân Nam và các tuyến du lịch Trung Quốc từ Móng Cái, Lào Cai.',
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: 'Blog Du Lịch Trung Quốc | Sơn Hằng Travel',
    description:
      'Chia sẻ kinh nghiệm đi Đông Hưng, Hà Khẩu, Nam Ninh, Vân Nam và các tuyến du lịch Trung Quốc từ Móng Cái, Lào Cai.',
    url: `${SITE_URL}/blog`,
    type: 'website',
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Blog du lịch Trung Quốc | Sơn Hằng Travel',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Du Lịch Trung Quốc | Sơn Hằng Travel',
    description:
      'Chia sẻ kinh nghiệm đi Đông Hưng, Hà Khẩu, Nam Ninh, Vân Nam và các tuyến du lịch Trung Quốc từ Móng Cái, Lào Cai.',
    images: [DEFAULT_OG_IMAGE],
  },
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

function getCategoryClasses(category: string) {
  const normalized = category.toLowerCase()

  if (/ưu đãi|sale|suất cuối/.test(normalized)) {
    return 'bg-rose-100 text-rose-700 border-rose-200'
  }

  if (/cẩm nang|kinh nghiệm|hướng dẫn/.test(normalized)) {
    return 'bg-sky-100 text-sky-700 border-sky-200'
  }

  if (/feedback|dịch vụ/.test(normalized)) {
    return 'bg-violet-100 text-violet-700 border-violet-200'
  }

  return 'bg-emerald-100 text-emerald-700 border-emerald-200'
}

function buildBlogItemListSchema(posts: BlogPost[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}/blog#collection`,
    url: `${SITE_URL}/blog`,
    name: 'Blog du lịch Sơn Hằng Travel',
    hasPart: {
      '@type': 'ItemList',
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      numberOfItems: posts.length,
      itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}/blog/${post.slug}`,
        item: {
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt || post.description,
          datePublished: post.publishedAt,
          image: post.thumbnail || DEFAULT_OG_IMAGE,
          url: `${SITE_URL}/blog/${post.slug}`,
        },
      })),
    },
  }
}

function FeaturedPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group overflow-hidden rounded-[32px] border border-emerald-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/11] overflow-hidden bg-gradient-to-br from-emerald-200 via-cyan-100 to-orange-100">
        {post.thumbnail ? (
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1280px) 100vw, 900px"
            priority
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-white/90">
            <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 font-semibold backdrop-blur">
              Bài mới nổi bật
            </span>
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 backdrop-blur">
              {post.category}
            </span>
            <span>{formatDate(post.publishedAt)}</span>
          </div>
          <h2 className="max-w-4xl text-2xl font-bold leading-tight text-white md:text-4xl">
            {post.title}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/85 md:text-base">
            {post.excerpt || post.description}
          </p>
          <span className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition group-hover:bg-emerald-50">
            Đọc bài nổi bật
            <span>→</span>
          </span>
        </div>
      </Link>
    </article>
  )
}

function CompactPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="grid grid-cols-[120px_1fr] md:grid-cols-[148px_1fr]">
        <Link
          href={`/blog/${post.slug}`}
          className="relative block min-h-[140px] overflow-hidden bg-gradient-to-br from-emerald-100 via-cyan-50 to-orange-50"
        >
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="148px"
            />
          ) : null}
        </Link>

        <div className="p-4 md:p-5">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span className={`inline-flex rounded-full border px-2.5 py-1 font-semibold ${getCategoryClasses(post.category)}`}>
              {post.category}
            </span>
            <span>{formatDate(post.publishedAt)}</span>
          </div>
          <h3 className="text-base font-bold leading-snug text-gray-900 md:text-lg">
            <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-emerald-700">
              {post.title}
            </Link>
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">{post.excerpt || post.description}</p>
        </div>
      </div>
    </article>
  )
}

function BlogGridCard({ post }: { post: BlogPost }) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link
        href={`/blog/${post.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-gradient-to-br from-emerald-100 via-cyan-50 to-orange-50"
      >
        {post.thumbnail ? (
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        ) : null}
        <div className="absolute left-4 top-4">
          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur ${getCategoryClasses(post.category)}`}>
            {post.category}
          </span>
        </div>
      </Link>

      <div className="p-5 md:p-6">
        <div className="text-sm text-gray-500">{formatDate(post.publishedAt)}</div>
        <h3 className="mt-3 text-xl font-bold leading-tight text-gray-900">
          <Link href={`/blog/${post.slug}`} className="line-clamp-2 transition-colors hover:text-emerald-700">
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-4 text-sm leading-7 text-gray-600 md:text-base">
          {post.excerpt || post.description}
        </p>
        <Link
          href={`/blog/${post.slug}`}
          className="mt-5 inline-flex items-center gap-2 font-semibold text-emerald-700 transition hover:text-emerald-800"
        >
          Xem chi tiết
          <span>→</span>
        </Link>
      </div>
    </article>
  )
}

export default async function BlogPage() {
  const posts = await getAllBlogPosts()
  const [featuredPost, ...remainingPosts] = posts
  const quickReadPosts = remainingPosts.slice(0, 2)
  const gridPosts = remainingPosts.slice(2)
  const categories = Array.from(
    posts.reduce((map, post) => {
      map.set(post.category, (map.get(post.category) || 0) + 1)
      return map
    }, new Map<string, number>())
  ).sort((a, b) => b[1] - a[1])

  const blogCollectionSchema = posts.length > 0 ? buildBlogItemListSchema(posts) : null

  return (
    <main className="bg-gradient-to-b from-emerald-50/60 via-white to-orange-50/50">
      {blogCollectionSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogCollectionSchema) }}
        />
      )}

      <section className="border-b border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="max-w-4xl">
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-white/80 px-4 py-1.5 text-sm font-semibold text-emerald-700 backdrop-blur">
              Cẩm nang, lịch khởi hành, review và ưu đãi
            </span>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Blog du lịch nhìn gọn hơn, quét nhanh hơn
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-gray-600 md:text-lg">
              Tổng hợp bài viết mới nhất về Đông Hưng, Hà Khẩu, Nam Ninh, Vân Nam cùng các lịch khởi hành, ưu đãi và kinh nghiệm đi tour thực tế từ Sơn Hằng Travel.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-sm">
              <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Tổng bài viết</div>
              <div className="mt-1 text-2xl font-bold text-gray-900">{posts.length}</div>
            </div>
            {categories.slice(0, 5).map(([category, count]) => (
              <div
                key={category}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 text-sm text-gray-700 shadow-sm"
              >
                <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getCategoryClasses(category)}`}>
                  {category}
                </span>
                <span>{count} bài</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        {posts.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-emerald-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">Chưa có bài viết nào</h2>
            <p className="mt-3 text-gray-600">Khi admin đăng bài mới, trang blog sẽ tự cập nhật tại đây.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_380px]">
              <FeaturedPostCard post={featuredPost} />

              <div className="space-y-4">
                <div className="rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm md:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Đọc nhanh</p>
                      <h2 className="mt-2 text-2xl font-bold text-gray-900">Bài mới đang đáng xem</h2>
                    </div>
                    <Link href="/uu-dai" className="inline-flex shrink-0 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
                      Xem ưu đãi
                    </Link>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    Gom các bài mới nhất theo kiểu card ngắn gọn để khách nhìn một lượt là biết bài nào nên mở tiếp.
                  </p>
                </div>

                {quickReadPosts.map((post) => (
                  <CompactPostCard key={post.slug} post={post} />
                ))}
              </div>
            </div>

            <div className="mt-10">
              <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Toàn bộ bài viết</p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">Lưới bài viết dễ nhìn hơn</h2>
                </div>
                <p className="max-w-2xl text-sm leading-7 text-gray-600 md:text-base">
                  Các bài còn lại được hiển thị theo card đồng đều, ảnh rõ hơn, tiêu đề gọn hơn và dễ kéo xem tiếp trên cả điện thoại lẫn desktop.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {gridPosts.map((post) => (
                  <BlogGridCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  )
}
