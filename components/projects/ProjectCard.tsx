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
      className="group block rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-lg hover:ring-blue-200"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">{projet.titre}</h3>
        <StatusBadge statut={projet.statut} />
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {projet.description}
      </p>

      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
        {projet.categories_metiers && (
          <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">{projet.categories_metiers.libelle}</span>
        )}
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {projet.ville} ({projet.code_postal})
        </span>
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formattedDate}
        </span>
      </div>

      <div className="flex items-center gap-3 text-xs">
        <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {responseCount}/3 reponse{responseCount > 1 ? 's' : ''}
        </span>
        {pendingCount > 0 && (
          <span className="font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-full ring-1 ring-amber-200">
            {pendingCount} en attente
          </span>
        )}
        {acceptedCount > 0 && (
          <span className="font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full ring-1 ring-green-200">
            {acceptedCount} acceptee{acceptedCount > 1 ? 's' : ''}
          </span>
        )}
      </div>
    </Link>
  )
}
