import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      return NextResponse.redirect(new URL('/login?error=Invalid+link', requestUrl.origin))
    }
    // Redirect to onboarding
    return NextResponse.redirect(new URL('/onboarding', requestUrl.origin))
  }

  return NextResponse.redirect(new URL('/login', requestUrl.origin))
}
