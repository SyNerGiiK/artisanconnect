import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar, { type NavItem } from '@/components/layout/Sidebar'

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
    .select('role, prenom, nom')
    .eq('id', user.id)
    .single<{ role: string; prenom: string | null; nom: string | null }>()

  if (profile?.role !== 'particulier') redirect('/artisan/feed')

  const nav: NavItem[] = [
    { href: '/particulier/dashboard', label: 'Mes projets', icon: '📋' },
    { href: '/particulier/conversations', label: 'Messagerie', icon: '💬' },
    { href: '/particulier/profil', label: 'Mon profil', icon: '👤' },
  ]

  const userName =
    `${profile?.prenom ?? ''} ${profile?.nom ?? ''}`.trim() || 'Particulier'

  return (
    <div className="flex h-screen bg-ac-bg overflow-hidden">
      <Sidebar role="particulier" nav={nav} userName={userName} userSub="Particulier" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
