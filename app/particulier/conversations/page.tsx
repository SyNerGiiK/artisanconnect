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
  const { data: conversationsRaw } = await supabase
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conversations = conversationsRaw as any[] | null

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Mes conversations</h1>
        <p className="text-gray-600">
          Échangez avec les artisans que vous avez acceptés.
        </p>
      </div>

      {conversationData.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center bg-white shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 mb-4">
             <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold mb-2">Aucune conversation</h2>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Acceptez la réponse d'un artisan sur l'un de vos projets pour démarrer une discussion.
          </p>
          <Link href="/particulier/dashboard" className="inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
            Voir mes projets
          </Link>
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
