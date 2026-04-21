'use client'

import { useState, Suspense } from 'react'
import { signIn } from '../actions'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Divider from '@/components/ui/Divider'

function ConnexionForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const authError = searchParams.get('error')

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await signIn(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[420px]">
      <div className="text-center mb-8">
        <div className="text-[22px] font-extrabold text-ac-primary mb-2 tracking-tight">
          ArtisanConnect
        </div>
        <h1 className="text-2xl font-bold text-ac-text mb-1.5">
          Connexion
        </h1>
        <p className="text-sm text-ac-text-sub">
          Bon retour parmi nous&nbsp;!
        </p>
      </div>

      <Card padded>
        {authError === 'auth' && (
          <div className="mb-5 rounded-ac-sm border border-red-200 bg-ac-red-light p-3.5 text-sm text-ac-red">
            Erreur de vérification du compte. Veuillez réessayer.
          </div>
        )}

        <form action={handleSubmit} className="flex flex-col gap-4.5">
          <Input
            label="Adresse email"
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
              placeholder="••••••••"
            />
            <div className="mt-2 text-right">
              <Link
                href="/mot-de-passe-oublie"
                className="text-[13px] font-semibold text-ac-primary-text hover:underline"
              >
                Mot de passe oublié&nbsp;?
              </Link>
            </div>
          </div>

          {error && (
            <div className="rounded-ac-sm border border-red-200 bg-ac-red-light p-3.5 text-sm text-ac-red">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} full size="lg">
            {loading ? 'Connexion en cours…' : 'Se connecter'}
          </Button>
        </form>

        <Divider />

        <p className="text-center text-[13px] text-ac-text-sub">
          Pas encore de compte&nbsp;?{' '}
          <Link href="/inscription" className="font-semibold text-ac-primary-text hover:underline">
            Créer un compte gratuitement
          </Link>
        </p>
      </Card>

      <div className="mt-6 flex items-center justify-center gap-5 text-xs text-ac-text-muted">
        <div className="flex items-center gap-1.5">
          <span className="text-ac-green">✓</span> Connexion sécurisée
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-ac-primary">🔒</span> Données protégées
        </div>
      </div>
    </div>
  )
}

export default function ConnexionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-ac-primary border-t-transparent" />
        </div>
      }
    >
      <ConnexionForm />
    </Suspense>
  )
}
