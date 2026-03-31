'use client'

import { useState } from 'react'
import { signUp } from '../actions'
import Link from 'next/link'

export default function InscriptionPage() {
  const [role, setRole] = useState<'particulier' | 'artisan' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')

  const passwordRequirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  }

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean)

  async function handleSubmit(formData: FormData) {
    if (!role) return
    setLoading(true)
    setError(null)
    formData.set('role', role)
    const result = await signUp(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg bg-white p-8 shadow-sm">
      <h2 className="text-center text-xl font-semibold text-gray-900 mb-8">
        Créer un compte
      </h2>

      {/* Role selection */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <button
          type="button"
          onClick={() => setRole('particulier')}
          className={`rounded-lg border-2 p-4 text-center transition-all duration-200 ${
            role === 'particulier'
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-200 text-gray-700 hover:border-gray-300'
          }`}
        >
          <span className="block text-3xl mb-2">🏠</span>
          <span className="font-medium block">Particulier</span>
          <span className="block text-xs text-gray-500 mt-2">
            Je cherche un artisan
          </span>
        </button>
        <button
          type="button"
          onClick={() => setRole('artisan')}
          className={`rounded-lg border-2 p-4 text-center transition-all duration-200 ${
            role === 'artisan'
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-200 text-gray-700 hover:border-gray-300'
          }`}
        >
          <span className="block text-3xl mb-2">🔧</span>
          <span className="font-medium block">Artisan</span>
          <span className="block text-xs text-gray-500 mt-2">
            Je propose mes services
          </span>
        </button>
      </div>

      {role && (
        <form action={handleSubmit} className="space-y-4 animate-in fade-in duration-300">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1.5">
                Prénom
              </label>
              <input
                id="prenom"
                name="prenom"
                type="text"
                required
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                placeholder="Jean"
              />
            </div>
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1.5">
                Nom
              </label>
              <input
                id="nom"
                name="nom"
                type="text"
                required
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                placeholder="Dupont"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              placeholder="••••••••"
            />
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2">
                <div className={`h-1.5 w-1.5 rounded-full ${passwordRequirements.minLength ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className={`text-xs ${passwordRequirements.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                  8 caractères minimum
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-1.5 w-1.5 rounded-full ${passwordRequirements.hasUppercase ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className={`text-xs ${passwordRequirements.hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
                  1 majuscule minimum
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-1.5 w-1.5 rounded-full ${passwordRequirements.hasNumber ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className={`text-xs ${passwordRequirements.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                  1 chiffre minimum
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3.5 text-sm text-red-600 border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !isPasswordValid}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors mt-6"
          >
            {loading ? 'Création du compte...' : "S'inscrire"}
          </button>
        </form>
      )}

      <p className="text-center text-sm text-gray-600 mt-6">
        Déjà un compte ?{' '}
        <Link href="/connexion" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
          Se connecter
        </Link>
      </p>
    </div>
  )
}
