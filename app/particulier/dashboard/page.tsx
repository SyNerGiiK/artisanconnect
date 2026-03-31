import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SignOutButton from '@/components/auth/SignOutButton'
import Link from 'next/link'
import ProjectCard from '@/components/projects/ProjectCard'

export default async function ParticulierDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const { data: profile } = await supabase
    .from('profiles')
    .select('prenom, nom')
    .eq('id', user.id)
    .single<{ prenom: string; nom: string }>()

  const { data: particulierRaw } = await supabase
    .from('particuliers')
    .select('id')
    .eq('profil_id', user.id)
    .single()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const particulier = particulierRaw as any

  if (!particulier) redirect('/particulier/onboarding')

  // Fetch projects with category label and response count
  const { data: projetsRaw } = await supabase
    .from('projets')
    .select(`
      *,
      categories_metiers ( libelle ),
      reponses ( id, statut )
    `)
    .eq('particulier_id', particulier.id)
    .order('created_at', { ascending: false })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const projets = projetsRaw as any[] | null

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Mes projets</h1>
          <p className="text-gray-600">
            Bonjour {profile?.prenom} — gérez vos projets de travaux ici.
          </p>
        </div>
        <Link
          href="/particulier/nouveau-projet"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors sm:hidden"
        >
          + Nouveau
        </Link>
      </div>

      {!projets || projets.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center bg-white shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 mb-4">
             <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold mb-2">Vous n'avez pas encore de projet</h2>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Décrivez vos besoins pour recevoir jusqu'à 3 devis gratuits d'artisans qualifiés.
          </p>
          <Link
            href="/particulier/nouveau-projet"
            className="inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Déposer mon premier projet
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {projets.map((projet) => (
            <ProjectCard key={projet.id} projet={projet} />
          ))}
        </div>
      )}
    </div>
  )
}
