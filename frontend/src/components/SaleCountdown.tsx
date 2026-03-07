'use client'

import { useEffect, useMemo, useState } from 'react'

function formatTime(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const days = Math.floor(total / 86400)
  const hours = Math.floor((total % 86400) / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  return { days, hours, minutes, seconds }
}

export default function SaleCountdown({ untilIso }: { untilIso: string }) {
  const target = useMemo(() => new Date(untilIso).getTime(), [untilIso])
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  const expired = now >= target
  const left = formatTime(target - now)

  if (expired) {
    return (
      <div className="mt-6 rounded-xl border border-gray-300 bg-gray-100 p-4 md:p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 text-sm md:text-base">
          <span className="rounded-lg bg-gray-800 text-white px-3 py-2 font-semibold">⏰ Đã hết thời gian ưu đãi</span>
          <span className="rounded-lg bg-white text-gray-700 px-3 py-2 font-medium border border-gray-200">Bài sale đã hết hạn, anh chị có thể xem thông tin tour để tham khảo thêm.</span>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-6 rounded-xl border border-orange-200 bg-white/90 backdrop-blur p-4 md:p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-3 text-sm md:text-base mb-4">
        <span className="rounded-lg bg-rose-100 text-rose-700 px-3 py-2 font-semibold animate-pulse">⏰ Còn thời gian ưu đãi</span>
        <span className="rounded-lg bg-orange-100 text-orange-700 px-3 py-2 font-semibold">🔥 Nên chốt sớm trước khi hết sale</span>
      </div>
      <div className="grid grid-cols-4 gap-2 md:gap-3 text-center">
        {[
          ['Ngày', left.days],
          ['Giờ', left.hours],
          ['Phút', left.minutes],
          ['Giây', left.seconds],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-xl bg-gradient-to-b from-rose-500 to-orange-500 text-white py-3 shadow-sm">
            <div className="text-2xl md:text-3xl font-bold leading-none">{String(value).padStart(2, '0')}</div>
            <div className="text-xs md:text-sm mt-1 opacity-90">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
