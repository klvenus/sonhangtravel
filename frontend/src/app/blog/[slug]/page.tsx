import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
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

function renderParagraph(text: string, key: number) {
  const match = text.match(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/)
  if (!match) return <p key={key}>{text}</p>

  const [full, label, href] = match
  const parts = text.split(full)

  return (
    <div key={key} className="my-6 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 md:p-5 not-prose">
      {parts[0] && <p className="mb-3 text-gray-700 leading-8">{parts[0].trim()}</p>}
      <Link
        href={href}
        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white no-underline hover:bg-emerald-700 transition-colors"
      >
        {label}
        <span>→</span>
      </Link>
      {parts[1] && <p className="mt-3 text-gray-700 leading-8">{parts[1].trim()}</p>}
    </div>
  )
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
          {(() => {
            const faqIndex = post.content.findIndex((block) => block.type === 'heading' && block.text.trim().toLowerCase() === 'faq nhanh')
            const mainBlocks = faqIndex >= 0 ? post.content.slice(0, faqIndex) : post.content
            const faqBlocks = faqIndex >= 0 ? post.content.slice(faqIndex + 1) : []

            return (
              <>
                {mainBlocks.map((block, index) => {
                  if (block.type === 'heading') {
                    return <h2 key={index}>{block.text}</h2>
                  }
                  return renderParagraph(block.text, index)
                })}

                {faqBlocks.length > 0 && (
                  <section className="not-prose mt-12 rounded-2xl border border-gray-200 bg-gray-50 p-5 md:p-7">
                    <div className="mb-5">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Câu hỏi thường gặp</h2>
                      <p className="text-gray-600 mt-2">Một vài thắc mắc nhanh trước khi chọn tour.</p>
                    </div>
                    <div className="space-y-3">
                      {faqBlocks.map((block, index) => {
                        const parts = block.text.split('?')
                        const question = parts[0]?.trim()
                        const answer = parts.slice(1).join('?').trim()
                        return (
                          <div key={`faq-${index}`} className="rounded-xl bg-white border border-gray-200 p-4 md:p-5">
                            <h3 className="font-semibold text-gray-900 leading-7">{question}?</h3>
                            {answer && <p className="text-gray-600 mt-2 leading-7">{answer}</p>}
                          </div>
                        )
                      })}
                    </div>
                  </section>
                )}
              </>
            )
          })()}
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
