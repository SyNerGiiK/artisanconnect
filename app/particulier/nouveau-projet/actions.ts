'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function createProject(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  // Get the particulier record for this user
  const { data: particulier } = await supabase
    .from('particuliers')
    .select('id')
    .eq('profil_id', user.id)
    .single()

  if (!particulier) redirect('/particulier/onboarding')

  const titre = formData.get('titre') as string
  const description = formData.get('description') as string
  const categorieId = parseInt(formData.get('categorie_id') as string, 10)
  const adresse = formData.get('adresse') as string
  const codePostal = formData.get('code_postal') as string
  const ville = formData.get('ville') as string

  const { error } = await supabase
    .from('projets')
    .insert({
      particulier_id: particulier.id,
      categorie_id: categorieId,
      titre,
      description,
      adresse,
      code_postal: codePostal,
      ville,
    })

  if (error) {
    return { error: error.message }
  }

  redirect('/particulier/dashboard')
}
