import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import StatusBadge from '@/components/ui/StatusBadge'

export default async function MesReponsesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const { data: artisanRaw } = await supabase
    .from('artisans')
    .select('id')
    .eq('profil_id', user.id)
    .single()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const artisan = artisanRaw as any
  if (!artisan) redirect('/artisan/onboarding')

  const [reponsesRes, convsRes] = await Promise.all([
    supabase
      .from('reponses')
      .select(`
        id,
        statut,
        message_initial,
        created_at,
        projet_id,
        projets (
          id,
          titre,
          description,
          ville,
          code_postal
        )
      `)
      .eq('artisan_id', artisan.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('conversations')
      .select('id, projet_id')
      .eq('artisan_id', artisan.id),
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reponses = reponsesRes.data as any[] | null
  const convMap = new Map((convsRes.data ?? []).map((c) => [c.projet_id, c.id]))

  return (
    <div className="mx-auto max-w-[1100px] px-7 py-8">
      <div className="mb-7">
        <h1 className="text-[28px] font-extrabold tracking-tight text-ac-text">
          Mes devis envoyés
        </h1>
        <p className="mt-1 text-sm text-ac-text-sub">
          Suivez l&apos;état de vos candidatures auprès des particuliers.
        </p>
      </div>

      {!reponses || reponses.length === 0 ? (
        <Card padded>
          <EmptyState
            icon="📝"
            title="Aucun devis envoyé"
            desc="Vous n'avez pas encore répondu à un chantier."
            action={
              <Button href="/artisan/feed" size="sm">
                Découvrir les chantiers →
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="flex flex-col gap-3.5">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {reponses.map((reponse: any) => {
            const convId = convMap.get(reponse.projet_id)
            const isRefusee = reponse.statut === 'refusee'
            const isAcceptee = reponse.statut === 'acceptee'

            const wrapperBg = isAcceptee
              ? 'border-ac-green-border bg-ac-green-light'
              : isRefusee
                ? 'border-red-300 bg-ac-red-light opacity-70'
                : 'border-ac-border bg-ac-surface'

            return (
              <Card
                key={reponse.id}
                className={`flex flex-col gap-5 border-[1.5px] p-5 sm:p-6 md:flex-row ${wrapperBg}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                    <h3 className="text-[17px] font-bold text-ac-text">
                      {reponse.projets?.titre}
                    </h3>
                    <StatusBadge statut={reponse.statut} />
                  </div>

                  <div className="mb-3 text-xs font-semibold text-ac-text-muted">
                    📍 {reponse.projets?.ville} ({reponse.projets?.code_postal})
                  </div>

                  <div className="rounded-ac-sm bg-ac-bg px-4 py-3">
                    <p className="line-clamp-2 text-sm italic leading-relaxed text-ac-text-sub">
                      «&nbsp;{reponse.message_initial}&nbsp;»
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-end gap-2.5 md:min-w-[200px]">
                  <span className="text-center text-[11px] text-ac-text-muted">
                    Envoyé le{' '}
                    {new Date(reponse.created_at).toLocaleDateString('fr-FR')}
                  </span>

                  {isAcceptee && convId && (
                    <Button
                      href={`/artisan/conversations/${convId}`}
                      variant="green"
                      size="sm"
                      full
                    >
                      💬 Ouvrir la conversation
                    </Button>
                  )}

                  {!isAcceptee && !isRefusee && (
                    <span className="w-full rounded-ac-sm border border-ac-amber-border bg-ac-amber-light px-4 py-2 text-center text-xs font-semibold text-ac-amber">
                      En attente du client
                    </span>
                  )}

                  {isRefusee && (
                    <span className="w-full rounded-ac-sm border border-ac-border bg-ac-surface-hover px-4 py-2 text-center text-xs font-semibold text-ac-text-muted">
                      Demande refusée
                    </span>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
