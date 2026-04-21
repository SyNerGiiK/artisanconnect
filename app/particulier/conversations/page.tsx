import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ConversationCard from '@/components/chat/ConversationCard'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'

export default async function ParticulierConversationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const { data: particulierRaw } = await supabase
    .from('particuliers')
    .select('id')
    .eq('profil_id', user.id)
    .single()

  const particulier = particulierRaw as { id: string } | null
  if (!particulier) redirect('/particulier/onboarding')

  const { data: viewRows } = await supabase
    .from('v_conversations_details' as never)
    .select('*')
    .eq('particulier_id', particulier.id)
    .order('last_message_date', { ascending: false, nullsFirst: false })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conversations = ((viewRows as any[] | null) ?? [])

  const conversationData = conversations.map((row) => ({
    id: row.conversation_id,
    projetTitre: row.projet_titre ?? 'Projet',
    interlocuteurNom: `${row.artisan_prenom ?? ''} ${row.artisan_nom ?? ''}`.trim(),
    interlocuteurEntreprise: row.artisan_nom_entreprise ?? null,
    lastMessage: row.last_message ?? null,
    lastMessageDate: row.last_message_date ?? row.conversation_created_at,
    unreadCount: Number(row.unread_particulier_count) || 0,
  }))

  return (
    <div className="mx-auto max-w-[860px] px-7 py-8">
      <div className="mb-7">
        <h1 className="text-[28px] font-extrabold tracking-tight text-ac-text">
          Mes conversations
        </h1>
        <p className="mt-1 text-sm text-ac-text-sub">
          Échangez avec les artisans que vous avez acceptés.
        </p>
      </div>

      {conversationData.length === 0 ? (
        <Card padded>
          <EmptyState
            icon="💬"
            title="Aucune conversation"
            desc="Acceptez la réponse d'un artisan sur l'un de vos projets pour démarrer une discussion."
            action={
              <Button href="/particulier/dashboard" size="sm">
                Voir mes projets →
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="flex flex-col gap-2.5">
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
