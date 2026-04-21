import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CheckoutButton from '@/components/stripe/CheckoutButton'

export default async function AbonnementPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const { data: artisan } = await supabase
    .from('artisans')
    .select('abonnement_actif')
    .eq('profil_id', user.id)
    .single<{ abonnement_actif: boolean }>()

  if (!artisan) redirect('/artisan/onboarding')
  if (artisan.abonnement_actif) redirect('/artisan/feed')

  const priceMensuel = process.env.STRIPE_PRICE_ID_MENSUEL!
  const priceAnnuel = process.env.STRIPE_PRICE_ID_ANNUEL!
  const priceFondateurs = process.env.STRIPE_PRICE_ID_FONDATEURS!

  const tick = (
    <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  )

  return (
    <div className="mx-auto max-w-[1100px] px-7 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-ac-text sm:text-[34px]">
          Choisissez votre abonnement
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-ac-text-sub">
          Accédez à tous les chantiers dans votre zone, sans commission, avec un tarif fixe.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {/* Mensuel */}
        <div className="flex flex-col rounded-ac-lg border border-ac-border bg-ac-surface p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h3 className="text-[15px] font-bold text-ac-text">Mensuel</h3>
          <p className="mt-1 text-xs text-ac-text-muted">Sans engagement</p>
          <div className="mt-5">
            <span className="text-4xl font-black text-ac-text">50€</span>
            <span className="text-sm text-ac-text-sub"> / mois</span>
          </div>
          <ul className="mt-6 flex flex-1 flex-col gap-2.5 text-sm text-ac-text-sub">
            {[
              'Accès illimité aux chantiers',
              'Profil public SEO',
              'Messagerie directe',
              'Zéro commission',
            ].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="text-ac-primary">{tick}</span>
                {f}
              </li>
            ))}
          </ul>
          <CheckoutButton priceId={priceMensuel} label="Commencer (50€/mois)" variant="secondary" />
        </div>

        {/* Annuel — populaire */}
        <div className="relative flex flex-col rounded-ac-lg bg-ac-primary p-7 text-white shadow-[0_12px_32px_rgba(59,130,246,0.28)] ring-2 ring-ac-primary">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ac-amber px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
            ⭐ Le + populaire
          </div>
          <h3 className="text-[15px] font-bold">Annuel</h3>
          <p className="mt-1 text-xs text-white/75">Économisez 120€/an</p>
          <div className="mt-5">
            <span className="text-4xl font-black">40€</span>
            <span className="text-sm text-white/80"> / mois</span>
          </div>
          <p className="mt-1 text-xs text-white/70">facturé 480€/an</p>
          <ul className="mt-6 flex flex-1 flex-col gap-2.5 text-sm text-white/90">
            {[
              'Tout du mensuel inclus',
              '2 mois offerts',
              'Priorité commerciale',
              'Support prioritaire',
            ].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="text-white/90">{tick}</span>
                {f}
              </li>
            ))}
          </ul>
          <CheckoutButton
            priceId={priceAnnuel}
            label="Choisir l'annuel (480€/an)"
            variant="light"
          />
        </div>

        {/* Fondateurs */}
        <div className="flex flex-col rounded-ac-lg border-[1.5px] border-ac-amber-border bg-ac-amber-light/40 p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h3 className="text-[15px] font-bold text-ac-text">Offre Fondateurs</h3>
          <p className="mt-1 text-xs font-bold text-ac-amber">50 places seulement</p>
          <div className="mt-5">
            <span className="text-4xl font-black text-ac-text">25€</span>
            <span className="text-sm text-ac-text-sub"> / mois</span>
          </div>
          <p className="mt-1 text-xs text-ac-text-muted">
            facturé 300€/an <strong>à vie</strong>
          </p>
          <ul className="mt-6 flex flex-1 flex-col gap-2.5 text-sm text-ac-text-sub">
            {[
              'Tarif préférentiel à vie',
              'Tout du plan annuel',
              'Badge « Fondateur »',
              'Accès anticipé nouveautés',
            ].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="text-ac-amber">{tick}</span>
                {f}
              </li>
            ))}
          </ul>
          <CheckoutButton
            priceId={priceFondateurs}
            label="Devenir fondateur (300€/an)"
            variant="amber"
          />
        </div>
      </div>

      <p className="mt-10 text-center text-xs text-ac-text-muted">
        Paiement sécurisé par Stripe · Sans engagement pour le plan mensuel · Annulation possible à tout moment
      </p>
    </div>
  )
}
