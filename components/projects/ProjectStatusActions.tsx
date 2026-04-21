'use client'

import { useState } from 'react'
import { updateProjectStatus } from '@/app/particulier/projet/[id]/actions'
import Button from '@/components/ui/Button'

export default function ProjectStatusActions({
  projetId,
  currentStatut,
}: {
  projetId: string
  currentStatut: string
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (currentStatut !== 'ouvert' && currentStatut !== 'en_cours') return null

  const handleUpdate = async (newStatut: 'en_cours' | 'annule' | 'termine') => {
    const confirmMessages: Record<string, string> = {
      annule:
        'Êtes-vous sûr de vouloir annuler ce projet ? Il sera définitivement retiré.',
      en_cours:
        'Avez-vous trouvé un artisan pour ce projet ? Il sera retiré de la liste publique.',
      termine:
        'Confirmez-vous que les travaux sont terminés ? Le projet sera clôturé définitivement.',
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
    <div className="mt-6 flex flex-col gap-2.5 rounded-ac border border-ac-primary-border bg-ac-primary-light/60 p-5">
      {error && <p className="text-sm font-medium text-ac-red">{error}</p>}

      {currentStatut === 'ouvert' && (
        <>
          <h3 className="font-bold text-ac-text">
            Ce projet n&apos;est plus d&apos;actualité ?
          </h3>
          <p className="mb-1 text-[13px] text-ac-text-sub">
            Clôturez ce projet pour qu&apos;il n&apos;apparaisse plus sur le marché des artisans.
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2.5">
            <Button
              variant="green"
              size="sm"
              onClick={() => handleUpdate('en_cours')}
              disabled={loading}
            >
              {loading ? 'Mise à jour…' : "✅ J'ai trouvé mon artisan"}
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleUpdate('annule')}
              disabled={loading}
            >
              {loading ? 'Mise à jour…' : '❌ Annuler la demande'}
            </Button>
          </div>
        </>
      )}

      {currentStatut === 'en_cours' && (
        <>
          <h3 className="font-bold text-ac-text">Les travaux sont terminés ?</h3>
          <p className="mb-1 text-[13px] text-ac-text-sub">
            Marquez ce chantier comme terminé pour clore définitivement le projet.
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2.5">
            <Button
              size="sm"
              onClick={() => handleUpdate('termine')}
              disabled={loading}
            >
              {loading ? 'Mise à jour…' : '🏁 Marquer comme terminé'}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
