'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function completeArtisanOnboarding(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const nomEntreprise = formData.get('nom_entreprise') as string
  const siret = formData.get('siret') as string
  const description = formData.get('description') as string
  const codePostalBase = formData.get('code_postal_base') as string
  const rayonKm = parseInt(formData.get('rayon_km') as string, 10)
  const categorieIds = formData.getAll('categorie_ids').map(Number)

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

  // Insert categories (many-to-many)
  if (categorieIds.length > 0 && artisan) {
    const categorieRows = categorieIds.map((categorieId) => ({
      artisan_id: artisan.id,
      categorie_id: categorieId,
    }))

    const { error: catError } = await supabase
      .from('artisan_categories')
      .insert(categorieRows)

    if (catError) {
      return { error: catError.message }
    }
  }

  redirect('/artisan/feed')
}
