import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SignOutButton from '@/components/auth/SignOutButton'
import Link from 'next/link'
import StatusBadge from '@/components/ui/StatusBadge'

export default async function ArtisanFeedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  // Parallel: current user's profile + artisan record with categories
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

  // RLS already filters by department + abonnement_actif, but we also filter
  // by artisan's categories client-side for the MVP
  const artisanCategorieIds =
    artisan.artisan_categories?.map((ac: { categorie_id: number }) => ac.categorie_id) ?? []

  // Parallel: open projects + project_ids this artisan has already responded to
  // (avoids overfetching ALL reponses for ALL projects)
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

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Chantiers disponibles
        </h1>
        <p className="mt-2 text-gray-600">
          Bonjour {profile?.prenom} — retrouvez ici les chantiers dans votre zone.
        </p>
      </div>

      {!artisan.abonnement_actif && (
        <div className="mb-8 rounded-xl bg-amber-50 p-5 ring-1 ring-amber-200">
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 text-amber-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-bold text-lg text-amber-900">Abonnement Premium requis</p>
              <p className="text-sm text-amber-800 mt-1 max-w-xl">
                L'accès aux chantiers, aux coordonnées des particuliers et la possibilité d'envoyer vos devis sont réservés aux artisans Premium. Prenez une longueur d'avance dès aujourd'hui !
              </p>
              <Link
                href="/artisan/abonnement"
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 transition-all"
              >
                Voir les offres Premium
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}

      {!projets || projets.length === 0 ? (
        <div className="rounded-2xl bg-white p-16 text-center shadow-xl ring-1 ring-gray-100">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 mb-6">
            <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Aucun chantier disponible</h2>
          <p className="text-gray-500 max-w-sm mx-auto">
            Il n&apos;y a pas encore de chantiers correspondant à vos critères dans votre zone d&apos;intervention.
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
                className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-lg hover:ring-blue-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">{projet.titre}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {responseCount}/3 réponse{responseCount > 1 ? 's' : ''}
                    </span>
                    <StatusBadge statut={projet.statut} />
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {projet.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-5">
                  {projet.categories_metiers && (
                    <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">{projet.categories_metiers.libelle}</span>
                  )}
                  <span className="flex items-center gap-1">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {projet.ville} ({projet.code_postal})
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(projet.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                    })}
                  </span>
                </div>

                {alreadyResponded ? (
                  <span className="inline-flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
                    <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Vous avez déjà répondu
                  </span>
                ) : isFull ? (
                  <span className="inline-flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
                    <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    3 artisans ont déjà répondu
                  </span>
                ) : (
                  <Link
                    href={`/artisan/repondre/${projet.id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-xl hover:scale-[1.02]"
                  >
                    Répondre à ce chantier
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
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
