import type { BlogPost } from '@/lib/blog'
import { getImageUrl } from '@/lib/data'
import Image from 'next/image'
import Link from 'next/link'

interface HomeNewsSectionProps {
  posts: BlogPost[]
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

function getCategoryClasses(category: string) {
  const normalized = category.toLowerCase()

  if (/uu dai|ưu đãi|sale|suat cuoi|suất cuối/.test(normalized)) {
    return 'border-rose-200 bg-rose-50 text-rose-700'
  }

  if (/cam nang|cẩm nang|kinh nghiem|kinh nghiệm|huong dan|hướng dẫn/.test(normalized)) {
    return 'border-sky-200 bg-sky-50 text-sky-700'
  }

  if (/feedback|dich vu|dịch vụ/.test(normalized)) {
    return 'border-violet-200 bg-violet-50 text-violet-700'
  }

  return 'border-emerald-200 bg-emerald-50 text-emerald-700'
}

function getPostHref(slug: string) {
  return `/blog/${slug}`
}

export default function HomeNewsSection({ posts }: HomeNewsSectionProps) {
  if (posts.length === 0) return null

  const [featuredPost, ...secondaryPosts] = posts

  return (
    <section id="home-news" className="border-t border-gray-100 bg-[linear-gradient(180deg,#ffffff_0%,#f7fbf9_100%)]">
      <div className="container-custom py-10 md:py-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Tin tức</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Lịch khởi hành, review tour và kinh nghiệm mới
            </h2>
            <p className="mt-3 text-sm leading-7 text-gray-600 md:text-base md:leading-8">
              Một khu riêng cho bài viết mới để khách xem nhanh thông tin tour, mẹo đi Trung Quốc và các cập nhật thực tế trước khi đặt chỗ.
            </p>
          </div>

          <Link
            href="/tintuc"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50"
          >
            Xem toàn bộ tin tức
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
          {featuredPost && (
            <article className="overflow-hidden rounded-[32px] border border-emerald-100 bg-white shadow-[0_20px_60px_rgba(15,118,110,0.08)]">
              <Link
                href={getPostHref(featuredPost.slug)}
                className="grid h-full lg:grid-cols-[1.02fr_0.98fr]"
              >
                <div className="relative aspect-[16/11] overflow-hidden bg-emerald-50 lg:h-full lg:aspect-auto">
                  {featuredPost.thumbnail ? (
                    <Image
                      src={getImageUrl(featuredPost.thumbnail, 'large')}
                      alt={featuredPost.title}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 52vw"
                      unoptimized
                    />
                  ) : null}
                </div>

                <div className="flex flex-col justify-center p-5 sm:p-6 md:p-8">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 sm:text-sm">
                    <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
                      Bài mới
                    </span>
                    <span className={`inline-flex rounded-full border px-3 py-1 font-medium ${getCategoryClasses(featuredPost.category)}`}>
                      {featuredPost.category}
                    </span>
                    <span>{formatDate(featuredPost.publishedAt)}</span>
                  </div>

                  <h3 className="mt-4 text-xl font-bold leading-tight text-gray-900 sm:text-2xl md:text-3xl">
                    {featuredPost.title}
                  </h3>

                  <p className="mt-4 line-clamp-4 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
                    {featuredPost.excerpt || featuredPost.description}
                  </p>

                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                    Đọc bài viết
                    <span aria-hidden>→</span>
                  </div>
                </div>
              </Link>
            </article>
          )}

          <div className="grid gap-4">
            {secondaryPosts.slice(0, 3).map((post) => (
              <article
                key={post.slug}
                className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <Link href={getPostHref(post.slug)} className="grid h-full grid-cols-[120px_minmax(0,1fr)]">
                  <div className="relative h-full min-h-[120px] overflow-hidden bg-gray-100">
                    {post.thumbnail ? (
                      <Image
                        src={getImageUrl(post.thumbnail, 'medium')}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                        sizes="120px"
                        unoptimized
                      />
                    ) : null}
                  </div>

                  <div className="p-4 sm:p-5">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500 sm:text-xs">
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 font-semibold ${getCategoryClasses(post.category)}`}>
                        {post.category}
                      </span>
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>

                    <h3 className="mt-3 line-clamp-2 text-sm font-bold leading-6 text-gray-900 sm:text-base">
                      {post.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                      {post.excerpt || post.description}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
