import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

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
      message,
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
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Mes devis envoyés</h1>
        <p className="text-gray-600">Suivez l&apos;état de vos candidatures auprès des particuliers.</p>
      </div>

      {!reponses || reponses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center text-gray-500 bg-white">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 mb-4">
             <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="mb-4">Vous n&apos;avez pas encore répondu à un chantier.</p>
          <Link href="/artisan/feed" className="text-blue-600 hover:underline font-medium">Découvrir les chantiers dans ma zone</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reponses.map((reponse: any) => (
            <div key={reponse.id} className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col md:flex-row gap-6 hover:shadow-sm transition-shadow">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{reponse.projets?.titre}</h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    reponse.statut === 'acceptee' ? 'bg-green-100 text-green-800' :
                    reponse.statut === 'refusee' ? 'bg-red-100 text-red-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {reponse.statut === 'acceptee' ? 'Acceptée' :
                     reponse.statut === 'refusee' ? 'Refusée' :
                     'En attente'}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mb-4">{reponse.projets?.ville} ({reponse.projets?.code_postal})</div>
                
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 italic border border-gray-100 line-clamp-2">
                  "{reponse.message}"
                </div>
              </div>
              
              <div className="flex flex-col gap-2 justify-end min-w-[140px]">
                <span className="text-xs text-center text-gray-500 mb-2">
                  Envoyé le {new Date(reponse.created_at).toLocaleDateString('fr-FR')}
                </span>
                <Link
                  href={`/artisan/conversations`}
                  className="w-full text-center rounded-lg bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
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
