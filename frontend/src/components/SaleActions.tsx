'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

export default function SaleActions({ untilIso, tourHref, zaloHref }: { untilIso: string; tourHref: string; zaloHref: string }) {
  const target = useMemo(() => new Date(untilIso).getTime(), [untilIso])
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  const expired = now >= target

  return (
    <div className="not-prose mt-8 rounded-2xl border border-orange-200 bg-white p-5 md:p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-orange-500 font-semibold">CTA hành động</p>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-1">
            {expired ? 'Ưu đãi đã hết, xem thông tin tour' : 'Giữ chỗ nhanh trước khi hết sale'}
          </h3>
          <p className="text-gray-600 mt-2 leading-7">
            {expired
              ? 'Bài ưu đãi đã hết thời gian, nhưng anh chị vẫn có thể xem đầy đủ thông tin tour để cân nhắc hành trình.'
              : 'Nếu muốn giữ 1 trong các suất còn lại, nên nhắn nhanh để được hỗ trợ chốt chỗ.'}
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-3 md:min-w-[360px]">
          <Link
            href={expired ? tourHref : zaloHref}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 font-semibold text-white shadow-md transition-all ${expired ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gradient-to-r from-orange-500 to-rose-500 hover:opacity-95 animate-pulse'}`}
          >
            {expired ? 'Xem thông tin tour' : 'Nhắn Zalo giữ chỗ ngay'}
            <span>→</span>
          </Link>
          <Link
            href={tourHref}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
          >
            Xem thông tin tour
          </Link>
        </div>
      </div>
    </div>
  )
}
