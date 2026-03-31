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
  const [pendingAction, setPendingAction] = useState<'acceptee' | 'refusee' | null>(null)

  async function confirmAction() {
    if (!pendingAction) return
    setLoading(true)
    setError(null)
    const result = await updateReponseStatus(reponseId, projetId, pendingAction)
    if (result.error) {
      setError(result.error)
      setLoading(false)
    }
    setPendingAction(null)
  }

  return (
    <div>
      <div className="flex gap-2">
        <button
          onClick={() => setPendingAction('acceptee')}
          disabled={loading}
          className="rounded-lg bg-green-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          Accepter
        </button>
        <button
          onClick={() => setPendingAction('refusee')}
          disabled={loading}
          className="rounded-lg border border-red-300 px-4 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50 transition-colors"
        >
          Refuser
        </button>
      </div>
      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}

      {/* Confirmation Modal */}
      {pendingAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-gray-200 animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full mb-4" 
                 style={{ backgroundColor: pendingAction === 'acceptee' ? '#dcfce7' : '#fee2e2' }}>
              {pendingAction === 'acceptee' ? (
                <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center">
              {pendingAction === 'acceptee'
                ? "Accepter cet artisan ?"
                : "Refuser cet artisan ?"}
            </h3>
            <p className="mt-2 text-sm text-gray-600 text-center">
              {pendingAction === 'acceptee'
                ? "Une conversation sera créée automatiquement. Cette action est irréversible."
                : "L'artisan sera définitivement rejeté pour ce projet. Cette action est irréversible."}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setPendingAction(null)}
                disabled={loading}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmAction}
                disabled={loading}
                className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50 ${
                  pendingAction === 'acceptee'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {loading ? (
                  <svg className="animate-spin h-4 w-4 mx-auto text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  pendingAction === 'acceptee' ? 'Confirmer l\'acceptation' : 'Confirmer le refus'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
