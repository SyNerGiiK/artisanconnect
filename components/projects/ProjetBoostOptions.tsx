'use client'

import { useState } from 'react'

type Props = {
  projetId: string
  isBoosted: boolean
  isUrgent: boolean
  photosUnlocked: boolean
}

export default function ProjetBoostOptions({ projetId, isBoosted, isUrgent, photosUnlocked }: Props) {
  const [loading, setLoading] = useState<string | null>(null)

  const purchase = async (type: 'boost' | 'urgence' | 'photos') => {
    setLoading(type)
    try {
      const res = await fetch('/api/stripe/checkout-projet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, projet_id: projetId }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      setLoading(null)
    }
  }

  const options = [
    {
      type: 'boost' as const,
      icon: '🚀',
      label: 'Boost visibilité',
      desc: 'Votre projet apparaît en premier dans le fil des artisans.',
      price: '4,99 €',
      done: isBoosted,
      doneLabel: 'Projet boosté',
    },
    {
      type: 'urgence' as const,
      icon: '⚡',
      label: 'Badge Urgence',
      desc: 'Signalez vos travaux comme urgents pour attirer des artisans disponibles rapidement.',
      price: '2,99 €',
      done: isUrgent,
      doneLabel: 'Badge activé',
    },
    {
      type: 'photos' as const,
      icon: '📷',
      label: 'Pack Photos',
      desc: "Ajoutez jusqu'à 5 photos pour illustrer vos travaux aux artisans.",
      price: '3,99 €',
      done: photosUnlocked,
      doneLabel: 'Photos débloquées',
    },
  ]

  return (
    <div className="mb-6 rounded-ac border border-indigo-200 bg-indigo-50/60 p-5">
      <h3 className="mb-1 font-bold text-[15px] text-indigo-900">Boostez votre projet</h3>
      <p className="mb-4 text-[13px] text-indigo-700">
        Augmentez vos chances de trouver l&apos;artisan idéal plus rapidement.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {options.map((opt) => (
          <div
            key={opt.type}
            className={`flex flex-col gap-1.5 rounded-ac-sm border p-4 ${
              opt.done
                ? 'border-ac-green-border bg-ac-green-light'
                : 'border-ac-border bg-ac-surface shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
            }`}
          >
            <div className="text-[22px] leading-none">{opt.icon}</div>
            <div className="text-[13px] font-bold text-ac-text">{opt.label}</div>
            <p className="flex-1 text-xs leading-relaxed text-ac-text-muted">
              {opt.desc}
            </p>
            {opt.done ? (
              <span className="text-xs font-bold text-ac-green">
                ✓ {opt.doneLabel}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => purchase(opt.type)}
                disabled={loading !== null}
                className="mt-1 w-full rounded-ac-sm bg-indigo-600 px-3 py-2 text-xs font-bold text-white transition-all hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading === opt.type ? 'Redirection…' : opt.price}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
