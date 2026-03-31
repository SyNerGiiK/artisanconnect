import { createClient } from '@/lib/supabase/server'
import SignOutButton from '@/components/auth/SignOutButton'

export default async function ParticulierDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('prenom, nom')
    .eq('id', user!.id)
    .single<{ prenom: string; nom: string }>()

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Mes projets</h1>
          <p className="text-gray-600">
            Bonjour {profile?.prenom} — gérez vos projets de travaux ici.
          </p>
        </div>
        <SignOutButton />
      </div>

      <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center text-gray-500">
        Le tableau de bord sera implémenté en Phase 3.
      </div>
    </div>
  )
}
