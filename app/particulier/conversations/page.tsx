import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SignOutButton from '@/components/auth/SignOutButton'
import ConversationCard from '@/components/chat/ConversationCard'
import Link from 'next/link'

export default async function ParticulierConversationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const { data: particulier } = await supabase
    .from('particuliers')
    .select('id')
    .eq('profil_id', user.id)
    .single()

  if (!particulier) redirect('/particulier/onboarding')

  // Fetch conversations with project title and artisan info
  const { data: conversations } = await supabase
    .from('conversations')
    .select(`
      id,
      created_at,
      projets ( titre ),
      artisans (
        profil_id,
        nom_entreprise,
        profiles ( prenom, nom )
      )
    `)
    .eq('particulier_id', particulier.id)
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

      const artisanData = conv.artisans as any
      const artisanProfile = artisanData?.profiles
      const interlocuteurNom = artisanProfile
        ? `${artisanProfile.prenom} ${artisanProfile.nom}`
        : 'Artisan'

      return {
        id: conv.id,
        projetTitre: (conv.projets as any)?.titre ?? 'Projet',
        interlocuteurNom,
        interlocuteurEntreprise: artisanData?.nom_entreprise ?? null,
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
            Échangez avec les artisans que vous avez acceptés.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/particulier/dashboard"
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Dashboard
          </Link>
          <SignOutButton />
        </div>
      </div>

      {conversationData.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center text-gray-500">
          <p className="mb-2">Aucune conversation pour le moment.</p>
          <p className="text-sm">
            Acceptez la réponse d&apos;un artisan sur un de vos projets pour
            démarrer une conversation.
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
              interlocuteurEntreprise={conv.interlocuteurEntreprise}
              lastMessage={conv.lastMessage}
              lastMessageDate={conv.lastMessageDate}
              unreadCount={conv.unreadCount}
              href={`/particulier/conversations/${conv.id}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
