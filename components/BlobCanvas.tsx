'use client'

import { useEffect, useState } from 'react'
import { createClient, subscribeToBlobs, subscribeToBlobLikes, type Blob as BlobType } from '@/lib/supabase/client'
import { Blob } from './Blob'

export function BlobCanvas() {
  const [blobs, setBlobs] = useState<BlobType[]>([])
  const [likedBlobs, setLikedBlobs] = useState<Set<string>>(new Set())
  const supabase = createClient()

  useEffect(() => {
    // Initial fetch of blobs
    const fetchBlobs = async () => {
      const { data: blobsData } = await supabase
        .from('blobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

      if (blobsData) {
        setBlobs(blobsData)
      }

      // Fetch user's likes
      const { data: session } = await supabase.auth.getSession()
      if (session?.session?.user) {
        const { data: likesData } = await supabase
          .from('blob_likes')
          .select('blob_id')
          .eq('user_id', session.session.user.id)

        if (likesData) {
          setLikedBlobs(new Set(likesData.map(like => like.blob_id)))
        }
      }
    }

    fetchBlobs()

    // Subscribe to blob changes
    const blobSubscription = subscribeToBlobs(supabase, (payload) => {
      if (payload.new) {
        setBlobs(current => {
          const filtered = current.filter(b => b.id !== payload.new!.id)
          return [payload.new!, ...filtered].slice(0, 20)
        })
      } else if (payload.old) {
        setBlobs(current => current.filter(b => b.id !== payload.old!.id))
      }
    })

    // Subscribe to like changes
    const likeSubscription = subscribeToBlobLikes(supabase, async (payload) => {
      if (payload.new) {
        const { data: session } = await supabase.auth.getSession()
        if (session?.session?.user?.id === payload.new.user_id) {
          setLikedBlobs(current => new Set([...current, payload.new!.blob_id]))
        }
      } else if (payload.old) {
        const { data: session } = await supabase.auth.getSession()
        if (session?.session?.user?.id === payload.old.user_id) {
          setLikedBlobs(current => {
            const newSet = new Set(current)
            newSet.delete(payload.old!.blob_id)
            return newSet
          })
        }
      }
    })

    return () => {
      blobSubscription.unsubscribe()
      likeSubscription.unsubscribe()
    }
  }, [supabase])

  const handleLike = async (blobId: string) => {
    const { data: session } = await supabase.auth.getSession()
    if (!session?.session?.user) return

    const isLiked = likedBlobs.has(blobId)
    if (isLiked) {
      await supabase
        .from('blob_likes')
        .delete()
        .eq('blob_id', blobId)
        .eq('user_id', session.session.user.id)
    } else {
      await supabase
        .from('blob_likes')
        .insert({
          blob_id: blobId,
          user_id: session.session.user.id
        })
    }
  }

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-br from-gray-900 to-purple-900">
      {blobs.map(blob => (
        <Blob
          key={blob.id}
          blob={blob}
          isLiked={likedBlobs.has(blob.id)}
          onLike={() => handleLike(blob.id)}
        />
      ))}
    </div>
  )
} 