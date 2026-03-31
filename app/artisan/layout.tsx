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
    <div className="min-h-screen bg-white flex flex-col">
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/artisan/feed" className="text-xl font-bold text-blue-600">ArtisanConnect</Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/artisan/feed" className="text-gray-700 hover:text-blue-600 transition-colors">Chantiers</Link>
              <Link href="/artisan/mes-reponses" className="text-gray-700 hover:text-blue-600 transition-colors">Mes devis</Link>
              <Link href="/artisan/conversations" className="text-gray-700 hover:text-blue-600 transition-colors">Messages</Link>
              <Link href="/artisan/profil" className="text-gray-700 hover:text-blue-600 transition-colors">Mon Profil</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Espace Pro
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="flex-1 bg-gradient-to-b from-blue-50/50 to-white">
        {children}
      </main>
    </div>
  )
}
