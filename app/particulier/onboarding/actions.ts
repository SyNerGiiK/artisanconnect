'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { validateString, validateCodePostal } from '@/lib/utils/validation'

export async function completeParticulierOnboarding(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  let adresse, codePostal, ville;
  try {
    adresse = formData.get('adresse') ? validateString(formData.get('adresse'), 'Adresse', 2) : ''
    codePostal = formData.get('code_postal') ? validateCodePostal(formData.get('code_postal')) : ''
    ville = formData.get('ville') ? validateString(formData.get('ville'), 'Ville', 2) : ''
  } catch (e) {
    return { error: (e as Error).message }
  }

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
