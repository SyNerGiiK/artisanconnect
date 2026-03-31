'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { validateString, validateSiret, validateCodePostal, validateInt } from '@/lib/utils/validation'

export async function updateArtisanProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Non authentifié' }

  let prenom, nom, telephone, nomEntreprise, siret, description, codePostalBase, rayonKm, categorieIds;
  try {
    prenom = validateString(formData.get('prenom'), 'Prénom', 2, 50)
    nom = validateString(formData.get('nom'), 'Nom', 2, 50)
    telephone = formData.get('telephone') ? validateString(formData.get('telephone'), 'Téléphone', 10, 15) : null
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

  // 1. Update Profile
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      prenom: prenom || null,
      nom: nom || null,
      telephone: telephone || null
    })
    .eq('id', user.id)

  if (profileError) return { error: profileError.message }

  // 2. Update Artisan
  const { data: artisan, error: artisanError } = await supabase
    .from('artisans')
    .update({
      nom_entreprise: nomEntreprise,
      siret: siret || null,
      description: description || null,
      code_postal_base: codePostalBase,
      rayon_km: rayonKm || 30,
    })
    .eq('profil_id', user.id)
    .select('id')
    .single()

  if (artisanError) return { error: artisanError.message }

  // 3. Update Categories
  if (artisan) {
    await supabase.from('artisan_categories').delete().eq('artisan_id', artisan.id)

    if (categorieIds.length > 0) {
      const categorieRows = categorieIds.map((cId) => ({
        artisan_id: artisan.id,
        categorie_id: cId,
      }))
      const { error: catError } = await supabase.from('artisan_categories').insert(categorieRows)
      if (catError) return { error: catError.message }
    }
  }

  revalidatePath('/artisan/profil')
  revalidatePath(`/artisans/${formData.get('slug')}`) // Just in case it updates the SEO page
  
  return { success: true }
}
