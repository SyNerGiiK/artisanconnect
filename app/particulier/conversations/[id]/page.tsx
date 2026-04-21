import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import ChatRoom from '@/components/chat/ChatRoom'
import Avatar from '@/components/ui/Avatar'

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

  const { data: particulierProfile } = await supabase
    .from('profiles')
    .select('id, prenom, nom')
    .eq('id', user.id)
    .single()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const projetTitre = (conversation.projets as any)?.titre ?? ''

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-3xl flex-col px-4 py-5 md:h-[calc(100vh-1rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 rounded-t-ac border border-b-0 border-ac-border bg-ac-surface px-5 py-3.5">
        <Link
          href="/particulier/conversations"
          className="shrink-0 text-sm font-semibold text-ac-text-sub transition-colors hover:text-ac-primary-text"
        >
          ←
        </Link>
        <Avatar name={interlocuteurNom} size={38} />
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-bold text-ac-text">{interlocuteurNom}</h1>
          <p className="truncate text-xs text-ac-text-muted">{projetTitre}</p>
        </div>
      </div>

      {/* Chat */}
      <div className="flex flex-1 min-h-0 flex-col rounded-b-ac border border-t-0 border-ac-border bg-ac-bg">
        <ChatRoom
          conversationId={id}
          currentUserId={user.id}
          participants={participants}
        />
      </div>
    </div>
  )
}
