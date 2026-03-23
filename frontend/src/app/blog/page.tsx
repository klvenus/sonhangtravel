import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getAllBlogPosts, type BlogPost } from '@/lib/blog'

const SITE_URL = 'https://sonhangtravel.com'
const DEFAULT_OG_IMAGE =
  'https://res.cloudinary.com/dzxntgoko/image/upload/v1772812681/sonhangtravel/pe1levewzcjvobldsvzr.jpg'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Blog du lịch Trung Quốc | Kinh nghiệm, lịch khởi hành, điểm đến',
  description:
    'Blog Sơn Hằng Travel chia sẻ kinh nghiệm đi Đông Hưng, Hà Khẩu, Nam Ninh, Vân Nam, lịch khởi hành, ưu đãi và các điểm đến đang bán.',
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: 'Blog du lịch Trung Quốc | Sơn Hằng Travel',
    description:
      'Blog Sơn Hằng Travel chia sẻ kinh nghiệm đi Đông Hưng, Hà Khẩu, Nam Ninh, Vân Nam, lịch khởi hành, ưu đãi và các điểm đến đang bán.',
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
    title: 'Blog du lịch Trung Quốc | Sơn Hằng Travel',
    description:
      'Blog Sơn Hằng Travel chia sẻ kinh nghiệm đi Đông Hưng, Hà Khẩu, Nam Ninh, Vân Nam, lịch khởi hành, ưu đãi và các điểm đến đang bán.',
    images: [DEFAULT_OG_IMAGE],
  },
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

function getCategoryClasses(category: string) {
  const normalized = category.toLowerCase()

  if (/ưu đãi|sale|suất cuối/.test(normalized)) {
    return 'border-rose-200 bg-rose-50 text-rose-700'
  }

  if (/cẩm nang|kinh nghiệm|hướng dẫn/.test(normalized)) {
    return 'border-sky-200 bg-sky-50 text-sky-700'
  }

  if (/feedback|dịch vụ/.test(normalized)) {
    return 'border-violet-200 bg-violet-50 text-violet-700'
  }

  return 'border-emerald-200 bg-emerald-50 text-emerald-700'
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
    <article className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
      <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
        <Link
          href={`/blog/${post.slug}`}
          className="relative block aspect-[16/10] overflow-hidden bg-gray-100 sm:aspect-[16/9] lg:min-h-[420px] lg:aspect-auto"
        >
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 55vw"
              priority
            />
          ) : null}
        </Link>

        <div className="flex flex-col justify-center p-4 sm:p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 sm:text-sm">
            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700 sm:px-3">
              Bài mới nhất
            </span>
            <span className={`inline-flex rounded-full border px-2.5 py-1 font-medium ${getCategoryClasses(post.category)} sm:px-3`}>
              {post.category}
            </span>
            <span>{formatDate(post.publishedAt)}</span>
          </div>

          <h2 className="mt-3 text-lg font-bold leading-tight text-gray-900 sm:mt-4 sm:text-2xl md:text-4xl">
            <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-emerald-700">
              {post.title}
            </Link>
          </h2>

          <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600 sm:mt-4 sm:line-clamp-4 sm:text-base sm:leading-8">
            {post.excerpt || post.description}
          </p>

          <div className="mt-4 sm:mt-6">
            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:px-5 sm:py-3 sm:text-base"
            >
              Đọc bài viết
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

function BlogGridCard({ post }: { post: BlogPost }) {
  return (
    <article className="overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link
        href={`/blog/${post.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-gray-100 md:aspect-[16/10]"
      >
        {post.thumbnail ? (
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 50vw, 33vw"
          />
        ) : null}
      </Link>

      <div className="p-3 sm:p-4 md:p-6">
        <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-gray-500 sm:text-xs">
          <span className={`inline-flex rounded-full border px-2 py-0.5 font-semibold sm:px-3 sm:py-1 ${getCategoryClasses(post.category)}`}>
            {post.category}
          </span>
          <span className="truncate">{formatDate(post.publishedAt)}</span>
        </div>

        <h3 className="mt-2 text-[13px] font-bold leading-tight text-gray-900 sm:text-base md:mt-4 md:text-xl">
          <Link href={`/blog/${post.slug}`} className="line-clamp-3 transition-colors hover:text-emerald-700 md:line-clamp-2">
            {post.title}
          </Link>
        </h3>

        <p className="mt-3 hidden line-clamp-3 text-base leading-7 text-gray-600 md:block">
          {post.excerpt || post.description}
        </p>

        <Link
          href={`/blog/${post.slug}`}
          className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 transition hover:text-emerald-800 sm:text-sm md:mt-5 md:gap-2 md:text-base"
        >
          Xem
          <span>→</span>
        </Link>
      </div>
    </article>
  )
}

export default async function BlogPage() {
  const posts = await getAllBlogPosts()
  const [featuredPost, ...remainingPosts] = posts
  const blogCollectionSchema = posts.length > 0 ? buildBlogItemListSchema(posts) : null

  return (
    <main className="bg-white">
      {blogCollectionSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogCollectionSchema) }}
        />
      )}

      <section className="border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-4 py-8 md:py-14">
          <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            Blog du lịch
          </span>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl md:mt-5 md:text-5xl">Blog Du Lịch Trung Quốc</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600 sm:text-base md:mt-4 md:text-lg md:leading-8">
            Tổng hợp các bài viết mới về Đông Hưng, Hà Khẩu, Nam Ninh, Vân Nam cùng lịch khởi hành, ưu đãi và kinh nghiệm đi tour thực tế từ Sơn Hằng Travel.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 md:py-12">
        {posts.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-emerald-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">Chưa có bài viết nào</h2>
            <p className="mt-3 text-gray-600">Khi admin đăng bài mới, trang blog sẽ tự cập nhật tại đây.</p>
          </div>
        ) : (
          <>
            {featuredPost && (
              <div>
                <div className="mb-4 md:mb-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Mới nhất</p>
                  <h2 className="mt-1.5 text-xl font-bold text-gray-900 sm:text-2xl md:mt-2 md:text-3xl">Bài nổi bật đầu trang</h2>
                </div>
                <FeaturedPostCard post={featuredPost} />
              </div>
            )}

            {remainingPosts.length > 0 && (
              <div className="mt-8 md:mt-10">
                <div className="mb-4 md:mb-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Tất cả bài viết</p>
                  <h2 className="mt-1.5 text-xl font-bold text-gray-900 sm:text-2xl md:mt-2 md:text-3xl">Danh sách bài viết</h2>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
                  {remainingPosts.map((post) => (
                    <BlogGridCard key={post.slug} post={post} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  )
}
