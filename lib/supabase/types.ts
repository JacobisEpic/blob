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
          created_at: string
          user_id: string
          shout_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          shout_id: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          shout_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 