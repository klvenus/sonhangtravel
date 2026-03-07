import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import BlogGalleryLightbox from '@/components/BlogGalleryLightbox'
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/blog'

export async function generateStaticParams() {
  const posts = await getAllBlogPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: 'Bài viết không tồn tại',
    }
  }

  return {
    title: `${post.title} | Blog Sơn Hằng Travel`,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `https://sonhangtravel.vercel.app/blog/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} | Sơn Hằng Travel`,
      description: post.description,
      url: `https://sonhangtravel.vercel.app/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      images: post.thumbnail
        ? [
            {
              url: post.thumbnail,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | Sơn Hằng Travel`,
      description: post.description,
      images: post.thumbnail ? [post.thumbnail] : undefined,
    },
  }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

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
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">{post.title}</h1>
          <p className="text-lg md:text-xl text-gray-600 leading-8">{post.description}</p>
        </div>

        {post.thumbnail && (
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl mb-10 bg-gray-100 shadow-sm">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1024px"
              priority
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none prose-p:text-gray-700 prose-p:leading-8 prose-h2:text-gray-900 prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4">
          {post.content.map((block, index) => {
            if (block.type === 'heading') {
              return <h2 key={index}>{block.text}</h2>
            }
            return <p key={index}>{block.text}</p>
          })}
        </div>

        {post.gallery && post.gallery.length > 0 && (
          <section className="mt-14 border-t border-gray-200 pt-10">
            <div className="mb-5">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Album ảnh chuyến đi</h2>
              <p className="text-gray-600 mt-2">Xem thêm một vài khoảnh khắc để cảm nhận rõ hơn vibe của hành trình.</p>
            </div>
            <BlogGalleryLightbox images={post.gallery} title={post.title} />
          </section>
        )}
      </article>
    </main>
  )
}
