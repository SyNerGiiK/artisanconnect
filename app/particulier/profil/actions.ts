'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { validateString, validateCodePostal } from '@/lib/utils/validation'

export async function updateParticulierProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Non authentifié' }

  let prenom, nom, telephone, adresse, codePostal, ville;
  try {
    prenom = validateString(formData.get('prenom'), 'Prénom', 2, 50)
    nom = validateString(formData.get('nom'), 'Nom', 2, 50)
    telephone = formData.get('telephone') ? validateString(formData.get('telephone'), 'Téléphone', 10, 15) : null
    adresse = formData.get('adresse') ? validateString(formData.get('adresse'), 'Adresse', 2) : ''
    codePostal = formData.get('code_postal') ? validateCodePostal(formData.get('code_postal')) : ''
    ville = formData.get('ville') ? validateString(formData.get('ville'), 'Ville', 2) : ''
  } catch (e) {
    return { error: (e as Error).message }
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
