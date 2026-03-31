'use client'

import { useState } from 'react'
import { updateReponseStatus } from '@/app/particulier/projet/[id]/actions'

export default function ReponseActions({
  reponseId,
  projetId,
}: {
  reponseId: string
  projetId: string
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAction(newStatut: 'acceptee' | 'refusee') {
    setLoading(true)
    setError(null)
    const result = await updateReponseStatus(reponseId, projetId, newStatut)
    if (result.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex gap-2">
        <button
          onClick={() => handleAction('acceptee')}
          disabled={loading}
          className="rounded-lg bg-green-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          Accepter
        </button>
        <button
          onClick={() => handleAction('refusee')}
          disabled={loading}
          className="rounded-lg border border-red-300 px-4 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50 transition-colors"
        >
          Refuser
        </button>
      </div>
      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}
