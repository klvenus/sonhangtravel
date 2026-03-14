import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import BlogGalleryLightbox from '@/components/BlogGalleryLightbox'
import BlogSalePageEnhancer from '@/components/BlogSalePageEnhancer'
import SaleCountdown from '@/components/SaleCountdown'
import SaleActions from '@/components/SaleActions'
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/blog'

const SITE_URL = 'https://sonhangtravel.com'
const DEFAULT_OG_IMAGE = 'https://res.cloudinary.com/dzxntgoko/image/upload/v1772812681/sonhangtravel/pe1levewzcjvobldsvzr.jpg'

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
      canonical: `${SITE_URL}/blog/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} | Sơn Hằng Travel`,
      description: post.description,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      images: [
        {
          url: post.thumbnail || DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | Sơn Hằng Travel`,
      description: post.description,
      images: [post.thumbnail || DEFAULT_OG_IMAGE],
    },
  }
}

function extractInlineLinks(text: string) {
  const matches = Array.from(text.matchAll(/https?:\/\/[^\s)]+/g))
  const seen = new Set<string>()

  return matches
    .map((match) => match[0].trim())
    .filter((url) => {
      if (seen.has(url)) return false
      seen.add(url)
      return true
    })
}

function getLinkLabel(href: string, index = 0) {
  try {
    const url = new URL(href)
    const slug = url.pathname.split('/').filter(Boolean).pop() || ''

    if (url.pathname.includes('/tour/') || url.pathname.includes('/tours/')) {
      const durationMatch = slug.match(/(\d+)-ngay-(\d+)-dem/i)
      if (durationMatch) {
        return `Xem tour ${durationMatch[1]}N${durationMatch[2]}Đ`
      }
      return index > 0 ? `Xem tour ${index + 1}` : 'Xem chi tiết tour'
    }
  } catch {}

  return index > 0 ? `Xem thêm lựa chọn ${index + 1}` : 'Xem chi tiết'
}

function renderParagraph(text: string, key: number, isSalePost: boolean, forceCtaBlock = false, inheritedLinks: string[] = []) {
  const markdownMatch = text.match(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/)
  const rawCtaMatch = text.match(/^(?:👉\s*)?(.+?):\s*(https?:\/\/\S+)$/)
  const match = markdownMatch || rawCtaMatch
  const inlineLinks = extractInlineLinks(text)
  const resolvedLinks = forceCtaBlock ? (inlineLinks.length > 0 ? inlineLinks : inheritedLinks) : inlineLinks
  const shouldRenderInlineCta = forceCtaBlock && resolvedLinks.length > 0

  if (!match && !shouldRenderInlineCta) {
    return <p key={key} className="mb-5 text-[17px] leading-8 text-gray-700 md:mb-6 md:text-[18px]">{text}</p>
  }

  const href = match?.[2] || ''
  const label = match?.[1]?.trim() || ''
  const full = match?.[0] || ''
  const parts = match
    ? (markdownMatch ? text.split(full) : [''])
    : [text.replace(/https?:\/\/[^\s)]+/g, '').replace(/\s{2,}/g, ' ').trim()]

  const ctaLinks = shouldRenderInlineCta
    ? resolvedLinks.map((url, index) => ({ href: url, label: getLinkLabel(url, index) }))
    : [{ href, label }]

  const cardClass = isSalePost
    ? 'not-prose my-8 space-y-4 rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 via-rose-50 to-amber-50 p-5 md:my-10 md:p-6 shadow-sm'
    : 'not-prose my-8 space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 md:my-10 md:p-6'

  const buttonClass = isSalePost
    ? 'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-3 text-center font-semibold text-white no-underline shadow-md transition-all hover:opacity-95'
    : 'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-center font-semibold text-white no-underline transition-colors hover:bg-emerald-700'

  return (
    <div key={key} className={cardClass}>
      {parts[0] && <p className="text-[17px] leading-8 text-gray-700 md:text-[18px]">{parts[0].trim()}</p>}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {ctaLinks.map((link, index) => (
          <Link key={`${key}-${index}`} href={link.href} className={buttonClass}>
            <span>{link.label}</span>
            <span>→</span>
          </Link>
        ))}
      </div>
      {parts[1] && <p className="text-[17px] leading-8 text-gray-700 md:text-[18px]">{parts[1].trim()}</p>}
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
  const publishedDate = new Date(post.publishedAt)
  const yyyy = publishedDate.getFullYear()
  const mm = String(publishedDate.getMonth() + 1).padStart(2, '0')
  const dd = String(publishedDate.getDate()).padStart(2, '0')
  const saleUntilIso = `${yyyy}-${mm}-${dd}T23:59:59+07:00`
  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`
  const articleImage = post.thumbnail || DEFAULT_OG_IMAGE
  const saleTourHref = `${SITE_URL}/tours`
  const saleZaloHref = 'https://zalo.me/0338239888'
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: [articleImage],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    mainEntityOfPage: canonicalUrl,
    author: {
      '@type': 'Organization',
      name: 'Sơn Hằng Travel',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Sơn Hằng Travel',
      logo: {
        '@type': 'ImageObject',
        url: DEFAULT_OG_IMAGE,
      },
    },
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: canonicalUrl },
    ],
  }
  const faqItems = post.content
    .filter((block) => block.type === 'paragraph' && typeof block.text === 'string' && block.text.includes('?'))
    .map((block) => {
      const text = block.text || ''
      const parts = text.split('?')
      const question = parts[0]?.trim()
      const answer = parts.slice(1).join('?').trim()
      return question && answer
        ? {
            '@type': 'Question',
            name: `${question}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: answer,
            },
          }
        : null
    })
    .filter(Boolean)
  const faqSchema = faqItems.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems,
      }
    : null

  return (
    <main className={isSalePost ? "bg-gradient-to-b from-rose-50 via-white to-orange-50" : "bg-white"}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
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

          {isSalePost && <SaleCountdown untilIso={saleUntilIso} />}
        </div>

        {post.thumbnail && (
          post.gallery && post.gallery.length > 1 && !isSalePost ? (
            <div className="mb-10">
              <BlogGalleryLightbox images={post.gallery} title={post.title} />
            </div>
          ) : (
            <div className={`relative overflow-hidden mb-10 bg-gray-100 shadow-sm ${isSalePost ? 'aspect-[4/5] md:aspect-[16/8] rounded-2xl ring-1 ring-orange-200' : 'aspect-[4/5] md:aspect-[16/10] rounded-3xl'}`}>
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className={`object-cover ${isSalePost ? 'scale-[1.02] transition-transform duration-700' : ''}`}
                sizes="(max-width: 768px) 100vw, 1024px"
                priority
              />
              {isSalePost && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent">
                  <div className="absolute left-4 right-4 bottom-4 md:left-8 md:right-8 md:bottom-8">
                    <div className="inline-flex items-center gap-2 rounded-lg bg-rose-500 text-white px-3 py-2 text-sm md:text-base font-bold shadow-lg animate-pulse">
                      🔥 ĐANG CÓ SUẤT GIÁ TỐT
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        )}

        <div className="prose prose-lg max-w-none prose-p:my-0 prose-p:text-gray-700 prose-p:leading-8 prose-h2:text-gray-900 prose-h2:font-bold prose-h2:mt-14 prose-h2:mb-5 prose-ul:my-7 prose-ol:my-7">
          {(() => {
            const faqIndex = post.content.findIndex((block) => block.type === 'heading' && typeof block.text === 'string' && block.text.trim().toLowerCase() === 'faq nhanh')
            const mainBlocks = faqIndex >= 0 ? post.content.slice(0, faqIndex) : post.content
            const faqBlocks = faqIndex >= 0 ? post.content.slice(faqIndex + 1) : []

            return (
              <>
                {mainBlocks.map((block, index) => {
                  const prevBlock = index > 0 ? mainBlocks[index - 1] : null
                  const prevPrevBlock = index > 1 ? mainBlocks[index - 2] : null
                  const afterCtaHeading = prevBlock?.type === 'heading' && /^cta$/i.test((prevBlock.text || '').trim())

                  if (block.type === 'heading') {
                    const headingText = (block.text || '').trim()
                    const isCtaHeading = /^cta$/i.test(headingText)
                    return (
                      <h2
                        key={index}
                        className={[
                          isSalePost ? 'text-gray-900 font-bold tracking-tight' : '',
                          isCtaHeading ? 'mt-16 mb-4 text-2xl md:text-3xl' : '',
                        ].filter(Boolean).join(' ')}
                      >
                        {isCtaHeading ? 'Liên hệ & giữ chỗ' : headingText}
                      </h2>
                    )
                  }

                  if (block.type === 'list') {
                    const items = Array.isArray(block.items) ? block.items.filter(Boolean) : []
                    if (items.length === 0) return null
                    const ListTag = block.style === 'ordered' ? 'ol' : 'ul'
                    return (
                      <ListTag key={index} className="my-5 space-y-3 pl-6 text-gray-700 leading-8 marker:text-emerald-600">
                        {items.map((item, itemIndex) => (
                          <li key={`${index}-${itemIndex}`}>{item}</li>
                        ))}
                      </ListTag>
                    )
                  }

                  const inheritedLinks = afterCtaHeading && prevPrevBlock?.type === 'paragraph'
                    ? extractInlineLinks(prevPrevBlock.text || '')
                    : []

                  return renderParagraph(block.text || '', index, isSalePost, afterCtaHeading, inheritedLinks)
                })}

                {faqBlocks.length > 0 && (
                  <section className={`not-prose mt-12 p-5 md:p-7 ${isSalePost ? 'rounded-2xl border border-orange-200 bg-gradient-to-b from-orange-50 to-white shadow-sm' : 'rounded-2xl border border-gray-200 bg-gray-50'}`}>
                    <div className="mb-5">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{isSalePost ? 'Cần chốt nhanh? Xem nhanh ở đây' : 'Câu hỏi thường gặp'}</h2>
                      <p className="text-gray-600 mt-2">{isSalePost ? 'Những câu hỏi khách hay quan tâm trước khi giữ suất.' : 'Một vài thắc mắc nhanh trước khi chọn tour.'}</p>
                    </div>
                    <div className="space-y-3">
                      {faqBlocks.map((block, index) => {
                        const text = block.text || ''
                        const parts = text.split('?')
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

        {isSalePost && <SaleActions untilIso={saleUntilIso} tourHref={saleTourHref} zaloHref={saleZaloHref} />}

        {!isSalePost && post.gallery && post.gallery.length === 1 && (
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
