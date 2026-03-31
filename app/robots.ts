import type { MetadataRoute } from 'next'

/**
 * Robots.txt configuration for search engine crawlers.
 * Automatically served at /robots.txt by Next.js.
 *
 * - Public pages (/artisans/*, /) are crawlable
 * - Private spaces (/artisan/*, /particulier/*) are blocked
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/artisans/'],
      disallow: ['/artisan/', '/particulier/', '/auth/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
