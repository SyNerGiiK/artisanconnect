const CONFIG: Record<string, { label: string; cls: string }> = {
  ouvert: {
    label: 'Ouvert',
    cls: 'bg-ac-green-light text-ac-green border-ac-green-border',
  },
  en_cours: {
    label: 'En cours',
    cls: 'bg-ac-primary-light text-ac-primary-text border-ac-primary-border',
  },
  termine: {
    label: 'Terminé',
    cls: 'bg-ac-bg text-ac-text-muted border-ac-border',
  },
  annule: {
    label: 'Annulé',
    cls: 'bg-ac-red-light text-ac-red border-red-300',
  },
  en_attente: {
    label: 'En attente',
    cls: 'bg-ac-amber-light text-ac-amber border-ac-amber-border',
  },
  acceptee: {
    label: 'Acceptée',
    cls: 'bg-ac-green-light text-ac-green border-ac-green-border',
  },
  refusee: {
    label: 'Refusée',
    cls: 'bg-ac-red-light text-ac-red border-red-300',
  },
}

export default function StatusBadge({ statut }: { statut: string }) {
  const c = CONFIG[statut] ?? {
    label: statut,
    cls: 'bg-ac-bg text-ac-text-muted border-ac-border',
  }
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${c.cls}`}
    >
      {c.label}
    </span>
  )
}
