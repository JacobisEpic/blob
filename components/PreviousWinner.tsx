'use client'

import { useState, useEffect } from 'react'
import { Trophy } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Winner {
  content: string
  like_count: number
  won_at: string
}

export function PreviousWinner() {
  const [winner, setWinner] = useState<Winner | null>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    const fetchWinner = async () => {
      try {
        setError(null)
        // Get the current minute start in UTC
        const now = new Date()
        const currentMinuteStart = new Date(Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          now.getUTCHours(),
          now.getUTCMinutes(),
          0,
          0
        ))

        console.log('Fetching winners before:', currentMinuteStart.toISOString())

        const { data, error } = await supabase
          .from('winners')
          .select('content, like_count, won_at')
          .lt('won_at', currentMinuteStart.toISOString())
          .order('won_at', { ascending: false })
          .limit(1)

        if (error) {
          console.error('Error fetching winner:', error.message)
          console.error('Error details:', error)
          setError('Failed to load previous winner')
          return
        }

        console.log('Winners query response:', data)

        if (!data || data.length === 0) {
          console.log('No winners found')
          setWinner(null)
          return
        }

        if (mounted) {
          console.log('Setting winner:', data[0])
          setWinner(data[0])
        }
      } catch (error) {
        console.error('Error in fetchWinner:', error)
        setError('An unexpected error occurred')
      }
    }

    fetchWinner()
    
    // Refetch winner every minute
    const minuteInterval = setInterval(fetchWinner, 60000)
    
    // Subscribe to winner updates
    const channel = supabase.channel('winners')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'winners'
        },
        (payload) => {
          console.log('New winner received:', payload.new)
          if (mounted && payload.new) {
            setWinner(payload.new as Winner)
            setError(null)
          }
        }
      )
      .subscribe((status) => {
        console.log('Winners subscription status:', status)
        if (status !== 'SUBSCRIBED') {
          console.error('Failed to subscribe to winners channel:', status)
        }
      })

    return () => {
      mounted = false
      clearInterval(minuteInterval)
      channel.unsubscribe()
    }
  }, [supabase])

  if (error) {
    return (
      <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/10">
        <Trophy className="w-5 h-5 text-white/40" />
        <div className="text-sm text-white/40">
          {error}
        </div>
      </div>
    )
  }

  if (!winner) {
    return (
      <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/10">
        <Trophy className="w-5 h-5 text-white/40" />
        <div className="text-sm text-white/40">
          No previous winner
        </div>
      </div>
    )
  }

  const wonAt = new Date(winner.won_at)
  const timeStr = wonAt.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/10">
      <Trophy className="w-5 h-5 text-yellow-400" />
      <div className="text-sm">
        <p className="text-white/80 font-medium mb-0.5">
          {winner.content}
        </p>
        <p className="text-white/60 text-xs">
          Winner at {timeStr} • {winner.like_count} {winner.like_count === 1 ? 'like' : 'likes'}
        </p>
      </div>
    </div>
  )
} 