import { createBrowserClient } from '@supabase/ssr'
import { type Database } from '@/lib/types/database.types'

/**
 * Supabase client for use in Client Components ('use client').
 * Creates a new instance on each call — safe for browser environment.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}
