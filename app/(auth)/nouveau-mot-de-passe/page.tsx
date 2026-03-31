'use client'

import { useActionState } from 'react'
import { updatePassword } from './actions'


export default function NouveauMotDePassePage() {
  const [state, formAction] = useActionState(updatePassword, null)

  return (
    <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl">
      <div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Nouveau mot de passe
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Veuillez saisir votre nouveau mot de passe ci-dessous.
        </p>
      </div>

      <form action={formAction} className="mt-8 space-y-6">
        {state?.error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200">
            {state.error}
          </div>
        )}

        <div className="-space-y-px rounded-md shadow-sm">
          <div>
            <label htmlFor="password" className="sr-only">
              Nouveau mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="relative block w-full appearance-none rounded-none rounded-t-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              placeholder="Nouveau mot de passe"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="sr-only">
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="relative block w-full appearance-none rounded-none rounded-b-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              placeholder="Confirmer le mot de passe"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            Mettre à jour mon mot de passe
          </button>
        </div>
      </form>
    </div>
  )
}
