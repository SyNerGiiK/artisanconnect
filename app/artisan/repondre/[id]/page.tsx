import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import StatusBadge from '@/components/ui/StatusBadge'
import RepondreForm from './RepondreForm'

type ProjetDetail = {
  id: string
  titre: string
  description: string
  ville: string
  code_postal: string
  statut: string
  created_at: string
  categories_metiers: { libelle: string } | null
}

export default async function RepondrePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const { data } = await supabase
    .from('projets')
    .select('id, titre, description, ville, code_postal, statut, created_at, categories_metiers ( libelle )')
    .eq('id', id)
    .single()

  const projet = data as ProjetDetail | null

  if (!projet) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-12">
      <div className="mb-8">
        <Link
          href="/artisan/feed"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour aux chantiers
        </Link>
      </div>

      {/* Project summary card */}
      <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-100 mb-8">
        <div className="flex items-start justify-between mb-4">
          <h2 className="font-semibold text-lg text-gray-900">{projet.titre}</h2>
          <StatusBadge statut={projet.statut} />
        </div>
        <p className="text-sm text-gray-600 mb-4">{projet.description}</p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
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
        </div>
      </div>

      {/* Response form */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Répondre à ce chantier
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Présentez-vous et expliquez pourquoi vous êtes le bon artisan pour ce projet.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
        <RepondreForm projetId={projet.id} />
      </div>
    </div>
  )
}
