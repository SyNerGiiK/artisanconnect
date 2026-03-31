'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateParticulierProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Non authentifié' }

  const prenom = formData.get('prenom') as string
  const nom = formData.get('nom') as string
  const telephone = formData.get('telephone') as string

  const adresse = formData.get('adresse') as string
  const codePostal = formData.get('code_postal') as string
  const ville = formData.get('ville') as string

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

  // 2. Update Particulier
  const { error: particulierError } = await supabase
    .from('particuliers')
    .update({
       adresse: adresse || null,
       code_postal: codePostal || null,
       ville: ville || null,
    })
    .eq('profil_id', user.id)

  if (particulierError) return { error: particulierError.message }

  revalidatePath('/particulier/profil')
  return { success: true }
}
