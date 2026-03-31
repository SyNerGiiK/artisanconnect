import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import ChatRoom from '@/components/chat/ChatRoom'

export default async function ArtisanChatPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const { data: artisanRaw } = await supabase
    .from('artisans')
    .select('id')
    .eq('profil_id', user.id)
    .single()

  const artisan = artisanRaw as { id: string } | null
  if (!artisan) redirect('/artisan/onboarding')

  // Fetch conversation with project and participants
  const { data: conversationRaw } = await supabase
    .from('conversations')
    .select(`
      id,
      projets ( titre ),
      artisan_id,
      particulier_id,
      particuliers (
        profil_id,
        profiles ( id, prenom, nom )
      )
    `)
    .eq('id', id)
    .eq('artisan_id', artisan.id)
    .single()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conversation = conversationRaw as any
  if (!conversation) notFound()

  // Get artisan profile info
  const { data: artisanProfileRaw } = await supabase
    .from('profiles')
    .select('id, prenom, nom')
    .eq('id', user.id)
    .single()

  const artisanProfile = artisanProfileRaw as { id: string; prenom: string; nom: string } | null

  // Build participants map
  const particulierProfile = (conversation.particuliers as any)?.profiles
  const participants: Record<string, { id: string; prenom: string; nom: string }> = {}

  if (artisanProfile) {
    participants[artisanProfile.id] = artisanProfile
  }
  if (particulierProfile) {
    participants[particulierProfile.id] = particulierProfile
  }

  const interlocuteurNom = particulierProfile
    ? `${particulierProfile.prenom} ${particulierProfile.nom}`
    : 'Particulier'

  return (
    <div className="flex h-[calc(100vh-2rem)] flex-col mx-auto max-w-3xl px-4 py-4">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 pb-4 mb-0">
        <Link
          href="/artisan/conversations"
          className="text-sm text-blue-600 hover:underline"
        >
          &larr; Retour
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold truncate">{interlocuteurNom}</h1>
          <p className="text-xs text-gray-500 truncate">
            {(conversation.projets as any)?.titre}
          </p>
        </div>
      </div>

      {/* Chat */}
      <ChatRoom
        conversationId={id}
        currentUserId={user.id}
        participants={participants}
      />
    </div>
  )
}
