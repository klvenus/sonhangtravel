import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import BlogGalleryLightbox from '@/components/BlogGalleryLightbox'
import BlogSalePageEnhancer from '@/components/BlogSalePageEnhancer'
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
      canonical: `https://sonhangtravel.com/blog/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} | Sơn Hằng Travel`,
      description: post.description,
      url: `https://sonhangtravel.com/blog/${post.slug}`,
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

function renderParagraph(text: string, key: number, isSalePost: boolean) {
  const match = text.match(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/)
  if (!match) return <p key={key}>{text}</p>

  const [full, label, href] = match
  const parts = text.split(full)

  if (isSalePost) {
    return (
      <div key={key} className="my-6 rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 via-rose-50 to-amber-50 p-4 md:p-5 not-prose shadow-sm">
        {parts[0] && <p className="mb-3 text-gray-700 leading-8">{parts[0].trim()}</p>}
        <Link
          href={href}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-3 font-semibold text-white no-underline shadow-md hover:opacity-95 transition-all animate-pulse"
        >
          {label}
          <span>→</span>
        </Link>
        {parts[1] && <p className="mt-3 text-gray-700 leading-8">{parts[1].trim()}</p>}
      </div>
    )
  }

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

  const isSalePost = /thanh lý|suất cuối|ưu đãi|giảm còn|giá tốt|flash sale/i.test(`${post.title} ${post.excerpt} ${post.description}`)

  return (
    <main className={isSalePost ? "bg-gradient-to-b from-rose-50 via-white to-orange-50" : "bg-white"}>
      {isSalePost && <BlogSalePageEnhancer />}
      <article className="max-w-4xl mx-auto px-4 py-10 md:py-14">
        <div className="mb-8">
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
            <span className={`inline-flex items-center px-3 py-1 font-medium ${isSalePost ? 'rounded-lg bg-orange-100 text-orange-700' : 'rounded-full bg-emerald-50 text-emerald-700'}`}>
              {isSalePost ? '⚡ Sale / Suất cuối' : post.category}
            </span>
            <span>{new Date(post.publishedAt).toLocaleDateString('vi-VN')}</span>
          </div>
          <h1 className={`leading-tight mb-4 font-bold ${isSalePost ? 'text-4xl md:text-6xl text-gray-900' : 'text-3xl md:text-5xl text-gray-900'}`}>{post.title}</h1>
          <p className={`leading-8 ${isSalePost ? 'text-xl md:text-2xl text-gray-700' : 'text-lg md:text-xl text-gray-600'}`}>{post.description}</p>

          {isSalePost && (
            <div className="mt-6 rounded-xl border border-orange-200 bg-white/80 backdrop-blur p-4 md:p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-3 text-sm md:text-base">
                <span className="rounded-lg bg-rose-100 text-rose-700 px-3 py-2 font-semibold animate-pulse">⏰ Số lượng có hạn</span>
                <span className="rounded-lg bg-orange-100 text-orange-700 px-3 py-2 font-semibold">🔥 Giá đang tốt, nên chốt sớm</span>
              </div>
            </div>
          )}
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
                    return <h2 key={index} className={isSalePost ? 'text-gray-900 font-bold tracking-tight' : ''}>{block.text}</h2>
                  }
                  return renderParagraph(block.text, index, isSalePost)
                })}

                {faqBlocks.length > 0 && (
                  <section className={`not-prose mt-12 p-5 md:p-7 ${isSalePost ? 'rounded-2xl border border-orange-200 bg-gradient-to-b from-orange-50 to-white shadow-sm' : 'rounded-2xl border border-gray-200 bg-gray-50'}`}>
                    <div className="mb-5">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{isSalePost ? 'Cần chốt nhanh? Xem nhanh ở đây' : 'Câu hỏi thường gặp'}</h2>
                      <p className="text-gray-600 mt-2">{isSalePost ? 'Những câu hỏi khách hay quan tâm trước khi giữ suất.' : 'Một vài thắc mắc nhanh trước khi chọn tour.'}</p>
                    </div>
                    <div className="space-y-3">
                      {faqBlocks.map((block, index) => {
                        const parts = block.text.split('?')
                        const question = parts[0]?.trim()
                        const answer = parts.slice(1).join('?').trim()
                        return (
                          <div key={`faq-${index}`} data-sale-faq-card={isSalePost ? 'true' : undefined} className={`rounded-xl p-4 md:p-5 ${isSalePost ? 'bg-white border border-orange-100 shadow-sm animate-[fadeInUp_.45s_ease-out_both]' : 'bg-white border border-gray-200'}`}>
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
