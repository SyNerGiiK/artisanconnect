'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { validateString, validateSiret, validateCodePostal, validateInt } from '@/lib/utils/validation'

export async function completeArtisanOnboarding(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  let nomEntreprise, siret, description, codePostalBase, rayonKm, categorieIds;
  try {
    nomEntreprise = validateString(formData.get('nom_entreprise'), 'Nom entreprise', 2, 100)
    siret = validateSiret(formData.get('siret'))
    description = formData.get('description') ? validateString(formData.get('description'), 'Description', 2) : ''
    codePostalBase = validateCodePostal(formData.get('code_postal_base'))
    rayonKm = validateInt(formData.get('rayon_km'), 'Rayon', 1, 200)
    categorieIds = formData.getAll('categorie_ids').map(id => validateInt(id, 'Catégorie'))
    if (categorieIds.length === 0) throw new Error("Veuillez sélectionner au moins un métier.")
  } catch (e) {
    return { error: (e as Error).message }
  }

  // Insert artisan profile
  const { data: artisan, error: artisanError } = await supabase
    .from('artisans')
    .insert({
      profil_id: user.id,
      nom_entreprise: nomEntreprise,
      siret: siret || null,
      description: description || null,
      code_postal_base: codePostalBase,
      rayon_km: rayonKm || 30,
    })
    .select('id')
    .single()

  if (artisanError) {
    return { error: artisanError.message }
  }

  // Insert categories (using atomic RPC)
  if (artisan) {
    const { error: catError } = await supabase.rpc('update_artisan_categories', {
      p_artisan_id: artisan.id,
      p_categorie_ids: categorieIds,
    })

    if (catError) {
      return { error: catError.message }
    }
  }

  redirect('/artisan/feed')
}
