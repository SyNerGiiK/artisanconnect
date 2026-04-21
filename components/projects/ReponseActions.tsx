'use client'

import { useState } from 'react'
import { updateReponseStatus } from '@/app/particulier/projet/[id]/actions'
import Button from '@/components/ui/Button'

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
      <div className="flex flex-wrap gap-2">
        <Button
          variant="green"
          size="sm"
          onClick={() => setPendingAction('acceptee')}
          disabled={loading}
        >
          ✓ Accepter
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => setPendingAction('refusee')}
          disabled={loading}
        >
          ✗ Refuser
        </Button>
      </div>
      {error && <p className="mt-2 text-xs text-ac-red">{error}</p>}

      {pendingAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-ac bg-ac-surface p-6 shadow-[0_20px_40px_rgba(0,0,0,0.2)] ring-1 ring-ac-border">
            <div
              className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
                pendingAction === 'acceptee' ? 'bg-ac-green-light' : 'bg-ac-red-light'
              }`}
            >
              <span
                className={`text-2xl ${pendingAction === 'acceptee' ? 'text-ac-green' : 'text-ac-red'}`}
              >
                {pendingAction === 'acceptee' ? '✓' : '✕'}
              </span>
            </div>
            <h3 className="text-center text-lg font-bold text-ac-text">
              {pendingAction === 'acceptee'
                ? 'Accepter cet artisan ?'
                : 'Refuser cet artisan ?'}
            </h3>
            <p className="mt-2 text-center text-sm text-ac-text-sub">
              {pendingAction === 'acceptee'
                ? 'Une conversation sera créée automatiquement. Cette action est irréversible.'
                : "L'artisan sera définitivement rejeté pour ce projet. Cette action est irréversible."}
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                variant="secondary"
                full
                onClick={() => setPendingAction(null)}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button
                variant={pendingAction === 'acceptee' ? 'green' : 'danger'}
                full
                onClick={confirmAction}
                disabled={loading}
              >
                {loading
                  ? '…'
                  : pendingAction === 'acceptee'
                    ? "Confirmer l'acceptation"
                    : 'Confirmer le refus'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
