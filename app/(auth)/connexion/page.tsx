'use client'

import { useState, Suspense } from 'react'
import { signIn } from '../actions'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function ConnexionForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const authError = searchParams.get('error')

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await signIn(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-center text-lg font-semibold">Se connecter</h2>

      {authError === 'auth' && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">
          Erreur de vérification du compte. Veuillez réessayer.
        </p>
      )}

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
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
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500">
        Pas encore de compte ?{' '}
        <Link href="/inscription" className="text-blue-600 hover:underline">
          Créer un compte
        </Link>
      </p>
    </div>
  )
}

export default function ConnexionPage() {
  return (
    <Suspense fallback={<div className="text-center py-8">Chargement...</div>}>
      <ConnexionForm />
    </Suspense>
  )
}
