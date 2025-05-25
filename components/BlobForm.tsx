'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { addHours } from 'date-fns'

export function BlobForm() {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const { data: session } = await supabase.auth.getSession()
      if (!session?.session?.user) {
        setError('You must be logged in to post a blob')
        return
      }

      // Check if user has posted in the last hour
      const oneHourAgo = new Date()
      oneHourAgo.setHours(oneHourAgo.getHours() - 1)

      const { data: recentBlobs } = await supabase
        .from('blobs')
        .select('id')
        .eq('user_id', session.session.user.id)
        .gte('created_at', oneHourAgo.toISOString())

      if (recentBlobs && recentBlobs.length > 0) {
        setError('You can only post one blob per hour')
        return
      }

      // Create new blob
      const { error: insertError } = await supabase
        .from('blobs')
        .insert({
          content: content.trim(),
          user_id: session.session.user.id,
          expires_at: addHours(new Date(), 1).toISOString()
        })

      if (insertError) throw insertError

      setContent('')
      setSuccess('Blob posted successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-4">
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind? (max 100 characters)"
          maxLength={100}
          className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          rows={3}
          disabled={isSubmitting}
        />
        <div className="absolute bottom-3 right-3 text-sm text-white/50">
          {content.length}/100
        </div>
      </div>
      
      {error && (
        <div className="mt-2 text-red-400 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-2 text-green-400 text-sm">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || content.trim().length === 0}
        className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-600 hover:to-pink-600 transition-colors"
      >
        {isSubmitting ? 'Posting...' : 'Post Blob'}
      </button>
    </form>
  )
} 