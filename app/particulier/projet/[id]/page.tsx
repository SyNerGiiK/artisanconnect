import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import StatusBadge from '@/components/ui/StatusBadge'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import ReponseActions from '@/components/projects/ReponseActions'
import ProjectStatusActions from '@/components/projects/ProjectStatusActions'
import ProjetBoostOptions from '@/components/projects/ProjetBoostOptions'
import PhotoUploader from '@/components/projects/PhotoUploader'
import PhotoGallery from '@/components/projects/PhotoGallery'

export default async function ProjetDetailPage({
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

  const [projetRes, reponsesRes, convsRes] = await Promise.all([
    supabase
      .from('projets')
      .select('*, categories_metiers ( libelle )')
      .eq('id', id)
      .eq('particulier_id', particulier.id)
      .single(),
    supabase
      .from('reponses')
      .select(`
        *,
        artisans (
          id,
          nom_entreprise,
          description,
          code_postal_base
        )
      `)
      .eq('projet_id', id)
      .order('created_at', { ascending: true }),
    supabase
      .from('conversations')
      .select('id, artisan_id')
      .eq('projet_id', id),
  ])

  const projet = projetRes.data
  const reponses = reponsesRes.data
  const convMap = new Map((convsRes.data ?? []).map((c) => [c.artisan_id, c.id]))

  if (!projet) notFound()

  const formattedDate = new Date(projet.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="mx-auto max-w-[860px] px-7 py-8">
      <Link
        href="/particulier/dashboard"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-ac-text-sub transition-colors hover:text-ac-primary"
      >
        ← Mes projets
      </Link>

      <Card className="mb-5 p-7 sm:p-8">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {projet.is_boosted && (
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
                  🚀 Boosté
                </span>
              )}
              {projet.is_urgent && (
                <span className="rounded-full bg-ac-red-light px-2.5 py-0.5 text-xs font-bold text-ac-red">
                  ⚡ Urgent
                </span>
              )}
              {projet.categories_metiers && (
                <Tag color="primary">{projet.categories_metiers.libelle}</Tag>
              )}
              <StatusBadge statut={projet.statut} />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-ac-text">
              {projet.titre}
            </h1>
          </div>
        </div>

        <p className="mb-4 whitespace-pre-line text-sm leading-relaxed text-ac-text-sub">
          {projet.description}
        </p>

        {projet.photos && projet.photos.length > 0 && (
          <PhotoGallery photos={projet.photos} />
        )}

        <div className="flex flex-wrap gap-2 text-xs text-ac-text-muted">
          <span className="inline-flex items-center gap-1 rounded-full border border-ac-border bg-ac-surface-hover px-2.5 py-0.5 font-semibold">
            📍 {projet.ville} ({projet.code_postal})
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-ac-border bg-ac-surface-hover px-2.5 py-0.5 font-semibold">
            📅 Publié le {formattedDate}
          </span>
        </div>

        <ProjectStatusActions projetId={projet.id} currentStatut={projet.statut} />

        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {(projet as any).photos_unlocked && (
          <PhotoUploader
            projetId={projet.id}
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            existingPhotos={(projet as any).photos ?? []}
          />
        )}
      </Card>

      {(projet.statut === 'ouvert' || projet.statut === 'en_cours') && (
        <ProjetBoostOptions
          projetId={projet.id}
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          isBoosted={(projet as any).is_boosted ?? false}
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          isUrgent={(projet as any).is_urgent ?? false}
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          photosUnlocked={(projet as any).photos_unlocked ?? false}
        />
      )}

      <h2 className="mb-4 text-lg font-bold text-ac-text">
        Réponses reçues{' '}
        <span className="font-normal text-ac-text-muted text-sm">
          ({reponses?.length ?? 0}/3)
        </span>
      </h2>

      {!reponses || reponses.length === 0 ? (
        <Card padded>
          <EmptyState
            icon="📬"
            title="Aucune réponse pour l'instant"
            desc="Les artisans de votre zone seront notifiés. Revenez bientôt !"
          />
        </Card>
      ) : (
        <div className="flex flex-col gap-3.5">
          {reponses.map((reponse) => {
            const wrapperBg =
              reponse.statut === 'acceptee'
                ? 'bg-ac-green-light border-ac-green-border'
                : reponse.statut === 'refusee'
                  ? 'bg-ac-red-light border-red-300'
                  : 'bg-ac-surface border-ac-border'

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const artisanId = (reponse.artisans as any)?.id
            const convId = artisanId ? convMap.get(artisanId) : undefined

            return (
              <Card
                key={reponse.id}
                className={`p-5 sm:p-6 border-[1.5px] ${wrapperBg}`}
              >
                <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={reponse.artisans?.nom_entreprise ?? 'Artisan'}
                      size={42}
                    />
                    <div>
                      <Link href={`/particulier/artisan/${artisanId}`} className="text-[15px] font-bold text-ac-text hover:text-ac-primary transition-colors inline-block">
                        {reponse.artisans?.nom_entreprise ?? 'Artisan'}
                      </Link>
                      {reponse.artisans?.code_postal_base && (
                        <div className="text-xs text-ac-text-muted">
                          Basé à {reponse.artisans.code_postal_base}
                        </div>
                      )}
                    </div>
                  </div>
                  <StatusBadge statut={reponse.statut} />
                </div>

                {reponse.artisans?.description && (
                  <p className="mb-3 line-clamp-2 text-sm text-ac-text-sub">
                    {reponse.artisans.description}
                  </p>
                )}

                <div className="mb-3.5 rounded-ac-sm bg-ac-bg px-4 py-3">
                  <p className="text-sm italic leading-relaxed text-ac-text-sub">
                    «&nbsp;{reponse.message_initial}&nbsp;»
                  </p>
                </div>

                <p className="mb-3 text-xs text-ac-text-muted">
                  Reçue le{' '}
                  {new Date(reponse.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>

                {reponse.statut === 'en_attente' && (
                  <ReponseActions reponseId={reponse.id} projetId={projet.id} />
                )}

                {reponse.statut === 'acceptee' && convId && (
                  <div className="flex flex-wrap gap-3">
                    <Button href={`/particulier/conversations/${convId}`} size="sm">
                      💬 Ouvrir la conversation
                    </Button>
                    <Button variant="secondary" href={`/particulier/donner-avis?artisan=${artisanId}&projet=${projet.id}`} size="sm">
                      ⭐ Noter l'artisan
                    </Button>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
