import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import SignOutButton from '@/components/auth/SignOutButton'

/**
 * Guard layout: only users with role='particulier' can access /particulier/* pages.
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/particulier/dashboard" className="text-xl font-bold text-blue-600">ArtisanConnect</Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/particulier/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">Mes projets</Link>
              <Link href="/particulier/conversations" className="text-gray-700 hover:text-blue-600 transition-colors">Messages</Link>
              <Link href="/particulier/profil" className="text-gray-700 hover:text-blue-600 transition-colors">Mon Profil</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/particulier/nouveau-projet"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-xl hover:scale-[1.02]"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nouveau projet
            </Link>
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
