import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SignOutButton from '@/components/auth/SignOutButton'
import ConversationCard from '@/components/chat/ConversationCard'
import Link from 'next/link'

export default async function ArtisanConversationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const { data: artisan } = await supabase
    .from('artisans')
    .select('id')
    .eq('profil_id', user.id)
    .single()

  if (!artisan) redirect('/artisan/onboarding')

  // Fetch conversations with project title and particulier info
  const { data: conversations } = await supabase
    .from('conversations')
    .select(`
      id,
      created_at,
      projets ( titre ),
      particuliers (
        profil_id,
        profiles ( prenom, nom )
      )
    `)
    .eq('artisan_id', artisan.id)
    .order('created_at', { ascending: false })

  // Fetch last message + unread count for each conversation
  const conversationData = await Promise.all(
    (conversations ?? []).map(async (conv) => {
      const { data: lastMsg } = await supabase
        .from('messages')
        .select('contenu, created_at')
        .eq('conversation_id', conv.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      const { count: unreadCount } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('conversation_id', conv.id)
        .eq('lu', false)
        .neq('auteur_id', user.id)

      const particulierProfile = (conv.particuliers as any)?.profiles
      const interlocuteurNom = particulierProfile
        ? `${particulierProfile.prenom} ${particulierProfile.nom}`
        : 'Particulier'

      return {
        id: conv.id,
        projetTitre: (conv.projets as any)?.titre ?? 'Projet',
        interlocuteurNom,
        lastMessage: lastMsg?.contenu ?? null,
        lastMessageDate: lastMsg?.created_at ?? conv.created_at,
        unreadCount: unreadCount ?? 0,
      }
    })
  )

  // Sort by last message date
  conversationData.sort((a, b) =>
    new Date(b.lastMessageDate ?? 0).getTime() -
    new Date(a.lastMessageDate ?? 0).getTime()
  )

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Mes conversations</h1>
          <p className="text-gray-600">
            Échangez avec les particuliers qui ont accepté votre réponse.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/artisan/feed"
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Feed
          </Link>
          <SignOutButton />
        </div>
      </div>

      {conversationData.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center text-gray-500">
          <p className="mb-2">Aucune conversation pour le moment.</p>
          <p className="text-sm">
            Les conversations s&apos;ouvrent quand un particulier accepte votre
            réponse.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {conversationData.map((conv) => (
            <ConversationCard
              key={conv.id}
              id={conv.id}
              projetTitre={conv.projetTitre}
              interlocuteurNom={conv.interlocuteurNom}
              lastMessage={conv.lastMessage}
              lastMessageDate={conv.lastMessageDate}
              unreadCount={conv.unreadCount}
              href={`/artisan/conversations/${conv.id}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
