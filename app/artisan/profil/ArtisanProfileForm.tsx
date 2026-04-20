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
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteError, setDeleteError] = useState<string | null>(null)

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
    <div className="space-y-4">
      <form action={handleSubmit} className="space-y-4">

        {/* Coordonnées personnelles */}
        <div className="rounded-xl bg-gray-50 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Mes coordonnées personnelles</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input
                id="prenom" name="prenom" type="text"
                required defaultValue={profile.prenom || ''}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                id="nom" name="nom" type="text"
                required defaultValue={profile.nom || ''}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input
              id="telephone" name="telephone" type="tel"
              defaultValue={profile.telephone || ''}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Informations entreprise */}
        <div className="rounded-xl bg-gray-50 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Informations de l&apos;entreprise</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="nom_entreprise" className="block text-sm font-medium text-gray-700 mb-1">
                Nom de l&apos;entreprise <span className="text-red-500">*</span>
              </label>
              <input
                id="nom_entreprise" name="nom_entreprise" type="text"
                required defaultValue={artisan.nom_entreprise || ''}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="siret" className="block text-sm font-medium text-gray-700 mb-1">SIRET</label>
              <input
                id="siret" name="siret" type="text"
                maxLength={14} pattern="\d{14}"
                defaultValue={artisan.siret || ''}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description de votre activité</label>
              <textarea
                id="description" name="description" rows={4}
                defaultValue={artisan.description || ''}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="code_postal_base" className="block text-sm font-medium text-gray-700 mb-1">
                  Code postal de base <span className="text-red-500">*</span>
                </label>
                <input
                  id="code_postal_base" name="code_postal_base" type="text"
                  required maxLength={5} pattern="\d{5}"
                  defaultValue={artisan.code_postal_base || ''}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="rayon_km" className="block text-sm font-medium text-gray-700 mb-1">Rayon d&apos;action (km)</label>
                <input
                  id="rayon_km" name="rayon_km" type="number"
                  min={1} max={200}
                  defaultValue={artisan.rayon_km || 30}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Corps de métier */}
        <div className="rounded-xl bg-gray-50 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Corps de métier</h2>
          <p className="text-xs text-gray-500 mb-4">Sélectionnez au moins un domaine d&apos;intervention.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {allCategories.map((cat) => (
              <label
                key={cat.id}
                className={`flex cursor-pointer items-center rounded-lg border p-3 transition-colors ${
                  selectedCategories.includes(cat.id)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white hover:border-gray-300'
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

        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-lg">{error}</p>}
        {success && <p className="text-sm text-green-700 bg-green-50 border border-green-100 p-3 rounded-lg">Profil mis à jour avec succès !</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Enregistrement en cours...' : 'Enregistrer toutes les modifications'}
        </button>
      </form>

      {/* Danger zone */}
      <div className="rounded-xl border border-red-100 bg-red-50/40 p-5 mt-2">
        <h3 className="text-sm font-semibold text-red-700 mb-1">Zone de danger</h3>
        <p className="text-xs text-gray-500 mb-4">
          La suppression de votre compte est définitive. Votre profil public SEO et tout votre historique de conversation seront supprimés.
        </p>

        {!deleteConfirm ? (
          <button
            type="button"
            onClick={() => setDeleteConfirm(true)}
            className="text-sm text-red-600 border border-red-200 bg-white hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
          >
            Supprimer mon compte artisan
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-red-800 font-medium">Êtes-vous absolument sûr ? Cette action est immédiate et irréversible.</p>
            <div>
              <label htmlFor="deletePassword" className="block text-sm font-medium text-red-800 mb-1">Confirmez votre mot de passe</label>
              <input
                type="password"
                id="deletePassword"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
                placeholder="Mot de passe"
              />
              {deleteError && <p className="mt-1 text-xs text-red-600">{deleteError}</p>}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                disabled={!deletePassword || loading}
                onClick={async () => {
                  setLoading(true)
                  setDeleteError(null)
                  const res = await deleteUserAccount(deletePassword)
                  if (res?.error) setDeleteError(res.error)
                  setLoading(false)
                }}
                className="text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
              >
                Oui, supprimer définitivement
              </button>
              <button
                type="button"
                onClick={() => { setDeleteConfirm(false); setDeletePassword(''); setDeleteError(null) }}
                className="text-sm bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
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
