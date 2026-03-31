'use client'

import { useState } from 'react'
import { updateArtisanProfile } from './actions'
import { deleteUserAccount } from '@/app/(auth)/rgpd-actions'
import type { CategorieMetier } from '@/lib/types/database.types'

type Props = {
  profile: any
  artisan: any
  allCategories: CategorieMetier[]
  initialSelectedCategories: number[]
}

export default function ArtisanProfileForm({ profile, artisan, allCategories, initialSelectedCategories }: Props) {
  const [selectedCategories, setSelectedCategories] = useState<number[]>(initialSelectedCategories)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

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
    setSuccess(false)

    selectedCategories.forEach((id) => {
      formData.append('categorie_ids', String(id))
    })

    // Add the slug if there is one so it can potentially revalidate the public page
    if (artisan.slug) {
        formData.append('slug', artisan.slug)
    }

    const result = await updateArtisanProfile(formData)
    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 overflow-hidden">
      <form action={handleSubmit} className="space-y-6">
        
        {/* Contact infos */}
        <div>
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Mes coordonnées personnelles</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="prenom" className="block text-sm font-medium mb-1">Prénom</label>
              <input
                id="prenom" name="prenom" type="text"
                required defaultValue={profile.prenom || ''}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="nom" className="block text-sm font-medium mb-1">Nom</label>
              <input
                id="nom" name="nom" type="text"
                required defaultValue={profile.nom || ''}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="telephone" className="block text-sm font-medium mb-1">Téléphone</label>
            <input
              id="telephone" name="telephone" type="tel"
              defaultValue={profile.telephone || ''}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500"
            />
          </div>
        </div>

        {/* Company infos */}
        <div>
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Informations de l'entreprise</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="nom_entreprise" className="block text-sm font-medium mb-1">Nom de l'entreprise *</label>
              <input
                id="nom_entreprise" name="nom_entreprise" type="text"
                required defaultValue={artisan.nom_entreprise || ''}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="siret" className="block text-sm font-medium mb-1">SIRET</label>
              <input
                id="siret" name="siret" type="text"
                maxLength={14} pattern="\d{14}"
                defaultValue={artisan.siret || ''}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">Description de votre activité</label>
              <textarea
                id="description" name="description" rows={4}
                defaultValue={artisan.description || ''}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="code_postal_base" className="block text-sm font-medium mb-1">Code postal de base *</label>
                <input
                  id="code_postal_base" name="code_postal_base" type="text"
                  required maxLength={5} pattern="\d{5}"
                  defaultValue={artisan.code_postal_base || ''}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="rayon_km" className="block text-sm font-medium mb-1">Rayon d'action (km)</label>
                <input
                  id="rayon_km" name="rayon_km" type="number"
                  min={1} max={200}
                  defaultValue={artisan.rayon_km || 30}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div>
           <span className="block text-sm font-medium mb-2">
            Corps de métier * (1 minimum)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {allCategories.map((cat) => (
              <label
                key={cat.id}
                className={`flex cursor-pointer items-center rounded-lg border p-3 transition-colors ${
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

        {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
        {success && <p className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">Profil mis à jour avec succès !</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Enregistrement en cours...' : 'Enregistrer toutes les modifications'}
        </button>
      </form>

      {/* Delete Section */}
       <div className="mt-12 pt-6 border-t border-red-100">
        <h3 className="text-red-600 font-semibold mb-2">Zone de danger</h3>
        <p className="text-sm text-gray-500 mb-4">
          La suppression de votre compte est définitive. Votre profil public SEO et tout votre historique de conversation seront supprimés.
        </p>
        
        {!deleteConfirm ? (
          <button 
            type="button" 
            onClick={() => setDeleteConfirm(true)}
            className="text-sm text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors"
          >
            Supprimer mon compte artisan
          </button>
        ) : (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-sm text-red-800 mb-3 font-medium">Êtes-vous absolument sûr de vouloir supprimer votre compte de la plateforme ? Cette action est immédiate et irréversible.</p>
            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={() => deleteUserAccount()}
                className="text-sm bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 font-medium"
              >
                Oui, supprimer définitivement
              </button>
              <button 
                type="button" 
                onClick={() => setDeleteConfirm(false)}
                className="text-sm bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 font-medium"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
