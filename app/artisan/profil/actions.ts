'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateArtisanProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Non authentifié' }

  const prenom = formData.get('prenom') as string
  const nom = formData.get('nom') as string
  const telephone = formData.get('telephone') as string
  
  const nomEntreprise = formData.get('nom_entreprise') as string
  const siret = formData.get('siret') as string
  const description = formData.get('description') as string
  const codePostalBase = formData.get('code_postal_base') as string
  const rayonKm = parseInt(formData.get('rayon_km') as string, 10)
  const categorieIds = formData.getAll('categorie_ids').map(Number)

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
