export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      blobs: {
        Row: {
          id: string
          content: string
          color: string | null
          mood: string | null
          created_at: string
          expires_at: string
          user_id: string
          like_count: number
        }
        Insert: {
          id?: string
          content: string
          color?: string | null
          mood?: string | null
          created_at?: string
          expires_at: string
          user_id: string
          like_count?: number
        }
        Update: {
          id?: string
          content?: string
          color?: string | null
          mood?: string | null
          created_at?: string
          expires_at?: string
          user_id?: string
          like_count?: number
        }
      }
      blob_likes: {
        Row: {
          id: string
          blob_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          blob_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          blob_id?: string
          user_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      clean_expired_blobs: {
        Args: Record<PropertyKey, never>
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
} 