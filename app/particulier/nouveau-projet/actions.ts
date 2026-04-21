'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { validateString, validateCodePostal, validateInt } from '@/lib/utils/validation'
import { stripe } from '@/lib/stripe'

const FEATURE_PRICES: Record<string, string | undefined> = {
  boost: process.env.STRIPE_PRICE_ID_BOOST,
  urgence: process.env.STRIPE_PRICE_ID_URGENCE,
  photos: process.env.STRIPE_PRICE_ID_PHOTOS,
}

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024

export async function createProject(formData: FormData) {
  try {
    const supabase = await createClient()
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const { data: particulier } = await supabase
      .from('particuliers')
      .select('id')
      .eq('profil_id', user.id)
      .single()

    if (!particulier) return { error: 'Not onboarded' }

    // Handle Premium options first to determine limits
    const opt_photos = formData.get('opt_photos') === 'on'

    const maxPhotos = opt_photos ? 7 : 2
    
    // Check credits if opt_photos is used
    if (opt_photos) {
      const { data: creditCheck } = await supabaseAdmin
        .from('particuliers')
        .select('credits_photos')
        .eq('id', particulier.id)
        .single()
        
      if (!creditCheck || creditCheck.credits_photos < 1) {
        return { error: 'Pack photos non valide ou crédit épuisé.' }
      }
    }

    // Parse the pre-uploaded URLs from the client
    const uploadedUrlsStr = formData.get('uploadedPhotosUrl') as string | null
    let uploadedUrls: string[] = []
    
    if (uploadedUrlsStr) {
      try {
        uploadedUrls = JSON.parse(uploadedUrlsStr)
      } catch (e) {
        return { error: 'Format invalide pour les photos.' }
      }
    }

    if (uploadedUrls.length > maxPhotos) {
      return { error: `Maximum ${maxPhotos} photos autorisées.` }
    }

    let titre, description, categorieId, adresse, codePostal, ville;
    titre = validateString(formData.get('titre'), 'Titre', 5, 150)
    description = validateString(formData.get('description'), 'Description', 20, 2000)
    categorieId = validateInt(formData.get('categorie_id'), 'Catégorie', 1)
    adresse = validateString(formData.get('adresse'), 'Adresse', 5, 200)
    codePostal = validateCodePostal(formData.get('code_postal'))
    ville = validateString(formData.get('ville'), 'Ville', 2, 100)

    const { data: insertedProjet, error: insertError } = await supabase
      .from('projets')
      .insert({
        particulier_id: particulier.id,
        categorie_id: categorieId,
        titre,
        description,
        adresse,
        code_postal: codePostal,
        ville,
        photos: uploadedUrls,
        photos_unlocked: opt_photos
      })
      .select('id')
      .single()

    if (insertError || !insertedProjet) {
      return { error: insertError?.message || 'Erreur lors de la création' }
    }

    // Deduct credit after successful insert
    if (opt_photos) {
      const { data: partToUpdate } = await supabaseAdmin.from('particuliers').select('credits_photos').eq('id', particulier.id).single();
      if (partToUpdate) {
          await supabaseAdmin
            .from('particuliers')
            .update({ credits_photos: Math.max(0, partToUpdate.credits_photos - 1) })
            .eq('id', particulier.id)
      }
    }

    return { success: true, redirectUrl: `/particulier/projet/${insertedProjet.id}` }
  } catch (err: any) {
    return { error: err.message || 'Une erreur interne est survenue.' }
  }
}
