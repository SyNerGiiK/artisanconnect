import Link from 'next/link'
import StatusBadge from '@/components/ui/StatusBadge'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'

type ProjectWithRelations = {
  id: string
  titre: string
  description: string
  statut: string
  ville: string
  code_postal: string
  created_at: string
  categories_metiers: { libelle: string } | null
  reponses: { id: string; statut: string }[] | null
}

export default function ProjectCard({
  projet,
}: {
  projet: ProjectWithRelations
}) {
  const responseCount = projet.reponses?.length ?? 0
  const acceptedCount =
    projet.reponses?.filter((r) => r.statut === 'acceptee').length ?? 0
  const pendingCount =
    projet.reponses?.filter((r) => r.statut === 'en_attente').length ?? 0

  const formattedDate = new Date(projet.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Link href={`/particulier/projet/${projet.id}`} className="block">
      <Card hover className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <h3 className="font-bold text-base text-ac-text">{projet.titre}</h3>
          <StatusBadge statut={projet.statut} />
        </div>

        <p className="text-sm text-ac-text-sub leading-relaxed line-clamp-2 mb-3.5">
          {projet.description}
        </p>

        <div className="mb-3.5 flex flex-wrap items-center gap-2">
          {projet.categories_metiers && (
            <Tag color="primary">{projet.categories_metiers.libelle}</Tag>
          )}
          <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-ac-border bg-ac-surface-hover px-2.5 py-0.5 text-xs font-semibold text-ac-text-sub">
            📍 {projet.ville} ({projet.code_postal})
          </span>
          <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-ac-border bg-ac-surface-hover px-2.5 py-0.5 text-xs font-semibold text-ac-text-sub">
            📅 {formattedDate}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full border border-ac-border bg-ac-bg px-2.5 py-0.5 text-ac-text-muted">
            {responseCount}/3 réponse{responseCount > 1 ? 's' : ''}
          </span>
          {pendingCount > 0 && (
            <Tag color="amber">{pendingCount} en attente</Tag>
          )}
          {acceptedCount > 0 && (
            <Tag color="green">{acceptedCount} acceptée{acceptedCount > 1 ? 's' : ''}</Tag>
          )}
        </div>
      </Card>
    </Link>
  )
}
