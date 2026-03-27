import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import { type Database } from '@/lib/types/database.types'

/**
 * Refreshes the Supabase session cookie on every request.
 * Must be called from middleware.ts before any route logic.
 * Returns the updated response and the authenticated user (or null).
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: do not add logic between createServerClient and getUser().
  // A simple mistake can make it hard to debug session issues.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return { supabaseResponse, user }
}
