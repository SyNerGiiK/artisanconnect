import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

// -- Types for joined query --------------------------------------------------
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

// -- Data fetching -----------------------------------------------------------
async function getArtisanBySlug(slug: string): Promise<ArtisanProfile | null> {
  const supabase = await createClient()

  const { data: baseArtisanRaw, error: artisanError } = await supabase
    .from('v_artisans_public' as any)
    .select('*')
    .eq('slug', slug)
    .single()

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

  const artisanProfiles = profile ? profile : { prenom: 'Artisan', nom: '' }
  const artisanCategories = rawCategories ? rawCategories : []

  return {
    ...baseArtisan,
    profiles: artisanProfiles,
    artisan_categories: artisanCategories,
  } as ArtisanProfile
}

// -- Metadata (SEO) ----------------------------------------------------------
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

// -- Page Component (Server Component — SSR for SEO) -------------------------
export default async function ArtisanPublicProfile({ params }: MetadataProps) {
  const { slug } = await params
  const artisan = await getArtisanBySlug(slug)

  if (!artisan) {
    notFound()
  }

  const metiers = artisan.artisan_categories.map(
    (ac) => ac.categories_metiers
  )
  const initials = artisan.profiles.prenom.charAt(0) + artisan.profiles.nom.charAt(0)

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-xl font-bold text-blue-600"
          >
            ArtisanConnect
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/connexion"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              Se connecter
            </Link>
            <Link
              href="/inscription"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              S&apos;inscrire
            </Link>
          </div>
        </div>
      </nav>

      {/* Profile Card */}
      <main className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-blue-100/50 blur-3xl" />
        
        <div className="relative mx-auto max-w-4xl px-6 py-12">
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-100">
            {/* Header gradient bar */}
            <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-500" />

            <div className="relative px-8 pb-10">
              {/* Avatar */}
              <div className="-mt-16 mb-6 flex items-end gap-6">
                <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-white text-3xl font-bold text-blue-600 shadow-lg ring-4 ring-white">
                  {initials.toUpperCase()}
                </div>
                <div className="pb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {artisan.nom_entreprise}
                  </h1>
                  <p className="mt-1 text-lg text-gray-500">
                    {artisan.profiles.prenom} {artisan.profiles.nom}
                  </p>
                </div>
              </div>

              {/* Badges metiers */}
              <div className="mb-8 flex flex-wrap gap-2">
                {metiers.map((m) => (
                  <span
                    key={m.slug}
                    className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 ring-1 ring-blue-200"
                  >
                    {m.libelle}
                  </span>
                ))}
              </div>

              {/* Info grid */}
              <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Zone d'intervention */}
                <div className="rounded-xl bg-gray-50 p-5 ring-1 ring-gray-100">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Zone d&apos;intervention
                  </div>
                  <p className="text-lg font-medium text-gray-900">
                    {artisan.code_postal_base}
                  </p>
                  <p className="text-sm text-gray-500">
                    Rayon de {artisan.rayon_km} km
                  </p>
                </div>

                {/* Specialites */}
                <div className="rounded-xl bg-gray-50 p-5 ring-1 ring-gray-100">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    Specialites
                  </div>
                  <p className="text-lg font-medium text-gray-900">
                    {metiers.length} metier{metiers.length > 1 ? 's' : ''}
                  </p>
                </div>

                {/* SIRET */}
                {artisan.siret && (
                  <div className="rounded-xl bg-gray-50 p-5 ring-1 ring-gray-100">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      SIRET verifie
                    </div>
                    <p className="text-lg font-medium text-gray-900 font-mono">
                      {artisan.siret}
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              {artisan.description && (
                <div className="mb-8">
                  <h2 className="mb-3 text-lg font-semibold text-gray-900">
                    A propos
                  </h2>
                  <div className="rounded-xl bg-gray-50 p-6 ring-1 ring-gray-100">
                    <p className="leading-relaxed text-gray-700 whitespace-pre-line">
                      {artisan.description}
                    </p>
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="rounded-2xl bg-blue-600 p-8 text-center text-white shadow-xl">
                <h2 className="mb-2 text-2xl font-bold">
                  Besoin de {metiers.map((m) => m.libelle.toLowerCase()).join(' ou ')} ?
                </h2>
                <p className="mb-6 text-blue-100">
                  Creez votre projet gratuitement et recevez jusqu&apos;a 3 devis d&apos;artisans verifies.
                </p>
                <Link
                  href="/inscription"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-blue-600 shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]"
                >
                  Demander un devis gratuit
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Back link */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour a l&apos;accueil
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} ArtisanConnect. Tous droits reserves.
        </div>
      </footer>
    </div>
  )
}
