import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { createServerClient } from '@supabase/ssr'
import { type Database } from '@/lib/types/database.types'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Refresh the session cookie (must run on every request)
  const { supabaseResponse, user } = await updateSession(request)

  // 2. Build a Supabase client reusing the cookies from the refreshed response
  //    to fetch the user's profile role without an extra round-trip.
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

  // 4. Role-based access control for authenticated users
  if (user && isProtected) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single<{ role: 'particulier' | 'artisan' }>()

    const role = profile?.role

    // Wrong role — redirect to the correct dashboard
    if (pathname.startsWith('/particulier') && role !== 'particulier') {
      return NextResponse.redirect(new URL('/artisan/feed', request.url))
    }

    if (pathname.startsWith('/artisan') && role !== 'artisan') {
      return NextResponse.redirect(new URL('/particulier/dashboard', request.url))
    }
  }

  // 5. Redirect authenticated users away from auth pages
  const isAuthPage =
    pathname.startsWith('/connexion') || pathname.startsWith('/inscription')

  if (user && isAuthPage) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single<{ role: 'particulier' | 'artisan' }>()

    const role = profile?.role
    const destination =
      role === 'artisan' ? '/artisan/feed' : '/particulier/dashboard'

    return NextResponse.redirect(new URL(destination, request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Run on all paths EXCEPT:
     * - _next/static  (Next.js static assets)
     * - _next/image   (image optimisation endpoint)
     * - favicon.ico   (favicon)
     * - public folder files (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
