'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function sendResetPasswordEmail(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  if (!email) return { error: "L'email est requis" }

  const supabase = await createClient()
  
  // Use env var to prevent open redirect via forged Origin header
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/nouveau-mot-de-passe`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
