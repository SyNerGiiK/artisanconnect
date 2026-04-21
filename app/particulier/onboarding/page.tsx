'use client'

import { useState } from 'react'
import { completeParticulierOnboarding } from './actions'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

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

export default function ParticulierOnboardingPage() {
  const [step, setStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    adresse: '',
    code_postal: '',
    ville: '',
  })

  function updateField(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleFinalSubmit() {
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.set('adresse', form.adresse)
    formData.set('code_postal', form.code_postal)
    formData.set('ville', form.ville)

    const result = await completeParticulierOnboarding(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  const totalSteps = 2
  const isLast = step === totalSteps - 1

  function canAdvance() {
    if (step === 0) {
      return form.ville.trim().length > 1 && /^\d{5}$/.test(form.code_postal)
    }
    return true
  }

  return (
    <div className="min-h-screen bg-ac-bg px-6 py-12 flex items-center justify-center">
      <div className="w-full max-w-[480px]">
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
                Votre localisation
              </h2>
              <p className="text-sm text-ac-text-sub mb-7">
                Pour que les artisans de votre zone voient vos projets.
              </p>
              <div className="flex flex-col gap-4">
                <Input
                  label="Adresse (facultatif)"
                  placeholder="12 rue de la Paix"
                  value={form.adresse}
                  onChange={(e) => updateField('adresse', e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Code postal"
                    required
                    placeholder="85000"
                    maxLength={5}
                    pattern="\d{5}"
                    value={form.code_postal}
                    onChange={(e) => updateField('code_postal', e.target.value)}
                  />
                  <Input
                    label="Ville"
                    required
                    placeholder="La Roche-sur-Yon"
                    value={form.ville}
                    onChange={(e) => updateField('ville', e.target.value)}
                  />
                </div>
                <div className="flex gap-2.5 rounded-ac-sm border border-ac-green-border bg-ac-green-light px-4 py-3">
                  <span>🔒</span>
                  <p className="text-[13px] text-ac-text-sub leading-relaxed m-0">
                    Vos coordonnées ne seront jamais partagées avec les artisans avant que vous l&apos;acceptiez.
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-[22px] font-bold text-ac-text mb-1.5">
                Tout est prêt&nbsp;! 🎉
              </h2>
              <p className="text-sm text-ac-text-sub mb-6">
                Votre compte est créé. Vous pouvez maintenant déposer votre premier projet.
              </p>
              <div className="rounded-ac border border-ac-green-border bg-ac-green-light p-6 text-center mb-5">
                <div className="text-5xl mb-3">🏠</div>
                <div className="font-bold text-base text-ac-text mb-1.5">
                  Service 100% gratuit
                </div>
                <div className="text-sm text-ac-text-sub">
                  Vous recevrez jusqu&apos;à 3 devis d&apos;artisans vérifiés dans votre zone.
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                {[
                  'Décrivez votre projet en quelques lignes',
                  'Recevez les propositions sous 24h',
                  "Choisissez l'artisan qui vous convient",
                ].map((s, i) => (
                  <div key={s} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-ac-primary-light text-xs font-bold text-ac-primary">
                      {i + 1}
                    </div>
                    <span className="text-sm text-ac-text-sub">{s}</span>
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
                  : 'Déposer mon premier projet →'
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
