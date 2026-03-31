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
    <div className="mx-auto max-w-2xl px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Mon Profil
        </h1>
        <p className="mt-2 text-gray-600">
          Gerez vos informations personnelles et vos preferences.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
        <ParticulierProfileForm profile={profile} particulier={particulier} />
      </div>
    </div>
  )
}
