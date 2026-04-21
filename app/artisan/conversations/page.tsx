import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ConversationCard from '@/components/chat/ConversationCard'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'

export default async function ArtisanConversationsPage() {
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

  const { data: viewRows } = await supabase
    .from('v_conversations_details' as never)
    .select('*')
    .eq('artisan_id', artisan.id)
    .order('last_message_date', { ascending: false, nullsFirst: false })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conversations = ((viewRows as any[] | null) ?? [])

  const conversationData = conversations.map((row) => ({
    id: row.conversation_id,
    projetTitre: row.projet_titre ?? 'Projet',
    interlocuteurNom: `${row.particulier_prenom ?? ''} ${row.particulier_nom ?? ''}`.trim(),
    lastMessage: row.last_message ?? null,
    lastMessageDate: row.last_message_date ?? row.conversation_created_at,
    unreadCount: Number(row.unread_artisan_count) || 0,
  }))

  return (
    <div className="mx-auto max-w-[860px] px-7 py-8">
      <div className="mb-7">
        <h1 className="text-[28px] font-extrabold tracking-tight text-ac-text">
          Mes conversations
        </h1>
        <p className="mt-1 text-sm text-ac-text-sub">
          Échangez avec les particuliers qui ont accepté votre devis.
        </p>
      </div>

      {conversationData.length === 0 ? (
        <Card padded>
          <EmptyState
            icon="💬"
            title="Aucune conversation"
            desc="Les conversations s'ouvrent dès qu'un particulier accepte l'un de vos devis."
            action={
              <Button href="/artisan/feed" size="sm">
                Voir les chantiers disponibles →
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
