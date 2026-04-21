import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import StatusBadge from '@/components/ui/StatusBadge'
import EmptyState from '@/components/ui/EmptyState'
import AlertBanner from '@/components/ui/AlertBanner'
import Button from '@/components/ui/Button'

export default async function ArtisanFeedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const [profileRes, artisanRes] = await Promise.all([
    supabase
      .from('profiles')
      .select('prenom, nom')
      .eq('id', user.id)
      .single<{ prenom: string; nom: string }>(),
    supabase
      .from('artisans')
      .select('id, code_postal_base, abonnement_actif, artisan_categories ( categorie_id )')
      .eq('profil_id', user.id)
      .single(),
  ])

  const profile = profileRes.data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const artisan = artisanRes.data as any

  if (!artisan) redirect('/artisan/onboarding')

  const artisanCategorieIds =
    artisan.artisan_categories?.map((ac: { categorie_id: number }) => ac.categorie_id) ?? []

  const [projetsRes, myReponsesRes] = await Promise.all([
    supabase
      .from('projets')
      .select(`
        *,
        categories_metiers ( libelle ),
        reponses ( id )
      `)
      .eq('statut', 'ouvert')
      .in('categorie_id', artisanCategorieIds.length > 0 ? artisanCategorieIds : [-1])
      .order('is_boosted', { ascending: false })
      .order('is_urgent', { ascending: false })
      .order('created_at', { ascending: false }),
    supabase
      .from('reponses')
      .select('projet_id')
      .eq('artisan_id', artisan.id),
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const projets = projetsRes.data as any[] | null

  const respondedProjectIds = new Set<string>(
    (myReponsesRes.data ?? []).map((r: { projet_id: string }) => r.projet_id),
  )

  const projetCount = projets?.length ?? 0

  return (
    <div className="mx-auto max-w-[860px] px-7 py-8">
      <div className="mb-7">
        <h1 className="text-[28px] font-extrabold tracking-tight text-ac-text mb-1">
          Chantiers disponibles
        </h1>
        <p className="text-sm text-ac-text-sub">
          Bonjour {profile?.prenom ?? 'artisan'} — {projetCount} chantier{projetCount > 1 ? 's' : ''} dans votre zone
        </p>
      </div>

      {!artisan.abonnement_actif && (
        <AlertBanner
          type="warning"
          title="Abonnement Premium requis"
          desc="Accédez aux coordonnées des particuliers et envoyez vos devis en illimité."
          action={
            <Button href="/artisan/abonnement" variant="amber" size="sm">
              Voir les offres Premium →
            </Button>
          }
          className="mb-5"
        />
      )}

      {!projets || projets.length === 0 ? (
        <Card padded>
          <EmptyState
            icon="🏗️"
            title="Aucun chantier disponible"
            desc="Il n'y a pas encore de chantiers correspondant à vos critères dans votre zone d'intervention."
          />
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {projets.map((projet) => {
            const alreadyResponded = respondedProjectIds.has(projet.id)
            const responseCount = projet.reponses?.length ?? 0
            const isFull = responseCount >= 3

            return (
              <Card key={projet.id} hover className="p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <h3 className="font-bold text-base text-ac-text flex-1 min-w-0">
                    {projet.titre}
                  </h3>
                  <div className="flex flex-shrink-0 items-center gap-2">
                    <span className="whitespace-nowrap rounded-full border border-ac-border bg-ac-bg px-2.5 py-0.5 text-xs text-ac-text-muted">
                      {responseCount}/3
                    </span>
                    <StatusBadge statut={projet.statut} />
                  </div>
                </div>

                {(projet.is_boosted || projet.is_urgent) && (
                  <div className="mb-2 flex gap-1.5">
                    {projet.is_boosted && (
                      <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700">
                        🚀 Boosté
                      </span>
                    )}
                    {projet.is_urgent && (
                      <span className="rounded-full bg-ac-red-light px-2.5 py-0.5 text-[11px] font-bold text-ac-red">
                        ⚡ Urgent
                      </span>
                    )}
                  </div>
                )}

                <p className="text-sm text-ac-text-sub leading-relaxed line-clamp-2 mb-3.5">
                  {projet.description}
                </p>

                <div className="mb-4 flex flex-wrap gap-2">
                  {projet.categories_metiers && (
                    <Tag color="primary">{projet.categories_metiers.libelle}</Tag>
                  )}
                  <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-ac-border bg-ac-surface-hover px-2.5 py-0.5 text-xs font-semibold text-ac-text-sub">
                    📍 {projet.ville}
                  </span>
                  <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-ac-border bg-ac-surface-hover px-2.5 py-0.5 text-xs font-semibold text-ac-text-sub">
                    📅{' '}
                    {new Date(projet.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>

                {alreadyResponded ? (
                  <span className="inline-flex items-center gap-1.5 rounded-ac-sm border border-ac-green-border bg-ac-green-light px-3.5 py-1.5 text-[13px] font-semibold text-ac-green">
                    ✓ Vous avez répondu
                  </span>
                ) : isFull ? (
                  <span className="inline-flex items-center gap-1.5 rounded-ac-sm border border-ac-border bg-ac-bg px-3.5 py-1.5 text-[13px] text-ac-text-muted">
                    ✗ 3 artisans ont déjà répondu
                  </span>
                ) : (
                  <Button href={`/artisan/repondre/${projet.id}`}>
                    Répondre à ce chantier →
                  </Button>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
