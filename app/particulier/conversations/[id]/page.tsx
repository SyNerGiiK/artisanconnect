import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import ChatRoom from '@/components/chat/ChatRoom'

export default async function ParticulierChatPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const { data: particulier } = await supabase
    .from('particuliers')
    .select('id')
    .eq('profil_id', user.id)
    .single()

  if (!particulier) redirect('/particulier/onboarding')

  // Fetch conversation with project and participants
  const { data: conversation } = await supabase
    .from('conversations')
    .select(`
      id,
      projets ( titre ),
      artisan_id,
      particulier_id,
      artisans (
        profil_id,
        nom_entreprise,
        profiles ( id, prenom, nom )
      )
    `)
    .eq('id', id)
    .eq('particulier_id', particulier.id)
    .single()

  if (!conversation) notFound()

  // Get particulier profile info
  const { data: particulierProfile } = await supabase
    .from('profiles')
    .select('id, prenom, nom')
    .eq('id', user.id)
    .single()

  // Build participants map
  const artisanData = conversation.artisans as any
  const artisanProfile = artisanData?.profiles
  const participants: Record<string, { id: string; prenom: string; nom: string }> = {}

  if (particulierProfile) {
    participants[particulierProfile.id] = particulierProfile
  }
  if (artisanProfile) {
    participants[artisanProfile.id] = artisanProfile
  }

  const interlocuteurNom = artisanData?.nom_entreprise ?? (
    artisanProfile
      ? `${artisanProfile.prenom} ${artisanProfile.nom}`
      : 'Artisan'
  )

  return (
    <div className="flex h-[calc(100vh-2rem)] flex-col mx-auto max-w-3xl px-4 py-4">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 pb-4 mb-0">
        <Link
          href="/particulier/conversations"
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
