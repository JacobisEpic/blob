import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')

  if (error || error_description) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error_description || 'An error occurred')}`, requestUrl.origin)
    )
  }

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
      )
    }

    return NextResponse.redirect(new URL('/', requestUrl.origin))
  }

  return NextResponse.redirect(new URL('/', requestUrl.origin))
} 