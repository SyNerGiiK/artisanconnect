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

  const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp']
  const MAX_FILE_SIZE = 5 * 1024 * 1024

  const filesRaw = formData.getAll('photos_realisations_files') as File[]
  const validFiles = filesRaw.filter(f => f.size > 0)

  if (uploadedPhotos.length + validFiles.length > 20) {
    return { error: 'Vous ne pouvez pas dépasser 20 photos au total dans votre portfolio.' }
  }

  for (const file of validFiles) {
    if (!ALLOWED_MIMES.includes(file.type)) return { error: 'Un fichier a un format non supporté (JPEG, PNG, WebP)' }
    if (file.size > MAX_FILE_SIZE) return { error: 'Une image est trop lourde (max 5 Mo)' }
  }

  // Upload new files
  if (validFiles.length > 0 && currentArtisan) {
    for (const file of validFiles) {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
      const path = `${currentArtisan.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('artisan-photos')
        .upload(path, file, { contentType: file.type, upsert: false })
      
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from('artisan-photos').getPublicUrl(path)
        uploadedPhotos.push(publicUrl)
      }
    }
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
