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
  const [optPhotos, setOptPhotos] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

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

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    setSelectedFiles(files)
    setError(null)
  }

  async function handleSubmit(formData: FormData) {
    const maxPhotos = optPhotos ? 7 : 2;
    if (selectedFiles.length > maxPhotos) {
      setError(`Vous ne pouvez sélectionner que ${maxPhotos} photo(s) au maximum avec vos options actuelles.`)
      return
    }

    setLoading(true)
    setError(null)
    
    // 1. Upload files securely from client-side to bypass Vercel 4.5MB payload limit
    const uploadedUrls: string[] = []
    
    if (selectedFiles.length > 0) {
      const supabase = createClient()
      
      // Verification session user
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError("Erreur : Impossible de vérifier l'authentification. Veuillez vous reconnecter.")
        setLoading(false)
        return
      }
      
      const MAX_FILE_SIZE = 5 * 1024 * 1024
      const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp']
      
      for (const file of selectedFiles) {
        if (!ALLOWED_MIMES.includes(file.type)) {
          setError('Format non supporté (JPEG, PNG, WebP)')
          setLoading(false)
          return
        }
        if (file.size > MAX_FILE_SIZE) {
          setError('Une image est trop lourde (max 5 Mo)')
          setLoading(false)
          return
        }
      }

      // Generate a temporary unique folder ID or use username
      const uploadPrefix = session.user.id; 

      for (const file of selectedFiles) {
        const ext = file.name ? file.name.split('.').pop()?.toLowerCase() || 'jpg' : 'jpg'
        const path = `${uploadPrefix}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('projet-photos')
          .upload(path, file, { contentType: file.type, upsert: false })
        
        if (uploadError) {
          setError(`Erreur lors du transfert d'image: ${uploadError.message}`)
          setLoading(false)
          return
        }
        
        const { data: { publicUrl } } = supabase.storage.from('projet-photos').getPublicUrl(path)
        uploadedUrls.push(publicUrl)
      }
    }
    
    // 2. Strip large files out of the payload!
    formData.delete('photos')
    
    // Append the uploaded URLs as a stringified array
    if (uploadedUrls.length > 0) {
      formData.append('uploadedPhotosUrl', JSON.stringify(uploadedUrls))
    }

    // 3. Send lightweight text-only formData to the Server Action
    const result = await createProject(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else if (result?.success && result?.redirectUrl) {
      window.location.href = result.redirectUrl
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

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-ac-text">
              Photos du projet ({optPhotos ? 'Max 7' : 'Max 2'})
            </label>
            <input
              type="file"
              name="photos"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="text-sm text-ac-text-sub file:mr-4 file:py-2 file:px-4 file:rounded-ac-sm file:border-0 file:text-sm file:font-semibold file:bg-ac-primary-light file:text-ac-primary hover:file:bg-ac-primary-light/80 cursor-pointer"
            />
            {selectedFiles.length > 0 && (
              <p className="text-xs text-ac-text-sub mt-1">
                {selectedFiles.length} fichier(s) sélectionné(s)
              </p>
            )}
            {selectedFiles.length > (optPhotos ? 7 : 2) && (
              <p className="text-xs font-bold text-ac-red mt-1">
                Vous avez dépassé la limite de photos autorisées.
              </p>
            )}
          </div>

          <div className="flex gap-2.5 rounded-ac-sm border border-ac-primary-border bg-ac-primary-light px-4 py-3 text-[13px] text-ac-primary-text">
            <span>🔒</span>
            <span>
              Vos coordonnées ne seront transmises qu&apos;après acceptation d&apos;un artisan.
            </span>
          </div>

          {/* Options Premium */}
          <div className="mt-2 flex flex-col gap-3 rounded-ac-sm border border-ac-border bg-ac-surface p-4">
            <h3 className="text-sm font-bold text-ac-text">Options Premium (Optionnel)</h3>
            
            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" name="opt_boost" className="mt-1 h-4 w-4 rounded border-ac-border text-ac-primary focus:ring-ac-primary" />
              <div>
                <span className="block text-sm font-semibold text-ac-text group-hover:text-ac-primary transition-colors">🚀 Projet Boosté</span>
                <span className="block text-[13px] text-ac-text-sub">Apparaissez en tête de liste chez les artisans (environ 3x plus de réponses)</span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" name="opt_urgence" className="mt-1 h-4 w-4 rounded border-ac-border text-ac-primary focus:ring-ac-primary" />
              <div>
                <span className="block text-sm font-semibold text-ac-text group-hover:text-ac-primary transition-colors">🔥 Marqueur Urgent</span>
                <span className="block text-[13px] text-ac-text-sub">Signalez que vos travaux doivent être pris en charge très rapidement</span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                name="opt_photos" 
                checked={optPhotos}
                onChange={(e) => {
                  setOptPhotos(e.target.checked)
                  setError(null)
                }}
                className="mt-1 h-4 w-4 rounded border-ac-border text-ac-primary focus:ring-ac-primary" 
              />
              <div>
                <span className="block text-sm font-semibold text-ac-text group-hover:text-ac-primary transition-colors">📸 Option Photos Avancée</span>
                <span className="block text-[13px] text-ac-text-sub">Débloquez l&apos;ajout jusqu&apos;à 7 photos au lieu de 2, pour des devis plus précis</span>
              </div>
            </label>
          </div>

          {error && (
            <div className="rounded-ac-sm border border-red-200 bg-ac-red-light p-3.5 text-sm text-ac-red">
              {error}
            </div>
          )}

          <Button type="submit" full size="lg" disabled={loading || selectedFiles.length > (optPhotos ? 7 : 2)}>
            {loading ? 'Publication…' : 'Publier mon projet →'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
