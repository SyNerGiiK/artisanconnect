'use client'

import { useState, useEffect } from 'react'
import { completeArtisanOnboarding } from './actions'
import { createClient } from '@/lib/supabase/client'
import type { CategorieMetier } from '@/lib/types/database.types'

export default function ArtisanOnboardingPage() {
  const [categories, setCategories] = useState<CategorieMetier[]>([])
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchCategories() {
      const supabase = createClient()
      const { data } = await supabase
        .from('categories_metiers')
        .select('*')
        .order('id')
      if (data) setCategories(data)
    }
    fetchCategories()
  }, [])

  function toggleCategory(id: number) {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  async function handleSubmit(formData: FormData) {
    if (selectedCategories.length === 0) {
      setError('Veuillez sélectionner au moins un corps de métier.')
      return
    }
    setLoading(true)
    setError(null)

    selectedCategories.forEach((id) => {
      formData.append('categorie_ids', String(id))
    })

    const result = await completeArtisanOnboarding(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 mb-6">
          <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Completez votre profil artisan
        </h1>
        <p className="mt-3 text-gray-600">
          Ces informations seront visibles par les particuliers qui recherchent un artisan.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
        <form action={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nom_entreprise" className="block text-sm font-medium text-gray-700 mb-2">
              Nom de l&apos;entreprise *
            </label>
            <input
              id="nom_entreprise"
              name="nom_entreprise"
              type="text"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="Mon Entreprise SARL"
            />
          </div>

          <div>
            <label htmlFor="siret" className="block text-sm font-medium text-gray-700 mb-2">
              SIRET
            </label>
            <input
              id="siret"
              name="siret"
              type="text"
              maxLength={14}
              pattern="\d{14}"
              placeholder="14 chiffres"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description de votre activite
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="Decrivez vos services, votre experience..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="code_postal_base" className="block text-sm font-medium text-gray-700 mb-2">
                Code postal *
              </label>
              <input
                id="code_postal_base"
                name="code_postal_base"
                type="text"
                required
                maxLength={5}
                pattern="\d{5}"
                placeholder="85000"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div>
              <label htmlFor="rayon_km" className="block text-sm font-medium text-gray-700 mb-2">
                Rayon d&apos;intervention (km)
              </label>
              <input
                id="rayon_km"
                name="rayon_km"
                type="number"
                min={1}
                max={200}
                defaultValue={30}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          <div>
            <span className="block text-sm font-medium text-gray-700 mb-3">
              Corps de metier * (1 minimum)
            </span>
            <div className="space-y-2">
              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className={`flex cursor-pointer items-center rounded-xl border-2 p-4 transition-all ${
                    selectedCategories.includes(cat.id)
                      ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-100'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                    className="mr-3 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">{cat.libelle}</span>
                </label>
              ))}
            </div>
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
            {loading ? 'Enregistrement...' : 'Valider mon profil'}
          </button>
        </form>
      </div>
    </div>
  )
}
