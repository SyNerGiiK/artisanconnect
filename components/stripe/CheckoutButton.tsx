'use client'

import { useState } from 'react'

interface Props {
  priceId: string
  label: string
  variant?: 'primary' | 'secondary' | 'amber' | 'light'
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
    primary:
      'bg-ac-primary text-white hover:bg-ac-primary-dark hover:shadow-[0_4px_14px_rgba(59,130,246,0.3)]',
    secondary:
      'bg-ac-surface text-ac-text border border-ac-border hover:bg-ac-surface-hover',
    amber: 'bg-ac-amber text-white hover:brightness-110',
    light:
      'bg-white text-ac-primary-text hover:bg-ac-primary-light border border-white/50',
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-ac-sm px-5 py-3 text-sm font-semibold transition-all disabled:opacity-50 ${styles[variant]}`}
    >
      {loading ? 'Redirection…' : label}
    </button>
  )
}
