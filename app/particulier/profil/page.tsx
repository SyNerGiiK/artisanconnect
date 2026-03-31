import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ParticulierProfileForm from './ParticulierProfileForm'

export const dynamic = 'force-dynamic'

export default async function ParticulierProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/connexion')
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch particulier
  const { data: particulier } = await supabase
    .from('particuliers')
    .select('*')
    .eq('profil_id', user.id)
    .single()

  if (!profile || !particulier) {
    redirect('/particulier/onboarding')
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mon Profil Particulier</h1>
      <ParticulierProfileForm profile={profile} particulier={particulier} />
    </div>
  )
}
