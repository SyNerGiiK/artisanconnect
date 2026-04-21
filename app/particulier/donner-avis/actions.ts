'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { validateString, validateInt } from '@/lib/utils/validation'

export async function submitAvis(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Non authentifié' }

  const { data: particulier } = await supabase
    .from('particuliers')
    .select('id')
    .eq('profil_id', user.id)
    .single()

  if (!particulier) return { error: 'Non autorisé' }

  const artisanId = formData.get('artisan_id') as string
  const projetId = formData.get('projet_id') as string
  
  if (!artisanId || !projetId) return { error: 'Paramètres manquants' }

  let note, commentaire;
  try {
    note = validateInt(formData.get('note'), 'Note', 1, 5)
    commentaire = validateString(formData.get('commentaire'), 'Commentaire', 5, 2000)
  } catch (e) {
    return { error: (e as Error).message }
  }

  // Insert review. RLS will verify that the project is owned by user AND response is accepted.
  const { error } = await supabase
    .from('avis')
    .insert({
      particulier_id: particulier.id,
      artisan_id: artisanId,
      projet_id: projetId,
      note,
      commentaire
    })

  if (error) {
    // Unique constraint violation check
    if (error.code === '23505') {
      return { error: 'Vous avez déjà laissé un avis pour cet artisan sur ce projet.' }
    }
    return { error: error.message }
  }

  // Redirect to project page smoothly after submitting
  redirect(`/particulier/projet/${projetId}`)
}
