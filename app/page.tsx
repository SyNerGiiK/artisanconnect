import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { CategorieMetier } from '@/lib/types/database.types'

// -- Data fetching for categories (dynamic content) --------------------------
async function getCategories(): Promise<CategorieMetier[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('categories_metiers')
    .select('id, slug, libelle')
    .order('id')
  return (data as CategorieMetier[] | null) ?? []
}

// -- Icons as inline SVG components ------------------------------------------
function PaintIcon() {
  return (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  )
}

function FloorIcon() {
  return (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  )
}

function GardenIcon() {
  return (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  )
}

const CATEGORY_ICONS: Record<string, () => React.JSX.Element> = {
  'peinture': PaintIcon,
  'sols-murs': FloorIcon,
  'espaces-verts': GardenIcon,
}

// -- Main Landing Page -------------------------------------------------------
export default async function HomePage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-white">
      {/* ── NAVIGATION ───────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-indigo-600">
            ArtisanConnect
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/connexion"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              Connexion
            </Link>
            <Link
              href="/inscription"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            >
              Inscription gratuite
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-indigo-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700 ring-1 ring-indigo-200">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Lancement en Vendée (85)
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Trouvez le bon artisan{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                près de chez vous
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
              Décrivez votre projet, recevez jusqu&apos;à 3 devis d&apos;artisans vérifiés.
              <br className="hidden sm:block" />
              <strong>Gratuit pour les particuliers, sans commission.</strong>
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/inscription"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-xl hover:scale-105"
              >
                Je suis particulier — C&apos;est gratuit
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/inscription"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-indigo-200 bg-white px-8 py-4 text-base font-semibold text-indigo-600 transition-all hover:bg-indigo-50 hover:border-indigo-300"
              >
                Je suis artisan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ─────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Comment ça marche ?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              3 étapes simples pour trouver votre artisan
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Décrivez votre projet',
                desc: 'Renseignez les détails de votre chantier : type de travaux, localisation, description.',
                icon: (
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                ),
              },
              {
                step: '2',
                title: 'Recevez des devis',
                desc: 'Jusqu\'à 3 artisans vérifiés de votre zone vous contactent avec leur proposition.',
                icon: (
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                ),
              },
              {
                step: '3',
                title: 'Choisissez le meilleur',
                desc: 'Comparez les propositions, échangez par messagerie et choisissez l\'artisan idéal.',
                icon: (
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group relative rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                  {item.icon}
                </div>
                <div className="absolute top-6 right-6 text-4xl font-black text-gray-100">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POUR LES PARTICULIERS ─────────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 ring-1 ring-green-200">
                100% gratuit
              </div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Particuliers : vos travaux en toute sérénité
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Fini le démarchage intempestif. Avec ArtisanConnect, vous gardez le contrôle.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  { text: 'Service 100% gratuit pour les particuliers', strong: true },
                  { text: 'Maximum 3 artisans par projet — pas de harcèlement', strong: false },
                  { text: 'Artisans vérifiés (SIRET obligatoire)', strong: false },
                  { text: 'Échangez par messagerie sécurisée', strong: false },
                  { text: 'Vos coordonnées restent privées', strong: false },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className={`text-gray-700 ${item.strong ? 'font-semibold' : ''}`}>
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/inscription"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-green-700 hover:shadow-lg"
              >
                Publier mon projet gratuitement
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-10 ring-1 ring-green-100">
              <div className="space-y-6">
                {[
                  { num: '0€', label: 'pour le particulier' },
                  { num: '3 max', label: 'artisans par projet' },
                  { num: '< 24h', label: 'pour recevoir un devis' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm">
                    <div className="text-3xl font-black text-green-600">{stat.num}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── POUR LES ARTISANS ─────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gradient-to-br from-indigo-50 to-purple-50 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1 rounded-2xl bg-white p-10 shadow-lg ring-1 ring-indigo-100">
              <div className="space-y-6">
                {[
                  { num: '0%', label: 'de commission' },
                  { num: '50€', label: '/ mois sans engagement' },
                  { num: '∞', label: 'chantiers accessibles' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-4 rounded-xl bg-indigo-50 p-5">
                    <div className="text-3xl font-black text-indigo-600">{stat.num}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="mb-4 inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 ring-1 ring-indigo-200">
                Pour les pros
              </div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Artisans : des chantiers sans les arnaques
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Un abonnement fixe, des leads qualifiés, zéro surprise sur la facture.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  'Abonnement fixe — pas de frais par contact',
                  'Répondez à autant de chantiers que vous voulez',
                  'Leads qualifiés dans votre zone (par département)',
                  'Profil public référencé sur Google',
                  'Messagerie directe avec les clients',
                ].map((text) => (
                  <li key={text} className="flex items-start gap-3">
                    <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{text}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/inscription"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-700 hover:shadow-lg"
              >
                Rejoindre ArtisanConnect
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── NOS MÉTIERS ───────────────────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Nos métiers
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Des artisans qualifiés dans chaque spécialité
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {categories.map((cat) => {
              const IconComponent = CATEGORY_ICONS[cat.slug] ?? PaintIcon
              return (
                <div
                  key={cat.id}
                  className="group rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                    <IconComponent />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {cat.libelle}
                  </h3>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── TARIFS ────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Tarifs artisans
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Simple, transparent, sans mauvaise surprise
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {/* Mensuel */}
            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900">Mensuel</h3>
              <p className="mt-1 text-sm text-gray-500">Sans engagement</p>
              <div className="mt-6">
                <span className="text-4xl font-black text-gray-900">50€</span>
                <span className="text-gray-500"> / mois</span>
              </div>
              <ul className="mt-8 space-y-3">
                {['Accès illimité aux chantiers', 'Profil public SEO', 'Messagerie directe', 'Zéro commission'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/inscription"
                className="mt-8 block w-full rounded-xl border-2 border-indigo-200 py-3 text-center text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-50"
              >
                Commencer
              </Link>
            </div>

            {/* Annuel — populaire */}
            <div className="relative rounded-2xl bg-indigo-600 p-8 text-white shadow-xl ring-2 ring-indigo-600 transition-shadow hover:shadow-2xl">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-4 py-1 text-xs font-bold text-amber-900 uppercase tracking-wide">
                Le + populaire
              </div>
              <h3 className="text-lg font-semibold">Annuel</h3>
              <p className="mt-1 text-sm text-indigo-200">Économisez 120€/an</p>
              <div className="mt-6">
                <span className="text-4xl font-black">40€</span>
                <span className="text-indigo-200"> / mois</span>
              </div>
              <p className="mt-1 text-sm text-indigo-300">facturé 480€/an</p>
              <ul className="mt-8 space-y-3">
                {['Tout du mensuel inclus', '2 mois offerts', 'Priorité commerciale', 'Support prioritaire'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-indigo-100">
                    <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/inscription"
                className="mt-8 block w-full rounded-xl bg-white py-3 text-center text-sm font-semibold text-indigo-600 transition-all hover:shadow-lg"
              >
                Choisir l&apos;annuel
              </Link>
            </div>

            {/* Fondateurs */}
            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-amber-200 transition-shadow hover:shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900">Offre Fondateurs</h3>
              <p className="mt-1 text-sm text-amber-600 font-medium">50 places seulement</p>
              <div className="mt-6">
                <span className="text-4xl font-black text-gray-900">25€</span>
                <span className="text-gray-500"> / mois</span>
              </div>
              <p className="mt-1 text-sm text-gray-500">facturé 300€/an <strong>à vie</strong></p>
              <ul className="mt-8 space-y-3">
                {['Tarif préférentiel à vie', 'Tout du plan annuel', 'Badge « Fondateur »', 'Accès anticipé nouveautés'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="h-4 w-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/inscription"
                className="mt-8 block w-full rounded-xl bg-amber-500 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-amber-600"
              >
                Devenir fondateur
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div>
              <Link href="/" className="text-lg font-bold text-indigo-600">
                ArtisanConnect
              </Link>
              <p className="mt-1 text-sm text-gray-500">
                La plateforme équitable pour vos travaux
              </p>
            </div>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link href="/inscription" className="hover:text-indigo-600 transition-colors">
                Inscription
              </Link>
              <Link href="/connexion" className="hover:text-indigo-600 transition-colors">
                Connexion
              </Link>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-100 pt-6 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} ArtisanConnect — Anti-Travaux.com. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  )
}
