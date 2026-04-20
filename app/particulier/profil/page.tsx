import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ParticulierProfileForm from './ParticulierProfileForm'

export default async function ParticulierProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/connexion')
  }

  // Parallel: profile + particulier (both only depend on user.id)
  const [profileRes, particulierRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('particuliers').select('*').eq('profil_id', user.id).single(),
  ])

  const profile = profileRes.data
  const particulier = particulierRes.data

  if (!profile || !particulier) {
    redirect('/particulier/onboarding')
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Mon Profil
        </h1>
        <p className="mt-2 text-gray-600">
          Gérez vos informations personnelles et vos préférences.
        </p>
      </div>

      <ParticulierProfileForm profile={profile} particulier={particulier} />
    </div>
  )
}
