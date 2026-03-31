'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { validateString, validateCodePostal, validateInt } from '@/lib/utils/validation'

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

  let titre, description, categorieId, adresse, codePostal, ville;
  try {
    titre = validateString(formData.get('titre'), 'Titre', 5, 150)
    description = validateString(formData.get('description'), 'Description', 20, 2000)
    categorieId = validateInt(formData.get('categorie_id'), 'Catégorie', 1)
    adresse = validateString(formData.get('adresse'), 'Adresse', 5, 200)
    codePostal = validateCodePostal(formData.get('code_postal'))
    ville = validateString(formData.get('ville'), 'Ville', 2, 100)
  } catch (e) {
    return { error: (e as Error).message }
  }

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
