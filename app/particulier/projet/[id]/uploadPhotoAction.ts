'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

export async function uploadProjectPhoto(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié' }

  const projetId = formData.get('projet_id') as string
  const file = formData.get('photo') as File | null
  if (!file || !projetId) return { error: 'Paramètres manquants' }

  if (file.size > 5 * 1024 * 1024) return { error: 'Image trop lourde (max 5 Mo)' }

  // Verify ownership
  const { data: particulier } = await supabase
    .from('particuliers').select('id').eq('profil_id', user.id).single()
  if (!particulier) return { error: 'Profil non trouvé' }

  const { data: projet } = await supabase
    .from('projets').select('photos').eq('id', projetId).eq('particulier_id', particulier.id).single()
  if (!projet) return { error: 'Projet non trouvé' }

  const existingPhotos: string[] = (projet as any).photos ?? []
  if (existingPhotos.length >= 5) return { error: 'Maximum 5 photos atteint' }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const path = `${projetId}/${Date.now()}.${ext}`

  // Use admin client to upload (bypasses RLS for storage)
  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error: uploadError } = await adminClient.storage
    .from('projet-photos')
    .upload(path, file, { contentType: file.type, upsert: false })

  if (uploadError) return { error: uploadError.message }

  const { data: { publicUrl } } = adminClient.storage.from('projet-photos').getPublicUrl(path)

  const { error: updateError } = await supabase
    .from('projets')
    .update({ photos: [...existingPhotos, publicUrl] } as any)
    .eq('id', projetId)
    .eq('particulier_id', particulier.id)

  if (updateError) return { error: updateError.message }

  revalidatePath(`/particulier/projet/${projetId}`)
  return { success: true, url: publicUrl }
}

export async function deleteProjectPhoto(projetId: string, photoUrl: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié' }

  const { data: particulier } = await supabase
    .from('particuliers').select('id').eq('profil_id', user.id).single()
  if (!particulier) return { error: 'Profil non trouvé' }

  const { data: projet } = await supabase
    .from('projets').select('photos').eq('id', projetId).eq('particulier_id', particulier.id).single()
  if (!projet) return { error: 'Projet non trouvé' }

  const existingPhotos: string[] = (projet as any).photos ?? []
  const newPhotos = existingPhotos.filter((p) => p !== photoUrl)

  const { error } = await supabase
    .from('projets')
    .update({ photos: newPhotos } as any)
    .eq('id', projetId)
    .eq('particulier_id', particulier.id)

  if (error) return { error: error.message }

  revalidatePath(`/particulier/projet/${projetId}`)
  return { success: true }
}
