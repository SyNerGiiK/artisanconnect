'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isValidUUID(id: string): boolean {
  return UUID_REGEX.test(id)
}

export async function uploadProjectPhoto(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié' }

  const projetId = formData.get('projet_id') as string
  const file = formData.get('photo') as File | null
  if (!file || !projetId) return { error: 'Paramètres manquants' }

  // Validate UUID format to prevent injection
  if (!isValidUUID(projetId)) return { error: 'ID projet invalide' }

  // Validate file
  if (!ALLOWED_MIMES.includes(file.type)) return { error: 'Format non supporté (JPEG, PNG, WebP)' }
  if (file.size > MAX_FILE_SIZE) return { error: 'Image trop lourde (max 5 Mo)' }

  // Verify ownership
  const { data: particulier, error: particulierError } = await supabase
    .from('particuliers').select('id').eq('profil_id', user.id).single()
  if (particulierError || !particulier) return { error: 'Profil non trouvé' }

  const { data: projet, error: projetError } = await supabase
    .from('projets')
    .select('id')
    .eq('id', projetId)
    .eq('particulier_id', particulier.id)
    .single()
  if (projetError || !projet) return { error: 'Projet non trouvé' }

  const existingPhotos = (projet as { photos?: string[] }).photos ?? []
  if (existingPhotos.length >= 5) return { error: 'Maximum 5 photos atteint' }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const path = `${projetId}/${Date.now()}.${ext}`

  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error: uploadError } = await adminClient.storage
    .from('projet-photos')
    .upload(path, file, { contentType: file.type, upsert: false })

  if (uploadError) return { error: uploadError.message }

  const { data: { publicUrl } } = adminClient.storage.from('projet-photos').getPublicUrl(path)

  // photos column added via migration — cast to bypass strict types until types are regenerated
  const { error: updateError } = await supabase
    .from('projets')
    .update({ photos: [...existingPhotos, publicUrl] } as Record<string, unknown>)
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

  // Validate UUID format
  if (!isValidUUID(projetId)) return { error: 'ID projet invalide' }

  // Basic URL validation
  if (!photoUrl.startsWith('https://')) return { error: 'URL invalide' }

  const { data: particulier, error: particulierError } = await supabase
    .from('particuliers').select('id').eq('profil_id', user.id).single()
  if (particulierError || !particulier) return { error: 'Profil non trouvé' }

  const { data: projet, error: projetError } = await supabase
    .from('projets')
    .select('id')
    .eq('id', projetId)
    .eq('particulier_id', particulier.id)
    .single()
  if (projetError || !projet) return { error: 'Projet non trouvé' }

  const existingPhotos = (projet as { photos?: string[] }).photos ?? []
  const newPhotos = existingPhotos.filter((p) => p !== photoUrl)

  const { error } = await supabase
    .from('projets')
    .update({ photos: newPhotos } as Record<string, unknown>)
    .eq('id', projetId)
    .eq('particulier_id', particulier.id)

  if (error) return { error: error.message }

  revalidatePath(`/particulier/projet/${projetId}`)
  return { success: true }
}
