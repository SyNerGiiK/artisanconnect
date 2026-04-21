'use client'

import { useState } from 'react'
import { updateParticulierProfile } from './actions'
import { deleteUserAccount } from '@/app/(auth)/rgpd-actions'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import AlertBanner from '@/components/ui/AlertBanner'

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    if (result?.error) setError(result.error)
    else setSuccess(true)
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-5">
      <form action={handleSubmit} className="flex flex-col gap-5">
        {/* Coordonnées */}
        <Card className="p-6">
          <h2 className="mb-4 text-[15px] font-bold text-ac-text">
            Mes coordonnées
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="prenom"
              name="prenom"
              type="text"
              required
              label="Prénom"
              defaultValue={profile.prenom || ''}
            />
            <Input
              id="nom"
              name="nom"
              type="text"
              required
              label="Nom"
              defaultValue={profile.nom || ''}
            />
          </div>
          <div className="mt-4">
            <Input
              id="telephone"
              name="telephone"
              type="tel"
              label="Téléphone"
              defaultValue={profile.telephone || ''}
            />
          </div>
        </Card>

        {/* Adresse */}
        <Card className="p-6">
          <h2 className="mb-1 text-[15px] font-bold text-ac-text">Mon adresse</h2>
          <p className="mb-4 text-xs text-ac-text-muted">
            Optionnelle — facilitera la création de vos projets.
          </p>
          <div className="mb-4">
            <Input
              id="adresse"
              name="adresse"
              type="text"
              label="Adresse"
              defaultValue={particulier.adresse || ''}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="code_postal"
              name="code_postal"
              type="text"
              maxLength={5}
              pattern="\d{5}"
              label="Code postal"
              defaultValue={particulier.code_postal || ''}
            />
            <Input
              id="ville"
              name="ville"
              type="text"
              label="Ville"
              defaultValue={particulier.ville || ''}
            />
          </div>
        </Card>

        {error && <AlertBanner kind="error" title={error} />}
        {success && (
          <AlertBanner kind="success" title="Profil mis à jour avec succès !" />
        )}

        <Button type="submit" disabled={loading} size="lg" full>
          {loading ? 'Enregistrement…' : 'Enregistrer les modifications'}
        </Button>
      </form>

      {/* Danger zone */}
      <Card className="border-[1.5px] border-red-200 bg-ac-red-light p-6">
        <h3 className="mb-1 text-sm font-bold text-ac-red">Zone de danger</h3>
        <p className="mb-4 text-xs text-ac-text-sub">
          La suppression de votre compte est définitive. Toutes vos données personnelles
          et vos projets seront immédiatement supprimés.
        </p>

        {!deleteConfirm ? (
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => setDeleteConfirm(true)}
          >
            Supprimer mon compte
          </Button>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-ac-red">
              Êtes-vous absolument sûr ? Cette action est irréversible.
            </p>
            <Input
              type="password"
              id="deletePassword"
              label="Confirmez votre mot de passe"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Mot de passe"
              error={deleteError ?? undefined}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="danger"
                size="sm"
                disabled={!deletePassword || loading}
                onClick={async () => {
                  setLoading(true)
                  setDeleteError(null)
                  const res = await deleteUserAccount(deletePassword)
                  if (res?.error) setDeleteError(res.error)
                  setLoading(false)
                }}
              >
                Oui, supprimer définitivement
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setDeleteConfirm(false)
                  setDeletePassword('')
                  setDeleteError(null)
                }}
              >
                Annuler
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
