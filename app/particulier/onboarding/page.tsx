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
    <div className="mx-auto max-w-lg px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 mb-6">
          <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Completez votre profil
        </h1>
        <p className="mt-3 text-gray-600">
          Ces informations nous aident a vous proposer des artisans proches de chez vous.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
        <form action={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-2">
              Adresse
            </label>
            <input
              id="adresse"
              name="adresse"
              type="text"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="12 rue de la Paix"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="code_postal" className="block text-sm font-medium text-gray-700 mb-2">
                Code postal
              </label>
              <input
                id="code_postal"
                name="code_postal"
                type="text"
                maxLength={5}
                pattern="\d{5}"
                placeholder="85000"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div>
              <label htmlFor="ville" className="block text-sm font-medium text-gray-700 mb-2">
                Ville
              </label>
              <input
                id="ville"
                name="ville"
                type="text"
                placeholder="La Roche-sur-Yon"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
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
            {loading ? 'Enregistrement...' : 'Continuer'}
          </button>
        </form>
      </div>
    </div>
  )
}
