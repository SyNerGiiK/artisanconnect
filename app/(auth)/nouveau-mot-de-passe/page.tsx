'use client'

import { useActionState } from 'react'
import { updatePassword } from './actions'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import AlertBanner from '@/components/ui/AlertBanner'

export default function NouveauMotDePassePage() {
  const [state, formAction] = useActionState(updatePassword, null)

  return (
    <>
      <div className="mb-7 text-center">
        <h1 className="text-[28px] font-extrabold tracking-tight text-ac-text">
          Nouveau mot de passe
        </h1>
        <p className="mt-2 text-sm text-ac-text-sub">
          Veuillez saisir votre nouveau mot de passe ci-dessous.
        </p>
      </div>

      <Card className="p-7 sm:p-8">
        <form action={formAction} className="flex flex-col gap-5">
          {state?.error && <AlertBanner kind="error" title={state.error} />}

          <Input
            id="password"
            name="password"
            type="password"
            required
            label="Nouveau mot de passe"
            placeholder="Minimum 8 caractères"
          />

          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            label="Confirmer le mot de passe"
            placeholder="Confirmez votre mot de passe"
          />

          <Button type="submit" size="lg" full>
            Mettre à jour mon mot de passe
          </Button>
        </form>
      </Card>
    </>
  )
}
