'use client'

import { useState, useEffect } from 'react'
import { Timer } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function NextBlobTimer() {
  const [timeLeft, setTimeLeft] = useState<string>('')
  const supabase = createClient()

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      const nextHour = new Date(now)
      nextHour.setUTCHours(now.getUTCHours() + 1, 0, 0, 0)
      
      const diff = nextHour.getTime() - now.getTime()
      const minutes = Math.floor(diff / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`)

      // If we just hit the hour mark, trigger a page reload
      if (minutes === 0 && seconds === 0) {
        window.location.reload()
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10">
      <Timer className="w-5 h-5 text-white/80" />
      <span className="text-white/80 text-sm font-mono">
        Next blob in {timeLeft}
      </span>
    </div>
  )
} 