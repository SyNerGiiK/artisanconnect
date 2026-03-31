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
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="mb-2 text-2xl font-bold">Complétez votre profil artisan</h1>
      <p className="mb-8 text-gray-600">
        Ces informations seront visibles par les particuliers qui recherchent un
        artisan.
      </p>

      <form action={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="nom_entreprise" className="block text-sm font-medium mb-1">
            Nom de l&apos;entreprise *
          </label>
          <input
            id="nom_entreprise"
            name="nom_entreprise"
            type="text"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="siret" className="block text-sm font-medium mb-1">
            SIRET
          </label>
          <input
            id="siret"
            name="siret"
            type="text"
            maxLength={14}
            pattern="\d{14}"
            placeholder="14 chiffres"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description de votre activité
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Décrivez vos services, votre expérience..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="code_postal_base" className="block text-sm font-medium mb-1">
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="rayon_km" className="block text-sm font-medium mb-1">
              Rayon d&apos;intervention (km)
            </label>
            <input
              id="rayon_km"
              name="rayon_km"
              type="number"
              min={1}
              max={200}
              defaultValue={30}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <span className="block text-sm font-medium mb-2">
            Corps de métier * (1 minimum)
          </span>
          <div className="space-y-2">
            {categories.map((cat) => (
              <label
                key={cat.id}
                className={`flex cursor-pointer items-center rounded-lg border-2 p-3 transition-colors ${
                  selectedCategories.includes(cat.id)
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.id)}
                  onChange={() => toggleCategory(cat.id)}
                  className="mr-3 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium">{cat.libelle}</span>
              </label>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Enregistrement...' : 'Valider mon profil'}
        </button>
      </form>
    </div>
  )
}
