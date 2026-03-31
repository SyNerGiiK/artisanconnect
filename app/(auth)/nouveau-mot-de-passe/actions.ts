'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function updatePassword(prevState: any, formData: FormData) {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password || !confirmPassword) {
    return { error: 'Tous les champs sont requis.' }
  }

  if (password !== confirmPassword) {
    return { error: 'Les mots de passe ne correspondent pas.' }
  }

  if (password.length < 6) {
    return { error: 'Le mot de passe doit contenir au moins 6 caractères.' }
  }

  const supabase = await createClient()

  // Verify that a user is actually logged in (Supabase automatically logs them in when they click the reset link)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Session expirée ou non valide. Veuillez refaire une demande de réinitialisation.' }
  }

  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    return { error: error.message }
  }

  // Find their role to redirect properly
  const { data: profileRaw } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile = profileRaw as any
  
  if (profile?.role === 'artisan') {
    redirect('/artisan/feed')
  } else {
    redirect('/particulier/dashboard')
  }
}
