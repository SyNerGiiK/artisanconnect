'use client'

import { useState } from 'react'
import { updateProjectStatus } from '@/app/particulier/projet/[id]/actions'

export default function ProjectStatusActions({
  projetId,
  currentStatut
}: {
  projetId: string;
  currentStatut: string
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (currentStatut !== 'ouvert' && currentStatut !== 'en_cours') return null

  const handleUpdate = async (newStatut: 'en_cours' | 'annule' | 'termine') => {
    const confirmMessages: Record<string, string> = {
      annule: 'Êtes-vous sûr de vouloir annuler ce projet ? Il sera définitivement retiré.',
      en_cours: 'Avez-vous trouvé un artisan pour ce projet ? Il sera retiré de la liste publique.',
      termine: 'Confirmez-vous que les travaux sont terminés ? Le projet sera clôturé définitivement.',
    }
    if (!confirm(confirmMessages[newStatut])) return

    setLoading(true)
    setError(null)
    const res = await updateProjectStatus(projetId, newStatut)
    if (res?.error) {
      setError(res.error)
      setLoading(false)
    }
  }

  return (
    <div className="mt-8 flex flex-col gap-3 rounded-lg border border-blue-100 bg-blue-50/50 p-5">
      {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

      {currentStatut === 'ouvert' && (
        <>
          <h3 className="font-semibold text-blue-900">Ce projet n&apos;est plus d&apos;actualité ?</h3>
          <p className="text-sm text-blue-800 mb-1">
            Clôturez ce projet pour qu&apos;il n&apos;apparaisse plus sur le marché des artisans.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleUpdate('en_cours')}
              disabled={loading}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Mise à jour...' : "✅ J'ai trouvé mon artisan"}
            </button>
            <button
              onClick={() => handleUpdate('annule')}
              disabled={loading}
              className="rounded-lg border border-red-200 bg-white text-red-700 px-4 py-2 text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {loading ? 'Mise à jour...' : "❌ Annuler la demande"}
            </button>
          </div>
        </>
      )}

      {currentStatut === 'en_cours' && (
        <>
          <h3 className="font-semibold text-blue-900">Les travaux sont terminés ?</h3>
          <p className="text-sm text-blue-800 mb-1">
            Marquez ce chantier comme terminé pour clore définitivement le projet.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleUpdate('termine')}
              disabled={loading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Mise à jour...' : "🏁 Marquer comme terminé"}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
