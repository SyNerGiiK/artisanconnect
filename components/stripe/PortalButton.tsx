'use client'

import { useState } from 'react'

export default function PortalButton() {
  const [loading, setLoading] = useState(false)

  async function handlePortal() {
    try {
      setLoading(true)
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      if (!res.ok) throw new Error('Erreur réseau')
      
      const { url } = await res.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error(error)
      alert("Une erreur est survenue lors de l'accès au portail de facturation.")
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePortal}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-lg bg-gray-100 border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-200 disabled:opacity-50 transition-all font-sans"
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 text-gray-800" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )}
      Gérer mon abonnement Stripe
    </button>
  )
}
