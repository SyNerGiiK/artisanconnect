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

  if (currentStatut !== 'ouvert') return null

  const handleUpdate = async (newStatut: 'en_cours' | 'annule') => {
    // Add simple confirmation dialogue
    if (newStatut === 'annule' && !confirm('Êtes-vous sûr de vouloir annuler ce projet ? Il sera définitivement retiré.')) return;
    if (newStatut === 'en_cours' && !confirm('Avez-vous trouvé un artisan pour ce projet ? Il sera retiré de la liste publique.')) return;
    
    setLoading(true)
    setError(null)
    const res = await updateProjectStatus(projetId, newStatut)
    if (res?.error) {
       setError(res.error)
       setLoading(false)
    }
    // No setLoading(false) on success because Next.js revalidatePath will refresh the page
  }

  return (
    <div className="mt-8 flex flex-col gap-3 rounded-lg border border-blue-100 bg-blue-50/50 p-5">
      <h3 className="font-semibold text-blue-900">Ce projet n'est plus d'actualité ?</h3>
      <p className="text-sm text-blue-800 mb-1">
        Clôturez ce projet pour qu'il n'apparaisse plus sur le marché des artisans.
      </p>
      
      {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
      
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
    </div>
  )
}
