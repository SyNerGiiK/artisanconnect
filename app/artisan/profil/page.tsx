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
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mon Profil Artisan</h1>
      <ArtisanProfileForm 
        profile={profile} 
        artisan={artisan} 
        allCategories={allCategories || []}
        initialSelectedCategories={selectedCategoryIds}
      />
    </div>
  )
}
