import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

/**
 * Dynamic sitemap including all public artisan profiles.
 * Automatically served at /sitemap.xml by Next.js.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/connexion`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/inscription`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Dynamic artisan profile pages
  const supabase = await createClient()
  const { data: artisans } = await supabase
    .from('v_artisans_public' as any)
    .select('slug')
    .not('slug', 'is', null)

  const artisanPages: MetadataRoute.Sitemap = ((artisans as Array<{ slug: string }> | null) ?? []).map((a) => ({
    url: `${siteUrl}/artisans/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...artisanPages]
}
