import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /auth/callback
 * Handles Supabase email confirmation (magic link / email verification).
 * Exchanges the auth code for a session, then redirects the user.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirect = searchParams.get('redirect') || '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(new URL(redirect, origin))
    }
  }

  // Auth error — redirect to login with error message
  return NextResponse.redirect(new URL('/connexion?error=auth', origin))
}
