'use client'

import { useState, useEffect } from 'react'
import { completeArtisanOnboarding } from './actions'
import { createClient } from '@/lib/supabase/client'
import type { CategorieMetier } from '@/lib/types/database.types'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-8 flex justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 w-12 rounded-full transition-all ${
            i < current
              ? 'bg-ac-primary'
              : i === current
                ? 'bg-ac-primary-border'
                : 'bg-ac-border'
          }`}
        />
      ))}
    </div>
  )
}

export default function ArtisanOnboardingPage() {
  const [categories, setCategories] = useState<CategorieMetier[]>([])
  const [step, setStep] = useState(0)
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nom_entreprise: '',
    siret: '',
    description: '',
    code_postal_base: '',
    rayon_km: '30',
  })

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

  function toggleCategory(id: number) {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  function updateField(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleFinalSubmit() {
    if (selectedCategories.length === 0) {
      setError('Veuillez sélectionner au moins un corps de métier.')
      setStep(2)
      return
    }
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.set('nom_entreprise', form.nom_entreprise)
    formData.set('siret', form.siret)
    formData.set('description', form.description)
    formData.set('code_postal_base', form.code_postal_base)
    formData.set('rayon_km', form.rayon_km)
    selectedCategories.forEach((id) => formData.append('categorie_ids', String(id)))

    const result = await completeArtisanOnboarding(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  const totalSteps = 4
  const isLast = step === totalSteps - 1

  function canAdvance() {
    if (step === 0) return form.nom_entreprise.trim().length > 1
    if (step === 1) return /^\d{5}$/.test(form.code_postal_base)
    if (step === 2) return selectedCategories.length > 0
    return true
  }

  return (
    <div className="min-h-screen bg-ac-bg px-6 py-12">
      <div className="mx-auto w-full max-w-[520px]">
        <div className="text-center mb-5">
          <div className="text-lg font-extrabold text-ac-primary tracking-tight">
            ArtisanConnect
          </div>
        </div>

        <StepIndicator current={step} total={totalSteps} />

        <Card className="p-8 sm:p-9">
          {step === 0 && (
            <div>
              <h2 className="text-[22px] font-bold text-ac-text mb-1.5">
                Votre profil professionnel
              </h2>
              <p className="text-sm text-ac-text-sub mb-7">
                Ces informations seront affichées sur votre profil public.
              </p>
              <div className="flex flex-col gap-4">
                <Input
                  label="Nom de l'entreprise"
                  required
                  placeholder="Mon Entreprise SARL"
                  value={form.nom_entreprise}
                  onChange={(e) => updateField('nom_entreprise', e.target.value)}
                />
                <Input
                  label="Numéro SIRET"
                  placeholder="14 chiffres"
                  maxLength={14}
                  pattern="\d{14}"
                  value={form.siret}
                  onChange={(e) => updateField('siret', e.target.value)}
                />
                <Textarea
                  label="Présentation (facultatif)"
                  placeholder="Décrivez vos services, votre expérience, vos spécialités…"
                  rows={3}
                  value={form.description}
                  onChange={(e) => updateField('description', e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-[22px] font-bold text-ac-text mb-1.5">
                Votre zone d&apos;intervention
              </h2>
              <p className="text-sm text-ac-text-sub mb-7">
                Les chantiers affichés seront filtrés par votre zone.
              </p>
              <div className="flex flex-col gap-4">
                <Input
                  label="Code postal de base"
                  required
                  placeholder="85000"
                  maxLength={5}
                  pattern="\d{5}"
                  value={form.code_postal_base}
                  onChange={(e) => updateField('code_postal_base', e.target.value)}
                />
                <Input
                  label="Rayon d'intervention (km)"
                  type="number"
                  min={1}
                  max={200}
                  value={form.rayon_km}
                  onChange={(e) => updateField('rayon_km', e.target.value)}
                />
                <div className="flex gap-2.5 rounded-ac-sm border border-ac-primary-border bg-ac-primary-light px-4 py-3">
                  <span className="text-ac-primary">ℹ️</span>
                  <p className="text-[13px] text-ac-primary-text leading-relaxed">
                    Pour le lancement, ArtisanConnect couvre principalement la Vendée (85). D&apos;autres départements seront ajoutés prochainement.
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-[22px] font-bold text-ac-text mb-1.5">
                Vos catégories de travaux
              </h2>
              <p className="text-sm text-ac-text-sub mb-7">
                Sélectionnez les types de chantiers sur lesquels vous intervenez.
              </p>
              <div className="flex flex-wrap gap-2.5">
                {categories.map((cat) => {
                  const sel = selectedCategories.includes(cat.id)
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`rounded-full border-2 px-4 py-2 text-sm transition-all ${
                        sel
                          ? 'border-ac-primary bg-ac-primary-light text-ac-primary-text font-bold'
                          : 'border-ac-border bg-ac-surface text-ac-text font-medium hover:border-ac-primary-border'
                      }`}
                    >
                      {cat.libelle}
                    </button>
                  )
                })}
              </div>
              {selectedCategories.length === 0 && (
                <p className="mt-4 text-[13px] text-ac-amber">
                  ⚠️ Sélectionnez au moins une catégorie
                </p>
              )}
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-[22px] font-bold text-ac-text mb-1.5">
                Tout est prêt ! 🎉
              </h2>
              <p className="text-sm text-ac-text-sub mb-6">
                Votre profil est complet. Vous pouvez maintenant accéder aux chantiers disponibles dans votre zone.
              </p>
              <div className="rounded-ac border border-ac-primary-border bg-ac-primary-light p-6 text-center mb-5">
                <div className="text-5xl mb-3">🔨</div>
                <div className="font-bold text-base text-ac-text mb-1.5">
                  Accédez aux chantiers
                </div>
                <div className="text-sm text-ac-text-sub">
                  Répondez sans commission, avec un abonnement fixe.
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                {[
                  'Consultez les nouveaux chantiers de votre zone',
                  'Proposez vos devis en quelques clics',
                  'Discutez avec les particuliers via la messagerie',
                ].map((line, i) => (
                  <div key={line} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-ac-primary-light text-xs font-bold text-ac-primary">
                      {i + 1}
                    </div>
                    <span className="text-sm text-ac-text-sub">{line}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-ac-sm border border-red-200 bg-ac-red-light p-3.5 text-sm text-ac-red">
              {error}
            </div>
          )}

          <div className="mt-7 flex justify-end gap-2.5">
            {step > 0 && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep((s) => s - 1)}
                disabled={loading}
              >
                ← Retour
              </Button>
            )}
            <Button
              type="button"
              onClick={() => {
                if (isLast) {
                  handleFinalSubmit()
                } else if (canAdvance()) {
                  setStep((s) => s + 1)
                }
              }}
              disabled={loading || !canAdvance()}
            >
              {isLast
                ? loading
                  ? 'Enregistrement…'
                  : 'Accéder au feed →'
                : 'Continuer →'}
            </Button>
          </div>
        </Card>

        <p className="mt-4 text-center text-xs text-ac-text-muted">
          Étape {step + 1} sur {totalSteps}
        </p>
      </div>
    </div>
  )
}
