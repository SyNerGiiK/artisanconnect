import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import SignOutButton from '@/components/auth/SignOutButton'

/**
 * Guard layout: only users with role='artisan' can access /artisan/* pages.
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/artisan/feed" className="font-bold text-lg text-blue-600">ArtisanConnect Pro</Link>
            <nav className="hidden sm:flex items-center gap-5 text-sm font-medium text-gray-600">
              <Link href="/artisan/feed" className="hover:text-gray-900 transition-colors">Chantiers</Link>
              <Link href="/artisan/mes-reponses" className="hover:text-gray-900 transition-colors">Mes devis / réponses</Link>
              <Link href="/artisan/conversations" className="hover:text-gray-900 transition-colors">Messages</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/artisan/profil" className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden sm:block">Mon Profil</Link>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
