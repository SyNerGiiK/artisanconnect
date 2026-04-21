import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ParticulierProfileForm from './ParticulierProfileForm'

export default async function ParticulierProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const [profileRes, particulierRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('particuliers').select('*').eq('profil_id', user.id).single(),
  ])

  const profile = profileRes.data
  const particulier = particulierRes.data

  if (!profile || !particulier) redirect('/particulier/onboarding')

  return (
    <div className="mx-auto max-w-[720px] px-7 py-8">
      <div className="mb-7">
        <h1 className="text-[28px] font-extrabold tracking-tight text-ac-text">
          Mon profil
        </h1>
        <p className="mt-1 text-sm text-ac-text-sub">
          Gérez vos informations personnelles et vos préférences.
        </p>
      </div>

      <ParticulierProfileForm profile={profile} particulier={particulier} />
    </div>
  )
}
