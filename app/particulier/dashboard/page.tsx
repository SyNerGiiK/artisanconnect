import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProjectCard from '@/components/projects/ProjectCard'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'

export default async function ParticulierDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const [profileRes, particulierRes] = await Promise.all([
    supabase
      .from('profiles')
      .select('prenom, nom')
      .eq('id', user.id)
      .single<{ prenom: string; nom: string }>(),
    supabase.from('particuliers').select('id').eq('profil_id', user.id).single(),
  ])

  const profile = profileRes.data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const particulier = particulierRes.data as any

  if (!particulier) redirect('/particulier/onboarding')

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

  const activeCount = projets?.filter((p) => p.statut === 'ouvert').length ?? 0
  const reponsesTotal =
    projets?.reduce((acc, p) => acc + (p.reponses?.length ?? 0), 0) ?? 0
  const enCoursCount =
    projets?.filter((p) => p.statut === 'en_cours').length ?? 0

  return (
    <div className="mx-auto max-w-[860px] px-7 py-8">
      <div className="mb-7 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-tight text-ac-text mb-1">
            Mes projets
          </h1>
          <p className="text-sm text-ac-text-sub">
            Bonjour {profile?.prenom ?? 'particulier'} — gérez vos projets de travaux ici.
          </p>
        </div>
        <Button href="/particulier/nouveau-projet">+ Nouveau projet</Button>
      </div>

      {projets && projets.length > 0 && (
        <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { label: 'Projets actifs', value: activeCount, color: 'text-ac-primary' },
            { label: 'Réponses reçues', value: reponsesTotal, color: 'text-ac-green' },
            { label: 'En cours', value: enCoursCount, color: 'text-ac-amber' },
          ].map((s) => (
            <Card key={s.label} className="px-5 py-4">
              <div
                className={`text-[26px] font-black leading-none mb-1 ${s.color}`}
              >
                {s.value}
              </div>
              <div className="text-[13px] text-ac-text-sub">{s.label}</div>
            </Card>
          ))}
        </div>
      )}

      {!projets || projets.length === 0 ? (
        <Card padded>
          <EmptyState
            icon="📋"
            title="Vous n'avez pas encore de projet"
            desc="Décrivez vos besoins pour recevoir jusqu'à 3 devis gratuits d'artisans qualifiés."
            action={
              <Button href="/particulier/nouveau-projet" size="lg">
                Déposer mon premier projet →
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {projets.map((projet) => (
            <ProjectCard key={projet.id} projet={projet} />
          ))}
        </div>
      )}
    </div>
  )
}
