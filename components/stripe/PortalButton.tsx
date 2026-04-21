'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'

export default function PortalButton() {
  const [loading, setLoading] = useState(false)

  async function handlePortal() {
    try {
      setLoading(true)
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      if (!res.ok) throw new Error('Erreur réseau')

      const { url } = await res.json()
      if (url) window.location.href = url
    } catch (error) {
      console.error(error)
      alert("Une erreur est survenue lors de l'accès au portail de facturation.")
      setLoading(false)
    }
  }

  return (
    <Button variant="secondary" size="sm" onClick={handlePortal} disabled={loading}>
      {loading ? 'Chargement…' : '💳 Gérer mon abonnement'}
    </Button>
  )
}
