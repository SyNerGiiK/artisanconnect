'use client'

import { useState } from 'react'
import { signUp } from '../actions'
import Link from 'next/link'

export default function InscriptionPage() {
  const [role, setRole] = useState<'particulier' | 'artisan' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  async function handleSubmit(formData: FormData) {
    if (!role) return
    setLoading(true)
    setError(null)
    formData.set('role', role)
    const result = await signUp(formData)
    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setIsSuccess(true)
    }
    setLoading(false)
  }

  if (isSuccess) {
    return (
      <div className="text-center p-8 bg-green-50 rounded-xl border border-green-200">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          ✓
        </div>
        <h2 className="text-2xl font-bold text-green-800 mb-2">Vérifiez votre boîte mail</h2>
        <p className="text-green-700 mb-6">
          Nous vous avons envoyé un email contenant un lien de confirmation. Veuillez cliquer sur ce lien pour activer votre compte.
        </p>
        <Link href="/connexion" className="inline-block bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium">
          Aller à la connexion
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-center text-lg font-semibold">Créer un compte</h2>

      {/* Role selection */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setRole('particulier')}
          className={`rounded-lg border-2 p-4 text-center transition-colors ${
            role === 'particulier'
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <span className="block text-2xl mb-1">🏠</span>
          <span className="font-medium">Particulier</span>
          <span className="block text-xs text-gray-500 mt-1">
            Je cherche un artisan
          </span>
        </button>
        <button
          type="button"
          onClick={() => setRole('artisan')}
          className={`rounded-lg border-2 p-4 text-center transition-colors ${
            role === 'artisan'
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <span className="block text-2xl mb-1">🔧</span>
          <span className="font-medium">Artisan</span>
          <span className="block text-xs text-gray-500 mt-1">
            Je propose mes services
          </span>
        </button>
      </div>

      {role && (
        <form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="prenom" className="block text-sm font-medium mb-1">
                Prénom
              </label>
              <input
                id="prenom"
                name="prenom"
                type="text"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="nom" className="block text-sm font-medium mb-1">
                Nom
              </label>
              <input
                id="nom"
                name="nom"
                type="text"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

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
              minLength={6}
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
            {loading ? 'Création du compte...' : "S'inscrire"}
          </button>
        </form>
      )}

      <p className="text-center text-sm text-gray-500">
        Déjà un compte ?{' '}
        <Link href="/connexion" className="text-blue-600 hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  )
}
