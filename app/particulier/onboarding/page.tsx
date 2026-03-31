'use client'

import { useState } from 'react'
import { completeParticulierOnboarding } from './actions'

export default function ParticulierOnboardingPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await completeParticulierOnboarding(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="mb-2 text-2xl font-bold">Complétez votre profil</h1>
      <p className="mb-8 text-gray-600">
        Ces informations nous aident à vous proposer des artisans proches de chez
        vous.
      </p>

      <form action={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="adresse" className="block text-sm font-medium mb-1">
            Adresse
          </label>
          <input
            id="adresse"
            name="adresse"
            type="text"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="12 rue de la Paix"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="code_postal" className="block text-sm font-medium mb-1">
              Code postal
            </label>
            <input
              id="code_postal"
              name="code_postal"
              type="text"
              maxLength={5}
              pattern="\d{5}"
              placeholder="85000"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="ville" className="block text-sm font-medium mb-1">
              Ville
            </label>
            <input
              id="ville"
              name="ville"
              type="text"
              placeholder="La Roche-sur-Yon"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Enregistrement...' : 'Continuer'}
        </button>
      </form>
    </div>
  )
}
