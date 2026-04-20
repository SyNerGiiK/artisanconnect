'use client'

import { useState } from 'react'

interface Props {
  priceId: string
  label: string
  variant?: 'primary' | 'secondary' | 'amber'
}

export default function CheckoutButton({ priceId, label, variant = 'primary' }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleCheckout() {
    try {
      setLoading(true)
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })
      if (!res.ok) throw new Error('Erreur réseau')
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch (error) {
      console.error(error)
      alert('Une erreur est survenue lors de la redirection vers Stripe.')
      setLoading(false)
    }
  }

  const styles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-200',
    amber: 'bg-amber-500 text-white hover:bg-amber-600',
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-sm disabled:opacity-50 transition-all ${styles[variant]}`}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )}
      {loading ? 'Redirection…' : label}
    </button>
  )
}
