'use client'

import { useState } from 'react'
import { submitReponse } from './actions'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import AlertBanner from '@/components/ui/AlertBanner'

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
    <form action={handleSubmit} className="flex flex-col gap-5">
      <Textarea
        id="message_initial"
        name="message_initial"
        required
        rows={6}
        label="Votre message"
        hint="Présentez-vous, vos qualifications et un premier ordre d'idée de tarif."
        placeholder="Bonjour, je suis disponible pour réaliser vos travaux. Voici ce que je propose…"
      />

      {error && <AlertBanner kind="error" title={error} />}

      <Button type="submit" disabled={loading} size="lg" full>
        {loading ? 'Envoi en cours…' : 'Envoyer ma réponse'}
      </Button>
    </form>
  )
}
