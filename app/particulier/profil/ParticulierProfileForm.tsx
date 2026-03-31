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
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 overflow-hidden">
      <form action={handleSubmit} className="space-y-5">
        
        <h2 className="text-lg font-semibold border-b pb-2">Mes coordonnées personnelles</h2>
        
        <div className="grid grid-cols-2 gap-4">
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

        <h2 className="text-lg font-semibold border-b pb-2 mt-6">Mon adresse (optionnelle)</h2>
        
        <div>
          <label htmlFor="adresse" className="block text-sm font-medium mb-1">Adresse</label>
          <input
            id="adresse" name="adresse" type="text"
            defaultValue={particulier.adresse || ''}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="code_postal" className="block text-sm font-medium mb-1">Code postal</label>
            <input
              id="code_postal" name="code_postal" type="text"
              maxLength={5} pattern="\d{5}"
              defaultValue={particulier.code_postal || ''}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="ville" className="block text-sm font-medium mb-1">Ville</label>
            <input
              id="ville" name="ville" type="text"
              defaultValue={particulier.ville || ''}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
        {success && <p className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">Profil mis à jour avec succès !</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </form>

      <div className="mt-12 pt-6 border-t border-red-100">
        <h3 className="text-red-600 font-semibold mb-2">Zone de danger</h3>
        <p className="text-sm text-gray-500 mb-4">
          La suppression de votre compte est définitive. Toutes vos données personnelles et vos projets seront immédiatement supprimés.
        </p>
        
        {!deleteConfirm ? (
          <button 
            type="button" 
            onClick={() => setDeleteConfirm(true)}
            className="text-sm text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors"
          >
            Supprimer mon compte
          </button>
        ) : (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-sm text-red-800 mb-3 font-medium">Êtes-vous absolument sûr de vouloir supprimer votre compte ? Cette action est irréversible.</p>
            
            <div className="mb-4">
              <label htmlFor="deletePassword" className="block text-sm font-medium text-red-800 mb-1">Confirmez votre mot de passe pour supprimer votre compte</label>
              <input
                type="password"
                id="deletePassword"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full rounded-md border border-red-300 px-3 py-2 text-sm focus:border-red-500"
                placeholder="Mot de passe"
              />
              {deleteError && <p className="mt-1 text-sm text-red-600">{deleteError}</p>}
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
                className="text-sm bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                Oui, supprimer définitivement
              </button>
              <button 
                type="button" 
                onClick={() => { setDeleteConfirm(false); setDeletePassword(''); setDeleteError(null); }}
                className="text-sm bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 disabled:opacity-50"
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
