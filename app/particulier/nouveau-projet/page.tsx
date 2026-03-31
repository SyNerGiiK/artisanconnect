'use client'

import { useState, useEffect } from 'react'
import { createProject } from './actions'
import { createClient } from '@/lib/supabase/client'
import type { CategorieMetier } from '@/lib/types/database.types'
import Link from 'next/link'

export default function NouveauProjetPage() {
  const [categories, setCategories] = useState<CategorieMetier[]>([])
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

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await createProject(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <div className="mb-6">
        <Link
          href="/particulier/dashboard"
          className="text-sm text-blue-600 hover:underline"
        >
          &larr; Retour au tableau de bord
        </Link>
      </div>

      <h1 className="mb-2 text-2xl font-bold">Déposer un projet</h1>
      <p className="mb-8 text-gray-600">
        Décrivez votre projet de travaux. Jusqu&apos;à 3 artisans pourront vous
        répondre.
      </p>

      <form action={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="titre" className="block text-sm font-medium mb-1">
            Titre du projet *
          </label>
          <input
            id="titre"
            name="titre"
            type="text"
            required
            placeholder="Ex : Peinture salon + couloir"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="categorie_id"
            className="block text-sm font-medium mb-1"
          >
            Type de travaux *
          </label>
          <select
            id="categorie_id"
            name="categorie_id"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Choisir une catégorie</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.libelle}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
          >
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            placeholder="Décrivez les travaux souhaités, la surface, vos contraintes..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="adresse" className="block text-sm font-medium mb-1">
            Adresse du chantier *
          </label>
          <input
            id="adresse"
            name="adresse"
            type="text"
            required
            placeholder="12 rue de la Paix"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="code_postal"
              className="block text-sm font-medium mb-1"
            >
              Code postal *
            </label>
            <input
              id="code_postal"
              name="code_postal"
              type="text"
              required
              maxLength={5}
              pattern="\d{5}"
              placeholder="85000"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="ville" className="block text-sm font-medium mb-1">
              Ville *
            </label>
            <input
              id="ville"
              name="ville"
              type="text"
              required
              placeholder="La Roche-sur-Yon"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Publication...' : 'Publier mon projet'}
        </button>
      </form>
    </div>
  )
}
