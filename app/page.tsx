'use client'

import { useEffect, useState } from 'react'
import { BlobCanvas } from '@/components/BlobCanvas'
import { BlobForm } from '@/components/BlobForm'
import { AuthForm } from '@/components/AuthForm'
import { createClient } from '@/lib/supabase/client'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900">
      <div className="container mx-auto">
        <div className="py-8">
          <h1 className="text-4xl font-bold text-center text-white mb-8">
            Blob
          </h1>
          <p className="text-center text-white/80 mb-8">
            Share your thoughts anonymously. They'll float away in an hour...
          </p>
          {isAuthenticated === null ? (
            <div className="animate-pulse w-full max-w-md mx-auto h-12 bg-white/5 rounded-lg" />
          ) : isAuthenticated ? (
            <BlobForm />
          ) : (
            <AuthForm />
          )}
        </div>
        <BlobCanvas />
      </div>
    </main>
  )
}