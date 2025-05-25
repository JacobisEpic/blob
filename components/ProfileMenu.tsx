'use client'

import { useState, useEffect } from 'react'
import { LogOut, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.email) {
        setEmail(session.user.email)
      }
    }
    getProfile()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  if (!email) return null

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
      >
        <User className="w-5 h-5 text-white/80" />
        <span className="text-white/80 text-sm">{email}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 py-2 bg-white/10 backdrop-blur-lg rounded-lg shadow-xl">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  )
} 