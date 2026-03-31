import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

/**
 * Guard layout: only users with role='artisan' can access /artisan/* pages.
 * The proxy already handles this, but this is defense-in-depth.
 */
export default async function ArtisanLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single<{ role: string }>()

  if (profile?.role !== 'artisan') redirect('/particulier/dashboard')

  return <>{children}</>
}
