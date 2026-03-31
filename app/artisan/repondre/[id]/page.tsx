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
      <div className="mx-auto max-w-lg px-4 py-12 text-center text-gray-500">
        Chargement...
      </div>
    )
  }

  if (!projet) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12 text-center">
        <p className="text-gray-500 mb-4">Projet non trouvé.</p>
        <Link href="/artisan/feed" className="text-blue-600 hover:underline">
          Retour au feed
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <div className="mb-6">
        <Link
          href="/artisan/feed"
          className="text-sm text-blue-600 hover:underline"
        >
          &larr; Retour aux chantiers
        </Link>
      </div>

      {/* Project summary */}
      <div className="rounded-lg border border-gray-200 p-5 mb-8">
        <div className="flex items-start justify-between mb-2">
          <h2 className="font-semibold text-lg">{projet.titre}</h2>
          <StatusBadge statut={projet.statut} />
        </div>
        <p className="text-sm text-gray-600 mb-3">{projet.description}</p>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          {projet.categories_metiers && (
            <span>{projet.categories_metiers.libelle}</span>
          )}
          <span>
            {projet.ville} ({projet.code_postal})
          </span>
        </div>
      </div>

      {/* Response form */}
      <h1 className="mb-2 text-xl font-bold">Répondre à ce chantier</h1>
      <p className="mb-6 text-sm text-gray-600">
        Présentez-vous et expliquez pourquoi vous êtes le bon artisan pour ce
        projet. Le particulier verra votre message et votre profil entreprise.
      </p>

      <form action={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="message_initial"
            className="block text-sm font-medium mb-1"
          >
            Votre message *
          </label>
          <textarea
            id="message_initial"
            name="message_initial"
            required
            rows={5}
            placeholder="Bonjour, je suis disponible pour réaliser vos travaux. Voici ce que je propose..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Envoi...' : 'Envoyer ma réponse'}
        </button>
      </form>
    </div>
  )
}
