'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { clsx } from 'clsx'

interface VoteButtonProps {
  shoutId: string
  initialVotes: number
  initialVoted?: 'up' | 'down' | null
  className?: string
}

export default function VoteButton({ shoutId, initialVotes, initialVoted = null, className }: VoteButtonProps) {
  const [votes, setVotes] = useState(initialVotes)
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(initialVoted)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleVote = async (direction: 'up' | 'down') => {
    if (isLoading) return
    setIsLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: existingVote } = await supabase
        .from('votes')
        .select()
        .eq('user_id', user.id)
        .eq('shout_id', shoutId)
        .single()

      let voteChange = 0
      
      if (existingVote) {
        if (existingVote.direction === direction) {
          // Remove vote if clicking same direction
          await supabase
            .from('votes')
            .delete()
            .eq('user_id', user.id)
            .eq('shout_id', shoutId)
          
          voteChange = direction === 'up' ? -1 : 1
          setVoteStatus(null)
        } else {
          // Change vote direction
          await supabase
            .from('votes')
            .update({ direction })
            .eq('user_id', user.id)
            .eq('shout_id', shoutId)
          
          voteChange = direction === 'up' ? 2 : -2
          setVoteStatus(direction)
        }
      } else {
        // Add new vote
        await supabase
          .from('votes')
          .insert({
            user_id: user.id,
            shout_id: shoutId,
            direction
          })
        
        voteChange = direction === 'up' ? 1 : -1
        setVoteStatus(direction)
      }

      await supabase
        .from('shouts')
        .update({ upvotes: votes + voteChange })
        .eq('id', shoutId)

      setVotes(prev => prev + voteChange)
    } catch (error) {
      console.error('Error handling vote:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={clsx('flex flex-col items-center gap-1', className)}>
      <button
        onClick={() => handleVote('up')}
        disabled={isLoading}
        className={clsx(
          'flex h-6 w-6 items-center justify-center rounded hover:bg-[#00000010]',
          voteStatus === 'up' ? 'text-[#FF4500]' : 'text-[#898989] hover:text-[#FF4500]',
          isLoading && 'cursor-not-allowed opacity-50'
        )}
        aria-label="Upvote"
      >
        <ChevronUp className="h-5 w-5" />
      </button>
      
      <span className={clsx(
        'text-xs font-bold',
        voteStatus === 'up' && 'text-[#FF4500]',
        voteStatus === 'down' && 'text-[#7193FF]',
        !voteStatus && 'text-[#1A1A1B]'
      )}>
        {votes}
      </span>
      
      <button
        onClick={() => handleVote('down')}
        disabled={isLoading}
        className={clsx(
          'flex h-6 w-6 items-center justify-center rounded hover:bg-[#00000010]',
          voteStatus === 'down' ? 'text-[#7193FF]' : 'text-[#898989] hover:text-[#7193FF]',
          isLoading && 'cursor-not-allowed opacity-50'
        )}
        aria-label="Downvote"
      >
        <ChevronDown className="h-5 w-5" />
      </button>
    </div>
  )
} 