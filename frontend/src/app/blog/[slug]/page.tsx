import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import BlogGalleryLightbox from '@/components/BlogGalleryLightbox'
import BlogSalePageEnhancer from '@/components/BlogSalePageEnhancer'
import SaleCountdown from '@/components/SaleCountdown'
import SaleActions from '@/components/SaleActions'
import TourCard from '@/components/TourCard'
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/blog'
import { getTours, getImageUrl } from '@/lib/data'

export const revalidate = 60

const SITE_URL = 'https://sonhangtravel.com'
const DEFAULT_OG_IMAGE = 'https://res.cloudinary.com/dzxntgoko/image/upload/v1772812681/sonhangtravel/pe1levewzcjvobldsvzr.jpg'
const ZALO_OA_URL = 'https://zalo.me/561113801789156735'
const STOP_MATCH_TOKENS = new Set([
  'tour', 'ngay', 'dem', 'trung', 'quoc', 'du', 'lich', 'noi', 'bat', 'ghep',
  'shopping', 'cao', 'cap', 'gia', 'tot', 'sale', 'uu', 'dai', 'hanh', 'trinh',
  'di', 've', 'cho', 'khach', 'son', 'hang', 'travel',
])

function normalizeVietnamese(text: string) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
}

function toPlainText(value?: string | null) {
  return (value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function shortenText(value?: string | null, maxLength = 220) {
  const text = toPlainText(value)
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).replace(/[\s,;:.!?-]+$/g, '')}…`
}

function tokenizeForMatch(text: string) {
  return Array.from(new Set(
    normalizeVietnamese(text)
      .split(/[^a-z0-9]+/)
      .map((token) => token.trim())
      .filter((token) => token.length > 2 && !STOP_MATCH_TOKENS.has(token))
  ))
}

function buildRelatedTours(post: NonNullable<Awaited<ReturnType<typeof getBlogPostBySlug>>>, tours: Awaited<ReturnType<typeof getTours>>['data']) {
  const contentText = post.content
    .flatMap((block) => [block.text || '', ...(block.items || [])])
    .join(' ')
  const searchText = normalizeVietnamese([
    post.title,
    post.description,
    post.excerpt,
    post.category,
    post.keywords.join(' '),
    contentText,
  ].join(' '))

  const scoredTours = tours
    .map((tour) => {
      const destinationText = normalizeVietnamese(tour.destination || '')
      const titleText = normalizeVietnamese(tour.title)
      const categoryText = normalizeVietnamese(tour.categoryName || '')
      const durationText = normalizeVietnamese(tour.duration || '')
      const titleTokens = tokenizeForMatch(tour.title)
      const destinationTokens = tokenizeForMatch(tour.destination || '')
      const categoryTokens = tokenizeForMatch(tour.categoryName || '')
      const durationTokens = tokenizeForMatch(tour.duration || '')

      let score = 0
      if (searchText.includes(titleText)) score += 16
      if (destinationText && searchText.includes(destinationText)) score += 10
      if (categoryText && searchText.includes(categoryText)) score += 8
      if (durationText && searchText.includes(durationText)) score += 4

      score += Math.min(10, titleTokens.filter((token) => searchText.includes(token)).length * 2)
      score += Math.min(6, destinationTokens.filter((token) => searchText.includes(token)).length * 2)
      score += Math.min(4, categoryTokens.filter((token) => searchText.includes(token)).length * 2)
      score += Math.min(2, durationTokens.filter((token) => searchText.includes(token)).length)

      return { tour, score }
    })
    .filter((item) => item.score >= 6)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return (b.tour.bookingCount || 0) - (a.tour.bookingCount || 0)
    })
  const selected = scoredTours.map((item) => item.tour).slice(0, 3)

  return selected.map((tour) => ({
    id: String(tour.id),
    title: /^tour\b/i.test(tour.title) ? tour.title : `Tour ${tour.title}`,
    slug: tour.slug,
    image: getImageUrl(tour.thumbnail, 'medium') || getImageUrl(tour.gallery?.[0], 'medium') || DEFAULT_OG_IMAGE,
    location: tour.destination,
    duration: tour.duration,
    price: tour.price,
    originalPrice: tour.originalPrice || undefined,
    rating: Number(tour.rating || 5),
    reviewCount: tour.reviewCount || 0,
    isHot: Boolean(tour.featured),
    categoryName: tour.categoryName,
    categorySlug: tour.categorySlug,
  }))
}

function normalizeMatchedUrl(url: string) {
  const trimmedUrl = url.trim().replace(/[.,!?;:]+$/g, '')

  try {
    const parsedUrl = new URL(trimmedUrl)

    if (parsedUrl.hostname === 'sonhangtravel.vercel.app') {
      return trimmedUrl.replace('https://sonhangtravel.vercel.app', SITE_URL)
    }
  } catch {}

  return trimmedUrl
}

function getFriendlyLinkLabel(href: string) {
  try {
    const url = new URL(href)
    if (url.hostname.includes('zalo.me')) return 'Zalo Sơn Hằng Travel'
    if (url.pathname.startsWith('/tour/')) return 'trang tour này'
    if (url.pathname.startsWith('/tours/')) return 'danh mục tour này'
    if (url.hostname.includes('sonhangtravel.com')) return 'trang này'
  } catch {}

  return 'liên kết này'
}

function renderLinkedText(text: string) {
  const parts: ReactNode[] = []
  const pattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s)]+)/g
  let lastIndex = 0
  let nodeIndex = 0

  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0
    if (index > lastIndex) {
      parts.push(text.slice(lastIndex, index))
    }

    const markdownLabel = match[1]
    const rawHref = normalizeMatchedUrl(match[2] || match[3] || '')
    const trailing = (match[0] || '').slice(rawHref.length)
    const label = markdownLabel?.trim() || getFriendlyLinkLabel(rawHref)
    const isInternal = rawHref.startsWith(SITE_URL)

    parts.push(
      isInternal ? (
        <Link key={`inline-${nodeIndex}`} href={rawHref} className="font-medium text-emerald-700 underline decoration-emerald-300 underline-offset-4 transition-colors hover:text-emerald-800">
          {label}
        </Link>
      ) : (
        <a
          key={`inline-${nodeIndex}`}
          href={rawHref}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-emerald-700 underline decoration-emerald-300 underline-offset-4 transition-colors hover:text-emerald-800"
        >
          {label}
        </a>
      )
    )

    if (trailing) {
      parts.push(trailing)
    }

    lastIndex = index + match[0].length
    nodeIndex += 1
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? parts : text
}

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
    .map((match) => normalizeMatchedUrl(match[0]))
    .filter((url) => {
      if (seen.has(url)) return false
      seen.add(url)
      return true
    })
}

function extractMarkdownLinks(text: string) {
  const matches = Array.from(text.matchAll(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g))
  const seen = new Set<string>()

  return matches
    .map((match) => ({
      label: match[1].trim(),
      href: normalizeMatchedUrl(match[2]),
    }))
    .filter((link) => {
      if (seen.has(link.href)) return false
      seen.add(link.href)
      return true
    })
}

function getLinkLabel(href: string, index = 0) {
  try {
    const url = new URL(href)
    if (url.pathname.includes('/tour/') || url.pathname.includes('/tours/')) {
      return index > 0 ? `Xem thêm tour ${index + 1}` : 'Xem chi tiết tour'
    }
  } catch {}

  return index > 0 ? `Xem thêm lựa chọn ${index + 1}` : 'Xem chi tiết'
}

function extractYouTubeVideoId(text: string) {
  const match = text.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/i)
  return match?.[1] || null
}

function extractScheduleData(text: string) {
  const cleaned = text.replace(/\s+/g, ' ').trim()
  if (!/ngày khởi hành|mở lịch|lịch khởi hành|đợt bay|đợt đi/i.test(cleaned)) {
    return null
  }

  const dateMatches = Array.from(cleaned.matchAll(/\b\d{1,2}\/\d{2}\b/g)).map((match) => match[0])
  const dates = Array.from(new Set(dateMatches))
  if (dates.length < 2) return null

  const priceMatch = cleaned.match(/(?:từ|giá|chỉ từ)?\s*((?:\d{1,3}(?:[.,]\d{3})+|\d+)\s*(?:đ|vnđ|vnd|triệu))/i)
  const introText = cleaned.split(':')[0]?.trim() || 'Lịch khởi hành đang mở'
  const noteText = cleaned
    .replace(introText, '')
    .replace(/^[\s:,-]+/, '')
    .replace(/\b\d{1,2}\/\d{2}\b/g, '')
    .replace(/\b(và|,|;|cùng)\b/gi, ' ')
    .replace(/[,:;]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const groupedByMonth = dates.reduce<Record<string, string[]>>((acc, date) => {
    const [day, month] = date.split('/')
    if (!acc[month]) acc[month] = []
    acc[month].push(day)
    return acc
  }, {})

  return {
    introText,
    noteText,
    priceText: priceMatch?.[1]?.trim() || null,
    groupedByMonth,
  }
}

function renderScheduleCard(text: string, key: number) {
  const schedule = extractScheduleData(text)
  if (!schedule) return null

  const monthEntries = Object.entries(schedule.groupedByMonth)

  return (
    <section key={key} className="not-prose my-8 overflow-hidden rounded-[24px] border border-orange-200 bg-white shadow-[0_20px_60px_rgba(249,115,22,0.12)] md:my-10">
      <div className="bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 px-5 py-5 text-white md:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Lịch mở bán</p>
            <h3 className="mt-2 text-xl font-bold leading-tight md:text-2xl">{schedule.introText}</h3>
          </div>
          {schedule.priceText && (
            <div className="inline-flex w-fit items-center rounded-2xl bg-white px-4 py-3 text-base font-bold text-rose-600 shadow-lg">
              {schedule.priceText}
            </div>
          )}
        </div>
      </div>

      <div className="px-5 py-5 md:px-6 md:py-6">
        <div className="overflow-hidden rounded-2xl border border-orange-100 bg-orange-50/40">
          <div className="grid grid-cols-[120px_1fr] border-b border-orange-100 bg-orange-100/70 text-sm font-semibold text-gray-700">
            <div className="px-4 py-3">Tháng</div>
            <div className="px-4 py-3">Ngày khởi hành</div>
          </div>

          {monthEntries.map(([month, days], index) => (
            <div
              key={month}
              className={`grid grid-cols-[120px_1fr] items-stretch ${index !== monthEntries.length - 1 ? 'border-b border-orange-100' : ''}`}
            >
              <div className="flex items-center border-r border-orange-100 bg-white px-4 py-4 text-lg font-bold text-gray-900">
                Tháng {month}
              </div>
              <div className="bg-white px-4 py-4">
                <div className="flex flex-wrap gap-2.5">
                  {days.map((day) => (
                    <div
                      key={`${month}-${day}`}
                      className="inline-flex min-w-[72px] items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600"
                    >
                      {day}/{month}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {schedule.noteText && (
          <p className="mt-4 text-[15px] leading-7 text-gray-600 md:text-base">{schedule.noteText}</p>
        )}
      </div>
    </section>
  )
}

function renderParagraph(text: string, key: number, isSalePost: boolean, forceCtaBlock = false, inheritedLinks: string[] = []) {
  const scheduleCard = renderScheduleCard(text, key)
  if (scheduleCard) {
    return scheduleCard
  }

  const markdownLinks = extractMarkdownLinks(text)
  const rawCtaMatch = text.match(/^(?:👉\s*)?(.+?):\s*(https?:\/\/\S+)$/)
  const match = rawCtaMatch
  const inlineLinks = extractInlineLinks(text)
  const resolvedLinks = forceCtaBlock ? (inlineLinks.length > 0 ? inlineLinks : inheritedLinks) : inlineLinks
  const shouldRenderInlineCta = forceCtaBlock && resolvedLinks.length > 0

  if (markdownLinks.length === 0 && !match && !shouldRenderInlineCta) {
    return <p key={key} className="mb-5 text-[17px] leading-8 text-gray-700 md:mb-6 md:text-[18px]">{renderLinkedText(text)}</p>
  }

  const href = match?.[2] || ''
  const label = match?.[1]?.trim() || ''
  const parts = markdownLinks.length > 0
    ? [text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '').replace(/\s{2,}/g, ' ').trim()]
    : match
      ? ['']
      : [text.replace(/https?:\/\/[^\s)]+/g, '').replace(/\s{2,}/g, ' ').trim()]

  const ctaLinks = shouldRenderInlineCta
    ? resolvedLinks.map((url, index) => ({ href: url, label: getLinkLabel(url, index) }))
    : markdownLinks.length > 0
      ? markdownLinks
      : [{ href, label }]

  const cardClass = isSalePost
    ? 'not-prose my-8 space-y-4 rounded-2xl border border-orange-200 bg-orange-50 p-5 md:my-10 md:p-6 shadow-sm'
    : 'not-prose my-8 space-y-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 md:my-10 md:p-6'

  const buttonClass = isSalePost
    ? 'group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-3 text-center font-semibold text-white no-underline shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:opacity-95'
    : 'group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#00CBA9] px-5 py-3 text-center font-semibold text-white no-underline shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#00b798]'

  return (
    <div key={key} className={cardClass}>
      <p className="text-sm font-semibold text-slate-900">Xem chi tiết hoặc nhắn bên em giữ chỗ</p>
      {parts[0] && <p className="text-[17px] leading-8 text-gray-700 md:text-[18px]">{renderLinkedText(parts[0].trim())}</p>}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {ctaLinks.map((link, index) => (
          <Link key={`${key}-${index}`} href={link.href} className={buttonClass}>
            <span>{link.label}</span>
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </Link>
        ))}
      </div>
      {parts[1] && <p className="text-[17px] leading-8 text-gray-700 md:text-[18px]">{renderLinkedText(parts[1].trim())}</p>}
    </div>
  )
}

function RecommendationSection({
  tours,
  isSalePost,
}: {
  tours: Array<{
    id: string
    title: string
    slug: string
    image: string
    location?: string | null
    duration?: string | null
    price?: number | null
    originalPrice?: number | null
    rating?: number | null
    reviewCount?: number | null
    isHot?: boolean
    categoryName?: string | null
  }>
  isSalePost: boolean
}) {
  const hasTours = tours.length > 0

  return (
    <section className="mt-14 border-t border-gray-200 pt-10">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            {hasTours ? 'Nếu thích đúng vibe này, nên xem tour nào?' : 'Chưa có tour khớp 100%, nhắn Zalo bên em nhé'}
          </h2>
          <p className="mt-2 text-gray-600">
            {hasTours
              ? 'Bên em để ngay các tour đang bán thật, liên quan trực tiếp tới bài viết này để khách xem tiếp cho nhanh.'
              : 'Bài này chưa khớp trọn với tour đang mở bán. Nhắn Zalo OA để bên em gợi ý đúng tuyến gần nhất, lịch phù hợp và báo giá nhanh.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={ZALO_OA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#00CBA9] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#00b798]"
          >
            <Image src="/icons/zalo.png" alt="Zalo" width={18} height={18} className="h-[18px] w-[18px]" />
            <span>Nhắn Zalo OA</span>
          </a>
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 transition-colors hover:border-[#059669] hover:text-[#059669]"
          >
            Xem tất cả tour
          </Link>
        </div>
      </div>

      {hasTours ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {tours.map((tour) => (
            <TourCard
              key={tour.id}
              id={tour.id}
              title={tour.title}
              slug={tour.slug}
              image={tour.image}
              location={tour.location || ''}
              duration={tour.duration || ''}
              price={tour.price || 0}
              originalPrice={tour.originalPrice ?? undefined}
              rating={tour.rating || 5}
              reviewCount={tour.reviewCount || 0}
              isHot={tour.isHot}
              category={tour.categoryName || undefined}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 md:p-6">
          <p className="text-sm leading-7 text-gray-600 md:text-base">
            Nhắn qua Zalo OA, bên em sẽ tư vấn nhanh tuyến gần nhất với nội dung bài viết này, kèm lịch khởi hành và mức giá hiện tại.
          </p>
        </div>
      )}
    </section>
  )
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [post, toursRes] = await Promise.all([
    getBlogPostBySlug(slug),
    getTours({ pageSize: 200, sort: 'bookingCount:desc' }),
  ])

  if (!post) {
    notFound()
  }

  const relatedTours = buildRelatedTours(post, toursRes.data || [])
  const relatedToursSchema = relatedTours.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `Tour phù hợp với bài viết ${post.title}`,
        itemListElement: relatedTours.map((tour, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${SITE_URL}/tour/${tour.slug}`,
        })),
      }
    : null

  const isSalePost = /thanh lý|suất cuối|ưu đãi|giảm còn|giá tốt|flash sale/i.test(`${post.title} ${post.excerpt} ${post.description}`)
  const publishedDate = new Date(post.publishedAt)
  const yyyy = publishedDate.getFullYear()
  const mm = String(publishedDate.getMonth() + 1).padStart(2, '0')
  const dd = String(publishedDate.getDate()).padStart(2, '0')
  const saleUntilIso = `${yyyy}-${mm}-${dd}T23:59:59+07:00`
  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`
  const articleImage = post.thumbnail || DEFAULT_OG_IMAGE
  const saleTourHref = `${SITE_URL}/tours`
  const saleZaloHref = ZALO_OA_URL
  const youtubeVideoId = post.content
    .map((block) => extractYouTubeVideoId(typeof block.text === 'string' ? block.text : ''))
    .find(Boolean) || null
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: shortenText(post.title, 110),
    description: shortenText(post.description, 220),
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
      const text = toPlainText(block.text || '')
      const parts = text.split('?')
      const question = parts[0]?.trim()
      const answer = parts.slice(1).join('?').trim()
      return question && answer
        ? {
            '@type': 'Question',
            name: `${shortenText(question, 140)}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: shortenText(answer, 220),
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
      {relatedToursSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(relatedToursSchema) }} />}
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

        {youtubeVideoId ? (
          <div className="mb-10 overflow-hidden rounded-3xl bg-black shadow-sm">
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                title={post.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        ) : post.thumbnail && (
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
                quality={100}
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
                  const nextBlock = index < mainBlocks.length - 1 ? mainBlocks[index + 1] : null
                  const afterCtaHeading = prevBlock?.type === 'heading' && /^cta$/i.test((prevBlock.text || '').trim())
                  const headingTextRaw = typeof block.text === 'string' ? block.text.trim() : ''
                  const isYoutubeSectionHeading = /^xem video thực tế của sơn hằng travel$/i.test(headingTextRaw)
                  const isYoutubeLinkParagraph = block.type === 'paragraph' && !!extractYouTubeVideoId(block.text || '')

                  if (isYoutubeSectionHeading || isYoutubeLinkParagraph) {
                    return null
                  }

                  if (block.type === 'heading') {
                    const headingText = (block.text || '').trim()
                    const isCtaHeading = /^(cta|liên hệ & giữ chỗ)$/i.test(headingText)
                    if (isCtaHeading) {
                      return null
                    }
                    return (
                      <h2
                        key={index}
                        className={[
                          isSalePost ? 'text-gray-900 font-bold tracking-tight' : '',
                        ].filter(Boolean).join(' ')}
                      >
                        {headingText}
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

                  if ((block as any).type === 'schedule') {
                    const scheduleBlock = block as any
                    const departures = Array.isArray(scheduleBlock.departures) ? scheduleBlock.departures.filter(Boolean) : []
                    const title = (scheduleBlock.title || '').trim()
                    const subtitle = (scheduleBlock.subtitle || '').trim()
                    const basePrice = (scheduleBlock.basePrice || '').trim()
                    const note = (scheduleBlock.note || '').trim()
                    const slots = (scheduleBlock.slots || '').trim()

                    if (!title || departures.length === 0) return null

                    return (
                      <section key={index} className="not-prose my-5 overflow-hidden rounded-[18px] border border-orange-200 bg-white shadow-[0_10px_24px_rgba(249,115,22,0.08)] md:my-10 md:rounded-[24px] md:shadow-[0_20px_60px_rgba(249,115,22,0.12)]">
                        <div className="border-b border-orange-100 bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 px-3.5 py-3 text-white md:px-6 md:py-5">
                          <div className="space-y-2 md:flex md:items-center md:justify-between md:gap-3 md:space-y-0">
                            <div>
                              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/80 md:text-xs">Lịch khởi hành</p>
                              <h3 className="mt-1 text-[16px] font-bold leading-snug md:mt-2 md:text-2xl">{title}</h3>
                              {subtitle && <p className="mt-1 text-[12px] leading-5 text-white/85 md:mt-2 md:text-base md:leading-6">{subtitle}</p>}
                            </div>
                            <div className="flex flex-wrap gap-2 md:justify-end">
                              {basePrice && (
                                <div className="inline-flex w-fit max-w-full items-center rounded-lg bg-white px-2.5 py-1.5 text-[13px] font-bold text-rose-600 shadow md:rounded-2xl md:px-4 md:py-3 md:text-base">
                                  Giá cơ bản: {basePrice}
                                </div>
                              )}
                              {slots && (
                                <div className="inline-flex w-fit max-w-full items-center rounded-lg bg-white/16 px-2.5 py-1.5 text-[13px] font-semibold text-white ring-1 ring-white/30 backdrop-blur-sm md:rounded-2xl md:px-4 md:py-3 md:text-base">
                                  Còn {slots}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="px-3.5 py-3.5 md:px-6 md:py-6">
                          <div className="overflow-hidden rounded-xl border border-orange-100 bg-white md:rounded-2xl">
                            <div className="hidden grid-cols-[1.1fr_1fr] border-b border-orange-100 bg-orange-100/70 text-sm font-semibold text-gray-700 md:grid">
                              <div className="px-4 py-3">Ngày khởi hành</div>
                              <div className="px-4 py-3">Giá</div>
                            </div>

                            <div className="divide-y divide-orange-100">
                              {departures.map((item: any, itemIndex: number) => (
                                <div key={`${index}-${itemIndex}`} className="flex items-center justify-between gap-3 bg-white px-3 py-2.5 md:grid md:grid-cols-[1.1fr_1fr] md:items-center md:gap-0 md:px-4 md:py-4">
                                  <div>
                                    <p className="text-[14px] font-semibold text-gray-900 md:text-[17px]">{item.date}</p>
                                  </div>
                                  <div className="text-right md:text-left">
                                    <p className="inline-flex w-fit max-w-full items-center rounded-full bg-rose-50 px-2.5 py-1 text-[12px] font-bold text-rose-600 ring-1 ring-rose-100 md:bg-transparent md:px-0 md:py-0 md:text-base md:ring-0">{item.price}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {note && <p className="mt-3 text-[13px] leading-5 text-gray-600 md:mt-4 md:text-base md:leading-7">{note}</p>}
                        </div>
                      </section>
                    )
                  }

                  const shouldHidePreCtaParagraph = block.type === 'paragraph'
                    && nextBlock?.type === 'heading'
                    && /^(cta|liên hệ & giữ chỗ)$/i.test((nextBlock.text || '').trim())
                    && extractInlineLinks(block.text || '').length > 0

                  if (shouldHidePreCtaParagraph) {
                    return null
                  }

                  const inheritedLinks = afterCtaHeading && prevPrevBlock?.type === 'paragraph'
                    ? extractInlineLinks(prevPrevBlock.text || '')
                    : []

                  if (afterCtaHeading) {
                    return null
                  }

                  return renderParagraph(block.text || '', index, isSalePost, false, inheritedLinks)
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

        <RecommendationSection tours={relatedTours} isSalePost={isSalePost} />

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
