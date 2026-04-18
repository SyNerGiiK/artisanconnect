'use client'

import { useState } from 'react'
import { submitReponse } from './actions'

export default function RepondreForm({ projetId }: { projetId: string }) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await submitReponse(projetId, formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="message_initial" className="block text-sm font-medium text-gray-700 mb-2">
          Votre message *
        </label>
        <textarea
          id="message_initial"
          name="message_initial"
          required
          rows={5}
          placeholder="Bonjour, je suis disponible pour réaliser vos travaux. Voici ce que je propose..."
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
        />
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
        {loading ? 'Envoi en cours...' : 'Envoyer ma réponse'}
      </button>
    </form>
  )
}
