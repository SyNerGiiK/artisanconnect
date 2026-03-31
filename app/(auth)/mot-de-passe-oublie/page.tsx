'use client'

import { useActionState } from 'react'
import { sendResetPasswordEmail } from './actions'
import Link from 'next/link'

export default function MotDePasseOubliePage() {
  const [state, formAction] = useActionState(sendResetPasswordEmail, null)

  return (
    <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl">
      <div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Mot de passe oublié
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Entrez votre email pour recevoir un lien de réinitialisation.
        </p>
      </div>

      {state?.success ? (
        <div className="rounded-lg bg-green-50 p-4 border border-green-200">
          <p className="text-sm font-medium text-green-800 text-center">
            ✔ Un e-mail contenant un lien de réinitialisation vous a été envoyé. Pensez à vérifier vos courriers indésirables.
          </p>
        </div>
      ) : (
        <form action={formAction} className="mt-8 space-y-6">
          {state?.error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200">
              {state.error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="sr-only">
              Adresse email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="relative block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              placeholder="Adresse email"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={state?.success}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Recevoir mon lien
            </button>
          </div>
        </form>
      )}

      <div className="text-center text-sm">
        <Link
          href="/connexion"
          className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
        >
          Retour à la connexion
        </Link>
      </div>
    </div>
  )
}
