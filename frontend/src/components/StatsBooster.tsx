'use client'

import { useEffect } from 'react'

export default function StatsBooster() {
  useEffect(() => {
    const boostStats = async () => {
      // Only boost with 30% chance to avoid too frequent updates
      if (Math.random() > 0.3) return
      
      // Check if already boosted in this session (limit to once per 5 minutes)
      const lastBoost = sessionStorage.getItem('last_stats_boost')
      const now = Date.now()
      
      if (lastBoost && now - parseInt(lastBoost) < 5 * 60 * 1000) {
        return // Too soon, skip
      }

      try {
        await fetch('/api/boost-stats', { method: 'POST' })
        sessionStorage.setItem('last_stats_boost', now.toString())
      } catch (error) {
        // Silently fail - this is just for boosting stats
        console.debug('Stats boost skipped')
      }
    }

    // Delay to not block page load
    const timer = setTimeout(boostStats, 2000)
    return () => clearTimeout(timer)
  }, [])

  return null // This component renders nothing
}
