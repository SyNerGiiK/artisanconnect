import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import StatusBadge from '@/components/ui/StatusBadge'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import RepondreForm from './RepondreForm'
import PhotoGallery from '@/components/projects/PhotoGallery'

type ProjetDetail = {
  id: string
  titre: string
  description: string
  ville: string
  code_postal: string
  statut: string
  created_at: string
  photos: string[] | null
  is_boosted: boolean | null
  is_urgent: boolean | null
  categories_metiers: { libelle: string } | null
}

export default async function RepondrePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const { data } = await supabase
    .from('projets')
    .select('id, titre, description, ville, code_postal, statut, created_at, photos, is_boosted, is_urgent, categories_metiers ( libelle )')
    .eq('id', id)
    .single()

  const projet = data as ProjetDetail | null

  if (!projet) notFound()

  return (
    <div className="mx-auto max-w-[640px] px-7 py-8">
      <Link
        href="/artisan/feed"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-ac-text-sub transition-colors hover:text-ac-primary"
      >
        ← Retour aux chantiers
      </Link>

      {/* Project summary card */}
      <Card className="mb-6 p-6">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <h2 className="text-lg font-bold text-ac-text">{projet.titre}</h2>
          <StatusBadge statut={projet.statut} />
        </div>
        <p className="mb-4 whitespace-pre-line text-sm leading-relaxed text-ac-text-sub">
          {projet.description}
        </p>
        
        {projet.photos && projet.photos.length > 0 && (
          <PhotoGallery photos={projet.photos} />
        )}

        <div className="flex flex-wrap items-center gap-2 text-xs text-ac-text-muted">
          {projet.is_boosted && (
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700">
              🚀 Boosté
            </span>
          )}
          {projet.is_urgent && (
            <span className="rounded-full bg-ac-red-light px-2.5 py-0.5 text-[11px] font-bold text-ac-red">
              ⚡ Urgent
            </span>
          )}
          {projet.categories_metiers && (
            <Tag color="primary">{projet.categories_metiers.libelle}</Tag>
          )}
          <span className="inline-flex items-center gap-1 rounded-full border border-ac-border bg-ac-surface-hover px-2.5 py-0.5 font-semibold">
            📍 {projet.ville} ({projet.code_postal})
          </span>
        </div>
      </Card>

      {/* Response form */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-ac-text">
          Répondre à ce chantier
        </h1>
        <p className="mt-1 text-sm text-ac-text-sub">
          Présentez-vous et expliquez pourquoi vous êtes le bon artisan.
        </p>
      </div>

      <Card className="p-7 sm:p-8">
        <RepondreForm projetId={projet.id} />
      </Card>
    </div>
  )
}
