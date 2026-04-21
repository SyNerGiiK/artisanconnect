import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import ChatRoom from '@/components/chat/ChatRoom'
import Avatar from '@/components/ui/Avatar'

export default async function ArtisanChatPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const [artisanRes, artisanProfileRes] = await Promise.all([
    supabase.from('artisans').select('id').eq('profil_id', user.id).single(),
    supabase.from('profiles').select('id, prenom, nom').eq('id', user.id).single(),
  ])

  const artisan = artisanRes.data as { id: string } | null
  if (!artisan) redirect('/artisan/onboarding')

  const artisanProfile = artisanProfileRes.data as { id: string; prenom: string; nom: string } | null

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

  const particulierProfile = conversation.particuliers?.profiles
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
  const projetTitre = conversation.projets?.titre ?? ''

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-3xl flex-col px-4 py-5 md:h-[calc(100vh-1rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 rounded-t-ac border border-b-0 border-ac-border bg-ac-surface px-5 py-3.5">
        <Link
          href="/artisan/conversations"
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
