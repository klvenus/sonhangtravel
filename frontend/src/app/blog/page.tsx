import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllBlogPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog Du Lịch Trung Quốc',
  description:
    'Chia sẻ kinh nghiệm đi Đông Hưng, Hà Khẩu, Nam Ninh, Vân Nam và các tuyến du lịch Trung Quốc từ Móng Cái, Lào Cai.',
  alternates: {
    canonical: 'https://sonhangtravel.vercel.app/blog',
  },
}

export default async function BlogPage() {
  const posts = await getAllBlogPosts()

  return (
    <main className="bg-white">
      <section className="max-w-5xl mx-auto px-4 py-10 md:py-14">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Blog Du Lịch</h1>
          <p className="text-gray-600 text-base md:text-lg leading-7 max-w-3xl">
            Tổng hợp kinh nghiệm, lịch trình tham khảo và các bài viết hữu ích dành cho khách đang quan tâm đến
            tour Đông Hưng, Hà Khẩu, Nam Ninh, Vân Nam và những tuyến du lịch Trung Quốc phổ biến.
          </p>
        </div>

        <div className="grid gap-6">
          {posts.map((post) => (
            <article key={post.slug} className="border border-gray-200 rounded-2xl p-6 md:p-8 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 font-medium">
                  {post.category}
                </span>
                <span>{new Date(post.publishedAt).toLocaleDateString('vi-VN')}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                <Link href={`/blog/${post.slug}`} className="hover:text-emerald-700 transition-colors">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600 leading-7 mb-5">{post.excerpt}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-2 text-emerald-700 font-semibold hover:text-emerald-800"
              >
                Đọc bài viết
                <span>→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
