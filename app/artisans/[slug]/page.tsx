import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'

interface ArtisanProfile {
  id: string
  slug: string
  nom_entreprise: string
  description: string | null
  siret: string | null
  code_postal_base: string
  rayon_km: number
  profil_id: string
  profiles: {
    prenom: string
    nom: string
  }
  artisan_categories: Array<{
    categories_metiers: {
      slug: string
      libelle: string
    }
  }>
}

async function getArtisanBySlug(slug: string): Promise<ArtisanProfile | null> {
  const supabase = await createClient()

  const { data: baseArtisanRaw, error: artisanError } = await supabase
    .from('v_artisans_public' as never)
    .select('*')
    .eq('slug', slug)
    .single()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const baseArtisan = baseArtisanRaw as any
  if (artisanError || !baseArtisan) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('prenom, nom')
    .eq('id', baseArtisan.profil_id)
    .single()

  const { data: rawCategories } = await supabase
    .from('artisan_categories')
    .select('categories_metiers(slug, libelle)')
    .eq('artisan_id', baseArtisan.id)

  const artisanProfiles = profile ?? { prenom: 'Artisan', nom: '' }
  const artisanCategories = rawCategories ?? []

  return {
    ...baseArtisan,
    profiles: artisanProfiles,
    artisan_categories: artisanCategories,
  } as ArtisanProfile
}

type MetadataProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { slug } = await params
  const artisan = await getArtisanBySlug(slug)

  if (!artisan) {
    return { title: 'Artisan introuvable — ArtisanConnect' }
  }

  const metiers = artisan.artisan_categories
    .map((ac) => ac.categories_metiers.libelle)
    .join(', ')

  const title = `${artisan.nom_entreprise} — ${metiers} | ArtisanConnect`
  const description = artisan.description
    ? artisan.description.slice(0, 160)
    : `${artisan.nom_entreprise}, artisan spécialisé en ${metiers} à ${artisan.code_postal_base}. Demandez un devis gratuit sur ArtisanConnect.`

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/artisans/${artisan.slug}`,
      siteName: 'ArtisanConnect',
      type: 'profile',
      locale: 'fr_FR',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

export default async function ArtisanPublicProfile({ params }: MetadataProps) {
  const { slug } = await params
  const artisan = await getArtisanBySlug(slug)

  if (!artisan) notFound()

  const metiers = artisan.artisan_categories.map((ac) => ac.categories_metiers)
  const fullName = `${artisan.profiles.prenom} ${artisan.profiles.nom}`.trim()

  return (
    <div className="min-h-screen bg-ac-bg">
      {/* Public nav */}
      <nav className="sticky top-0 z-50 border-b border-ac-border bg-ac-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <Link href="/" className="text-lg font-extrabold tracking-tight text-ac-text">
            ArtisanConnect
          </Link>
          <div className="flex items-center gap-2">
            <Button href="/connexion" variant="ghost" size="sm">
              Se connecter
            </Button>
            <Button href="/inscription" size="sm">
              S&apos;inscrire
            </Button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <Card className="overflow-hidden p-0">
          {/* Header band */}
          <div className="h-28 bg-gradient-to-br from-ac-primary to-ac-primary-dark" />

          <div className="px-7 pb-10 pt-0 sm:px-10">
            <div className="-mt-14 mb-5 flex flex-wrap items-end gap-5">
              <div className="rounded-ac-lg bg-ac-surface p-1.5 shadow-[0_6px_20px_rgba(0,0,0,0.12)] ring-1 ring-ac-border">
                <Avatar name={artisan.nom_entreprise} size={96} />
              </div>
              <div className="pb-1">
                <h1 className="text-2xl font-extrabold tracking-tight text-ac-text sm:text-3xl">
                  {artisan.nom_entreprise}
                </h1>
                {fullName && (
                  <p className="mt-0.5 text-sm text-ac-text-sub">{fullName}</p>
                )}
              </div>
            </div>

            {metiers.length > 0 && (
              <div className="mb-7 flex flex-wrap gap-2">
                {metiers.map((m) => (
                  <Tag key={m.slug} color="primary">
                    {m.libelle}
                  </Tag>
                ))}
              </div>
            )}

            {/* Info grid */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-ac border border-ac-border bg-ac-surface-hover p-5">
                <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-ac-text-muted">
                  📍 Zone d&apos;intervention
                </div>
                <p className="font-bold text-ac-text">{artisan.code_postal_base}</p>
                <p className="text-xs text-ac-text-sub">Rayon de {artisan.rayon_km} km</p>
              </div>

              <div className="rounded-ac border border-ac-border bg-ac-surface-hover p-5">
                <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-ac-text-muted">
                  🛠️ Spécialités
                </div>
                <p className="font-bold text-ac-text">
                  {metiers.length} métier{metiers.length > 1 ? 's' : ''}
                </p>
                <p className="text-xs text-ac-text-sub">Vérifiés par ArtisanConnect</p>
              </div>

              {artisan.siret && (
                <div className="rounded-ac border border-ac-green-border bg-ac-green-light p-5">
                  <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-ac-green">
                    ✓ SIRET vérifié
                  </div>
                  <p className="font-mono text-sm font-bold text-ac-text">
                    {artisan.siret}
                  </p>
                </div>
              )}
            </div>

            {artisan.description && (
              <div className="mb-8">
                <h2 className="mb-2 text-base font-bold text-ac-text">À propos</h2>
                <div className="rounded-ac border border-ac-border bg-ac-surface-hover p-5">
                  <p className="whitespace-pre-line text-sm leading-relaxed text-ac-text-sub">
                    {artisan.description}
                  </p>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="rounded-ac-lg bg-ac-text px-7 py-8 text-center text-white shadow-[0_12px_32px_rgba(15,23,42,0.25)]">
              <h2 className="mb-2 text-xl font-extrabold tracking-tight sm:text-2xl">
                Besoin de {metiers.map((m) => m.libelle.toLowerCase()).join(' ou ')} ?
              </h2>
              <p className="mx-auto mb-6 max-w-md text-sm text-white/75">
                Créez votre projet gratuitement et recevez jusqu&apos;à 3 devis d&apos;artisans vérifiés.
              </p>
              <Button href="/inscription" size="lg" variant="secondary">
                Demander un devis gratuit →
              </Button>
            </div>
          </div>
        </Card>

        <div className="mt-7 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ac-text-sub transition-colors hover:text-ac-primary"
          >
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </main>

      <footer className="border-t border-ac-border bg-ac-surface py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-xs text-ac-text-muted">
          © {new Date().getFullYear()} ArtisanConnect. Tous droits réservés.
        </div>
      </footer>
    </div>
  )
}
