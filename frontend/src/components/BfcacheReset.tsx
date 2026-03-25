'use client'

import { useEffect } from 'react'

export default function BfcacheReset() {
  useEffect(() => {
    const resetTransientUi = () => {
      window.dispatchEvent(new CustomEvent('sonhang:reset-transient-ui'))
    }

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        resetTransientUi()
      }
    }

    window.addEventListener('pageshow', onPageShow)
    window.addEventListener('pagehide', resetTransientUi)

    return () => {
      window.removeEventListener('pageshow', onPageShow)
      window.removeEventListener('pagehide', resetTransientUi)
    }
  }, [])

  return null
}
