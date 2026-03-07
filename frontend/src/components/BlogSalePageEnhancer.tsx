'use client'

import { useEffect } from 'react'

export default function BlogSalePageEnhancer() {
  useEffect(() => {
    const cards = document.querySelectorAll('[data-sale-faq-card="true"]')
    cards.forEach((card, index) => {
      ;(card as HTMLElement).style.animationDelay = `${index * 90}ms`
    })
  }, [])

  return null
}
