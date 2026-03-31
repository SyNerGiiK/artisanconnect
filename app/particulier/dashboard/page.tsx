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

  const { data: particulier } = await supabase
    .from('particuliers')
    .select('id')
    .eq('profil_id', user.id)
    .single()

  if (!particulier) redirect('/particulier/onboarding')

  // Fetch projects with category label and response count
  const { data: projets } = await supabase
    .from('projets')
    .select(`
      *,
      categories_metiers ( libelle ),
      reponses ( id, statut )
    `)
    .eq('particulier_id', particulier.id)
    .order('created_at', { ascending: false })

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Mes projets</h1>
          <p className="text-gray-600">
            Bonjour {profile?.prenom} — gérez vos projets de travaux ici.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/particulier/conversations"
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Messages
          </Link>
          <Link
            href="/particulier/nouveau-projet"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            + Nouveau projet
          </Link>
          <SignOutButton />
        </div>
      </div>

      {!projets || projets.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500 mb-4">
            Vous n&apos;avez pas encore de projet.
          </p>
          <Link
            href="/particulier/nouveau-projet"
            className="text-blue-600 hover:underline font-medium"
          >
            Déposer votre premier projet
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
