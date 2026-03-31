'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { submitReponse } from './actions'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import StatusBadge from '@/components/ui/StatusBadge'

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

export default function RepondrePage() {
  const { id } = useParams<{ id: string }>()
  const [projet, setProjet] = useState<ProjetDetail | null>(null)
  const [loadingProjet, setLoadingProjet] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchProjet() {
      const supabase = createClient()
      const { data } = await supabase
        .from('projets')
        .select('id, titre, description, ville, code_postal, statut, created_at, categories_metiers ( libelle )')
        .eq('id', id)
        .single()

      setProjet(data as ProjetDetail | null)
      setLoadingProjet(false)
    }
    fetchProjet()
  }, [id])

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await submitReponse(id, formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  if (loadingProjet) {
    return (
      <div className="flex items-center justify-center py-24">
        <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    )
  }

  if (!projet) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 mb-6">
          <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-500 mb-6">Projet non trouvé.</p>
        <Link 
          href="/artisan/feed" 
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour aux chantiers
        </Link>
      </div>
    )
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
        <form action={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="message_initial" className="block text-sm font-medium text-gray-700 mb-2">
              Votre message *
            </label>
            <textarea
              id="message_initial"
              name="message_initial"
              required
              rows={5}
              placeholder="Bonjour, je suis disponible pour réaliser vos travaux. Voici ce que je propose..."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 ring-1 ring-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-xl hover:scale-[1.02] disabled:bg-gray-300 disabled:shadow-none disabled:hover:scale-100"
          >
            {loading ? 'Envoi en cours...' : 'Envoyer ma réponse'}
          </button>
        </form>
      </div>
    </div>
  )
}
