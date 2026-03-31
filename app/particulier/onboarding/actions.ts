'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function completeParticulierOnboarding(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const adresse = formData.get('adresse') as string
  const codePostal = formData.get('code_postal') as string
  const ville = formData.get('ville') as string

  const { error } = await supabase
    .from('particuliers')
    .insert({
      profil_id: user.id,
      adresse: adresse || null,
      code_postal: codePostal || null,
      ville: ville || null,
    })

  if (error) {
    return { error: error.message }
  }

  redirect('/particulier/dashboard')
}
