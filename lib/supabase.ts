import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      shouts: {
        Row: {
          id: string
          created_at: string
          content: string
          user_id: string
          upvotes: number
        }
        Insert: {
          id?: string
          created_at?: string
          content: string
          user_id: string
          upvotes?: number
        }
        Update: {
          id?: string
          created_at?: string
          content?: string
          user_id?: string
          upvotes?: number
        }
      }
      votes: {
        Row: {
          id: string
          user_id: string
          shout_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          shout_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          shout_id?: string
          created_at?: string
        }
      }
    }
  }
} 