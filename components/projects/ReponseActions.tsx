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
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    action: 'acceptee' | 'refusee' | null
  }>({ isOpen: false, action: null })

  function openModal(action: 'acceptee' | 'refusee') {
    setModalState({ isOpen: true, action })
  }

  function closeModal() {
    if (!loading) setModalState({ isOpen: false, action: null })
  }

  async function executeAction() {
    if (!modalState.action) return
    setLoading(true)
    setError(null)
    const result = await updateReponseStatus(reponseId, projetId, modalState.action)
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      closeModal()
    }
  }

  return (
    <div>
      <div className="flex gap-2">
        <button
          onClick={() => openModal('acceptee')}
          disabled={loading}
          className="rounded-xl bg-green-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-green-200 hover:bg-green-700 hover:scale-[1.02] disabled:opacity-50 transition-all font-sans"
        >
          Accepter
        </button>
        <button
          onClick={() => openModal('refusee')}
          disabled={loading}
          className="rounded-xl border border-red-200 bg-white px-5 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-50 transition-all font-sans"
        >
          Refuser
        </button>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600 font-medium">{error}</p>
      )}

      {/* Confirmation Modal */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-gray-200 animate-in zoom-in-95 duration-200">
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              {modalState.action === 'acceptee'
                ? 'Accepter cet artisan ?'
                : 'Refuser cet artisan ?'}
            </h3>
            <p className="mb-6 text-base text-gray-600 leading-relaxed">
              {modalState.action === 'acceptee'
                ? 'Vous allez ouvrir une conversation directe avec cet artisan. Si la limite de 3 réponses est atteinte, votre projet ne recevra plus de nouvelles candidatures.'
                : 'Cette action est définitive. L\'artisan sera informé de votre refus et ne pourra plus vous contacter pour ce projet.'}
            </p>

            <div className="flex gap-3 justify-end items-center">
              <button
                onClick={closeModal}
                disabled={loading}
                className="rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-all"
              >
                Annuler
              </button>
              <button
                onClick={executeAction}
                disabled={loading}
                className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all disabled:opacity-50 flex items-center gap-2 ${
                  modalState.action === 'acceptee'
                    ? 'bg-green-600 hover:bg-green-700 shadow-green-200'
                    : 'bg-red-600 hover:bg-red-700 shadow-red-200'
                }`}
              >
                {loading ? (
                   <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                ) : (
                  modalState.action === 'acceptee' ? 'Oui, Accepter' : 'Oui, Refuser'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
