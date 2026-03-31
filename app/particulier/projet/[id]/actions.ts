'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateReponseStatus(
  reponseId: string,
  projetId: string,
  newStatut: 'acceptee' | 'refusee'
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Non authentifié' }

  // Verify the user owns this project via their particulier record
  const { data: particulier } = await supabase
    .from('particuliers')
    .select('id')
    .eq('profil_id', user.id)
    .single()

  if (!particulier) return { error: 'Profil particulier non trouvé' }

  const { data: projet } = await supabase
    .from('projets')
    .select('id')
    .eq('id', projetId)
    .eq('particulier_id', particulier.id)
    .single()

  if (!projet) return { error: 'Projet non trouvé' }

  const { error } = await supabase
    .from('reponses')
    .update({ statut: newStatut })
    .eq('id', reponseId)
    .eq('projet_id', projetId)

  if (error) return { error: error.message }

  revalidatePath(`/particulier/projet/${projetId}`)
  return { success: true }
}
