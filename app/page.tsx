import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { CategorieMetier } from '@/lib/types/database.types'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

async function getCategories(): Promise<CategorieMetier[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('categories_metiers')
    .select('id, slug, libelle')
    .order('id')
  return (data as CategorieMetier[] | null) ?? []
}

const HOW_IT_WORKS = [
  {
    step: '1',
    icon: '✏️',
    title: 'Décrivez votre projet',
    desc: 'Renseignez les détails de votre chantier : type de travaux, localisation, description.',
  },
  {
    step: '2',
    icon: '📬',
    title: 'Recevez des devis',
    desc: "Jusqu'à 3 artisans vérifiés de votre zone vous contactent avec leur proposition.",
  },
  {
    step: '3',
    icon: '✅',
    title: 'Choisissez le meilleur',
    desc: "Comparez les propositions, échangez par messagerie et choisissez l'artisan idéal.",
  },
]

const PARTICULIER_BULLETS = [
  'Service 100% gratuit pour les particuliers',
  'Maximum 3 artisans par projet',
  'Artisans vérifiés (SIRET obligatoire)',
  'Échangez par messagerie sécurisée',
  'Vos coordonnées restent privées',
]

const ARTISAN_BULLETS = [
  'Abonnement fixe — pas de frais par contact',
  'Répondez à autant de chantiers que vous voulez',
  'Leads qualifiés dans votre zone',
  'Profil public référencé sur Google',
  'Messagerie directe avec les clients',
]

export default async function HomePage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-white text-ac-text">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-ac-border-light px-6">
        <div className="mx-auto max-w-6xl h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-extrabold text-ac-primary tracking-tight">
            ArtisanConnect
          </Link>
          <div className="hidden md:flex gap-8">
            {[
              { href: '#comment-ca-marche', label: 'Comment ça marche' },
              { href: '#tarifs', label: 'Tarifs' },
              { href: '#nos-metiers', label: 'Nos métiers' },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-ac-text-sub hover:text-ac-primary transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="flex gap-2.5">
            <Button href="/connexion" variant="secondary" size="sm">Se connecter</Button>
            <Button href="/inscription" variant="primary" size="sm">S&apos;inscrire</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-24 px-6 text-center bg-gradient-to-br from-ac-primary-light via-white to-ac-primary-light">
        <div
          aria-hidden
          className="absolute top-[-100px] left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-ac-primary/10 blur-3xl pointer-events-none"
        />
        <div className="relative mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-ac-primary-light border border-ac-primary-border px-4 py-1.5 text-sm font-semibold text-ac-primary-text">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500 ac-pulse" />
            Lancement en Vendée (85)
          </div>
          <h1
            className="font-extrabold leading-[1.15] tracking-[-1.5px] text-ac-text"
            style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}
          >
            Trouvez le bon artisan
            <br />
            <span className="inline-block pb-1 bg-gradient-to-br from-ac-primary to-ac-primary-dark bg-clip-text text-transparent">
              près de chez vous
            </span>
          </h1>
          <p className="mt-5 text-lg text-ac-text-sub leading-relaxed">
            Décrivez votre projet, recevez jusqu&apos;à{' '}
            <strong className="text-ac-text">3 devis d&apos;artisans vérifiés</strong>.
            <br />
            Gratuit pour les particuliers, sans commission.
          </p>
          <div className="mt-9 flex flex-wrap gap-3 justify-center">
            <Button href="/inscription" variant="primary" size="lg">
              Je cherche un artisan →
            </Button>
            <Button href="/inscription" variant="secondary" size="lg">
              Je suis artisan
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="comment-ca-marche" className="py-20 px-6 bg-ac-bg">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <h2
              className="font-extrabold tracking-tight"
              style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}
            >
              Comment ça marche ?
            </h2>
            <p className="mt-3 text-ac-text-sub">3 étapes simples pour trouver votre artisan</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {HOW_IT_WORKS.map((item) => (
              <Card key={item.step} hover className="relative p-8">
                <div className="mb-5 h-12 w-12 rounded-ac-sm bg-ac-primary-light text-ac-primary flex items-center justify-center text-[22px]">
                  {item.icon}
                </div>
                <div className="absolute top-5 right-6 text-5xl font-black text-ac-border-light leading-none">
                  {item.step}
                </div>
                <h3 className="font-bold text-base mb-2">{item.title}</h3>
                <p className="text-sm text-ac-text-sub leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Particuliers */}
      <section className="py-20 px-6 bg-white">
        <div className="mx-auto max-w-6xl grid gap-12 items-center lg:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-ac-green-light border border-ac-green-border text-ac-green px-3.5 py-1 text-xs font-bold mb-4">
              100% gratuit
            </span>
            <h2
              className="font-extrabold tracking-tight mb-3"
              style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}
            >
              Particuliers : vos travaux en toute sérénité
            </h2>
            <p className="text-ac-text-sub mb-6">
              Fini le démarchage intempestif. Avec ArtisanConnect, vous gardez le contrôle.
            </p>
            <ul className="space-y-2.5">
              {PARTICULIER_BULLETS.map((b) => (
                <li key={b} className="flex gap-2.5 text-sm text-ac-text-sub">
                  <span className="text-ac-green shrink-0">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Button href="/inscription" variant="green" size="lg">
                Publier mon projet gratuitement →
              </Button>
            </div>
          </div>
          <div className="rounded-ac-lg p-10 bg-gradient-to-br from-ac-green-light to-white border border-ac-green-border">
            {[
              { num: '0€', label: 'pour le particulier' },
              { num: '3 max', label: 'artisans par projet' },
              { num: '< 24h', label: 'pour recevoir un devis' },
            ].map((s) => (
              <Card key={s.label} className="mb-3 flex items-center gap-4 px-5 py-4 last:mb-0">
                <div className="text-3xl font-black text-ac-green">{s.num}</div>
                <div className="text-sm text-ac-text-sub">{s.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Artisans */}
      <section className="py-20 px-6 bg-ac-primary-light border-t border-ac-border-light">
        <div className="mx-auto max-w-6xl grid gap-12 items-center lg:grid-cols-2">
          <Card className="p-10 order-2 lg:order-1">
            {[
              { num: '0%', label: 'de commission' },
              { num: '50€', label: '/ mois sans engagement' },
              { num: '∞', label: 'chantiers accessibles' },
            ].map((s) => (
              <div
                key={s.label}
                className="mb-2.5 flex items-center gap-4 bg-ac-primary-light rounded-ac-sm p-4 last:mb-0"
              >
                <div className="text-3xl font-black text-ac-primary">{s.num}</div>
                <div className="text-sm text-ac-text-sub">{s.label}</div>
              </div>
            ))}
          </Card>
          <div className="order-1 lg:order-2">
            <span className="inline-block rounded-full bg-ac-primary-light border border-ac-primary-border text-ac-primary-text px-3.5 py-1 text-xs font-bold mb-4">
              Pour les pros
            </span>
            <h2
              className="font-extrabold tracking-tight mb-3"
              style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}
            >
              Artisans : des chantiers sans les arnaques
            </h2>
            <p className="text-ac-text-sub mb-6">
              Un abonnement fixe, des leads qualifiés, zéro surprise sur la facture.
            </p>
            <ul className="space-y-2.5">
              {ARTISAN_BULLETS.map((b) => (
                <li key={b} className="flex gap-2.5 text-sm text-ac-text-sub">
                  <span className="text-ac-primary shrink-0">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Button href="/inscription" variant="primary" size="lg">
                Rejoindre ArtisanConnect →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Nos métiers */}
      <section id="nos-metiers" className="py-20 px-6 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <h2
              className="font-extrabold tracking-tight"
              style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}
            >
              Nos métiers
            </h2>
            <p className="mt-3 text-ac-text-sub">
              Des artisans qualifiés dans chaque spécialité
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {categories.map((cat) => (
              <Card key={cat.id} hover className="p-8 text-center">
                <div className="mx-auto mb-4 h-14 w-14 rounded-ac bg-ac-primary-light text-ac-primary flex items-center justify-center text-2xl">
                  🔧
                </div>
                <h3 className="font-bold text-base">{cat.libelle}</h3>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tarifs */}
      <section id="tarifs" className="py-20 px-6 bg-ac-bg border-t border-ac-border-light">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <h2
              className="font-extrabold tracking-tight"
              style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}
            >
              Tarifs artisans
            </h2>
            <p className="mt-3 text-ac-text-sub">
              Simple, transparent, sans mauvaise surprise
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {/* Mensuel */}
            <Card className="p-8">
              <h3 className="font-bold text-base">Mensuel</h3>
              <p className="mt-1 text-xs text-ac-text-muted">Sans engagement</p>
              <div className="mt-5">
                <span className="text-[40px] font-black text-ac-text">50€</span>
                <span className="text-ac-text-muted text-sm"> / mois</span>
              </div>
              <ul className="mt-6 space-y-2.5">
                {['Accès illimité aux chantiers', 'Profil public SEO', 'Messagerie directe', 'Zéro commission'].map((f) => (
                  <li key={f} className="flex gap-2 text-[13px] text-ac-text-sub">
                    <span className="text-ac-green shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Button href="/inscription" variant="secondary" full className="mt-6">
                Commencer
              </Button>
            </Card>

            {/* Annuel */}
            <Card className="relative p-8 border-2 border-ac-primary bg-ac-primary-light">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-4 py-1 text-[11px] font-bold text-amber-900 whitespace-nowrap">
                LE PLUS POPULAIRE
              </div>
              <h3 className="font-bold text-base">Annuel ⭐</h3>
              <p className="mt-1 text-xs text-ac-text-muted">Facturé 480€/an — 2 mois offerts</p>
              <div className="mt-5">
                <span className="text-[40px] font-black text-ac-primary">40€</span>
                <span className="text-ac-text-muted text-sm"> / mois</span>
              </div>
              <ul className="mt-6 space-y-2.5">
                {['Tout du mensuel inclus', '2 mois offerts', 'Priorité commerciale', 'Support prioritaire'].map((f) => (
                  <li key={f} className="flex gap-2 text-[13px] text-ac-text-sub">
                    <span className="text-ac-primary shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Button href="/inscription" variant="primary" full className="mt-6">
                Choisir l&apos;annuel
              </Button>
            </Card>

            {/* Fondateur */}
            <Card className="p-8 border-2 border-ac-amber-border">
              <h3 className="font-bold text-base">Offre Fondateurs 🚀</h3>
              <p className="mt-1 text-xs text-ac-amber font-bold">
                Facturé 300€/an à vie — 50 places
              </p>
              <div className="mt-5">
                <span className="text-[40px] font-black text-ac-amber">25€</span>
                <span className="text-ac-text-muted text-sm"> / mois</span>
              </div>
              <ul className="mt-6 space-y-2.5">
                {['Tarif préférentiel à vie', 'Tout du plan annuel', 'Badge « Fondateur »', 'Accès anticipé nouveautés'].map((f) => (
                  <li key={f} className="flex gap-2 text-[13px] text-ac-text-sub">
                    <span className="text-ac-amber shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Button href="/inscription" variant="amber" full className="mt-6">
                Devenir fondateur
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-ac-border py-12 px-6">
        <div className="mx-auto max-w-6xl grid gap-8 sm:grid-cols-4">
          <div>
            <div className="font-extrabold text-base text-ac-primary mb-2">ArtisanConnect</div>
            <div className="text-[13px] text-ac-text-muted">
              La plateforme équitable pour vos travaux
            </div>
          </div>
          {[
            {
              title: 'Produit',
              links: [
                { label: 'Comment ça marche', href: '#comment-ca-marche' },
                { label: 'Tarifs', href: '#tarifs' },
              ],
            },
            {
              title: 'Légal',
              links: [
                { label: 'CGU', href: '/cgu' },
                { label: 'CGV', href: '/cgv' },
                { label: 'Mentions légales', href: '/mentions-legales' },
              ],
            },
            {
              title: 'Contact',
              links: [
                { label: 'contact@artisanconnect.fr', href: '#' },
                { label: 'Vendée (85)', href: '#' },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <div className="font-bold text-[13px] mb-3">{col.title}</div>
              {col.links.map((l) => (
                <div key={l.label} className="text-[13px] text-ac-text-muted mb-2 hover:text-ac-primary">
                  {l.href.startsWith('/') ? (
                    <Link href={l.href} className="hover:text-ac-primary">
                      {l.label}
                    </Link>
                  ) : (
                    <a href={l.href}>{l.label}</a>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="mx-auto max-w-6xl mt-6 pt-4 border-t border-ac-border-light text-center text-xs text-ac-text-muted">
          © {new Date().getFullYear()} ArtisanConnect. Tous droits réservés.
        </div>
      </footer>
    </div>
  )
}
