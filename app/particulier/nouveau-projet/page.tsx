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
    <div className="mx-auto max-w-lg px-6 py-12">
      <div className="mb-8">
        <Link
          href="/particulier/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour au tableau de bord
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mb-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 mb-6">
          <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Déposer un projet
        </h1>
        <p className="mt-3 text-gray-600">
          Décrivez votre projet de travaux. Jusqu&apos;à 3 artisans pourront vous répondre.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
        <form action={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="titre" className="block text-sm font-medium text-gray-700 mb-2">
              Titre du projet *
            </label>
            <input
              id="titre"
              name="titre"
              type="text"
              required
              placeholder="Ex : Peinture salon + couloir"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div>
            <label htmlFor="categorie_id" className="block text-sm font-medium text-gray-700 mb-2">
              Type de travaux *
            </label>
            <select
              id="categorie_id"
              name="categorie_id"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
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
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              placeholder="Décrivez les travaux souhaités, la surface, vos contraintes..."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div>
            <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-2">
              Adresse du chantier *
            </label>
            <input
              id="adresse"
              name="adresse"
              type="text"
              required
              placeholder="12 rue de la Paix"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="code_postal" className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div>
              <label htmlFor="ville" className="block text-sm font-medium text-gray-700 mb-2">
                Ville *
              </label>
              <input
                id="ville"
                name="ville"
                type="text"
                required
                placeholder="La Roche-sur-Yon"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
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
            {loading ? 'Publication...' : 'Publier mon projet'}
          </button>
        </form>
      </div>
    </div>
  )
}
