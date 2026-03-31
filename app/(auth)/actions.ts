'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as 'particulier' | 'artisan'
  const prenom = formData.get('prenom') as string
  const nom = formData.get('nom') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role, prenom, nom },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // After signup, redirect to onboarding based on role
  redirect(role === 'artisan' ? '/artisan/onboarding' : '/particulier/onboarding')
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  // Proxy will handle role-based redirect
  redirect('/')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/connexion')
}
