'use client'

import { useState } from 'react'
import { signUp } from '../actions'
import Link from 'next/link'

function HomeIcon() {
  return (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}

function ToolsIcon() {
  return (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  )
}

export default function InscriptionPage() {
  const [role, setRole] = useState<'particulier' | 'artisan' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
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
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Créer un compte
        </h1>
        <p className="mt-3 text-gray-600">
          Rejoignez la communauté ArtisanConnect
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
        {/* Role selection */}
        <p className="text-sm font-medium text-gray-700 mb-4">Je suis...</p>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            type="button"
            onClick={() => setRole('particulier')}
            className={`group relative rounded-xl border-2 p-6 text-center transition-all duration-200 ${
              role === 'particulier'
                ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-100'
                : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
            }`}
          >
            <div className={`mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl transition-colors ${
              role === 'particulier' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200'
            }`}>
              <HomeIcon />
            </div>
            <span className="font-semibold text-gray-900 block">Particulier</span>
            <span className="block text-sm text-gray-500 mt-1">
              Je cherche un artisan
            </span>
            {role === 'particulier' && (
              <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center">
                <CheckIcon className="h-4 w-4 text-white" />
              </div>
            )}
          </button>
          <button
            type="button"
            onClick={() => setRole('artisan')}
            className={`group relative rounded-xl border-2 p-6 text-center transition-all duration-200 ${
              role === 'artisan'
                ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-100'
                : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
            }`}
          >
            <div className={`mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl transition-colors ${
              role === 'artisan' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200'
            }`}>
              <ToolsIcon />
            </div>
            <span className="font-semibold text-gray-900 block">Artisan</span>
            <span className="block text-sm text-gray-500 mt-1">
              Je propose mes services
            </span>
            {role === 'artisan' && (
              <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center">
                <CheckIcon className="h-4 w-4 text-white" />
              </div>
            )}
          </button>
        </div>

        {role && (
          <form action={handleSubmit} className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom
                </label>
                <input
                  id="prenom"
                  name="prenom"
                  type="text"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                  placeholder="Jean"
                />
              </div>
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                  placeholder="Dupont"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder="Minimum 8 caractères"
              />
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className={`rounded-lg p-2.5 text-center text-xs transition-colors ${
                  passwordRequirements.minLength ? 'bg-green-50 text-green-700 ring-1 ring-green-200' : 'bg-gray-50 text-gray-500'
                }`}>
                  {passwordRequirements.minLength && <CheckIcon className="h-3 w-3 inline mr-1" />}
                  8 caractères
                </div>
                <div className={`rounded-lg p-2.5 text-center text-xs transition-colors ${
                  passwordRequirements.hasUppercase ? 'bg-green-50 text-green-700 ring-1 ring-green-200' : 'bg-gray-50 text-gray-500'
                }`}>
                  {passwordRequirements.hasUppercase && <CheckIcon className="h-3 w-3 inline mr-1" />}
                  1 majuscule
                </div>
                <div className={`rounded-lg p-2.5 text-center text-xs transition-colors ${
                  passwordRequirements.hasNumber ? 'bg-green-50 text-green-700 ring-1 ring-green-200' : 'bg-gray-50 text-gray-500'
                }`}>
                  {passwordRequirements.hasNumber && <CheckIcon className="h-3 w-3 inline mr-1" />}
                  1 chiffre
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 ring-1 ring-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !isPasswordValid}
              className="w-full rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-xl hover:scale-[1.02] disabled:bg-gray-300 disabled:shadow-none disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Création du compte...
                </span>
              ) : (
                "Créer mon compte"
              )}
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-center text-sm text-gray-600">
            Déjà un compte ?{' '}
            <Link href="/connexion" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              Se connecter
            </Link>
          </p>
        </div>
      </div>

      {/* Trust badges */}
      <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Données sécurisées
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Gratuit pour les particuliers
        </div>
      </div>
    </>
  )
}
