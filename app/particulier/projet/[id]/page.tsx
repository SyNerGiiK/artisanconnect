import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import StatusBadge from '@/components/ui/StatusBadge'
import ReponseActions from '@/components/projects/ReponseActions'
import ProjectStatusActions from '@/components/projects/ProjectStatusActions'
import ProjetBoostOptions from '@/components/projects/ProjetBoostOptions'
import PhotoUploader from '@/components/projects/PhotoUploader'

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

  // Parallel: project details + responses + conversations
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
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <Link
          href="/particulier/dashboard"
          className="text-sm text-blue-600 hover:underline"
        >
          &larr; Retour au tableau de bord
        </Link>
      </div>

      {/* Project details */}
      <div className="rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-2xl font-bold">{projet.titre}</h1>
          <StatusBadge statut={projet.statut} />
        </div>

        <p className="text-gray-700 mb-4 whitespace-pre-line">
          {projet.description}
        </p>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          {projet.categories_metiers && (
            <span>{projet.categories_metiers.libelle}</span>
          )}
          <span>
            {projet.ville} ({projet.code_postal})
          </span>
          <span>Publié le {formattedDate}</span>
        </div>

        <ProjectStatusActions projetId={projet.id} currentStatut={projet.statut} />

        {/* Photos */}
        {(projet as any).photos_unlocked && (
          <PhotoUploader
            projetId={projet.id}
            existingPhotos={(projet as any).photos ?? []}
          />
        )}
      </div>

      {/* Boost options — only for active projects */}
      {(projet.statut === 'ouvert' || projet.statut === 'en_cours') && (
        <ProjetBoostOptions
          projetId={projet.id}
          isBoosted={(projet as any).is_boosted ?? false}
          isUrgent={(projet as any).is_urgent ?? false}
          photosUnlocked={(projet as any).photos_unlocked ?? false}
        />
      )}

      {/* Responses */}
      <h2 className="text-lg font-semibold mb-4">
        Réponses ({reponses?.length ?? 0}/3)
      </h2>

      {!reponses || reponses.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
          Aucun artisan n&apos;a encore répondu à ce projet.
        </div>
      ) : (
        <div className="space-y-4">
          {reponses.map((reponse) => (
            <div
              key={reponse.id}
              className="rounded-lg border border-gray-200 p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">
                    {reponse.artisans?.nom_entreprise ?? 'Artisan'}
                  </h3>
                  {reponse.artisans?.code_postal_base && (
                    <p className="text-xs text-gray-500">
                      Basé à {reponse.artisans.code_postal_base}
                    </p>
                  )}
                </div>
                <StatusBadge statut={reponse.statut} />
              </div>

              {reponse.artisans?.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {reponse.artisans.description}
                </p>
              )}

              <div className="rounded-lg bg-gray-50 p-3 mb-3">
                <p className="text-sm text-gray-700 italic">
                  &laquo; {reponse.message_initial} &raquo;
                </p>
              </div>

              <p className="text-xs text-gray-400 mb-3">
                Reçue le{' '}
                {new Date(reponse.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>

              {reponse.statut === 'en_attente' && (
                <ReponseActions
                  reponseId={reponse.id}
                  projetId={projet.id}
                />
              )}

              {reponse.statut === 'acceptee' && (() => {
                const artisanId = (reponse.artisans as any)?.id
                const convId = artisanId ? convMap.get(artisanId) : undefined
                return convId ? (
                  <Link
                    href={`/particulier/conversations/${convId}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Envoyer un message
                  </Link>
                ) : null
              })()}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
