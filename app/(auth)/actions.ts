'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { validateEmail, validatePassword, validateString, validateEnum } from '@/lib/utils/validation'

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  let email, password, role, prenom, nom;
  try {
    email = validateEmail(formData.get('email'))
    password = validatePassword(formData.get('password'))
    role = validateEnum(formData.get('role'), ['particulier', 'artisan'], 'Rôle')
    prenom = validateString(formData.get('prenom'), 'Prénom', 2, 50)
    nom = validateString(formData.get('nom'), 'Nom', 2, 50)
  } catch (e) {
    return { error: (e as Error).message }
  }

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

  let email, password;
  try {
    email = validateEmail(formData.get('email'))
    password = validateString(formData.get('password'), 'Mot de passe')
  } catch (e) {
    return { error: (e as Error).message }
  }

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
