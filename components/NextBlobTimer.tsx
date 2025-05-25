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
      const nextMinute = new Date(now)
      nextMinute.setUTCMinutes(now.getUTCMinutes() + 1, 0, 0)
      
      const diff = nextMinute.getTime() - now.getTime()
      const seconds = Math.floor(diff / 1000)
      setTimeLeft(`${seconds}s`)

      // If we just hit the minute mark, trigger a page reload
      if (seconds === 0) {
        window.location.reload()
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 100) // Update more frequently for smoother countdown
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