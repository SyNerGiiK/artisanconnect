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

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Choisissez votre abonnement
        </h1>
        <p className="mt-3 text-gray-500 max-w-xl mx-auto">
          Accédez à tous les chantiers dans votre zone, sans commission, avec un tarif fixe mensuel.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-3">
        {/* Mensuel */}
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900">Mensuel</h3>
          <p className="mt-1 text-sm text-gray-500">Sans engagement</p>
          <div className="mt-6">
            <span className="text-4xl font-black text-gray-900">50€</span>
            <span className="text-gray-500"> / mois</span>
          </div>
          <ul className="mt-8 space-y-3 flex-1">
            {[
              'Accès illimité aux chantiers',
              'Profil public SEO',
              'Messagerie directe',
              'Zéro commission',
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="h-4 w-4 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          <CheckoutButton priceId={priceMensuel} label="Commencer (50€/mois)" variant="secondary" />
        </div>

        {/* Annuel — populaire */}
        <div className="relative rounded-2xl bg-blue-600 p-8 text-white shadow-xl ring-2 ring-blue-600 flex flex-col">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-4 py-1 text-xs font-bold text-amber-900 uppercase tracking-wide whitespace-nowrap">
            Le + populaire
          </div>
          <h3 className="text-lg font-semibold">Annuel</h3>
          <p className="mt-1 text-sm text-blue-200">Économisez 120€/an</p>
          <div className="mt-6">
            <span className="text-4xl font-black">40€</span>
            <span className="text-blue-200"> / mois</span>
          </div>
          <p className="mt-1 text-sm text-blue-300">facturé 480€/an</p>
          <ul className="mt-8 space-y-3 flex-1">
            {[
              'Tout du mensuel inclus',
              '2 mois offerts',
              'Priorité commerciale',
              'Support prioritaire',
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-blue-100">
                <svg className="h-4 w-4 text-blue-300 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          <CheckoutButton priceId={priceAnnuel} label="Choisir l'annuel (480€/an)" variant="secondary" />
        </div>

        {/* Fondateurs */}
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-amber-200 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900">Offre Fondateurs</h3>
          <p className="mt-1 text-sm text-amber-600 font-medium">50 places seulement</p>
          <div className="mt-6">
            <span className="text-4xl font-black text-gray-900">25€</span>
            <span className="text-gray-500"> / mois</span>
          </div>
          <p className="mt-1 text-sm text-gray-500">facturé 300€/an <strong>à vie</strong></p>
          <ul className="mt-8 space-y-3 flex-1">
            {[
              'Tarif préférentiel à vie',
              'Tout du plan annuel',
              'Badge « Fondateur »',
              'Accès anticipé nouveautés',
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="h-4 w-4 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          <CheckoutButton priceId={priceFondateurs} label="Devenir fondateur (300€/an)" variant="amber" />
        </div>
      </div>

      <p className="mt-10 text-center text-xs text-gray-400">
        Paiement sécurisé par Stripe · Sans engagement pour le plan mensuel · Annulation possible à tout moment
      </p>
    </div>
  )
}
