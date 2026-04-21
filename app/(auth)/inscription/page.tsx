'use client'

import { useState } from 'react'
import { signUp } from '../actions'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function InscriptionPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [role, setRole] = useState<'particulier' | 'artisan' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [password, setPassword] = useState('')

  const passwordRequirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  }
  const isPasswordValid = Object.values(passwordRequirements).every(Boolean)

  async function handleSubmit(formData: FormData) {
    if (!role) return
    setLoading(true)
    setError(null)
    formData.set('role', role)
    const result = await signUp(formData)
    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setIsSuccess(true)
    }
    setLoading(false)
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-[440px]">
        <Card padded className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-ac-green-light text-3xl text-ac-green">
            ✓
          </div>
          <h2 className="mb-2 text-xl font-bold text-ac-text">Vérifiez votre boîte mail</h2>
          <p className="mb-6 text-sm text-ac-text-sub">
            Nous vous avons envoyé un lien de confirmation. Cliquez dessus pour activer votre compte.
          </p>
          <Button href="/connexion" variant="green">
            Aller à la connexion
          </Button>
        </Card>
      </div>
    )
  }

  if (step === 1) {
    return (
      <div className="w-full max-w-[480px]">
        <div className="text-center mb-8">
          <div className="text-[22px] font-extrabold text-ac-primary mb-2 tracking-tight">
            ArtisanConnect
          </div>
          <h1 className="text-2xl font-bold text-ac-text mb-1.5">
            Créer un compte
          </h1>
          <p className="text-sm text-ac-text-sub">Vous êtes…</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {(
            [
              {
                value: 'particulier' as const,
                emoji: '🏠',
                title: 'Particulier',
                desc: 'Je cherche des artisans pour mes travaux',
              },
              {
                value: 'artisan' as const,
                emoji: '🔨',
                title: 'Artisan',
                desc: 'Je propose mes services aux particuliers',
              },
            ]
          ).map((opt) => {
            const active = role === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setRole(opt.value)}
                className={`rounded-ac border-2 p-6 text-center transition-all ${
                  active
                    ? 'border-ac-primary bg-ac-primary-light shadow-[0_0_0_3px_var(--ac-primary-light)]'
                    : 'border-ac-border bg-ac-surface hover:border-ac-primary-border hover:bg-ac-primary-light/50'
                }`}
              >
                <div className="text-4xl mb-2.5">{opt.emoji}</div>
                <div className="font-bold text-[15px] text-ac-text mb-1">{opt.title}</div>
                <div className="text-xs text-ac-text-sub leading-snug">{opt.desc}</div>
              </button>
            )
          })}
        </div>

        <Button
          full
          size="lg"
          onClick={() => role && setStep(2)}
          disabled={!role}
        >
          Continuer →
        </Button>

        <p className="text-center text-[13px] text-ac-text-sub mt-4">
          Déjà inscrit&nbsp;?{' '}
          <Link href="/connexion" className="font-semibold text-ac-primary-text hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[440px]">
      <div className="text-center mb-8">
        <div className="text-[22px] font-extrabold text-ac-primary mb-2 tracking-tight">
          ArtisanConnect
        </div>
        <h1 className="text-[22px] font-bold text-ac-text mb-1">
          Vos informations
        </h1>
        <p className="text-[13px] text-ac-text-sub">
          Étape 2 / 3 — Compte {role}
        </p>
      </div>

      <Card padded>
        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Prénom"
              id="prenom"
              name="prenom"
              type="text"
              required
              placeholder="Sophie"
            />
            <Input
              label="Nom"
              id="nom"
              name="nom"
              type="text"
              required
              placeholder="Martin"
            />
          </div>

          <Input
            label="Email"
            id="email"
            name="email"
            type="email"
            required
            placeholder="vous@exemple.fr"
          />

          <div>
            <Input
              label="Mot de passe"
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8 caractères minimum"
            />
            <div className="mt-2.5 grid grid-cols-3 gap-2">
              {[
                { ok: passwordRequirements.minLength, label: '8 caractères' },
                { ok: passwordRequirements.hasUppercase, label: '1 majuscule' },
                { ok: passwordRequirements.hasNumber, label: '1 chiffre' },
              ].map((r) => (
                <div
                  key={r.label}
                  className={`rounded-ac-sm border p-2 text-center text-[11px] font-medium transition-colors ${
                    r.ok
                      ? 'border-ac-green-border bg-ac-green-light text-ac-green'
                      : 'border-ac-border bg-ac-surface-hover text-ac-text-muted'
                  }`}
                >
                  {r.ok ? '✓ ' : ''}{r.label}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="rounded-ac-sm border border-red-200 bg-ac-red-light p-3.5 text-sm text-ac-red">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setStep(1)}
              disabled={loading}
            >
              ←
            </Button>
            <Button
              type="submit"
              full
              size="lg"
              disabled={loading || !isPasswordValid}
            >
              {loading ? 'Création du compte…' : 'Créer mon compte →'}
            </Button>
          </div>
        </form>

        <p className="mt-4 text-center text-[11px] text-ac-text-muted leading-relaxed">
          En créant un compte, vous acceptez nos{' '}
          <Link href="/cgu" className="text-ac-primary-text hover:underline">
            CGU
          </Link>{' '}
          et notre{' '}
          <Link href="/mentions-legales" className="text-ac-primary-text hover:underline">
            politique de confidentialité
          </Link>
          .
        </p>
      </Card>
    </div>
  )
}
