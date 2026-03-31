import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

/**
 * Guard layout: only users with role='particulier' can access /particulier/* pages.
 * The proxy already handles this, but this is defense-in-depth.
 */
export default async function ParticulierLayout({
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

  if (profile?.role !== 'particulier') redirect('/artisan/feed')

  return <>{children}</>
}
