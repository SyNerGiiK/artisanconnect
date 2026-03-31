import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SignOutButton from '@/components/auth/SignOutButton'
import Link from 'next/link'
import StatusBadge from '@/components/ui/StatusBadge'

export default async function ArtisanFeedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const { data: profile } = await supabase
    .from('profiles')
    .select('prenom, nom')
    .eq('id', user.id)
    .single<{ prenom: string; nom: string }>()

  // Get artisan record + categories
  const { data: artisanRaw } = await supabase
    .from('artisans')
    .select('id, code_postal_base, abonnement_actif, artisan_categories ( categorie_id )')
    .eq('profil_id', user.id)
    .single()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const artisan = artisanRaw as any

  if (!artisan) redirect('/artisan/onboarding')

  // RLS already filters by department + abonnement_actif, but we also filter
  // by artisan's categories client-side for the MVP
  const artisanCategorieIds =
    artisan.artisan_categories?.map((ac: { categorie_id: number }) => ac.categorie_id) ?? []

  // Fetch open projects — RLS handles zone + subscription filtering
  const { data: projetsRaw } = await supabase
    .from('projets')
    .select(`
      *,
      categories_metiers ( libelle ),
      reponses ( id, artisan_id )
    `)
    .eq('statut', 'ouvert')
    .in('categorie_id', artisanCategorieIds.length > 0 ? artisanCategorieIds : [-1])
    .order('created_at', { ascending: false })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const projets = projetsRaw as any[] | null

  // Check which projects this artisan already responded to
  const respondedProjectIds = new Set(
    projets
      ?.flatMap((p) => p.reponses ?? [])
      .filter((r: { artisan_id: string }) => r.artisan_id === artisan.id)
      .map((r: { artisan_id: string; id: string }) =>
        projets?.find((p) =>
          p.reponses?.some((re: { id: string }) => re.id === r.id)
        )?.id
      )
      .filter(Boolean) ?? []
  )

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Chantiers disponibles</h1>
        <p className="text-gray-600">
          Bonjour {profile?.prenom} — retrouvez ici les chantiers dans votre zone.
        </p>
      </div>

      {!artisan.abonnement_actif && (
        <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          Votre abonnement n&apos;est pas actif. Contactez-nous pour activer
          votre compte et accéder aux chantiers.
        </div>
      )}

      {!projets || projets.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center bg-white shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 mb-4">
             <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold mb-2">Aucun chantier disponible</h2>
          <p className="text-gray-500">
            Il n'y a pas encore de chantiers correspondant à vos critères dans votre zone d'intervention.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {projets.map((projet) => {
            const alreadyResponded = respondedProjectIds.has(projet.id)
            const responseCount = projet.reponses?.length ?? 0
            const isFull = responseCount >= 3

            return (
              <div
                key={projet.id}
                className="rounded-lg border border-gray-200 p-5 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{projet.titre}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {responseCount}/3 réponse{responseCount > 1 ? 's' : ''}
                    </span>
                    <StatusBadge statut={projet.statut} />
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                  {projet.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  {projet.categories_metiers && (
                    <span>{projet.categories_metiers.libelle}</span>
                  )}
                  <span>
                    {projet.ville} ({projet.code_postal})
                  </span>
                  <span>
                    {new Date(projet.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                    })}
                  </span>
                </div>

                {alreadyResponded ? (
                  <span className="text-sm text-gray-500 italic">
                    Vous avez déjà répondu à ce chantier
                  </span>
                ) : isFull ? (
                  <span className="text-sm text-gray-500 italic">
                    3 artisans ont déjà répondu
                  </span>
                ) : (
                  <Link
                    href={`/artisan/repondre/${projet.id}`}
                    className="inline-block rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    Répondre à ce chantier
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
