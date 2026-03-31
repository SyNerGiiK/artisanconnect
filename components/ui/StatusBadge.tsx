const STATUT_CONFIG: Record<string, { label: string; className: string }> = {
  ouvert: {
    label: 'Ouvert',
    className: 'bg-green-100 text-green-800',
  },
  en_cours: {
    label: 'En cours',
    className: 'bg-blue-100 text-blue-800',
  },
  termine: {
    label: 'Terminé',
    className: 'bg-gray-100 text-gray-800',
  },
  annule: {
    label: 'Annulé',
    className: 'bg-red-100 text-red-800',
  },
  en_attente: {
    label: 'En attente',
    className: 'bg-yellow-100 text-yellow-800',
  },
  acceptee: {
    label: 'Acceptée',
    className: 'bg-green-100 text-green-800',
  },
  refusee: {
    label: 'Refusée',
    className: 'bg-red-100 text-red-800',
  },
}

export default function StatusBadge({ statut }: { statut: string }) {
  const config = STATUT_CONFIG[statut] || {
    label: statut,
    className: 'bg-gray-100 text-gray-800',
  }

  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  )
}
