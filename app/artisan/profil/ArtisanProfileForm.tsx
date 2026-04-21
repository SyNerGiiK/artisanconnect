'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { updateArtisanProfile } from './actions'
import { deleteUserAccount } from '@/app/(auth)/rgpd-actions'
import type { CategorieMetier } from '@/lib/types/database.types'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import AlertBanner from '@/components/ui/AlertBanner'

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  artisan: any
  allCategories: CategorieMetier[]
  initialSelectedCategories: number[]
}

export default function ArtisanProfileForm({
  profile,
  artisan,
  allCategories,
  initialSelectedCategories,
}: Props) {
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    initialSelectedCategories
  )
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

    selectedCategories.forEach((id) => formData.append('categorie_ids', String(id)))
    if (artisan.slug) formData.append('slug', artisan.slug)

    // CLIENT-SIDE UPLOAD to bypass Vercel 4.5MB limit
    const uploadedUrls: string[] = []
    const filesRaw = formData.getAll('photos_realisations_files') as File[]
    const validFiles = filesRaw.filter(f => f && typeof f === 'object' && f.size > 0)

    if (validFiles.length > 0) {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setError("Erreur : Impossible de vérifier l'authentification.")
        setLoading(false)
        return
      }

      const MAX_FILE_SIZE = 5 * 1024 * 1024
      const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp']

      for (const file of validFiles) {
        if (!ALLOWED_MIMES.includes(file.type)) {
          setError('Un fichier a un format non supporté (JPEG, PNG, WebP)')
          setLoading(false)
          return
        }
        if (file.size > MAX_FILE_SIZE) {
          setError('Une image est trop lourde (max 5 Mo)')
          setLoading(false)
          return
        }
      }

      const uploadPrefix = artisan.id || session.user.id
      for (const file of validFiles) {
        const ext = file.name ? file.name.split('.').pop()?.toLowerCase() || 'jpg' : 'jpg'
        const path = `${uploadPrefix}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('artisan-photos')
          .upload(path, file, { contentType: file.type, upsert: false })
        
        if (uploadError) {
          setError(`Erreur lors du transfert: ${uploadError.message}`)
          setLoading(false)
          return
        }
        
        const { data: { publicUrl } } = supabase.storage.from('artisan-photos').getPublicUrl(path)
        uploadedUrls.push(publicUrl)
      }
    }

    formData.delete('photos_realisations_files')
    if (uploadedUrls.length > 0) {
      formData.append('uploadedPhotosUrl', JSON.stringify(uploadedUrls))
    }

    const result = await updateArtisanProfile(formData)
    if (result?.error) setError(result.error)
    else setSuccess(true)
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-5">
      <form action={handleSubmit} className="flex flex-col gap-5">
        {/* Coordonnées personnelles */}
        <Card className="p-6">
          <h2 className="mb-4 text-[15px] font-bold text-ac-text">
            Mes coordonnées personnelles
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

        {/* Informations entreprise */}
        <Card className="p-6">
          <h2 className="mb-4 text-[15px] font-bold text-ac-text">
            Informations de l&apos;entreprise
          </h2>
          <div className="flex flex-col gap-4">
            <Input
              id="nom_entreprise"
              name="nom_entreprise"
              type="text"
              required
              label="Nom de l'entreprise"
              defaultValue={artisan.nom_entreprise || ''}
            />
            <Input
              id="siret"
              name="siret"
              type="text"
              maxLength={14}
              pattern="\d{14}"
              label="SIRET"
              hint="14 chiffres sans espaces"
              defaultValue={artisan.siret || ''}
            />
            <Textarea
              id="description"
              name="description"
              rows={4}
              label="Description de votre activité"
              defaultValue={artisan.description || ''}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-ac-text">
                Ajouter des photos de réalisations
              </label>
              <input
                type="file"
                name="photos_realisations_files"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="text-sm text-ac-text-sub file:mr-4 file:py-2 file:px-4 file:rounded-ac-sm file:border-0 file:text-sm file:font-semibold file:bg-ac-primary-light file:text-ac-primary hover:file:bg-ac-primary-light/80 cursor-pointer"
              />
              {artisan.photos_realisations && artisan.photos_realisations.length > 0 && (
                <p className="text-xs text-ac-text-sub">
                  Vous avez déjà {artisan.photos_realisations.length} photo(s) en ligne. Les nouveaux fichiers y seront ajoutés.
                </p>
              )}
            </div>
            <label className="flex cursor-pointer items-center gap-3 mt-2 rounded-ac-sm border border-ac-primary-border bg-ac-primary-light p-3">
              <input
                type="checkbox"
                name="assurance_pro"
                defaultChecked={artisan.assurance_pro}
                className="h-4 w-4 rounded border-ac-border text-ac-primary focus:ring-ac-primary"
              />
              <span className="text-sm font-semibold text-ac-primary-text">
                Je certifie posséder une Assurance Décennale / Professionnelle valide
              </span>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                id="code_postal_base"
                name="code_postal_base"
                type="text"
                required
                maxLength={5}
                pattern="\d{5}"
                label="Code postal de base"
                defaultValue={artisan.code_postal_base || ''}
              />
              <Input
                id="rayon_km"
                name="rayon_km"
                type="number"
                min={1}
                max={200}
                label="Rayon d'action (km)"
                defaultValue={artisan.rayon_km || 30}
              />
            </div>
          </div>
        </Card>

        {/* Corps de métier */}
        <Card className="p-6">
          <h2 className="mb-1 text-[15px] font-bold text-ac-text">
            Corps de métier
          </h2>
          <p className="mb-4 text-xs text-ac-text-muted">
            Sélectionnez au moins un domaine d&apos;intervention.
          </p>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {allCategories.map((cat) => {
              const active = selectedCategories.includes(cat.id)
              return (
                <label
                  key={cat.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-ac-sm border-[1.5px] p-3 transition-all ${
                    active
                      ? 'border-ac-primary bg-ac-primary-light text-ac-primary-text'
                      : 'border-ac-border bg-ac-surface text-ac-text hover:border-ac-primary-border hover:bg-ac-surface-hover'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleCategory(cat.id)}
                    className="h-4 w-4 rounded border-ac-border text-ac-primary focus:ring-ac-primary"
                  />
                  <span className="text-sm font-semibold">{cat.libelle}</span>
                </label>
              )
            })}
          </div>
        </Card>

        {error && <AlertBanner kind="error" title={error} />}
        {success && (
          <AlertBanner kind="success" title="Profil mis à jour avec succès !" />
        )}

        <Button type="submit" disabled={loading} size="lg" full>
          {loading ? 'Enregistrement…' : 'Enregistrer toutes les modifications'}
        </Button>
      </form>

      {/* Danger zone */}
      <Card className="border-[1.5px] border-red-200 bg-ac-red-light p-6">
        <h3 className="mb-1 text-sm font-bold text-ac-red">Zone de danger</h3>
        <p className="mb-4 text-xs text-ac-text-sub">
          La suppression de votre compte est définitive. Votre profil public SEO
          et tout votre historique de conversation seront supprimés.
        </p>

        {!deleteConfirm ? (
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => setDeleteConfirm(true)}
          >
            Supprimer mon compte artisan
          </Button>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-ac-red">
              Êtes-vous absolument sûr ? Cette action est immédiate et irréversible.
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
