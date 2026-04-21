import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import Stars from '@/components/ui/Stars'
import Tag from '@/components/ui/Tag'

type Params = { id: string }
// Updated to Next.js 15+ promise based params
export default async function PublicArtisanProfilePage({ params }: { params: Promise<Params> }) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch from the public view
  const { data: artisan, error } = await supabase
    .from('v_artisans_public')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !artisan) {
    redirect('/particulier/dashboard')
  }

  // Fetch categories
  const { data: categories } = await supabase
    .from('artisan_categories')
    .select('categories_metiers(libelle)')
    .eq('artisan_id', id)

  // Fetch Avis
  const { data: avisList } = await supabase
    .from('avis')
    .select(`
      id, note, commentaire, created_at,
      particuliers(profiles(prenom))
    `)
    .eq('artisan_id', id)
    .order('created_at', { ascending: false })

  const categoryNames = categories?.flatMap((c: any) => c.categories_metiers?.libelle)

  return (
    <div className="mx-auto max-w-[800px] px-7 py-8">
      <Link
        href="javascript:history.back()"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-ac-text-sub transition-colors hover:text-ac-primary"
      >
        ← Retour
      </Link>

      <Card padded className="mb-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <Avatar
            name={artisan.nom_entreprise}
            size={80}
            className="h-20 w-20 text-xl font-bold bg-ac-surface-hover border-ac-border"
          />
          <div className="flex-1">
            <h1 className="text-[26px] font-extrabold text-ac-text tracking-tight flex items-center gap-3">
              {artisan.nom_entreprise}
              {artisan.assurance_pro && (
                <Tag color="green">Assurance Pro ✓</Tag>
              )}
            </h1>
            <p className="text-sm font-medium text-ac-text-muted mt-1">
              Catégories : {categoryNames?.join(', ') || 'Non renseigné'}
            </p>
            <div className="flex items-center gap-2 mt-3 text-sm text-ac-text-sub flex-wrap">
              <span className="font-semibold text-ac-text flex items-center gap-1">
                📍 Vendée &amp; Alentours (Rayon {artisan.rayon_km}km)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-bold text-ac-text">
                <Stars rating={Number(artisan.note_moyenne)} /> {artisan.note_moyenne}
              </span>
              <span className="text-ac-text-muted">({artisan.nombre_avis} avis)</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid sm:grid-cols-3 gap-6">
        <div className="sm:col-span-2 flex flex-col gap-6">
          <Card padded>
            <h2 className="text-[17px] font-bold text-ac-text mb-3">À propos</h2>
            <p className="text-[15px] whitespace-pre-line leading-relaxed text-ac-text-sub">
              {artisan.description || 'Cet artisan n\'a pas encore rédigé de description.'}
            </p>
          </Card>

          {artisan.photos_realisations && artisan.photos_realisations.length > 0 && (
            <Card padded>
              <h2 className="text-[17px] font-bold text-ac-text mb-4">Réalisations</h2>
              <div className="grid grid-cols-2 gap-3">
                {artisan.photos_realisations.map((url: string, i: number) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={url}
                    alt={`Realisation ${i + 1}`}
                    className="w-full aspect-video object-cover rounded-md border border-ac-border bg-ac-surface"
                  />
                ))}
              </div>
            </Card>
          )}

          <h2 className="text-[20px] font-bold text-ac-text mt-4 mb-2">Avis clients</h2>
          
          {avisList && avisList.length > 0 ? (
            <div className="flex flex-col gap-4">
              {avisList.map((av: any) => (
                <Card key={av.id} padded>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-[15px] text-ac-text">
                      {av.particuliers?.profiles?.prenom || 'Utilisateur'}
                    </span>
                    <span className="text-xs text-ac-text-muted">
                      {new Date(av.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="mb-3"><Stars rating={av.note} /></div>
                  <p className="text-[14px] text-ac-text-sub italic">"{av.commentaire}"</p>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ac-text-muted">Aucun avis pour l'instant.</p>
          )}

        </div>
        <div className="sm:col-span-1">
          <Card padded>
            <h3 className="text-[15px] font-bold text-ac-text mb-3 border-b border-ac-border pb-2">Informations légales</h3>
            <p className="text-[13px] text-ac-text-muted font-mono bg-ac-surface rounded px-2 py-1 mb-2">
              SIRET : {artisan.siret || 'X'}
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
