import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DonnerAvisForm from './DonnerAvisForm'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import Link from 'next/link'

export default async function DonnerAvisPage({
  searchParams,
}: {
  searchParams: Promise<{ artisan?: string; projet?: string }>
}) {
  const { artisan, projet } = await searchParams
  if (!artisan || !projet) redirect('/particulier/dashboard')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const { data: particulier } = await supabase
    .from('particuliers')
    .select('id')
    .eq('profil_id', user.id)
    .single()

  if (!particulier) redirect('/particulier/dashboard')

  // Verify that the response is accepted
  const { data: reponse } = await supabase
    .from('reponses')
    .select(`
      id,
      projet_id,
      artisan_id,
      statut,
      projets!inner(titre, particulier_id),
      artisans!inner(nom_entreprise)
    `)
    .eq('projet_id', projet)
    .eq('artisan_id', artisan)
    .eq('projets.particulier_id', particulier.id)
    .eq('statut', 'acceptee')
    .single()

  if (!reponse) {
    return (
      <div className="mx-auto max-w-[600px] px-7 py-8">
        <Card padded className="border-ac-red-light bg-ac-red-light/20 text-ac-red">
          Vous ne pouvez pas noter cet artisan car vous n'avez pas de projet validé avec lui.
        </Card>
      </div>
    )
  }

  // Check if avis already exists
  const { data: existingAvis } = await supabase
    .from('avis')
    .select('id')
    .eq('projet_id', projet)
    .eq('artisan_id', artisan)
    .single()

  if (existingAvis) {
    return (
      <div className="mx-auto max-w-[600px] px-7 py-8">
        <Card padded className="border-ac-primary-border bg-ac-primary-light text-ac-primary-text">
          Vous avez déjà laissé un avis pour ce projet. Merci de votre contribution !
          <div className="mt-4">
            <Link href={`/particulier/projet/${projet}`} className="underline">Retour au projet</Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[600px] px-7 py-8">
      <Link
        href={`/particulier/projet/${projet}`}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-ac-text-sub transition-colors hover:text-ac-primary"
      >
        ← Retour au projet
      </Link>

      <h1 className="text-[26px] font-extrabold text-ac-text tracking-tight mb-2">
        Noter l'artisan
      </h1>
      <p className="text-sm text-ac-text-sub mb-7">
        Votre avis aide les autres particuliers de Vendée à choisir le meilleur professionnel.
      </p>

      <Card padded className="mb-6 flex items-center gap-4">
        <Avatar name={reponse.artisans?.nom_entreprise || 'A'} size={48} />
        <div>
          <h2 className="text-[17px] font-bold text-ac-text">{reponse.artisans?.nom_entreprise}</h2>
          <p className="text-xs text-ac-text-muted">Projet : {reponse.projets?.titre}</p>
        </div>
      </Card>

      <Card padded>
        <DonnerAvisForm artisanId={artisan} projetId={projet} />
      </Card>
    </div>
  )
}
