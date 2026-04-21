import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ArtisanProfileForm from './ArtisanProfileForm'
import PortalButton from '@/components/stripe/PortalButton'

export default async function ArtisanProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const [profileRes, artisanRes, allCategoriesRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('artisans').select('*').eq('profil_id', user.id).single(),
    supabase.from('categories_metiers').select('*').order('id'),
  ])

  const profile = profileRes.data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const artisan = artisanRes.data as any
  const allCategories = allCategoriesRes.data

  if (!profile || !artisan) redirect('/artisan/onboarding')

  const { data: artisanCategories } = await supabase
    .from('artisan_categories')
    .select('categorie_id')
    .eq('artisan_id', artisan.id)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectedCategoryIds = artisanCategories?.map((cat: any) => cat.categorie_id) || []

  return (
    <div className="mx-auto max-w-[720px] px-7 py-8">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-tight text-ac-text">
            Mon profil artisan
          </h1>
          <p className="mt-1 text-sm text-ac-text-sub">
            Gérez vos informations professionnelles et vos préférences.
          </p>
        </div>
        {artisan.abonnement_actif && <PortalButton />}
      </div>

      <ArtisanProfileForm
        profile={profile}
        artisan={artisan}
        allCategories={allCategories || []}
        initialSelectedCategories={selectedCategoryIds}
      />
    </div>
  )
}
