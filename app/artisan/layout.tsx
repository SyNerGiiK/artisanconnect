import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar, { type NavItem } from '@/components/layout/Sidebar'

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
    .select('role, prenom, nom')
    .eq('id', user.id)
    .single<{ role: string; prenom: string | null; nom: string | null }>()

  if (profile?.role !== 'artisan') redirect('/particulier/dashboard')

  const { data: artisan } = await supabase
    .from('artisans')
    .select('nom_entreprise')
    .eq('profil_id', user.id)
    .single<{ nom_entreprise: string | null }>()

  const nav: NavItem[] = [
    { href: '/artisan/feed', label: 'Chantiers', icon: '🏗️' },
    { href: '/artisan/mes-reponses', label: 'Mes devis', icon: '📝' },
    { href: '/artisan/conversations', label: 'Messagerie', icon: '💬' },
    { href: '/artisan/profil', label: 'Mon profil', icon: '👤' },
    { href: '/artisan/abonnement', label: 'Abonnement', icon: '💎' },
  ]

  const userName =
    `${profile?.prenom ?? ''} ${profile?.nom ?? ''}`.trim() || 'Artisan'
  const userSub = artisan?.nom_entreprise ?? 'Artisan'

  return (
    <div className="flex h-screen bg-ac-bg overflow-hidden">
      <Sidebar role="artisan" nav={nav} userName={userName} userSub={userSub} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
