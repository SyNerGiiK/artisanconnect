import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { createServerClient } from '@supabase/ssr'
import { type Database } from '@/lib/types/database.types'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Refresh the session cookie (must run on every request)
  const { supabaseResponse, user } = await updateSession(request)

  // 2. Build a Supabase client to query the user's profile
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll() {
          // Cookies already handled by updateSession — no-op here
        },
      },
    }
  )

  // 3. Redirect unauthenticated users away from protected routes
  const isProtected =
    pathname.startsWith('/particulier') || pathname.startsWith('/artisan')

  if (!user && isProtected) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/connexion'
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // 4. Role-based access control + onboarding redirect
  if (user && isProtected) {
    // Read role from JWT metadata (set at signUp) — zero DB hit
    const role = user.user_metadata?.role as 'particulier' | 'artisan' | undefined

    // Wrong role — redirect to the correct area
    if (pathname.startsWith('/particulier') && role !== 'particulier') {
      return NextResponse.redirect(new URL('/artisan/feed', request.url))
    }
    if (pathname.startsWith('/artisan') && role !== 'artisan') {
      return NextResponse.redirect(new URL('/particulier/dashboard', request.url))
    }

    // Onboarding check — skip if already on onboarding page
    const isOnboardingPage = pathname.endsWith('/onboarding')
    if (!isOnboardingPage) {
      if (role === 'artisan') {
        const { data: artisan } = await supabase
          .from('artisans')
          .select('id')
          .eq('profil_id', user.id)
          .single()

        if (!artisan) {
          return NextResponse.redirect(new URL('/artisan/onboarding', request.url))
        }
      }

      if (role === 'particulier') {
        const { data: particulier } = await supabase
          .from('particuliers')
          .select('id')
          .eq('profil_id', user.id)
          .single()

        if (!particulier) {
          return NextResponse.redirect(new URL('/particulier/onboarding', request.url))
        }
      }
    }
  }

  // 5. Redirect authenticated users away from auth pages
  const isAuthPage =
    pathname.startsWith('/connexion') || pathname.startsWith('/inscription')

  if (user && isAuthPage) {
    // Read role from JWT metadata — zero DB hit
    const role = user.user_metadata?.role as 'particulier' | 'artisan' | undefined
    const destination =
      role === 'artisan' ? '/artisan/feed' : '/particulier/dashboard'

    return NextResponse.redirect(new URL(destination, request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
