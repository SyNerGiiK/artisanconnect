import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ArtisanProfileForm from './ArtisanProfileForm'

export const dynamic = 'force-dynamic'

export default async function ArtisanProfilePage() {
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

  // Fetch artisan
  const { data: artisan } = await supabase
    .from('artisans')
    .select('*')
    .eq('profil_id', user.id)
    .single()

  if (!profile || !artisan) {
    redirect('/artisan/onboarding')
  }

  // Fetch all categories
  const { data: allCategories } = await supabase
    .from('categories_metiers')
    .select('*')
    .order('id')

  // Fetch artisan's categories
  const { data: artisanCategories } = await supabase
    .from('artisan_categories')
    .select('categorie_id')
    .eq('artisan_id', artisan.id)

  const selectedCategoryIds = artisanCategories?.map((cat) => cat.categorie_id) || []

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Mon Profil Artisan
        </h1>
        <p className="mt-2 text-gray-600">
          Gerez vos informations professionnelles et vos preferences.
        </p>
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
