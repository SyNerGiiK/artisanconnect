import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ArtisanProfileForm from './ArtisanProfileForm'
import PortalButton from '@/components/stripe/PortalButton'

export default async function ArtisanProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/connexion')
  }

  // Parallel: profile + artisan + all categories (all independent)
  const [profileRes, artisanRes, allCategoriesRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('artisans').select('*').eq('profil_id', user.id).single(),
    supabase.from('categories_metiers').select('*').order('id'),
  ])

  const profile = profileRes.data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const artisan = artisanRes.data as any
  const allCategories = allCategoriesRes.data

  if (!profile || !artisan) {
    redirect('/artisan/onboarding')
  }

  // Depends on artisan.id — must run after
  const { data: artisanCategories } = await supabase
    .from('artisan_categories')
    .select('categorie_id')
    .eq('artisan_id', artisan.id)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectedCategoryIds = artisanCategories?.map((cat: any) => cat.categorie_id) || []

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      {/* Header */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Mon Profil Artisan
          </h1>
          <p className="mt-2 text-gray-600">
            Gérez vos informations professionnelles et vos préférences.
          </p>
        </div>
        {artisan.abonnement_actif && (
          <div>
            <PortalButton />
          </div>
        )}
      </div>

      {/* Card */}
      <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
        <ArtisanProfileForm 
          profile={profile} 
          artisan={artisan} 
          allCategories={allCategories || []}
          initialSelectedCategories={selectedCategoryIds}
        />
      </div>
    </div>
  )
}
