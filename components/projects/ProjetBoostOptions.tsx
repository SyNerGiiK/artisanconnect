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
      desc: 'Signalez vos travaux comme urgents pour attirer les artisans disponibles rapidement.',
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
    <div className="mt-8 rounded-xl border border-indigo-100 bg-indigo-50/40 p-5">
      <h3 className="font-semibold text-indigo-900 mb-1">Boostez votre projet</h3>
      <p className="text-sm text-indigo-700 mb-5">
        Augmentez vos chances de trouver l&apos;artisan idéal plus rapidement.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map((opt) => (
          <div
            key={opt.type}
            className={`rounded-xl border p-4 flex flex-col gap-2 ${
              opt.done
                ? 'border-green-200 bg-green-50'
                : 'border-white bg-white shadow-sm'
            }`}
          >
            <div className="text-2xl">{opt.icon}</div>
            <div className="font-semibold text-sm text-gray-900">{opt.label}</div>
            <p className="text-xs text-gray-500 flex-1">{opt.desc}</p>
            {opt.done ? (
              <span className="text-xs font-semibold text-green-700">✓ {opt.doneLabel}</span>
            ) : (
              <button
                onClick={() => purchase(opt.type)}
                disabled={loading !== null}
                className="mt-1 w-full rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {loading === opt.type ? 'Redirection...' : opt.price}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
