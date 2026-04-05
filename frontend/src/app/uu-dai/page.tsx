import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getAllBlogPosts } from '@/lib/blog'
import { getImageUrl } from '@/lib/data'

const SITE_URL = 'https://sonhangtravel.com'
const DEFAULT_OG_IMAGE = 'https://res.cloudinary.com/dzxntgoko/image/upload/v1772812681/sonhangtravel/pe1levewzcjvobldsvzr.jpg'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Ưu Đãi',
  description:
    'Tổng hợp các bài viết sale, suất cuối, ưu đãi và chương trình giá tốt mới nhất từ Sơn Hằng Travel.',
  alternates: {
    canonical: `${SITE_URL}/uu-dai`,
  },
  openGraph: {
    title: 'Ưu Đãi | Sơn Hằng Travel',
    description: 'Tổng hợp các bài viết sale, suất cuối, ưu đãi và chương trình giá tốt mới nhất từ Sơn Hằng Travel.',
    url: `${SITE_URL}/uu-dai`,
    type: 'website',
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Ưu đãi | Sơn Hằng Travel',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ưu Đãi | Sơn Hằng Travel',
    description: 'Tổng hợp các bài viết sale, suất cuối, ưu đãi và chương trình giá tốt mới nhất từ Sơn Hằng Travel.',
    images: [DEFAULT_OG_IMAGE],
  },
}

function isSalePost(text: string) {
  return /thanh lý|suất cuối|ưu đãi|giảm còn|giá tốt|flash sale|khuyến mại|khuyen mai/i.test(text)
}

export default async function SalePostsPage() {
  const posts = await getAllBlogPosts()
  const salePosts = posts.filter((post) =>
    isSalePost(`${post.title} ${post.excerpt} ${post.description} ${post.keywords.join(' ')}`)
  )

  return (
    <main className="bg-gradient-to-b from-rose-50 via-white to-orange-50">
      <section className="border-b border-orange-100 bg-gradient-to-br from-orange-50 via-rose-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="max-w-4xl">
            <span className="inline-flex items-center rounded-full bg-orange-100 px-4 py-1.5 text-sm font-semibold text-orange-700">
              ⚡ Ưu đãi / Bài sales
            </span>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Các bài viết ưu đãi đang hiển thị
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-gray-600 md:text-lg">
              Trang này tổng hợp các bài viết dạng sale, suất cuối, giảm giá và bài chốt nhanh để khách xem một chỗ cho tiện.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        {salePosts.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-orange-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">Chưa có bài ưu đãi nào</h2>
            <p className="mt-3 text-gray-600">Khi có bài viết mang nội dung sale / suất cuối / ưu đãi, trang này sẽ tự hiện.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {salePosts.map((post) => (
              <article
                key={post.slug}
                className="overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {post.thumbnail && (
                  <Link href={`/blog/${post.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <Image
                      src={getImageUrl(post.thumbnail, 'medium')}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                    <div className="absolute left-4 top-4 inline-flex rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white shadow">
                      Sale / Ưu đãi
                    </div>
                  </Link>
                )}

                <div className="p-6">
                  <div className="mb-3 flex items-center gap-3 text-sm text-gray-500">
                    <span>{new Date(post.publishedAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <h2 className="text-2xl font-bold leading-tight text-gray-900">
                    <Link href={`/blog/${post.slug}`} className="hover:text-rose-600 transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-3 line-clamp-4 text-gray-600 leading-7">{post.excerpt || post.description}</p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95"
                  >
                    Xem bài ưu đãi
                    <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
