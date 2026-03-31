'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function submitReponse(projetId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const { data: artisan } = await supabase
    .from('artisans')
    .select('id, abonnement_actif')
    .eq('profil_id', user.id)
    .single()

  if (!artisan) redirect('/artisan/onboarding')

  if (!artisan.abonnement_actif) {
    return { error: 'Votre abonnement doit être actif pour répondre aux chantiers.' }
  }

  const messageInitial = formData.get('message_initial') as string

  // Server-side check: max 3 responses per project
  const { count } = await supabase
    .from('reponses')
    .select('id', { count: 'exact', head: true })
    .eq('projet_id', projetId)

  if (count !== null && count >= 3) {
    return { error: 'Ce projet a déjà reçu le maximum de 3 réponses.' }
  }

  const { error } = await supabase
    .from('reponses')
    .insert({
      projet_id: projetId,
      artisan_id: artisan.id,
      message_initial: messageInitial,
    })

  if (error) {
    // UNIQUE constraint violation = artisan already responded
    if (error.code === '23505') {
      return { error: 'Vous avez déjà répondu à ce projet.' }
    }
    return { error: error.message }
  }

  redirect('/artisan/feed')
}
