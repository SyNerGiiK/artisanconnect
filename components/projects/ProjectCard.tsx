import Link from 'next/link'
import StatusBadge from '@/components/ui/StatusBadge'

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
    <Link
      href={`/particulier/projet/${projet.id}`}
      className="block rounded-lg border border-gray-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-lg">{projet.titre}</h3>
        <StatusBadge statut={projet.statut} />
      </div>

      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {projet.description}
      </p>

      <div className="flex items-center gap-4 text-xs text-gray-500">
        {projet.categories_metiers && (
          <span>{projet.categories_metiers.libelle}</span>
        )}
        <span>
          {projet.ville} ({projet.code_postal})
        </span>
        <span>{formattedDate}</span>
      </div>

      <div className="mt-3 flex items-center gap-3 text-xs">
        <span className="text-gray-500">
          {responseCount}/3 réponse{responseCount > 1 ? 's' : ''}
        </span>
        {pendingCount > 0 && (
          <span className="font-medium text-yellow-700">
            {pendingCount} en attente
          </span>
        )}
        {acceptedCount > 0 && (
          <span className="font-medium text-green-700">
            {acceptedCount} acceptée{acceptedCount > 1 ? 's' : ''}
          </span>
        )}
      </div>
    </Link>
  )
}
