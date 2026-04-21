'use client'

import { useActionState } from 'react'
import { sendResetPasswordEmail } from './actions'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import AlertBanner from '@/components/ui/AlertBanner'

export default function MotDePasseOubliePage() {
  const [state, formAction] = useActionState(sendResetPasswordEmail, null)

  return (
    <>
      <div className="mb-7 text-center">
        <h1 className="text-[28px] font-extrabold tracking-tight text-ac-text">
          Mot de passe oublié
        </h1>
        <p className="mt-2 text-sm text-ac-text-sub">
          Entrez votre email pour recevoir un lien de réinitialisation.
        </p>
      </div>

      <Card className="p-7 sm:p-8">
        {state?.success ? (
          <AlertBanner
            kind="success"
            title="Email envoyé"
            desc="Un lien de réinitialisation vous a été envoyé. Pensez à vérifier vos courriers indésirables."
          />
        ) : (
          <form action={formAction} className="flex flex-col gap-5">
            {state?.error && <AlertBanner kind="error" title={state.error} />}

            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              label="Adresse email"
              placeholder="votre@email.com"
            />

            <Button type="submit" disabled={state?.success} size="lg" full>
              Recevoir mon lien
            </Button>
          </form>
        )}

        <div className="mt-7 border-t border-ac-border pt-5 text-center text-sm text-ac-text-sub">
          <Link
            href="/connexion"
            className="font-semibold text-ac-primary-text transition-colors hover:text-ac-primary-dark"
          >
            ← Retour à la connexion
          </Link>
        </div>
      </Card>
    </>
  )
}
