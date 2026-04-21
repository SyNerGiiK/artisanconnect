'use client'

import { useState, useEffect } from 'react'
import { createProject } from './actions'
import { createClient } from '@/lib/supabase/client'
import type { CategorieMetier } from '@/lib/types/database.types'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'

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
    <div className="mx-auto max-w-[640px] px-7 py-8">
      <Link
        href="/particulier/dashboard"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-ac-text-sub transition-colors hover:text-ac-primary"
      >
        ← Retour au tableau de bord
      </Link>

      <h1 className="text-[26px] font-extrabold text-ac-text tracking-tight mb-1.5">
        Déposer un projet
      </h1>
      <p className="text-sm text-ac-text-sub mb-7">
        Décrivez vos besoins pour recevoir jusqu&apos;à 3 devis gratuits d&apos;artisans qualifiés.
      </p>

      <Card padded>
        <form action={handleSubmit} className="flex flex-col gap-4.5">
          <Input
            label="Titre du projet"
            id="titre"
            name="titre"
            type="text"
            required
            placeholder="Ex : Peinture salon + couloir"
          />

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="categorie_id"
              className="text-[13px] font-semibold text-ac-text"
            >
              Type de travaux <span className="text-ac-red">*</span>
            </label>
            <select
              id="categorie_id"
              name="categorie_id"
              required
              className="w-full px-3.5 py-2.5 rounded-ac-sm border-[1.5px] border-ac-border bg-ac-surface text-ac-text text-sm outline-none transition-colors focus:border-ac-primary focus:shadow-[0_0_0_3px_var(--ac-primary-light)]"
            >
              <option value="">Choisir une catégorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.libelle}
                </option>
              ))}
            </select>
          </div>

          <Textarea
            label="Description détaillée"
            id="description"
            name="description"
            required
            rows={5}
            placeholder="Décrivez vos travaux : surface, type de matériaux, contraintes particulières, délai souhaité…"
          />

          <Input
            label="Adresse du chantier"
            id="adresse"
            name="adresse"
            type="text"
            required
            placeholder="12 rue de la Paix"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Code postal"
              id="code_postal"
              name="code_postal"
              type="text"
              required
              maxLength={5}
              pattern="\d{5}"
              placeholder="85000"
            />
            <Input
              label="Ville"
              id="ville"
              name="ville"
              type="text"
              required
              placeholder="La Roche-sur-Yon"
            />
          </div>

          <div className="flex gap-2.5 rounded-ac-sm border border-ac-primary-border bg-ac-primary-light px-4 py-3 text-[13px] text-ac-primary-text">
            <span>🔒</span>
            <span>
              Vos coordonnées ne seront transmises qu&apos;après acceptation d&apos;un artisan.
            </span>
          </div>

          {error && (
            <div className="rounded-ac-sm border border-red-200 bg-ac-red-light p-3.5 text-sm text-ac-red">
              {error}
            </div>
          )}

          <Button type="submit" full size="lg" disabled={loading}>
            {loading ? 'Publication…' : 'Publier mon projet →'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
