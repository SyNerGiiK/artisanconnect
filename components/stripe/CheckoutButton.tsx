'use client'

import { useState } from 'react'

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false)

  async function handleCheckout() {
    try {
      setLoading(true)
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      if (!res.ok) throw new Error('Erreur réseau')
      
      const { url } = await res.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error(error)
      alert("Une erreur est survenue lors de la redirection vers Stripe.")
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 disabled:opacity-50 transition-all font-sans"
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )}
      Activer mon accès Premium (50€/mois)
    </button>
  )
}
