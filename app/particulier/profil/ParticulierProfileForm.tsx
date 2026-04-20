'use client'

import { useState } from 'react'
import { updateParticulierProfile } from './actions'
import { deleteUserAccount } from '@/app/(auth)/rgpd-actions'

type Props = {
  profile: any
  particulier: any
}

export default function ParticulierProfileForm({ profile, particulier }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteError, setDeleteError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(false)

    const result = await updateParticulierProfile(formData)
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

        {/* Coordonnées */}
        <div className="rounded-xl bg-gray-50 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Mes coordonnées</h2>
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

        {/* Adresse */}
        <div className="rounded-xl bg-gray-50 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Mon adresse</h2>
          <p className="text-xs text-gray-500 mb-4">Optionnelle — facilitera la création de vos projets.</p>
          <div className="mb-4">
            <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <input
              id="adresse" name="adresse" type="text"
              defaultValue={particulier.adresse || ''}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="code_postal" className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
              <input
                id="code_postal" name="code_postal" type="text"
                maxLength={5} pattern="\d{5}"
                defaultValue={particulier.code_postal || ''}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="ville" className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
              <input
                id="ville" name="ville" type="text"
                defaultValue={particulier.ville || ''}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-lg">{error}</p>}
        {success && <p className="text-sm text-green-700 bg-green-50 border border-green-100 p-3 rounded-lg">Profil mis à jour avec succès !</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </form>

      {/* Danger zone */}
      <div className="rounded-xl border border-red-100 bg-red-50/40 p-5 mt-2">
        <h3 className="text-sm font-semibold text-red-700 mb-1">Zone de danger</h3>
        <p className="text-xs text-gray-500 mb-4">
          La suppression de votre compte est définitive. Toutes vos données personnelles et vos projets seront immédiatement supprimés.
        </p>

        {!deleteConfirm ? (
          <button
            type="button"
            onClick={() => setDeleteConfirm(true)}
            className="text-sm text-red-600 border border-red-200 bg-white hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
          >
            Supprimer mon compte
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-red-800 font-medium">Êtes-vous absolument sûr ? Cette action est irréversible.</p>
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
                className="text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium"
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
