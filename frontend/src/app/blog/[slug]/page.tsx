import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/blog'

export async function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: 'Bài viết không tồn tại',
    }
  }

  return {
    title: `${post.title} | Blog Sơn Hằng Travel`,
    description: post.description,
    alternates: {
      canonical: `https://sonhangtravel.vercel.app/blog/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} | Sơn Hằng Travel`,
      description: post.description,
      url: `https://sonhangtravel.vercel.app/blog/${post.slug}`,
      type: 'article',
    },
  }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="bg-white">
      <article className="max-w-4xl mx-auto px-4 py-10 md:py-14">
        <div className="mb-8">
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
            <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 font-medium">
              {post.category}
            </span>
            <span>{new Date(post.publishedAt).toLocaleDateString('vi-VN')}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">{post.title}</h1>
          <p className="text-lg text-gray-600 leading-8">{post.description}</p>
        </div>

        <div className="prose prose-lg max-w-none prose-p:text-gray-700 prose-p:leading-8">
          {post.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>
    </main>
  )
}
