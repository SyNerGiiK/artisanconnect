'use client'

import { useActionState } from 'react'
import { sendResetPasswordEmail } from './actions'
import Link from 'next/link'

export default function MotDePasseOubliePage() {
  const [state, formAction] = useActionState(sendResetPasswordEmail, null)

  return (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Mot de passe oublié
        </h1>
        <p className="mt-3 text-gray-600">
          Entrez votre email pour recevoir un lien de réinitialisation.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
        {state?.success ? (
          <div className="rounded-xl bg-green-50 p-6 ring-1 ring-green-200">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-sm font-medium text-green-800 text-center">
              Un e-mail contenant un lien de réinitialisation vous a été envoyé. Pensez à vérifier vos courriers indésirables.
            </p>
          </div>
        ) : (
          <form action={formAction} className="space-y-5">
            {state?.error && (
              <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 ring-1 ring-red-200">
                {state.error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder="votre@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={state?.success}
              className="w-full rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-xl hover:scale-[1.02] disabled:bg-gray-300 disabled:shadow-none disabled:hover:scale-100"
            >
              Recevoir mon lien
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-center text-sm text-gray-600">
            <Link href="/connexion" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              Retour a la connexion
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
