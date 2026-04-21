'use client'

import { useState } from 'react'
import { submitAvis } from './actions'
import Button from '@/components/ui/Button'
import Textarea from '@/components/ui/Textarea'
import AlertBanner from '@/components/ui/AlertBanner'

export default function DonnerAvisForm({ artisanId, projetId }: { artisanId: string, projetId: string }) {
  const [note, setNote] = useState<number>(0)
  const [hoveredNote, setHoveredNote] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    if (note === 0) {
      setError("Veuillez sélectionner une note entre 1 et 5 étoiles.")
      return
    }
    
    setLoading(true)
    setError(null)
    
    formData.append('artisan_id', artisanId)
    formData.append('projet_id', projetId)
    formData.append('note', String(note))

    const res = await submitAvis(formData)
    if (res?.error) setError(res.error)
    setLoading(false)
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label className="text-[13px] font-semibold text-ac-text">Note globale</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((idx) => (
            <button
              key={idx}
              type="button"
              className="text-3xl focus:outline-none transition-transform hover:scale-110"
              onMouseEnter={() => setHoveredNote(idx)}
              onMouseLeave={() => setHoveredNote(0)}
              onClick={() => setNote(idx)}
            >
              {idx <= (hoveredNote || note) ? '⭐' : '☆'}
            </button>
          ))}
        </div>
      </div>

      <Textarea
        id="commentaire"
        name="commentaire"
        label="Votre commentaire"
        required
        rows={4}
        placeholder="Décrivez votre expérience avec cet artisan (respect des délais, qualité du travail, propreté...)"
      />

      {error && <AlertBanner kind="error" title={error} />}

      <Button type="submit" size="lg" full disabled={loading}>
        {loading ? 'Publication...' : 'Publier mon avis'}
      </Button>
    </form>
  )
}
