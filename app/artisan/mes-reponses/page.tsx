import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

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

  // Fetch responses with project details
  const { data: reponsesRaw } = await supabase
    .from('reponses')
    .select(`
      id,
      statut,
      message_initial,
      created_at,
      projets (
        id,
        titre,
        description,
        ville,
        code_postal
      )
    `)
    .eq('artisan_id', artisan.id)
    .order('created_at', { ascending: false })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reponses = reponsesRaw as any[] | null

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Mes devis envoyes
        </h1>
        <p className="mt-2 text-gray-600">
          Suivez l&apos;etat de vos candidatures aupres des particuliers.
        </p>
      </div>

      {!reponses || reponses.length === 0 ? (
        <div className="rounded-2xl bg-white p-16 text-center shadow-xl ring-1 ring-gray-100">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 mb-6">
            <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Aucun devis envoyé</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Vous n&apos;avez pas encore répondu à un chantier.
          </p>
          <Link 
            href="/artisan/feed" 
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-xl hover:scale-[1.02]"
          >
            Découvrir les chantiers
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reponses.map((reponse: any) => (
            <div key={reponse.id} className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-lg hover:ring-blue-200 flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">{reponse.projets?.titre}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    reponse.statut === 'acceptee' ? 'bg-green-100 text-green-700 ring-1 ring-green-200' :
                    reponse.statut === 'refusee' ? 'bg-red-100 text-red-700 ring-1 ring-red-200' :
                    'bg-amber-100 text-amber-700 ring-1 ring-amber-200'
                  }`}>
                    {reponse.statut === 'acceptee' ? 'Acceptée' :
                     reponse.statut === 'refusee' ? 'Refusée' :
                     'En attente'}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {reponse.projets?.ville} ({reponse.projets?.code_postal})
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 italic ring-1 ring-gray-100 line-clamp-2">
                  &quot;{reponse.message_initial}&quot;
                </div>
              </div>
              
              <div className="flex flex-col gap-3 justify-end min-w-[160px]">
                <span className="text-xs text-center text-gray-500">
                  Envoyé le {new Date(reponse.created_at).toLocaleDateString('fr-FR')}
                </span>
                <Link
                  href={`/artisan/conversations`}
                  className="w-full text-center rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50 hover:ring-gray-300 transition-all"
                >
                  Voir les messages
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
