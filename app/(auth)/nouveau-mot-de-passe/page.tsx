'use client'

import { useActionState } from 'react'
import { updatePassword } from './actions'

export default function NouveauMotDePassePage() {
  const [state, formAction] = useActionState(updatePassword, null)

  return (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Nouveau mot de passe
        </h1>
        <p className="mt-3 text-gray-600">
          Veuillez saisir votre nouveau mot de passe ci-dessous.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
        <form action={formAction} className="space-y-5">
          {state?.error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 ring-1 ring-red-200">
              {state.error}
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Nouveau mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="Minimum 8 caracteres"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="Confirmez votre mot de passe"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-xl hover:scale-[1.02]"
          >
            Mettre a jour mon mot de passe
          </button>
        </form>
      </div>
    </>
  )
}
