import { createBrowserClient } from '@supabase/ssr'
import { Database } from './types'

export const createClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export type Blob = {
  id: string
  content: string
  color?: string
  mood?: string
  created_at: string
  expires_at: string
  user_id: string
  like_count: number
}

export type BlobLike = {
  id: string
  blob_id: string
  user_id: string
  created_at: string
}

export const subscribeToBlobs = (
  supabase: ReturnType<typeof createClient>,
  callback: (payload: { new: Blob | null; old: Blob | null }) => void
) => {
  return supabase
    .channel('blobs')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'blobs',
      },
      callback
    )
    .subscribe()
}

export const subscribeToBlobLikes = (
  supabase: ReturnType<typeof createClient>,
  callback: (payload: { new: BlobLike | null; old: BlobLike | null }) => void
) => {
  return supabase
    .channel('blob_likes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'blob_likes',
      },
      callback
    )
    .subscribe()
} 