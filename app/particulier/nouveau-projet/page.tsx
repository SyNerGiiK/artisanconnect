'use client'

import { useState, useEffect, useRef } from 'react'
import { createProject } from './actions'
import { createClient } from '@/lib/supabase/client'
import type { CategorieMetier } from '@/lib/types/database.types'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function NouveauProjetPage() {
  const [categories, setCategories] = useState<CategorieMetier[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  const [optPhotos, setOptPhotos] = useState(false)
  const [hasCredit, setHasCredit] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  
  // Stripe Modal State
  const [showStripeModal, setShowStripeModal] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const [catRes, sessionRes] = await Promise.all([
        supabase.from('categories_metiers').select('*').order('id'),
        supabase.auth.getSession()
      ])
      
      if (catRes.data) setCategories(catRes.data)

      const user = sessionRes.data.session?.user
      if (user) {
        const { data: particulier } = await supabase
          .from('particuliers')
          .select('credits_photos')
          .eq('profil_id', user.id)
          .single()
          
        if (particulier && particulier.credits_photos > 0) {
          setHasCredit(true)
          setOptPhotos(true)
        }
        
        // Handle return from Stripe
        const urlParams = new URLSearchParams(window.location.search)
        if (urlParams.get('pack') === 'success') {
          setHasCredit(true)
          setOptPhotos(true)
          // Hide success parameter from URL cleanly
          window.history.replaceState({}, document.title, window.location.pathname)
        }
      }
    }
    init()
  }, [])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    setSelectedFiles(files)
    setError(null)
  }

  async function openStripeModal() {
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch('/api/stripe/checkout-embedded', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          return_url: `${window.location.origin}${window.location.pathname}?pack=success&session_id={CHECKOUT_SESSION_ID}`
        })
      })
      
      const data = await res.json()
      if (data.clientSecret) {
        setClientSecret(data.clientSecret)
        setShowStripeModal(true)
      } else {
        setError(data.details ? `${data.error} : ${data.details}` : data.error || 'Erreur inconnue')
      }
    } catch(e) {
      setError('Erreur réseau lors de la communication avec le serveur de paiement.')
    }
    
    setLoading(false)
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
    
    // Note: Provide optPhotos so server knows it should deduct credits
    formData.append('opt_photos', optPhotos ? 'on' : 'off')

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
    <>
      <div className="mx-auto max-w-[640px] px-7 py-8 relative">
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
              <label className="text-[13px] font-semibold text-ac-text border-b border-ac-border pb-2 mb-2">
                Photos du projet ({optPhotos ? 'Max 7 - Option activée' : 'Max 2'})
              </label>
              
              {!hasCredit && !optPhotos ? (
                <div className="bg-ac-primary-light p-4 rounded-ac-sm border border-ac-primary-border mb-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-ac-primary-text mb-1">Passer à 7 Photos !</p>
                    <p className="text-xs text-ac-primary-text opacity-90">Idéal pour bien détailler votre projet et obtenir de meilleurs devis : achetez le pack 5 photos supplémentaires (3,99€).</p>
                  </div>
                  <Button type="button" size="sm" onClick={openStripeModal} disabled={loading}>
                    {loading ? '...' : 'Acheter le Pack'}
                  </Button>
                </div>
              ) : null}

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

            <div className="flex gap-2.5 rounded-ac-sm border border-ac-primary-border bg-ac-primary-light px-4 py-3 text-[13px] text-ac-primary-text mt-3">
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

            <Button type="submit" full size="lg" disabled={loading || selectedFiles.length > (optPhotos ? 7 : 2)}>
              {loading ? 'Publication…' : 'Publier mon projet →'}
            </Button>
          </form>
        </Card>
      </div>

      {showStripeModal && clientSecret && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full max-w-[600px] bg-white rounded-xl shadow-2xl relative flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-ac-border p-4">
              <h2 className="text-lg font-bold">Paiement : Pack 5 Photos</h2>
              <button 
                onClick={() => setShowStripeModal(false)}
                className="text-ac-text-muted hover:text-ac-text transition-colors p-1"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto p-4 flex-grow">
              <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
