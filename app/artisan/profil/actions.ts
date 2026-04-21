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

  const assurance_pro = formData.get('assurance_pro') === 'on'

  // Fetch current artisan to preserve existing photos
  const { data: currentArtisan } = await supabase
    .from('artisans')
    .select('id, photos_realisations')
    .eq('profil_id', user.id)
    .single()

  let uploadedPhotos: string[] = currentArtisan?.photos_realisations || []

  // Parse the pre-uploaded URLs from the client bypassing Vercel 4.5MB payload limit
  const uploadedUrlsStr = formData.get('uploadedPhotosUrl') as string | null
  
  if (uploadedUrlsStr) {
    try {
      const parsedUrls = JSON.parse(uploadedUrlsStr) as string[]
      uploadedPhotos = [...uploadedPhotos, ...parsedUrls]
    } catch(e) {
      return { error: 'Erreur lors du traitement des images' }
    }
  }

  if (uploadedPhotos.length > 20) {
    return { error: 'Vous ne pouvez pas dépasser 20 photos au total dans votre portfolio.' }
  }

  // 1. Update Profile
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      prenom,
      nom,
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
      assurance_pro,
      photos_realisations: uploadedPhotos
    })
    .eq('profil_id', user.id)
    .select('id')
    .single()

  if (artisanError) return { error: artisanError.message }

  // 3. Update Categories via RPC
  if (artisan) {
    const { error: catError } = await supabase.rpc('update_artisan_categories', {
      p_artisan_id: artisan.id,
      p_categorie_ids: categorieIds,
    })
    if (catError) return { error: catError.message }
  }

  revalidatePath('/artisan/profil')
  revalidatePath(`/artisans/${formData.get('slug')}`) // Just in case it updates the SEO page
  
  return { success: true }
}
